# FxIconSelect

Icon selector component with search, pagination, and multi-tab switching.

## v1.0.7+ (Recommended)

Starting from v1.0.7, UI presets are split into independent picker packages. The Vite plugin automatically detects installed picker packages and registers the `FxIconSelect` component.

### Install Picker Package

Install the picker package for your UI framework:

::: code-group

```bash [Element Plus]
pnpm add @fuxishi/svg-icon-element-plus-picker
```

```bash [Naive UI]
pnpm add @fuxishi/svg-icon-naive-picker
```

```bash [AntDv Next]
pnpm add @fuxishi/svg-icon-antdv-picker
```

```bash [TDesign]
pnpm add @fuxishi/svg-icon-tdesign-picker
```

:::

| UI Framework | Picker Package | Dependency |
|--------------|----------------|------------|
| Element Plus | `@fuxishi/svg-icon-element-plus-picker` | `element-plus` |
| Naive UI | `@fuxishi/svg-icon-naive-picker` | `naive-ui` |
| AntDv Next | `@fuxishi/svg-icon-antdv-picker` | `antdv-next` |
| TDesign | `@fuxishi/svg-icon-tdesign-picker` | `tdesign-vue-next` |

### Usage

After installing a picker package, `setupIcons(app)` will automatically register the `FxIconSelect` component without any manual configuration:

```ts
// main.ts
import { setupIcons } from 'virtual:fx-svg-icon'

const app = createApp(App)
setupIcons(app) // Auto-register FxIcon + detect picker package and register FxIconSelect
```

Use directly in templates:

```vue
<template>
  <FxIconSelect v-model="iconName" placeholder="Select an icon" />
</template>

<script setup>
import { ref } from 'vue'
const iconName = ref('')
</script>
```

## v1.0.6 and Earlier

::: warning
The following usage applies to v1.0.6 and earlier. For v1.0.7+, use the picker package approach above.
:::

v1.0.6 and earlier, UI framework presets were built-in. `FxIconSelect` automatically detected the installed UI framework:

| UI Framework | Detection Method | Preset Component |
|--------------|------------------|------------------|
| Element Plus | Detects `ElPopover` global component | Element Plus style selector |
| Naive UI | Detects `NPopover` global component | Naive UI style selector |
| AntDv Next | Detects `APopover` global component | AntDv Next style selector |
| TDesign | Detects `TPopup` global component | TDesign style selector |

After installing a UI framework, the selector automatically used the corresponding preset without extra configuration.

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
  <div>
    <input
      :value="iconSelect.inputValue.value"
      :placeholder="iconSelect.placeholder"
      readonly
      @click="iconSelect.handleInputClick"
    />
    <div v-if="iconSelect.visible.value">
      <!-- Custom selector UI -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useIconSelect } from '@fuxishi/svg-icon'

const iconName = ref('')
const iconSelect = useIconSelect({
  modelValue: () => iconName.value,
  onSelect: (value) => { iconName.value = value }
})
</script>
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
