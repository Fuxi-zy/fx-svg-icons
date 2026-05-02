# Vite Plugin

The Vite plugin from `@fuxishi/svg-icon/vite` auto-generates icon type declarations and virtual modules.

## Setup

The plugin is included in `@fuxishi/svg-icon`, no additional installation needed. Import from `@fuxishi/svg-icon/vite`:

```ts
import { fxDtsPlugin } from '@fuxishi/svg-icon/vite'
```

## Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fxDtsPlugin } from '@fuxishi/svg-icon/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
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

## Options

### FxSvgTypesOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `svgGlobPattern` | `string` | — | Glob path for local SVG directory |
| `dtsDir` | `string` | `'src'` | Type file output directory, supports `@/xxx` or `src/xxx` format |
| `splitDts` | `boolean` | `false` | Whether to split type files by icon package |

## Features

### 1. Auto Type Generation

The plugin automatically scans all `@iconify-json` packages in `node_modules/` and generates TypeScript type declarations precise to each icon name.

**Merged mode** (`splitDts: false`): All icons are generated into a single `fx-icon-types.d.ts` file.

**Split mode** (`splitDts: true`): Each icon package gets its own type file:

```
src/types/
├── fx-icon-types.d.ts              # Main file, unified imports
├── fx-icon-ep-types.d.ts           # Element Plus icons
├── fx-icon-ant-design-types.d.ts   # Ant Design icons
└── fx-icon-mdi-types.d.ts          # Material Design Icons
```

Generated types enhance Vue global components:

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

### 2. Virtual Module

The plugin generates a `virtual:fx-svg-icon` virtual module that includes:

- Auto-import of all `@iconify-json` packages
- Registration of `FxIcon` and `FxIconSelect` global components
- Loading of Iconify icon collections
- Loading of local SVG (if `svgGlobPattern` is configured)

```ts
// main.ts
import { setupIcons } from 'virtual:fx-svg-icon'

const app = createApp(App)
setupIcons(app) // One line for all initialization
```

### 3. Path Change Auto-Handling

- When `dtsDir` changes, old files are automatically deleted and new ones generated
- Import statements referencing old type files are automatically updated
- Supports `@` path alias detection

## TypeScript Configuration

Ensure `tsconfig.json` includes the type declaration file:

```json
{
  "compilerOptions": {
    "types": ["./src/types/fx-icon-types"]
  }
}
```
