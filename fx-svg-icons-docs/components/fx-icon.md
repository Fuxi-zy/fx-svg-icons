# FxIcon

图标组件，基于 `@iconify/vue` 的 `Icon` 组件封装，支持 Iconify 图标集和本地 SVG。

## 基本用法

```vue
<template>
  <FxIcon name="ep:edit" />
</template>
```

## 图标名称格式

`name` 属性支持以下格式：

| 格式 | 说明 | 示例 |
|------|------|------|
| `prefix:iconName` | Iconify 图标 | `ep:edit`、`ant-design:home-outlined` |
| `svg:iconName` | 本地 SVG 图标 | `svg:star`、`svg:common-batch-processing` |

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | — | 图标名称，必填 |
| `size` | `string \| number` | `'16px'` | 图标大小，数字类型会自动加 `px` |
| `color` | `string` | `'currentColor'` | 图标颜色 |
| `customClass` | `string` | `''` | 自定义 CSS 类名 |

## 示例

### 不同大小

```vue
<template>
  <FxIcon name="ep:edit" :size="16" />
  <FxIcon name="ep:edit" :size="24" />
  <FxIcon name="ep:edit" size="32px" />
</template>
```

### 自定义颜色

```vue
<template>
  <FxIcon name="ep:edit" color="#409eff" />
  <FxIcon name="ep:delete" color="#f56c6c" />
  <FxIcon name="ep:check" color="#67c23a" />
</template>
```

### 自定义类名

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

### 本地 SVG

```vue
<template>
  <!-- 根目录下的 SVG -->
  <FxIcon name="svg:star" />

  <!-- 子目录下的 SVG，路径用 - 连接 -->
  <FxIcon name="svg:common-batch-processing" />
  <FxIcon name="svg:md-h1" />
</template>
```

> 本地 SVG 文件的图标名规则：取 `svgs/` 之后的路径，去掉 `.svg` 后缀，`/` 替换为 `-`。
> 例如 `/src/assets/svgs/common/batch-processing.svg` → `svg:common-batch-processing`。
