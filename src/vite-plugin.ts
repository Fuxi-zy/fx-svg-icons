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
import { resolve, relative, join, dirname } from "node:path"

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

  return {
    name: "fx-svg-dts",

    configResolved(resolvedConfig) {
      config = resolvedConfig
      logger = createLogger(config.logLevel, { prefix: "[fx-svg-dts]" })
      dtsFilePath = resolveDtsDir(dtsDir || "src")
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
   * 解析类型文件目录路径，支持 @/xxx 和 src/xxx 格式
   */
  function resolveDtsDir(dir: string): string {
    if (dir.startsWith("@/")) {
      const aliases: Array<{ find: string | RegExp; replacement: string }> =
        config.resolve?.alias || []
      const atAlias = aliases.find(
        (a) => typeof a.find === "string" && a.find === "@",
      )
      if (!atAlias) {
        throw new Error(
          `[fx-svg-dts] dtsDir 使用了 @/ 前缀，但项目中未配置 '@' 路径别名。请在 vite.config.ts 的 resolve.alias 中配置 '@'`,
        )
      }
      return resolve(atAlias.replacement, dir.slice(2), DTS_FILENAME)
    }
    return resolve(config.root, dir, DTS_FILENAME)
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
      unlinkSync(previousPath)
      logger.info(`已删除旧文件: ${relative(config.root, previousPath)}`, {
        timestamp: true,
      })
    }
    // 首次使用新版本时，清理默认位置的旧文件
    if (
      !previousPath &&
      dtsFilePath !== defaultOldPath &&
      existsSync(defaultOldPath)
    ) {
      oldPath = defaultOldPath
      unlinkSync(defaultOldPath)
      logger.info(`已删除旧文件: ${relative(config.root, defaultOldPath)}`, {
        timestamp: true,
      })
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
   * 删除目录下所有 fx-icon-{prefix}-types.d.ts 拆分文件
   */
  function cleanupSplitFiles() {
    const dtsDir = dirname(dtsFilePath)
    if (!existsSync(dtsDir)) return
    const entries = readdirSync(dtsDir)
    for (const entry of entries) {
      if (/^fx-icon-.+-types\.d\.ts$/.test(entry) && entry !== DTS_FILENAME) {
        const filePath = join(dtsDir, entry)
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

    const svgLoading = svgGlobPattern
      ? `
  const svgModules = import.meta.glob('${svgGlobPattern}', { eager: true, query: '?raw' })
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
