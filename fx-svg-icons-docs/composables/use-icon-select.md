# useIconSelect

Headless composable，提供图标选择器的核心逻辑。`FxIconSelect` 组件的预设就是基于此 composable 构建。

## 参数

### UseIconSelectOptions

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `() => string \| undefined` | `() => undefined` | 获取当前选中的图标名称（getter 函数） |
| `onSelect` | `(value: string) => void` | `() => {}` | 选中图标时的回调 |
| `placeholder` | `string` | `'请选择图标'` | 占位文本 |
| `height` | `number` | `418` | 弹层高度（px） |

## 返回值

### UseIconSelectReturn

| 属性 | 类型 | 说明 |
|------|------|------|
| `visible` | `Ref<boolean>` | 弹层是否可见 |
| `activeTab` | `Ref<string>` | 当前激活的 Tab key |
| `inputValue` | `ComputedRef<string>` | 输入框显示的值 |
| `placeholder` | `string` | 占位文本 |
| `tabs` | `ComputedRef<IconSelectTab[]>` | Tab 列表 |
| `iconData` | `Ref<Record<string, string[]>>` | 所有图标数据 |
| `searchTexts` | `Ref<Record<string, string>>` | 各 Tab 的搜索文本 |
| `currentPages` | `Ref<Record<string, number>>` | 各 Tab 的当前页码 |
| `pageSize` | `number` | 每页显示数量（30） |
| `contentHeight` | `ComputedRef<number>` | 弹层内容高度 |
| `tabContentHeight` | `ComputedRef<number>` | Tab 内容区域高度 |
| `iconListHeight` | `ComputedRef<number>` | 图标列表高度 |

### 方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `getFilteredIcons(key)` | `key: string` | 获取过滤后的图标列表 |
| `getPaginatedIcons(key)` | `key: string` | 获取当前页的图标列表 |
| `isSelected(prefix, iconName)` | `prefix: string, iconName: string` | 判断图标是否被选中 |
| `setListRef(key, el)` | `key: string, el: HTMLElement \| null` | 设置图标列表 DOM 引用 |
| `handleInputClick()` | — | 点击输入框，切换弹层显隐 |
| `handleSelectIcon(prefix, iconName)` | `prefix: string, iconName: string` | 选中图标 |
| `closePopover()` | — | 关闭弹层 |

### IconSelectTab

| 属性 | 类型 | 说明 |
|------|------|------|
| `key` | `string` | Tab 标识（`'svg'` 或图标集前缀） |
| `label` | `string` | Tab 显示文本 |

## 示例

### 基础用法

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
