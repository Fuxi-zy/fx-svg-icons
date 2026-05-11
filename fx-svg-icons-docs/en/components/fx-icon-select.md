# FxIconSelect

Icon selector component with search, pagination, and multi-tab switching.

## Basic Usage

```vue
<template>
  <FxIconSelect v-model="iconName" placeholder="Select an icon" />
</template>

<script setup>
import { ref } from 'vue'
const iconName = ref('')
</script>
```

## Auto Preset Detection

After installing a UI framework picker package, the Vite plugin automatically detects and registers the corresponding preset:

| UI Framework | Package | Preset Component |
|--------------|---------|------------------|
| Element Plus | `@fuxishi/svg-icon-element-plus-picker` | Element Plus style selector |
| Naive UI | `@fuxishi/svg-icon-naive-picker` | Naive UI style selector |
| AntDv Next | `@fuxishi/svg-icon-antdv-picker` | AntDv Next style selector |
| TDesign | `@fuxishi/svg-icon-tdesign-picker` | TDesign style selector |

After installing a picker package, `setupIcons(app)` will automatically register the `FxIconSelect` component without any configuration.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | — | v-model bound icon name |
| `placeholder` | `string` | `'请选择图标'` | Placeholder text |
| `height` | `number` | `418` | Popover height (px) |

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `update:modelValue` | `(value: string)` | Emitted when an icon is selected |

## Headless Usage

If you don't use a UI framework preset, you can customize the selector UI via the `useIconSelect` composable:

```vue
<template>
  <FxIconSelect v-model="iconName">
    <template #default="{ visible, tabs, handleInputClick, handleSelectIcon }">
      <!-- Custom selector UI -->
    </template>
  </FxIconSelect>
</template>
```

See [useIconSelect](/en/composables/use-icon-select) for details.

[View Custom Demo](https://fuxi-zy.github.io/fx-svg-icons/demos/custom/){target="_blank"}

## Examples

### Basic

```vue
<template>
  <FxIconSelect v-model="iconName" />
  <p>Selected: {{ iconName }}</p>
</template>
```

### Custom Height and Placeholder

```vue
<template>
  <FxIconSelect
    v-model="iconName"
    placeholder="Click to select an icon"
    :height="500"
  />
</template>
```
