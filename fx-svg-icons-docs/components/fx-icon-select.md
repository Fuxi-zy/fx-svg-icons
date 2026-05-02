# FxIconSelect

图标选择器组件，提供搜索、分页、多 Tab 切换的图标选择功能。

## 基本用法

```vue
<template>
  <FxIconSelect v-model="iconName" placeholder="请选择图标" />
</template>

<script setup>
import { ref } from 'vue'
const iconName = ref('')
</script>
```

## 自动预设检测

`FxIconSelect` 会自动检测当前项目中安装的 UI 框架，加载对应的预设组件：

| UI 框架 | 检测方式 | 预设组件 |
|---------|----------|----------|
| Element Plus | 检测 `ElPopover` 全局组件 | Element Plus 风格的选择器 |
| Naive UI | 检测 `NPopover` 全局组件 | Naive UI 风格的选择器 |
| AntDv Next | 检测 `APopover` 全局组件 | AntDv Next 风格的选择器 |
| TDesign | 检测 `TPopup` 全局组件 | TDesign 风格的选择器 |

安装对应的 UI 框架后，选择器会自动使用对应的预设，无需任何配置。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string` | — | v-model 绑定的图标名称 |
| `placeholder` | `string` | `'请选择图标'` | 占位文本 |
| `height` | `number` | `418` | 弹层高度（px） |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `(value: string)` | 选中图标时触发 |

## Headless 使用

如果不使用预设组件，可以通过 `useIconSelect` composable 自定义选择器的 UI：

```vue
<template>
  <FxIconSelect v-model="iconName">
    <template #default="{ visible, tabs, handleInputClick, handleSelectIcon }">
      <!-- 自定义选择器 UI -->
    </template>
  </FxIconSelect>
</template>
```

详见 [useIconSelect](/composables/use-icon-select)。

## 示例

### 基础

```vue
<template>
  <FxIconSelect v-model="iconName" />
  <p>已选择：{{ iconName }}</p>
</template>
```

### 自定义高度和占位文本

```vue
<template>
  <FxIconSelect
    v-model="iconName"
    placeholder="点击选择图标"
    :height="500"
  />
</template>
```
