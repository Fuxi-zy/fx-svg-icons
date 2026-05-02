# Iconify 图标集

`@fuxishi/svg-icon` 基于 [Iconify](https://iconify.design/) 构建图标加载能力，支持所有 `@iconify-json` 图标包。

## 安装图标集

```bash
# Element Plus 图标
pnpm add -D @iconify-json/ep

# Ant Design 图标
pnpm add -D @iconify-json/ant-design

# Material Design Icons
pnpm add -D @iconify-json/mdi
```

## 加载图标集

### 方式一：手动加载

```ts
import { initIconifyIcons, addCollection } from '@fuxishi/svg-icon'
import epIcons from '@iconify-json/ep/icons.json'

initIconifyIcons([
  { prefix: 'ep', icons: epIcons }
])
```

### 方式二：使用 Vite 插件自动加载

配置 `fxDtsPlugin` 后，插件会自动扫描 `node_modules/@iconify-json/` 下的所有图标包，生成虚拟模块 `virtual:fx-svg-icon`，自动加载所有已安装的图标集：

```ts
// main.ts
import { setupIcons } from 'virtual:fx-svg-icon'

const app = createApp(App)
setupIcons(app) // 自动加载所有 @iconify-json 包
```

## 使用图标

安装并加载图标集后，通过 `prefix:iconName` 格式使用：

```vue
<template>
  <FxIcon name="ep:edit" />
  <FxIcon name="ep:delete" :size="24" />
  <FxIcon name="ant-design:home-outlined" color="#1890ff" />
  <FxIcon name="mdi:account" :size="32" />
</template>
```

## 按需加载

如果只需要少量图标，可以使用 `addIcon` 按需加载：

```ts
import { addIcon } from '@fuxishi/svg-icon'

addIcon('ep:edit', {
  body: '<svg>...</svg>',
  width: 24,
  height: 24
})
```

## 图标名称查询

使用工具函数查询可用的图标：

```ts
import {
  getAllIconNames,
  getIconNamesByPrefix,
  hasIcon,
  hasIconByString
} from '@fuxishi/svg-icon'

// 获取所有图标集的名称映射
getAllIconNames() // { ep: ['edit', 'delete', ...], 'ant-design': [...] }

// 获取指定前缀的图标名列表
getIconNamesByPrefix('ep') // ['edit', 'delete', ...]

// 检查图标是否存在
hasIcon('ep', 'edit') // true
hasIconByString('ep:edit') // true
```
