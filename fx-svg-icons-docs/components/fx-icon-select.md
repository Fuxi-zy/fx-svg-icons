# FxIconSelect

图标选择器组件，提供搜索、分页、多 Tab 切换的图标选择功能。

## v1.0.7+（推荐）

从 v1.0.7 开始，UI 预设拆分为独立的 picker 包，Vite 插件会自动检测已安装的 picker 包并注册 `FxIconSelect` 组件。

### 安装 picker 包

根据你的 UI 框架安装对应的 picker 包：

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

```bash [Vanilla（无 UI 框架）]
pnpm add @fuxishi/svg-icon-picker
```

:::

| UI 框架 | Picker 包 | 依赖 |
|---------|-----------|------|
| Element Plus | `@fuxishi/svg-icon-element-plus-picker` | `element-plus` |
| Naive UI | `@fuxishi/svg-icon-naive-picker` | `naive-ui` |
| AntDv Next | `@fuxishi/svg-icon-antdv-picker` | `antdv-next` |
| TDesign | `@fuxishi/svg-icon-tdesign-picker` | `tdesign-vue-next` |
| 无 UI 框架 | `@fuxishi/svg-icon-picker` | 无 |

### 使用

安装 picker 包后，`setupIcons(app)` 会自动注册 `FxIconSelect` 组件，无需手动配置：

```ts
// main.ts
import { setupIcons } from 'virtual:fx-svg-icon'

const app = createApp(App)
setupIcons(app) // 自动注册 FxIcon + 检测 picker 包并注册 FxIconSelect
```

在模板中直接使用：

```vue
<template>
  <FxIconSelect v-model="iconName" placeholder="请选择图标" />
</template>

<script setup>
import { ref } from 'vue'
const iconName = ref('')
</script>
```

## v1.0.6 及之前

::: warning
以下用法适用于 v1.0.6 及之前版本。v1.0.7+ 请使用上方的 picker 包方式。
:::

v1.0.6 及之前版本内置了 UI 框架预设，`FxIconSelect` 会自动检测已安装的 UI 框架：

| UI 框架 | 检测方式 | 预设组件 |
|---------|----------|----------|
| Element Plus | 检测 `ElPopover` 全局组件 | Element Plus 风格的选择器 |
| Naive UI | 检测 `NPopover` 全局组件 | Naive UI 风格的选择器 |
| AntDv Next | 检测 `APopover` 全局组件 | AntDv Next 风格的选择器 |
| TDesign | 检测 `TPopup` 全局组件 | TDesign 风格的选择器 |

安装 UI 框架后，选择器会自动使用对应的预设，无需额外配置。

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

如果不使用任何 UI 框架预设，可以通过 `useIconSelect` composable 自定义选择器的 UI：

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
      <!-- 自定义选择器 UI -->
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

详见 [useIconSelect](/composables/use-icon-select)。

[查看自定义示例](https://fuxi-zy.github.io/fx-svg-icons/demos/custom/){target="_blank"}

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

## CSS 变量

`@fuxishi/svg-icon-picker`（Vanilla 版本）支持通过 CSS 变量自定义主题。只需在组件外层覆盖对应的 CSS 变量即可：

```css
/* 全局覆盖 */
:root {
  --fx-primary: #1677ff;
  --fx-border-radius: 8px;
}

/* 或针对单个选择器覆盖 */
.my-picker {
  --fx-primary: #1677ff;
}
```

```vue
<template>
  <div class="my-picker">
    <FxIconSelect v-model="iconName" />
  </div>
</template>
```

### 可用变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--fx-primary` | `#409eff` | 主题色（选中、hover、激活状态） |
| `--fx-primary-light` | `#ecf5ff` | 主题色浅色（图标项 hover 背景） |
| `--fx-color-text-primary` | `#303133` | 主文本色 |
| `--fx-color-text-regular` | `#606266` | 常规文本色 |
| `--fx-color-text-secondary` | `#909399` | 次要文本色（图标名称、提示文字） |
| `--fx-color-text-placeholder` | `#c0c4cc` | 占位符 / 禁用文本色 |
| `--fx-color-bg` | `#fff` | 背景色 |
| `--fx-color-bg-hover` | `#f0f2f5` | 清除按钮 hover 背景色 |
| `--fx-border-color` | `#dcdfe6` | 边框色 |
| `--fx-border-color-light` | `#e4e7ed` | 浅边框色（分隔线、图标项边框） |
| `--fx-border-radius` | `4px` | 基础圆角 |
| `--fx-border-radius-lg` | `6px` | 大圆角（输入框、弹窗） |
| `--fx-font-size-sm` | `12px` | 小字号 |
| `--fx-font-size-base` | `13px` | 基础字号 |
| `--fx-font-size-md` | `14px` | 中字号（输入框、标签页） |
| `--fx-transition` | `0.2s` | 过渡动画时长 |
