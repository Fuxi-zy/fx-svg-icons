# @fuxishi/svg-icon

Vue 3 图标组件库，支持 Iconify 图标集和本地 SVG，多 UI 框架预设，Vite 插件自动类型生成。

## 特性

- **Iconify 图标集** — 支持所有 `@iconify-json` 图标包，一键加载海量图标资源
- **本地 SVG** — 通过 `import.meta.glob` 自动加载本地 SVG 文件，支持多级目录
- **多 UI 框架预设** — 内置 Element Plus、Naive UI、AntDv Next、TDesign 图标选择器预设
- **Vite 插件** — 自动生成精确到每个图标名的 TypeScript 类型声明，IDE 智能提示
- **图标选择器** — Headless composable + 多框架预设，搜索、分页、自定义 Tab
- **TypeScript** — 完整类型定义，泛型推导精确图标名，全局组件类型增强

## 安装

```bash
pnpm add @fuxishi/svg-icon
```

## 快速开始

### 1. 配置 Vite 插件

```ts
// vite.config.ts
import { fxDtsPlugin } from '@fuxishi/svg-icon/vite'

export default defineConfig({
  plugins: [
    vue(),
    fxDtsPlugin({
      svgGlobPattern: '/src/assets/svgs/**/*.svg', // 本地 SVG 目录（可选）
      dtsDir: '@/types',                            // 类型声明输出目录
      splitDts: true,                               // 按图标集拆分类型文件
    }),
  ],
})
```

### 2. 初始化

```ts
// main.ts
import { setupIcons } from 'virtual:fx-svg-icon'

const app = createApp(App)
setupIcons(app) // 自动注册组件 + 加载图标数据 + 加载本地 SVG
app.mount('#app')
```

`setupIcons` 一行搞定所有事情：注册 `FxIcon` / `FxIconSelect` 全局组件、加载已安装的 `@iconify-json/*` 图标数据、通过 `import.meta.glob` 加载本地 SVG 图标。

### 3. 使用图标

```vue
<template>
  <!-- Iconify 图标集 -->
  <FxIcon name="ep:edit" />
  <FxIcon name="ep:delete" :size="24" color="#409eff" />

  <!-- 本地 SVG 图标 -->
  <FxIcon name="svg:my-icon" :size="32" />
</template>
```

### 4. 使用图标选择器

```vue
<template>
  <FxIconSelect v-model="selectedIcon" placeholder="请选择图标" />
</template>

<script setup>
import { ref } from 'vue'
const selectedIcon = ref('')
</script>
```

图标选择器会自动检测当前 UI 框架（Element Plus / Naive UI / AntDv Next / TDesign），匹配对应的组件预设。

## 文档

在线文档：[https://fuxi-zy.github.io/fx-svg-icons/](https://fuxi-zy.github.io/fx-svg-icons/)

## License

MIT
