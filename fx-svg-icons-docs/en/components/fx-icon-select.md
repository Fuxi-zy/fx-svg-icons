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

`FxIconSelect` automatically detects the installed UI framework and loads the corresponding preset:

| UI Framework | Detection Method | Preset Component |
|--------------|------------------|------------------|
| Element Plus | Detects `ElPopover` global component | Element Plus style selector |
| Naive UI | Detects `NPopover` global component | Naive UI style selector |
| AntDv Next | Detects `APopover` global component | AntDv Next style selector |
| TDesign | Detects `TPopup` global component | TDesign style selector |

After installing a UI framework, the selector automatically uses the corresponding preset without configuration.

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

If you don't use a preset component, you can customize the selector UI via the `useIconSelect` composable:

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
