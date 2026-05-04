# Vite 插件

`@fuxishi/svg-icon/vite` 提供的 Vite 插件，用于自动生成图标类型声明和虚拟模块。

## 安装

插件已包含在 `@fuxishi/svg-icon` 包中，无需额外安装。从 `@fuxishi/svg-icon/vite` 导入：

```ts
import { fxDtsPlugin } from '@fuxishi/svg-icon/vite'
```

## 配置

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fxDtsPlugin } from '@fuxishi/svg-icon/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src/assets', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    fxDtsPlugin({
      svgGlobPattern: '~/svgs',
      dtsDir: '@/types',
      splitDts: true,
    }),
  ],
})
```

## 选项

### FxSvgTypesOptions

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `svgGlobPattern` | `string` | — | 本地 SVG 目录路径，支持别名前缀（如 `@/`、`~/`），不含 glob 时自动补全 `/**/*.svg` |
| `dtsDir` | `string` | `'src'` | 类型文件输出目录，支持别名前缀、`/xxx` 根路径、相对路径（基于 vite.config.ts 所在目录） |
| `splitDts` | `boolean` | `false` | 是否按图标包拆分类型文件 |

### svgGlobPattern 支持的格式

假设 `resolve.alias` 配置了 `@` → `src`，`~` → `src/assets`：

| 配置值 | 解析结果 | 说明 |
|--------|----------|------|
| `'/src/assets/svgs/**/*.svg'` | `/src/assets/svgs/**/*.svg` | 根路径 + 完整 glob |
| `'/src/assets/svgs'` | `/src/assets/svgs/**/*.svg` | 根路径，自动补全 glob |
| `'@/assets/svgs'` | `/src/assets/svgs/**/*.svg` | `@` 别名，自动补全 glob |
| `'@/assets/svgs/**/*.svg'` | `/src/assets/svgs/**/*.svg` | `@` 别名 + 完整 glob |
| `'~/svgs'` | `/src/assets/svgs/**/*.svg` | `~` 别名，自动补全 glob |
| `'~/svgs/**/*.svg'` | `/src/assets/svgs/**/*.svg` | `~` 别名 + 完整 glob |

### dtsDir 支持的格式

假设 `resolve.alias` 配置了 `@` → `src`：

| 配置值 | 解析结果 | 说明 |
|--------|----------|------|
| `'src'` | `<root>/src/` | 默认值 |
| `'src/types'` | `<root>/src/types/` | 子目录 |
| `'/types'` | `<root>/types/` | 根路径 |
| `'@/types'` | `<root>/src/types/` | `@` 别名 |
| `'types'` | `<root>/types/` | 相对路径 |
| `'../types'` | — | 超出项目根目录，报错 |

## 功能

### 1. 自动类型生成

插件会自动扫描 `node_modules/@iconify-json/` 下的所有图标包，生成精确到每个图标名的 TypeScript 类型声明。

**合并模式**（`splitDts: false`）：所有图标生成到一个 `fx-icon-types.d.ts` 文件。

**拆分模式**（`splitDts: true`）：每个图标包生成独立的类型文件：

```
src/types/
├── fx-icon-types.d.ts              # 主文件，统一引入
├── fx-icon-ep-types.d.ts           # Element Plus 图标
├── fx-icon-ant-design-types.d.ts   # Ant Design 图标
└── fx-icon-mdi-types.d.ts          # Material Design Icons
```

生成的类型会增强 Vue 全局组件：

```ts
declare module 'vue' {
  export interface GlobalComponents {
    FxIcon: FunctionalComponent<{
      name: 'ep:edit' | 'ep:delete' | ... | `svg:${string}`
      size?: string | number
      color?: string
      customClass?: string
    }>
  }
}
```

### 2. 虚拟模块

插件会生成 `virtual:fx-svg-icon` 虚拟模块，包含：

- 自动导入所有 `@iconify-json` 包
- 注册 `FxIcon` 和 `FxIconSelect` 全局组件
- 加载 Iconify 图标集
- 加载本地 SVG（如果配置了 `svgGlobPattern`）

```ts
// main.ts
import { setupIcons } from 'virtual:fx-svg-icon'

const app = createApp(App)
setupIcons(app) // 一行搞定所有初始化
```

### 3. 路径变更自动处理

- `dtsDir` 变更时，自动删除旧文件（包括拆分文件）并生成新文件
- 自动更新项目中引用了旧类型文件的 import 语句
- 支持所有 `resolve.alias` 配置的路径别名
- 解析后的路径超出项目根目录时会报错提示

## TypeScript 配置

确保 `tsconfig.json` 包含类型声明文件：

```json
{
  "compilerOptions": {
    "types": ["./src/types/fx-icon-types"]
  }
}
```

或使用 Vite 插件的 `env.d.ts` 自动引入。
