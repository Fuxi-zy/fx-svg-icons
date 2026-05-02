// 由 @fuxishi/svg-icon/vite 自动生成，请勿手动修改
// 图标总数: 1123

import type { FunctionalComponent } from 'vue'
import type { IconStringAntDesign } from './fx-icon-ant-design-types'
import type { IconStringEp } from './fx-icon-ep-types'

type IconString =
  | `svg:${string}`
  | IconStringAntDesign
  | IconStringEp

declare module 'vue' {
  export interface GlobalComponents {
    FxIcon: FunctionalComponent<{
      name: IconString
      size?: string | number
      color?: string
      customClass?: string
    }>
    FxIconSelect: FunctionalComponent<{
      modelValue?: IconString | ''
      placeholder?: string
      height?: number
    }>
  }
}

declare module 'virtual:fx-svg-icon' {
  import type { App } from 'vue'
  export function setupIcons(app: App): void
}
