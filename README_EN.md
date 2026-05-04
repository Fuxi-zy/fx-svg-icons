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

### 1. Configure Vite Plugin

```ts
// vite.config.ts
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
      svgGlobPattern: '~/svgs',       // Local SVG directory (optional), supports alias prefix, auto-completes glob
      // svgGlobPattern also supports: '/src/assets/svgs', '@/assets/svgs', '~/svgs/**/*.svg'
      dtsDir: '@/types',              // Type declaration output directory, supports alias prefix
      // dtsDir also supports: 'src', '/types', 'src/types'
      splitDts: true,                 // Split type files by icon set
    }),
  ],
})
```

### 2. Initialize

```ts
// main.ts
import { setupIcons } from 'virtual:fx-svg-icon'

const app = createApp(App)
setupIcons(app) // Auto register components + load icon data + load local SVG
app.mount('#app')
```

`setupIcons` handles everything in one line: registers `FxIcon` / `FxIconSelect` as global components, loads all installed `@iconify-json/*` icon data, and loads local SVG icons via `import.meta.glob`.

### 3. Using Icons

```vue
<template>
  <!-- Iconify icon sets -->
  <FxIcon name="ep:edit" />
  <FxIcon name="ep:delete" :size="24" color="#409eff" />

  <!-- Local SVG icons -->
  <FxIcon name="svg:my-icon" :size="32" />
</template>
```

### 4. Using Icon Selector

```vue
<template>
  <FxIconSelect v-model="selectedIcon" placeholder="Select an icon" />
</template>

<script setup>
import { ref } from 'vue'
const selectedIcon = ref('')
</script>
```

The icon selector automatically detects the current UI framework (Element Plus / Naive UI / AntDv Next / TDesign) and matches the corresponding component preset.

## Documentation

Online docs: [https://fuxi-zy.github.io/fx-svg-icons/](https://fuxi-zy.github.io/fx-svg-icons/)

## License

MIT
