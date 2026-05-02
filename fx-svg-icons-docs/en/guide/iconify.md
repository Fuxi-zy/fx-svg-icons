# Iconify Icons

`@fuxishi/svg-icon` is built on [Iconify](https://iconify.design/) for icon loading, supporting all `@iconify-json` packages.

## Install Icon Collections

```bash
# Element Plus icons
pnpm add -D @iconify-json/ep

# Ant Design icons
pnpm add -D @iconify-json/ant-design

# Material Design Icons
pnpm add -D @iconify-json/mdi
```

## Load Icon Collections

### Option 1: Manual Loading

```ts
import { initIconifyIcons, addCollection } from '@fuxishi/svg-icon'
import epIcons from '@iconify-json/ep/icons.json'

initIconifyIcons([
  { prefix: 'ep', icons: epIcons }
])
```

### Option 2: Auto Loading via Vite Plugin

With `fxDtsPlugin` configured, the plugin automatically scans all `@iconify-json` packages in `node_modules/` and generates a virtual module `virtual:fx-svg-icon` that auto-loads all installed icon collections:

```ts
// main.ts
import { setupIcons } from 'virtual:fx-svg-icon'

const app = createApp(App)
setupIcons(app) // Auto-loads all @iconify-json packages
```

## Using Icons

After installing and loading icon collections, use the `prefix:iconName` format:

```vue
<template>
  <FxIcon name="ep:edit" />
  <FxIcon name="ep:delete" :size="24" />
  <FxIcon name="ant-design:home-outlined" color="#1890ff" />
  <FxIcon name="mdi:account" :size="32" />
</template>
```

## On-Demand Loading

If you only need a few icons, use `addIcon` for on-demand loading:

```ts
import { addIcon } from '@fuxishi/svg-icon'

addIcon('ep:edit', {
  body: '<svg>...</svg>',
  width: 24,
  height: 24
})
```

## Icon Name Utilities

Use utility functions to query available icons:

```ts
import {
  getAllIconNames,
  getIconNamesByPrefix,
  hasIcon,
  hasIconByString
} from '@fuxishi/svg-icon'

// Get all icon collection name mappings
getAllIconNames() // { ep: ['edit', 'delete', ...], 'ant-design': [...] }

// Get icon name list by prefix
getIconNamesByPrefix('ep') // ['edit', 'delete', ...]

// Check if an icon exists
hasIcon('ep', 'edit') // true
hasIconByString('ep:edit') // true
```
