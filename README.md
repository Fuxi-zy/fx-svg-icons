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

### 注册组件

```ts
import { createApp } from 'vue'
import { FxIcon, FxIconSelect, initIconifyIcons } from '@fuxishi/svg-icon'
import '@fuxishi/svg-icon/dist/style.css'

import epIcons from '@iconify-json/ep/icons.json'

const app = createApp(App)

app.component('FxIcon', FxIcon)
app.component('FxIconSelect', FxIconSelect)

initIconifyIcons([
  { prefix: 'ep', icons: epIcons }
])

app.mount('#app')
```

### 使用图标

```vue
<template>
  <FxIcon name="ep:edit" />
  <FxIcon name="ep:delete" :size="24" color="#409eff" />
  <FxIcon name="svg:my-icon" :size="32" />
</template>
```

### 使用图标选择器

```vue
<template>
  <FxIconSelect v-model="selectedIcon" placeholder="请选择图标" />
</template>

<script setup>
import { ref } from 'vue'
const selectedIcon = ref('')
</script>
```

### Vite 插件（推荐）

```ts
// vite.config.ts
import { fxDtsPlugin } from '@fuxishi/svg-icon/vite'

export default defineConfig({
  plugins: [
    vue(),
    fxDtsPlugin({
      svgGlobPattern: '/src/assets/svgs/**/*.svg',
      dtsDir: '@/types',
      splitDts: true,
    }),
  ],
})
```

```ts
// main.ts
import { setupIcons } from 'virtual:fx-svg-icon'

const app = createApp(App)
setupIcons(app)
```

## 文档

在线文档：[https://fuxi-zy.github.io/fx-svg-icons/](https://fuxi-zy.github.io/fx-svg-icons/)

## License

MIT
