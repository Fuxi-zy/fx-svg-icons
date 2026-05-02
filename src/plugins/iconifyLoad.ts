import { addCollection } from '@iconify/vue'
import type { IconifyJSON } from '@iconify/vue'
import { registerIconNames, extractIconNames } from './iconifyNames'
import type { IconCollection } from '../types'

/**
 * 加载单个图标集合
 */
function loadIconCollection(prefix: string, collectionData: Record<string, any>): boolean {
  try {
    if (!collectionData || !collectionData.icons) return false

    const data: IconifyJSON = {
      ...collectionData,
      prefix: collectionData.prefix || prefix,
      icons: collectionData.icons
    }

    addCollection(data)

    const iconNames = extractIconNames(collectionData)
    registerIconNames(prefix, iconNames)

    return true
  } catch {
    return false
  }
}

/**
 * 初始化 Iconify 图标集合
 * 将用户安装的图标包加载到内存中
 */
export function initIconifyIcons(collections: readonly IconCollection[]): void {
  const results = collections.map((collection) =>
    loadIconCollection(collection.prefix, collection.icons)
  )

  const successCount = results.filter(Boolean).length
  if (successCount !== results.length) {
    console.warn(
      `[FxSvgIcon] 部分图标集初始化失败 (${successCount}/${results.length})`
    )
  }
}
