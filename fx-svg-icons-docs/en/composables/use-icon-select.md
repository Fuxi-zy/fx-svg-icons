# useIconSelect

Headless composable providing the core logic for the icon selector. The presets of `FxIconSelect` are built on this composable.

## Options

### UseIconSelectOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `modelValue` | `() => string \| undefined` | `() => undefined` | Getter function for the currently selected icon name |
| `onSelect` | `(value: string) => void` | `() => {}` | Callback when an icon is selected |
| `placeholder` | `string` | `'请选择图标'` | Placeholder text |
| `height` | `number` | `418` | Popover height (px) |

## Return Values

### UseIconSelectReturn

| Property | Type | Description |
|----------|------|-------------|
| `visible` | `Ref<boolean>` | Whether the popover is visible |
| `activeTab` | `Ref<string>` | Current active tab key |
| `inputValue` | `ComputedRef<string>` | Input display value |
| `placeholder` | `string` | Placeholder text |
| `tabs` | `ComputedRef<IconSelectTab[]>` | Tab list |
| `iconData` | `Ref<Record<string, string[]>>` | All icon data |
| `searchTexts` | `Ref<Record<string, string>>` | Search text for each tab |
| `currentPages` | `Ref<Record<string, number>>` | Current page for each tab |
| `pageSize` | `number` | Items per page (30) |
| `contentHeight` | `ComputedRef<number>` | Popover content height |
| `tabContentHeight` | `ComputedRef<number>` | Tab content area height |
| `iconListHeight` | `ComputedRef<number>` | Icon list height |

### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `getFilteredIcons(key)` | `key: string` | Get filtered icon list |
| `getPaginatedIcons(key)` | `key: string` | Get paginated icon list for current page |
| `isSelected(prefix, iconName)` | `prefix: string, iconName: string` | Check if an icon is selected |
| `setListRef(key, el)` | `key: string, el: HTMLElement \| null` | Set icon list DOM reference |
| `handleInputClick()` | — | Toggle popover visibility on input click |
| `handleSelectIcon(prefix, iconName)` | `prefix: string, iconName: string` | Select an icon |
| `closePopover()` | — | Close the popover |

### IconSelectTab

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Tab identifier (`'svg'` or icon collection prefix) |
| `label` | `string` | Tab display text |

## Example

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
      <div v-for="tab in iconSelect.tabs.value" :key="tab.key">
        <button @click="iconSelect.activeTab.value = tab.key">
          {{ tab.label }}
        </button>
      </div>
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

[View Custom Demo](https://fuxi-zy.github.io/fx-svg-icons/demos/custom/){target="_blank"}