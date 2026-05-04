# 更新日志

所有版本变更记录，点击版本号可查看 GitHub Release 详情。

## [v1.0.5](https://github.com/Fuxi-zy/fx-svg-icons/releases/tag/v1.0.5)

- 移除 FxIconSelect 各预设对外部图标包的静态依赖（`tdesign-icons-vue-next`、`@element-plus/icons-vue`、`@antdv-next/icons`），改用内置 SVG
- 移除 naive/antdv 预设对 UI 库组件的静态导入，改为运行时通过全局注册解析
- 修复消费者项目未安装对应 UI 库时构建报错的问题

## ~~[v1.0.4](https://github.com/Fuxi-zy/fx-svg-icons/releases/tag/v1.0.4)~~ ⚠️ 已废弃

- 移除 FxIconSelect 各预设对外部图标包的静态依赖，改用内置 SVG

## ~~[v1.0.3](https://github.com/Fuxi-zy/fx-svg-icons/releases/tag/v1.0.3)~~ ⚠️ 已废弃

- 自动生成的 `IconString` 类型添加 `export` 导出

## ~~[v1.0.2](https://github.com/Fuxi-zy/fx-svg-icons/releases/tag/v1.0.2)~~ ⚠️ 已废弃

- 路径解析支持所有 `resolve.alias` 配置的前缀（`@/`、`~/` 等）
- `svgGlobPattern` 不含 glob 模式时自动补全 `/**/*.svg`
- `dtsDir` 路径超出项目根目录时报错
- `dtsDir` 变更时同步清理旧目录下的拆分文件

## ~~[v1.0.1](https://github.com/Fuxi-zy/fx-svg-icons/releases/tag/v1.0.1)~~ ⚠️ 已废弃

- 为所有 demo 添加左侧依赖检测面板
- 为 naive/antdv-next/tdesign demo 添加本地 SVG 图标展示
- 重构 README 快速开始流程
- 修复 demos 文档链接问题

## ~~[v1.0.0](https://github.com/Fuxi-zy/fx-svg-icons/releases/tag/v1.0.0)~~ ⚠️ 已废弃

- 首个正式版本发布
- 支持 Iconify 图标集 + 本地 SVG
- 支持 Element Plus / Naive UI / AntDv Next / TDesign 预设
- Vite 插件自动类型生成
- 图标选择器组件

## ~~v0.x~~（已废弃）

早期测试版本，请升级到 v1.0.5 或更高版本。
