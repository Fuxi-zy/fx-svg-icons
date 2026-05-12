# Installation

## Package Manager

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

## Peer Dependencies

`@fuxishi/svg-icon` requires the following peer dependency:

| Dependency | Version | Required |
|------------|---------|----------|
| `vue` | `^3.5.33` | Yes |

```bash
pnpm add vue
```

## Optional Dependencies

The following UI frameworks are optional. Installing them automatically enables the corresponding icon selector preset:

| Dependency | Purpose |
|------------|---------|
| `element-plus` | Element Plus preset |
| `naive-ui` | Naive UI preset |
| `antdv-next` | AntDv Next preset |
| `tdesign-vue-next` | TDesign preset |

You can also install the framework-free picker package:

| Package | Purpose |
|---------|---------|
| `@fuxishi/svg-icon-vanilla-picker` | No UI framework preset, supports CSS variable theming |

After installing a picker package, `FxIconSelect` will automatically detect and load the corresponding preset component without manual configuration.

## Icon Collection Packages

To use Iconify icon collections, install the corresponding `@iconify-json` packages:

```bash
# Element Plus icons
pnpm add -D @iconify-json/ep

# Ant Design icons
pnpm add -D @iconify-json/ant-design

# Material Design Icons
pnpm add -D @iconify-json/mdi
```

> You can find all available icon sets at [Iconify Icon Sets](https://icon-sets.iconify.design/).

## Full Installation Example

For an Element Plus project:

```bash
pnpm add @fuxishi/svg-icon element-plus @element-plus/icons-vue @iconify-json/ep
```
