# 安装

## 包管理器

::: code-group

```bash [pnpm]
pnpm add @fuxishi/svg-icon
```

```bash [npm]
npm install @fuxishi/svg-icon
```

```bash [yarn]
yarn add @fuxishi/svg-icon
```

:::

## Peer 依赖

`@fuxishi/svg-icon` 需要以下 Peer 依赖：

| 依赖 | 版本 | 必须 |
|------|------|------|
| `vue` | `^3.5.33` | 是 |

```bash
pnpm add vue
```

## 可选依赖

以下 UI 框架为可选依赖，安装后可自动启用对应的图标选择器预设：

| 依赖 | 用途 |
|------|------|
| `element-plus` | Element Plus 预设 |
| `naive-ui` | Naive UI 预设 |
| `antdv-next` | AntDv Next 预设 |
| `tdesign-vue-next` | TDesign 预设 |

也可安装无 UI 框架依赖的 picker 包：

| 包名 | 用途 |
|------|------|
| `@fuxishi/svg-icon-vanilla-picker` | 无 UI 框架预设，支持 CSS 变量自定义主题 |

安装对应的 picker 包后，`FxIconSelect` 会自动检测并加载对应的预设组件，无需手动配置。

## 图标集包

使用 Iconify 图标集需要安装对应的 `@iconify-json` 包：

```bash
# Element Plus 图标
pnpm add -D @iconify-json/ep

# Ant Design 图标
pnpm add -D @iconify-json/ant-design

# Material Design Icons
pnpm add -D @iconify-json/mdi
```

> 你可以在 [Iconify 图标集](https://icon-sets.iconify.design/) 查找所有可用的图标集。

## 完整安装示例

以 Element Plus 项目为例：

```bash
pnpm add @fuxishi/svg-icon element-plus @element-plus/icons-vue @iconify-json/ep
```
