# Getting Started

## Install

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

## Register Components

Register components and icons in your `main.ts`:

```ts
import { createApp } from 'vue'
import { FxIcon, FxIconSelect, initIconifyIcons } from '@fuxishi/svg-icon'
import '@fuxishi/svg-icon/dist/style.css'

// Load icon collections (optional)
import epIcons from '@iconify-json/ep/icons.json'

const app = createApp(App)

// Register components
app.component('FxIcon', FxIcon)
app.component('FxIconSelect', FxIconSelect)

// Initialize icon collections
initIconifyIcons([
  { prefix: 'ep', icons: epIcons }
])

app.mount('#app')
```

## Use Icons

```vue
<template>
  <!-- Iconify icons -->
  <FxIcon name="ep:edit" />
  <FxIcon name="ep:delete" :size="24" color="#409eff" />

  <!-- Local SVG icons -->
  <FxIcon name="svg:my-icon" :size="32" />
</template>
```

## Use Icon Selector

```vue
<template>
  <FxIconSelect
    v-model="selectedIcon"
    placeholder="Select an icon"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedIcon = ref('')
</script>
```

## Use Vite Plugin (Recommended)

The Vite plugin auto-generates icon type declarations for full IDE smart hints.

### 1. Configure Plugin

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

### 2. Use Virtual Module

```ts
// main.ts
import { setupIcons } from 'virtual:fx-svg-icon'

const app = createApp(App)
setupIcons(app) // Auto-register components + load icon collections + load local SVG
```

## Next Steps

- [Installation](/en/guide/installation) — Detailed installation and dependency guide
- [Iconify Icons](/en/guide/iconify) — How to use Iconify icons
- [FxIcon Component](/en/components/fx-icon) — Full icon component API
- [Vite Plugin](/en/plugins/vite-plugin) — Full plugin configuration
