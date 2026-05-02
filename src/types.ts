/**
 * 图标集合配置
 */
export interface IconCollection {
  /** 图标集合前缀（如 'ep', 'ant-design'） */
  prefix: string
  /** 图标集合数据（@iconify-json 包的 icons.json 内容） */
  icons: Record<string, any>
}

/**
 * 本地 SVG 图标信息
 */
export interface LocalSvgIconInfo {
  /** 图标名称（不含路径） */
  name: string
  /** 完整名称（用 - 连接的路径+名称） */
  fullName: string
  /** 文件夹路径（用 / 连接，空字符串表示根目录） */
  folderPath: string
}

/**
 * FxIcon 组件 Props
 */
export interface FxIconProps {
  /** 图标名称，格式：svg:xxx、ep:xxx、ant-design:xxx 等 */
  name: string
  /** 图标大小 */
  size?: string | number
  /** 图标颜色 */
  color?: string
  /** 自定义类名 */
  customClass?: string
}

/**
 * FxIconSelect 组件 Props
 */
export interface FxIconSelectProps {
  /** v-model 绑定的图标名称 */
  modelValue?: string
  /** 占位文本 */
  placeholder?: string
  /** 弹层高度（px） */
  height?: number
}

export { type UseIconSelectOptions, type UseIconSelectReturn, type IconSelectTab } from './composables/useIconSelect'
