# Changelog

All version changes. Click the version number to view the GitHub Release details.

## [v1.0.4](https://github.com/Fuxi-zy/fx-svg-icons/releases/tag/v1.0.4)

- Removed static imports of external icon packages (`tdesign-icons-vue-next`, `@element-plus/icons-vue`, `@antdv-next/icons`) from FxIconSelect presets, replaced with built-in SVGs
- Removed static imports of UI library components from naive/antdv presets, now resolved at runtime via global registration
- Fixed build errors in consumer projects that don't have the corresponding UI libraries installed

## [v1.0.3](https://github.com/Fuxi-zy/fx-svg-icons/releases/tag/v1.0.3)

- Added `export` to the auto-generated `IconString` type

## [v1.0.2](https://github.com/Fuxi-zy/fx-svg-icons/releases/tag/v1.0.2)

- Path resolution supports all `resolve.alias` prefixes (`@/`, `~/`, etc.)
- `svgGlobPattern` auto-completes `/**/*.svg` when no glob pattern is present
- `dtsDir` throws an error when the resolved path is outside the project root
- `dtsDir` cleans up split files in the old directory when path changes

## [v1.0.1](https://github.com/Fuxi-zy/fx-svg-icons/releases/tag/v1.0.1)

- Added dependency detection panel to all demos
- Added local SVG icon display for naive/antdv-next/tdesign demos
- Refactored README quick start guide
- Fixed demo documentation link issues

## [v1.0.0](https://github.com/Fuxi-zy/fx-svg-icons/releases/tag/v1.0.0)

- First stable release
- Iconify icon sets + local SVG support
- Element Plus / Naive UI / AntDv Next / TDesign presets
- Vite plugin auto type generation
- Icon selector component
