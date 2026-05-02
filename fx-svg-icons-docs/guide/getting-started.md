# 快速开始

## 安装

::: code-group

```bash [pnpm]
pnpm add @fuxishi/svg-icon
```

```bash [npm]
npm install @fuxishi/svg-icon
```

```bash [yarn]
yarn add @fuxishi/svg-icon
```

:::

## 注册组件

在你的 `main.ts` 中注册组件和图标：

```ts
import { createApp } from 'vue'
import { FxIcon, FxIconSelect, initIconifyIcons } from '@fuxishi/svg-icon'
import '@fuxishi/svg-icon/dist/style.css'

// 加载图标集（可选）
import epIcons from '@iconify-json/ep/icons.json'

const app = createApp(App)

// 注册组件
app.component('FxIcon', FxIcon)
app.component('FxIconSelect', FxIconSelect)

// 初始化图标集
initIconifyIcons([
  { prefix: 'ep', icons: epIcons }
])

app.mount('#app')
```

## 使用图标

```vue
<template>
  <!-- Iconify 图标 -->
  <FxIcon name="ep:edit" />
  <FxIcon name="ep:delete" :size="24" color="#409eff" />

  <!-- 本地 SVG 图标 -->
  <FxIcon name="svg:my-icon" :size="32" />
</template>
```

## 使用图标选择器

```vue
<template>
  <FxIconSelect
    v-model="selectedIcon"
    placeholder="请选择图标"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedIcon = ref('')
</script>
```

## 使用 Vite 插件（推荐）

使用 Vite 插件可自动生成图标类型声明，获得完整的 IDE 智能提示。

### 1. 配置插件

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

### 2. 使用虚拟模块

```ts
// main.ts
import { setupIcons } from 'virtual:fx-svg-icon'

const app = createApp(App)
setupIcons(app) // 自动注册组件 + 加载图标集 + 加载本地 SVG
```

## 下一步

- [安装](/guide/installation) — 了解详细的安装和依赖说明
- [Iconify 图标集](/guide/iconify) — 了解如何使用 Iconify 图标
- [FxIcon 组件](/components/fx-icon) — 了解图标组件的完整 API
- [Vite 插件](/plugins/vite-plugin) — 了解插件的完整配置
