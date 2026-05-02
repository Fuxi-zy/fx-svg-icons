import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  getLocalSvgIconNames,
  getAllIconNames
} from '../plugins/iconifyNames'

export interface IconSelectTab {
  key: string
  label: string
}

export interface UseIconSelectOptions {
  /** 获取当前选中的图标名称 */
  modelValue?: () => string | undefined
  /** 选中图标时的回调 */
  onSelect?: (value: string) => void
  /** 占位文本 */
  placeholder?: string
  /** 弹层高度 (px) */
  height?: number
}

const LAYOUT_FIXED_PX = 162
const DEFAULT_PAGE_SIZE = 30

export function useIconSelect(options: UseIconSelectOptions = {}) {
  const getModelValue = options.modelValue ?? (() => undefined)
  const onSelect = options.onSelect ?? (() => {})

  const visible = ref(false)
  const activeTab = ref('svg')

  const placeholder = options.placeholder ?? '请选择图标'
  const height = options.height ?? 418

  const tabs = computed<IconSelectTab[]>(() => {
    const result: IconSelectTab[] = [{ key: 'svg', label: '本地 SVG' }]
    const allNames = getAllIconNames()
    const labelMap: Record<string, string> = {
      ep: 'Element Plus',
      'ant-design': 'Ant Design'
    }
    for (const prefix of Object.keys(allNames)) {
      result.push({ key: prefix, label: labelMap[prefix] || prefix })
    }
    return result
  })

  const iconData = ref<Record<string, string[]>>({})
  const searchTexts = ref<Record<string, string>>({})
  const currentPages = ref<Record<string, number>>({})
  const listRefs = ref<Record<string, HTMLElement | null>>({})

  const pageSize = DEFAULT_PAGE_SIZE

  const contentHeight = computed(() => Math.max(320, Number(height) || 418))
  const tabContentHeight = computed(() => contentHeight.value - 40)
  const iconListHeight = computed(() => Math.max(120, contentHeight.value - LAYOUT_FIXED_PX))

  const inputValue = computed(() => getModelValue() || '')

  function getFilteredIcons(key: string): string[] {
    const search = (searchTexts.value[key] || '').toLowerCase()
    const icons = iconData.value[key] || []
    if (!search) return icons
    return icons.filter((icon) => icon.toLowerCase().includes(search))
  }

  function getPaginatedIcons(key: string): string[] {
    const page = currentPages.value[key] || 1
    const start = (page - 1) * pageSize
    return getFilteredIcons(key).slice(start, start + pageSize)
  }

  function isSelected(prefix: string, iconName: string): boolean {
    const value = getModelValue()
    if (!value) return false
    return value === `${prefix}:${iconName}`
  }

  function setListRef(key: string, el: HTMLElement | null) {
    listRefs.value[key] = el
  }

  function handleInputClick() {
    visible.value = !visible.value
  }

  function handleSelectIcon(prefix: string, iconName: string) {
    onSelect(`${prefix}:${iconName}`)
    visible.value = false
  }

  function closePopover() {
    visible.value = false
  }

  function scrollToTop(key: string) {
    const el = listRefs.value[key]
    if (el) el.scrollTop = 0
  }

  function loadIcons() {
    const data: Record<string, string[]> = {
      svg: getLocalSvgIconNames()
    }
    const allNames = getAllIconNames()
    for (const prefix of Object.keys(allNames)) {
      data[prefix] = allNames[prefix]
    }
    iconData.value = data
  }

  function initTabState() {
    const texts: Record<string, string> = {}
    const pages: Record<string, number> = {}
    for (const tab of tabs.value) {
      texts[tab.key] = ''
      pages[tab.key] = 1
    }
    searchTexts.value = texts
    currentPages.value = pages
  }

  function handleClickOutside(event: MouseEvent) {
    if (!visible.value) return
    const target = event.target as HTMLElement
    if (!target.closest('.fx-icon-select') && !target.closest('.fx-icon-select-popover')) {
      visible.value = false
    }
  }

  watch(() => getModelValue(), (newValue) => {
    if (newValue) {
      const colonIndex = newValue.indexOf(':')
      if (colonIndex !== -1) {
        const prefix = newValue.substring(0, colonIndex)
        const tabKeys = tabs.value.map((t) => t.key)
        if (tabKeys.includes(prefix)) {
          activeTab.value = prefix
        }
      }
    }
  }, { immediate: true })

  watch(searchTexts, async (val) => {
    for (const key of Object.keys(val)) {
      currentPages.value[key] = 1
      await nextTick()
      scrollToTop(key)
    }
  }, { deep: true })

  watch(currentPages, async (val) => {
    for (const key of Object.keys(val)) {
      await nextTick()
      scrollToTop(key)
    }
  }, { deep: true })

  watch(activeTab, () => {
    for (const key of Object.keys(currentPages.value)) {
      currentPages.value[key] = 1
    }
  })

  onMounted(() => {
    loadIcons()
    initTabState()
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  return {
    visible,
    activeTab,
    inputValue,
    placeholder,
    tabs,
    iconData,
    searchTexts,
    currentPages,
    pageSize,
    contentHeight,
    tabContentHeight,
    iconListHeight,
    getFilteredIcons,
    getPaginatedIcons,
    isSelected,
    setListRef,
    handleInputClick,
    handleSelectIcon,
    closePopover
  }
}

export type UseIconSelectReturn = ReturnType<typeof useIconSelect>
