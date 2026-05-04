import type { Plugin, ResolvedConfig, Logger } from "vite"
import { createLogger } from "vite"
import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  unlinkSync,
  mkdirSync,
} from "node:fs"
import { resolve, relative, join, dirname, isAbsolute } from "node:path"

const VIRTUAL_MODULE_ID = "virtual:fx-svg-icon"
const RESOLVED_MODULE_ID = "\0" + VIRTUAL_MODULE_ID

interface FxSvgTypesOptions {
  /** 本地 SVG 目录 glob 路径 */
  svgGlobPattern?: string
  /** 类型文件输出目录，支持 @/xxx 或 src/xxx 格式，默认 'src' */
  dtsDir?: string
  /** 是否按图标包拆分类型文件，默认 false */
  splitDts?: boolean
}

interface CacheData {
  dtsPath: string
  splitDts: boolean
}

const DTS_FILENAME = "fx-icon-types.d.ts"
const CACHE_FILE = join("node_modules", ".cache", "fx-svg-dts-cache")

export function fxDtsPlugin(options?: FxSvgTypesOptions): Plugin {
  const { svgGlobPattern, dtsDir, splitDts } = options || {}
  let config: ResolvedConfig
  let logger: Logger
  let dtsFilePath: string
  let resolvedSvgGlobPattern = svgGlobPattern

  return {
    name: "fx-svg-dts",

    configResolved(resolvedConfig) {
      config = resolvedConfig
      logger = createLogger(config.logLevel, { prefix: "[fx-svg-dts]" })
      dtsFilePath = resolveDtsDir(dtsDir || "src")
      resolvedSvgGlobPattern = resolveSvgGlobPattern(svgGlobPattern)
      cleanupOldFile()
    },

    buildStart() {
      generateDts()
    },

    handleHotUpdate({ file }) {
      if (file.includes("iconify-json")) {
        generateDts()
      }
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_MODULE_ID
    },

    load(id) {
      if (id === RESOLVED_MODULE_ID) return generateVirtualModule()
    },
  }

  /**
   * 解析路径中的别名前缀，支持所有 resolve.alias 配置
   * 如 @/xxx → src/xxx，~/xxx → src/assets/xxx
   * 返回 { resolved, aliasPrefix }，未匹配别名时 resolved 为 null
   */
  function resolveAliasPath(
    path: string,
    optionName: string,
  ): { resolved: string; aliasPrefix: string } | null {
    const aliases: Array<{ find: string | RegExp; replacement: string }> =
      config.resolve?.alias || []

    for (const alias of aliases) {
      if (typeof alias.find !== "string") continue
      const prefix = alias.find + "/"
      if (path.startsWith(prefix)) {
        return {
          resolved: resolve(alias.replacement, path.slice(prefix.length)),
          aliasPrefix: alias.find,
        }
      }
    }

    // 路径使用了 <前缀>/ 格式但未匹配到任何别名时，给出提示
    const match = path.match(/^([^/]+)\//)
    if (match && !path.startsWith("/") && !path.startsWith("./") && !path.startsWith("../")) {
      throw new Error(
        `[fx-svg-dts] ${optionName} 使用了 '${match[1]}/' 前缀，但项目中未配置 '${match[1]}' 路径别名。请在 vite.config.ts 的 resolve.alias 中配置`,
      )
    }

    return null
  }

  /**
   * 解析 svgGlobPattern，支持所有别名前缀
   */
  function resolveSvgGlobPattern(pattern?: string): string | undefined {
    if (!pattern) return pattern

    let resolved = pattern
    const aliasResult = resolveAliasPath(pattern, "svgGlobPattern")
    if (aliasResult) {
      const relativeToRoot = relative(
        config.root,
        aliasResult.resolved,
      ).replace(/\\/g, "/")
      resolved = "/" + relativeToRoot
    }

    if (!resolved.includes("*")) {
      resolved = resolved.replace(/\/+$/, "") + "/**/*.svg"
    }

    return resolved
  }

  /**
   * 解析类型文件目录路径，支持别名前缀、/xxx、相对路径格式
   * 相对路径基于 vite.config.ts 所在目录（config.root）解析
   */
  function resolveDtsDir(dir: string): string {
    let resolved: string
    const aliasResult = resolveAliasPath(dir, "dtsDir")
    if (aliasResult) {
      resolved = resolve(aliasResult.resolved, DTS_FILENAME)
    } else if (dir.startsWith("/")) {
      resolved = resolve(config.root, dir.slice(1), DTS_FILENAME)
    } else {
      resolved = resolve(config.root, dir, DTS_FILENAME)
    }

    ensurePathInProject(resolved, "dtsDir")
    return resolved
  }

  /**
   * 校验路径是否在项目根目录内，超出时抛出错误
   */
  function ensurePathInProject(filePath: string, optionName: string) {
    const rel = relative(config.root, filePath)
    if (rel.startsWith("..") || isAbsolute(rel)) {
      throw new Error(
        `[fx-svg-dts] ${optionName} 解析后的路径 "${filePath}" 超出了项目根目录 "${config.root}"，请使用项目内的路径`,
      )
    }
  }

  /**
   * 读取缓存，兼容旧版纯文本格式
   */
  function readCache(cachePath: string): CacheData | null {
    if (!existsSync(cachePath)) return null
    try {
      const raw = readFileSync(cachePath, "utf-8").trim()
      if (!raw.startsWith("{")) {
        return { dtsPath: raw, splitDts: false }
      }
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  /**
   * 路径变化或拆分模式变化时，清理旧文件
   */
  function cleanupOldFile() {
    const cachePath = resolve(config.root, CACHE_FILE)
    const prevCache = readCache(cachePath)
    const previousPath = prevCache?.dtsPath || ""
    const defaultOldPath = resolve(config.root, "src", DTS_FILENAME)

    let oldPath = ""
    // 路径变化时删除旧文件
    if (
      previousPath &&
      previousPath !== dtsFilePath &&
      existsSync(previousPath)
    ) {
      oldPath = previousPath
      const oldDir = dirname(previousPath)
      unlinkSync(previousPath)
      logger.info(`已删除旧文件: ${relative(config.root, previousPath)}`, {
        timestamp: true,
      })
      // 清理旧目录下的拆分文件
      cleanupSplitFiles(oldDir)
    }
    // 首次使用新版本时，清理默认位置的旧文件
    if (
      !previousPath &&
      dtsFilePath !== defaultOldPath &&
      existsSync(defaultOldPath)
    ) {
      oldPath = defaultOldPath
      const defaultOldDir = dirname(defaultOldPath)
      unlinkSync(defaultOldPath)
      logger.info(`已删除旧文件: ${relative(config.root, defaultOldPath)}`, {
        timestamp: true,
      })
      cleanupSplitFiles(defaultOldDir)
    }

    // 更新项目中的 import 引用路径
    if (oldPath) {
      updateImportPaths(oldPath, dtsFilePath)
    }

    // 从拆分模式切回合并模式时，清理拆分文件
    if (prevCache?.splitDts && !splitDts) {
      cleanupSplitFiles()
    }

    const cacheDir = dirname(cachePath)
    if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true })
    writeFileSync(
      cachePath,
      JSON.stringify({ dtsPath: dtsFilePath, splitDts: !!splitDts }),
    )
  }

  /**
   * 删除指定目录下所有 fx-icon-{prefix}-types.d.ts 拆分文件
   */
  function cleanupSplitFiles(targetDir?: string) {
    const dir = targetDir || dirname(dtsFilePath)
    if (!existsSync(dir)) return
    const entries = readdirSync(dir)
    for (const entry of entries) {
      if (/^fx-icon-.+-types\.d\.ts$/.test(entry) && entry !== DTS_FILENAME) {
        const filePath = join(dir, entry)
        unlinkSync(filePath)
        logger.info(`已删除旧文件: ${entry}`, { timestamp: true })
      }
    }
  }

  /**
   * 递归搜索目录下的 .ts 和 .vue 文件
   */
  function findSourceFiles(dir: string): string[] {
    const results: string[] = []
    if (!existsSync(dir)) return results
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory() && entry.name !== "node_modules") {
        results.push(...findSourceFiles(fullPath))
      } else if (
        /\.(ts|vue)$/.test(entry.name) &&
        !entry.name.endsWith(".d.ts")
      ) {
        results.push(fullPath)
      }
    }
    return results
  }

  /**
   * 路径变化时，自动更新项目中引用了旧类型文件的 import 语句
   * 如果项目配置了 @ alias，优先使用 @/ 路径
   */
  function updateImportPaths(oldPath: string, newPath: string) {
    const srcDir = resolve(config.root, "src")
    if (!existsSync(srcDir)) return

    const newBase = newPath.replace(/\.d\.ts$/, "")

    // 检查是否配置了 @ alias
    const aliases: Array<{ find: string | RegExp; replacement: string }> =
      config.resolve?.alias || []
    const atAlias = aliases.find(
      (a) => typeof a.find === "string" && a.find === "@",
    )

    for (const file of findSourceFiles(srcDir)) {
      const content = readFileSync(file, "utf-8")
      if (!content.includes("fx-icon-types")) continue

      let newRef: string
      if (atAlias) {
        const relToAlias = relative(atAlias.replacement, newBase).replace(
          /\\/g,
          "/",
        )
        newRef = "@/" + relToAlias
      } else {
        const fileDir = dirname(file)
        const relNew = relative(fileDir, newBase).replace(/\\/g, "/")
        newRef = relNew.startsWith(".") ? relNew : "./" + relNew
      }

      const updated = content.replace(
        /(from\s*['"]).*fx-icon-types(['"])/g,
        `$1${newRef}$2`,
      )

      if (updated !== content) {
        writeFileSync(file, updated)
        logger.info(`已更新引用: ${relative(config.root, file)}`, {
          timestamp: true,
        })
      }
    }
  }

  /**
   * 自动扫描 node_modules/@iconify-json/ 下的所有图标包
   */
  function scanCollections(): { prefix: string; pkgName: string }[] {
    const result: { prefix: string; pkgName: string }[] = []

    const searchDirs = [
      join(config.root, "node_modules", "@iconify-json"),
      join(config.root, "..", "node_modules", "@iconify-json"),
    ]

    for (const dir of searchDirs) {
      if (!existsSync(dir)) continue
      try {
        const entries = readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
          if (!entry.isDirectory() && !entry.isSymbolicLink()) continue
          const jsonPath = join(dir, entry.name, "icons.json")
          if (!existsSync(jsonPath)) continue

          const data = JSON.parse(readFileSync(jsonPath, "utf-8"))
          if (data.prefix && data.icons) {
            result.push({
              prefix: data.prefix,
              pkgName: `@iconify-json/${entry.name}`,
            })
          }
        }
      } catch {
        // 忽略扫描错误
      }
    }

    return result
  }

  /**
   * 将图标包前缀转为 PascalCase，如 ant-design → AntDesign
   */
  function prefixToPascal(prefix: string): string {
    return prefix
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join("")
  }

  /**
   * 读取图标包的图标名称列表
   */
  function readCollectionIcons(col: {
    prefix: string
    pkgName: string
  }): string[] {
    const jsonPath = resolve(
      config.root,
      "node_modules",
      col.pkgName,
      "icons.json",
    )
    const altPath = resolve(
      config.root,
      "..",
      "node_modules",
      col.pkgName,
      "icons.json",
    )
    const data = JSON.parse(
      readFileSync(existsSync(jsonPath) ? jsonPath : altPath, "utf-8"),
    )
    return Object.keys(data.icons || {})
  }

  /**
   * 生成类型声明文件
   */
  function generateDts() {
    const collections = scanCollections()
    const dtsDir = dirname(dtsFilePath)
    const relativePath = relative(config.root, dtsFilePath).replace(/\\/g, "/")

    // 按包收集图标
    const collectionIcons = new Map<string, string[]>()
    let totalCount = 0

    for (const col of collections) {
      try {
        const names = readCollectionIcons(col)
        if (names.length > 0) {
          collectionIcons.set(
            col.prefix,
            names.map((n) => `\`${col.prefix}:${n}\``),
          )
          totalCount += names.length
        }
      } catch (e) {
        logger.warn(`读取失败 ${col.prefix}: ${(e as Error).message}`, {
          timestamp: true,
        })
      }
    }

    if (splitDts) {
      generateSplitDts(dtsDir, collectionIcons, totalCount, relativePath)
    } else {
      generateSingleDts(collectionIcons, totalCount, relativePath)
    }
  }

  /**
   * 合并模式：所有图标生成到一个文件
   */
  function generateSingleDts(
    collectionIcons: Map<string, string[]>,
    totalCount: number,
    relativePath: string,
  ) {
    const iconTypes: string[] = ["`svg:${string}`"]
    for (const icons of collectionIcons.values()) {
      iconTypes.push(...icons)
    }

    const content = `// 由 @fuxishi/svg-icon/vite 自动生成，请勿手动修改
// 图标总数: ${totalCount}

import type { FunctionalComponent } from 'vue'

type IconString =
  | ${iconTypes.join("\n  | ")}

declare module 'vue' {
  export interface GlobalComponents {
    FxIcon: FunctionalComponent<{
      name: IconString
      size?: string | number
      color?: string
      customClass?: string
    }>
    FxIconSelect: FunctionalComponent<{
      modelValue?: IconString | ''
      placeholder?: string
      height?: number
    }>
  }
}

declare module 'virtual:fx-svg-icon' {
  import type { App } from 'vue'
  export function setupIcons(app: App): void
}
`

    const existing = existsSync(dtsFilePath)
      ? readFileSync(dtsFilePath, "utf-8")
      : ""
    if (existing !== content) {
      const dir = dirname(dtsFilePath)
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
      writeFileSync(dtsFilePath, content)
      logger.info(`已生成 ${relativePath} (${totalCount} 个图标)`, {
        timestamp: true,
      })
    }
  }

  /**
   * 拆分模式：每个图标包单独一个文件，主文件统一引入
   */
  function generateSplitDts(
    dtsDir: string,
    collectionIcons: Map<string, string[]>,
    totalCount: number,
    relativePath: string,
  ) {
    if (!existsSync(dtsDir)) mkdirSync(dtsDir, { recursive: true })
    const expectedFiles = new Set<string>()

    // 生成各包的独立类型文件
    for (const [prefix, icons] of collectionIcons) {
      const fileName = `fx-icon-${prefix}-types.d.ts`
      expectedFiles.add(fileName)
      const filePath = join(dtsDir, fileName)
      const pascalName = prefixToPascal(prefix)

      const content = `// 由 @fuxishi/svg-icon/vite 自动生成，请勿手动修改
// 图标数量: ${icons.length}

export type IconString${pascalName} =
  | ${icons.join("\n  | ")}
`

      const existing = existsSync(filePath)
        ? readFileSync(filePath, "utf-8")
        : ""
      if (existing !== content) {
        writeFileSync(filePath, content)
        logger.info(`已生成 ${fileName} (${icons.length} 个图标)`, {
          timestamp: true,
        })
      }
    }

    // 清理不再存在的包的拆分文件
    const entries = readdirSync(dtsDir)
    for (const entry of entries) {
      if (
        /^fx-icon-.+-types\.d\.ts$/.test(entry) &&
        !expectedFiles.has(entry)
      ) {
        unlinkSync(join(dtsDir, entry))
        logger.info(`已删除 ${entry}`, { timestamp: true })
      }
    }

    // 生成主文件，统一引入所有拆分文件
    const imports = Array.from(collectionIcons.keys())
      .map((prefix) => {
        const pascalName = prefixToPascal(prefix)
        return `import type { IconString${pascalName} } from './fx-icon-${prefix}-types'`
      })
      .join("\n")

    const unionParts = [
      "`svg:${string}`",
      ...Array.from(collectionIcons.keys()).map(
        (prefix) => `IconString${prefixToPascal(prefix)}`,
      ),
    ]

    const content = `// 由 @fuxishi/svg-icon/vite 自动生成，请勿手动修改
// 图标总数: ${totalCount}

import type { FunctionalComponent } from 'vue'
${imports}

type IconString =
  | ${unionParts.join("\n  | ")}

declare module 'vue' {
  export interface GlobalComponents {
    FxIcon: FunctionalComponent<{
      name: IconString
      size?: string | number
      color?: string
      customClass?: string
    }>
    FxIconSelect: FunctionalComponent<{
      modelValue?: IconString | ''
      placeholder?: string
      height?: number
    }>
  }
}

declare module 'virtual:fx-svg-icon' {
  import type { App } from 'vue'
  export function setupIcons(app: App): void
}
`

    const existing = existsSync(dtsFilePath)
      ? readFileSync(dtsFilePath, "utf-8")
      : ""
    if (existing !== content) {
      writeFileSync(dtsFilePath, content)
      logger.info(`已生成 ${relativePath} (${totalCount} 个图标)`, {
        timestamp: true,
      })
    }
  }

  /**
   * 生成虚拟模块代码（运行时初始化）
   */
  function generateVirtualModule(): string {
    const collections = scanCollections()
    const imports: string[] = []
    const collectionItems: string[] = []

    for (let i = 0; i < collections.length; i++) {
      const col = collections[i]
      const varName = `icons_${i}`
      imports.push(`import ${varName} from '${col.pkgName}/icons.json'`)
      collectionItems.push(`{ prefix: '${col.prefix}', icons: ${varName} }`)
    }

    const svgLoading = resolvedSvgGlobPattern
      ? `
  const svgModules = import.meta.glob('${resolvedSvgGlobPattern}', { eager: true, query: '?raw' })
  initSvgIcons(svgModules)`
      : ""

    return `import { FxIcon, FxIconSelect, initIconifyIcons, initSvgIcons } from '@fuxishi/svg-icon'
import '@fuxishi/svg-icon/dist/style.css'
${imports.join("\n")}

export function setupIcons(app) {
  app.component('FxIcon', FxIcon)
  app.component('FxIconSelect', FxIconSelect)
  initIconifyIcons([${collectionItems.join(", ")}])${svgLoading}
}
`
  }
}
