import type { LocalSvgIconInfo } from '../types'

/** 已加载的图标集合数据（依赖包中的图标） */
const iconCollections: Record<string, string[]> = {}

/** 本地 SVG 图标列表（完整名称） */
let localSvgIcons: string[] = []

/** 本地 SVG 图标详细信息 */
let localSvgIconDetails: LocalSvgIconInfo[] = []

/**
 * 注册图标集合的名称列表
 */
export function registerIconNames(prefix: string, iconNames: string[]): void {
  iconCollections[prefix] = iconNames
}

/**
 * 从图标集合数据中提取图标名称
 */
export function extractIconNames(collectionData: { icons?: Record<string, any> }): string[] {
  if (!collectionData || !collectionData.icons) return []
  return Object.keys(collectionData.icons)
}

/**
 * 注册本地 SVG 图标信息（由 svg/load.ts 调用）
 */
export function registerLocalSvgIcon(iconName: string): void {
  if (!localSvgIcons.includes(iconName)) {
    localSvgIcons.push(iconName)

    const parts = iconName.split('-')
    const name = parts[parts.length - 1] || ''
    const folderPath = parts.length > 1 ? parts.slice(0, -1).join('/') : ''

    localSvgIconDetails.push({
      name,
      fullName: iconName,
      folderPath
    })
  }
}

/**
 * 获取所有图标集合的名称
 */
export function getAllIconNames(): Record<string, string[]> {
  return { ...iconCollections }
}

/**
 * 获取指定前缀的图标名称列表
 */
export function getIconNamesByPrefix(prefix: string): string[] {
  return iconCollections[prefix] || []
}

/**
 * 检查指定图标是否存在
 */
export function hasIcon(prefix: string, iconName: string): boolean {
  const names = iconCollections[prefix]
  return names ? names.includes(iconName) : false
}

/**
 * 检查本地是否拥有指定的 SVG 图标
 */
export function hasLocalSvgIcon(iconName: string): boolean {
  const cleanName = iconName.replace(/\.svg$/, '')
  const normalizedName = cleanName.replace(/\//g, '-')
  return localSvgIcons.includes(normalizedName)
}

/**
 * 获取所有本地 SVG 图标名称列表
 */
export function getLocalSvgIconNames(): string[] {
  return [...localSvgIcons]
}

/**
 * 获取所有本地 SVG 图标详细信息列表
 */
export function getLocalSvgIconDetails(): LocalSvgIconInfo[] {
  return [...localSvgIconDetails]
}

/**
 * 检查依赖包中是否拥有指定的图标
 */
export function hasDependencyIcon(prefix: string, iconName: string): boolean {
  return hasIcon(prefix, iconName)
}

/**
 * 检查图标是否存在（支持本地 SVG 和依赖图标）
 * 格式：'svg:xxx' 或 'ep:xxx' 或 'ant-design:xxx'
 */
export function hasIconByString(iconString: string): boolean {
  const trimmed = (iconString != null ? String(iconString) : '').trim()
  const colonIndex = trimmed.indexOf(':')

  if (colonIndex === -1) {
    return hasLocalSvgIcon(trimmed)
  }

  const prefix = trimmed.substring(0, colonIndex)
  const iconName = trimmed.substring(colonIndex + 1)

  if (prefix === 'svg') {
    return hasLocalSvgIcon(iconName)
  }
  return hasDependencyIcon(prefix, iconName)
}
