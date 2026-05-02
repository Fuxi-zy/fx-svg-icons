# FxIcon

Icon component based on `@iconify/vue`'s `Icon` component, supporting Iconify collections and local SVG.

## Basic Usage

```vue
<template>
  <FxIcon name="ep:edit" />
</template>
```

## Icon Name Format

The `name` prop supports the following formats:

| Format | Description | Example |
|--------|-------------|---------|
| `prefix:iconName` | Iconify icon | `ep:edit`, `ant-design:home-outlined` |
| `svg:iconName` | Local SVG icon | `svg:star`, `svg:common-batch-processing` |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Icon name, required |
| `size` | `string \| number` | `'16px'` | Icon size, numbers are automatically suffixed with `px` |
| `color` | `string` | `'currentColor'` | Icon color |
| `customClass` | `string` | `''` | Custom CSS class name |

## Examples

### Different Sizes

```vue
<template>
  <FxIcon name="ep:edit" :size="16" />
  <FxIcon name="ep:edit" :size="24" />
  <FxIcon name="ep:edit" size="32px" />
</template>
```

### Custom Colors

```vue
<template>
  <FxIcon name="ep:edit" color="#409eff" />
  <FxIcon name="ep:delete" color="#f56c6c" />
  <FxIcon name="ep:check" color="#67c23a" />
</template>
```

### Custom Class

```vue
<template>
  <FxIcon name="ep:edit" custom-class="my-icon" />
</template>

<style>
.my-icon {
  cursor: pointer;
  transition: color 0.3s;
}
.my-icon:hover {
  color: #409eff;
}
</style>
```

### Local SVG

```vue
<template>
  <!-- Root-level SVG -->
  <FxIcon name="svg:star" />

  <!-- Sub-directory SVG, path joined with - -->
  <FxIcon name="svg:common-batch-processing" />
  <FxIcon name="svg:md-h1" />
</template>
```

> Local SVG icon naming rule: take the path after `svgs/`, remove the `.svg` suffix, and replace `/` with `-`.
> For example, `/src/assets/svgs/common/batch-processing.svg` → `svg:common-batch-processing`.
