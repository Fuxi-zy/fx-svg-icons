# @fuxishi/svg-icon

Vue 3 icon component library with Iconify icon set support, local SVG, multi-UI framework presets, and Vite plugin auto type generation.

## Features

- **Iconify Icon Sets** — Supports all `@iconify-json` packages, load massive icon resources with one click
- **Local SVG** — Auto-load local SVG files via `import.meta.glob`, supports multi-level directories
- **Multi-UI Framework Presets** — Built-in Element Plus, Naive UI, AntDv Next, TDesign icon selector presets
- **Vite Plugin** — Auto-generate TypeScript type declarations precise to each icon name, full IDE intellisense
- **Icon Selector** — Headless composable + multi-framework presets, search, pagination, custom tabs
- **TypeScript** — Complete type definitions, generic inference for precise icon names, global component type augmentation

## Installation

```bash
pnpm add @fuxishi/svg-icon
```

## Quick Start

### Register Components

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

### Using Icons

```vue
<template>
  <FxIcon name="ep:edit" />
  <FxIcon name="ep:delete" :size="24" color="#409eff" />
  <FxIcon name="svg:my-icon" :size="32" />
</template>
```

### Using Icon Selector

```vue
<template>
  <FxIconSelect v-model="selectedIcon" placeholder="Select an icon" />
</template>

<script setup>
import { ref } from 'vue'
const selectedIcon = ref('')
</script>
```

### Vite Plugin (Recommended)

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

## Documentation

Online docs: [https://fuxi-zy.github.io/fx-svg-icons/](https://fuxi-zy.github.io/fx-svg-icons/)

## License

MIT
