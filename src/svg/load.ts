import { addIcon } from '@iconify/vue'
import type { IconifyIcon } from '@iconify/vue'
import { registerLocalSvgIcon } from '../plugins/iconifyNames'

/**
 * 解析 SVG 字符串为 Iconify 图标格式
 */
function parseSvg(svgData: string): IconifyIcon {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(svgData, 'image/svg+xml')
  const svgElement = xmlDoc.documentElement

  const getAttrs = (el: Element, attrs: string[]) =>
    attrs
      .map((attr) =>
        el.hasAttribute(attr) ? `${attr}="${el.getAttribute(attr)}"` : ''
      )
      .filter(Boolean)
      .join(' ')

  const rootAttrs = getAttrs(svgElement, [
    'fill',
    'stroke',
    'fill-rule',
    'stroke-width'
  ])

  const svgContent = [...svgElement.childNodes]
    .filter((node) => node.nodeType === Node.ELEMENT_NODE)
    .map((node) => new XMLSerializer().serializeToString(node))
    .join('')

  const body = rootAttrs ? `<g ${rootAttrs}>${svgContent}</g>` : svgContent

  const viewBoxValue = svgElement.getAttribute('viewBox') || ''
  const [left, top, width, height] = viewBoxValue.split(' ').map((val) => {
    const num = Number(val)
    return Number.isNaN(num) ? undefined : num
  })

  return {
    body,
    height,
    left,
    top,
    width
  }
}

/**
 * 从文件路径中提取图标名称（支持多级目录）
 * 例如: /src/assets/svgs/common/batch-processing.svg -> common-batch-processing
 * 例如: /src/assets/svgs/star.svg -> star
 */
function extractIconName(filePath: string): string {
  const end = filePath.lastIndexOf('.')
  const noExt = filePath.slice(0, end)
  // 取 svgs/ 之后的部分
  const svgsIndex = noExt.indexOf('/svgs/')
  const relative = svgsIndex !== -1 ? noExt.slice(svgsIndex + '/svgs/'.length) : noExt.split('/').pop() || ''
  // 将 / 替换为 - 连接
  return relative.replace(/\//g, '-')
}

/**
 * 初始化本地 SVG 图标
 * 接收 import.meta.glob 的结果，解析 SVG 并注册为 Iconify 图标
 *
 * @param svgModules - import.meta.glob 的结果，需使用 { eager: true, query: '?raw' }
 *
 * @example
 * ```ts
 * const svgModules = import.meta.glob('/src/assets/svgs/*.svg', {
 *   eager: true,
 *   query: '?raw'
 * })
 * await initSvgIcons(svgModules)
 * ```
 */
export async function initSvgIcons(
  svgModules: Record<string, string | { default: string }>
): Promise<void> {
  await Promise.all(
    Object.entries(svgModules).map(([key, body]) => {
      const iconName = extractIconName(key)
      const svgContent = typeof body === 'object' ? body.default : body

      const iconData = parseSvg(svgContent)

      registerLocalSvgIcon(iconName)

      return addIcon(`svg:${iconName}`, iconData)
    })
  )
}
