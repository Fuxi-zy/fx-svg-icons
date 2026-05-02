import { h, type FunctionalComponent } from 'vue'
import FxIconSFC from './components/FxIcon.vue'
import FxIconSelectSFC from './components/FxIconSelect.vue'

// 组件
export { default as FxIcon } from './components/FxIcon.vue'
export { default as FxIconSelect } from './components/FxIconSelect.vue'

// Headless composable
export { useIconSelect } from './composables/useIconSelect'

// 图标加载
export { initIconifyIcons } from './plugins/iconifyLoad'
export { initSvgIcons } from './svg/load'

// 图标名称工具
export {
  getAllIconNames,
  getIconNamesByPrefix,
  hasIcon,
  hasLocalSvgIcon,
  getLocalSvgIconNames,
  getLocalSvgIconDetails,
  hasDependencyIcon,
  hasIconByString,
  registerIconNames,
  extractIconNames
} from './plugins/iconifyNames'

// @iconify/vue 基础能力
export { addIcon, addCollection, Icon as IconifyIcon, listIcons } from '@iconify/vue'

// 类型
export type { IconCollection, LocalSvgIconInfo, FxIconProps, FxIconSelectProps } from './types'
export type { UseIconSelectOptions, UseIconSelectReturn, IconSelectTab } from './composables/useIconSelect'
export type { IconifyIcon as IconifyIconStructure } from '@iconify/vue'

/**
 * 提取 icons.json 中真实的图标名称联合类型
 */
type ExtractIconName<T> = T extends { icons: infer I } ? Extract<keyof I, string> : never

/**
 * 根据图标集合数据推导出精确的图标名称类型
 */
type DeriveIconString<
  T extends ReadonlyArray<{ prefix: string; icons: Record<string, any> }>
> =
  | `svg:${string}`
  | {
      [K in T[number] as K['prefix']]: `${K['prefix']}:${ExtractIconName<K['icons']>}`
    }[T[number]['prefix']]

/**
 * 根据用户配置的图标集合，推导出精确到每个图标名的类型，并返回集合数据
 *
 * @example
 * ```ts
 * // plugins/icons.ts
 * import epIcons from '@iconify-json/ep/icons.json'
 *
 * export const { collections, declareTypes } = defineIconCollections([
 *   { prefix: 'ep', icons: epIcons }
 * ])
 * ```
 */
export function defineIconCollections<
  T extends ReadonlyArray<{ prefix: string; icons: Record<string, any> }>
>(collections: T) {
  type IconString = DeriveIconString<T>

  const declareTypes = () => {
    // 运行时无操作，仅用于触发模块增强的类型加载
  }

  return {
    collections,
    /** 推导出的图标名称类型（仅用于 typeof 提取） */
    IconString: null as unknown as IconString,
    /**
     * 调用此函数以激活 Vue 全局组件类型增强
     * 需要在用户项目的入口文件中调用
     */
    declareTypes
  }
}
