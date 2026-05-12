<template>
  <div class="fx-icon-select" ref="wrapperRef">
    <div class="fx-icon-select-input" @click="iconSelect.handleInputClick">
      <span class="fx-icon-select-prefix">
        <FxIcon v-if="modelValue" :name="modelValue" :size="16" />
        <span v-else class="fx-icon-select-placeholder-text">图标</span>
      </span>
      <span v-if="modelValue" class="fx-icon-select-value">{{ modelValue }}</span>
      <span v-else class="fx-icon-select-placeholder">{{ iconSelect.placeholder }}</span>
      <span class="fx-icon-select-arrow" :class="{ 'is-reverse': iconSelect.visible.value }" v-html="arrowDownSvgRaw"></span>
    </div>

    <div
      v-if="iconSelect.visible.value"
      class="fx-icon-select-popover"
      :style="popupStyle"
      @click.stop
    >
      <div class="fx-icon-select-tabs">
        <button
          v-for="tab in iconSelect.tabs.value"
          :key="tab.key"
          class="fx-icon-select-tab"
          :class="{ active: iconSelect.activeTab.value === tab.key }"
          @click="iconSelect.activeTab.value = tab.key"
        >{{ tab.label }}</button>
      </div>

      <div class="fx-icon-select-tab-content">
        <div class="fx-icon-select-search-wrapper">
          <span class="fx-icon-select-search-icon" v-html="searchSvgRaw"></span>
          <input
            class="fx-icon-select-search"
            :value="iconSelect.searchTexts.value[iconSelect.activeTab.value]"
            placeholder="搜索图标..."
            @input="(e: Event) => { iconSelect.searchTexts.value[iconSelect.activeTab.value] = (e.target as HTMLInputElement).value }"
          />
          <span
            v-if="iconSelect.searchTexts.value[iconSelect.activeTab.value]"
            class="fx-icon-select-search-clear"
            @click="iconSelect.searchTexts.value[iconSelect.activeTab.value] = ''"
          >&#10005;</span>
        </div>

        <div
          :ref="(el: any) => iconSelect.setListRef(iconSelect.activeTab.value, el as HTMLElement | null)"
          class="fx-icon-select-grid"
        >
          <div
            v-for="icon in iconSelect.getPaginatedIcons(iconSelect.activeTab.value)"
            :key="icon"
            class="fx-icon-select-item"
            :class="{ active: iconSelect.isSelected(iconSelect.activeTab.value, icon) }"
            @click="iconSelect.handleSelectIcon(iconSelect.activeTab.value, icon)"
          >
            <FxIcon :name="`${iconSelect.activeTab.value}:${icon}`" :size="20" />
            <span class="icon-name">{{ icon }}</span>
          </div>
          <div v-if="iconSelect.getFilteredIcons(iconSelect.activeTab.value).length === 0" class="fx-icon-select-empty">
            <span class="fx-icon-select-empty-text">未找到图标</span>
          </div>
        </div>

        <div v-if="iconSelect.getFilteredIcons(iconSelect.activeTab.value).length > 0" class="fx-icon-select-pagination">
          <span class="pagination-total">共 {{ iconSelect.getFilteredIcons(iconSelect.activeTab.value).length }} 个图标</span>
          <div class="pagination-controls">
            <button
              class="pagination-btn pagination-arrow"
              :disabled="getCurrentPage() <= 1"
              @click="iconSelect.currentPages.value[iconSelect.activeTab.value] = getCurrentPage() - 1"
            ><span v-html="arrowLeftSvg"></span></button>

            <template v-for="(p, idx) in getVisiblePages()" :key="p">
              <span
                v-if="idx === 0 && hasPrevEllipsis()"
                class="pagination-ellipsis"
                @mouseenter="hoveredEllipsis = 'prev'"
                @mouseleave="hoveredEllipsis = null"
                @click="jumpPrev"
              >
                <span v-if="hoveredEllipsis === 'prev'" v-html="arrowLeftSvg"></span>
                <template v-else>&#8226;&#8226;&#8226;</template>
              </span>
              <button
                class="pagination-btn"
                :class="{ active: p === getCurrentPage() }"
                @click="iconSelect.currentPages.value[iconSelect.activeTab.value] = p"
              >{{ p }}</button>
              <span
                v-if="idx === getVisiblePages().length - 1 && hasNextEllipsis()"
                class="pagination-ellipsis"
                @mouseenter="hoveredEllipsis = 'next'"
                @mouseleave="hoveredEllipsis = null"
                @click="jumpNext"
              >
                <span v-if="hoveredEllipsis === 'next'" v-html="arrowRightSvg"></span>
                <template v-else>&#8226;&#8226;&#8226;</template>
              </span>
            </template>

            <button
              class="pagination-btn pagination-arrow"
              :disabled="getCurrentPage() >= getTotalPages()"
              @click="iconSelect.currentPages.value[iconSelect.activeTab.value] = getCurrentPage() + 1"
            ><span v-html="arrowRightSvg"></span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import searchSvgRaw from './assets/search.svg?raw'
import arrowDownSvgRaw from './assets/arrow-down.svg?raw'
import { FxIcon, useIconSelect, type FxIconSelectProps } from '@fuxishi/svg-icon'

const arrowLeftSvg = '<svg viewBox="0 0 1024 1024" width="12" height="12"><path d="M658.133333 155.733333L334.933333 477.866667c-12.8 12.8-12.8 34.133333 0 46.933333l323.2 322.133333c12.8 12.8 34.133333 12.8 46.933334 0s12.8-34.133333 0-46.933333L405.333333 512l299.733334-288c12.8-12.8 12.8-34.133333 0-46.933333s-34.133333-12.8-46.933334-1.066667z"/></svg>'
const arrowRightSvg = '<svg viewBox="0 0 1024 1024" width="12" height="12"><path d="M365.866667 155.733333L689.066667 477.866667c12.8 12.8 12.8 34.133333 0 46.933333L365.866667 846.933333c-12.8 12.8-34.133333 12.8-46.933334 0s-12.8-34.133333 0-46.933333L618.666667 512 318.933333 224c-12.8-12.8-12.8-34.133333 0-46.933333s34.133333-12.8 46.933334-1.066667z"/></svg>'

const props = withDefaults(defineProps<FxIconSelectProps>(), {
  placeholder: '请选择图标',
  height: 418
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const wrapperRef = ref<HTMLElement | null>(null)
const hoveredEllipsis = ref<'prev' | 'next' | null>(null)

const iconSelect = useIconSelect({
  modelValue: () => props.modelValue,
  onSelect: (value) => emit('update:modelValue', value),
  placeholder: props.placeholder,
  height: props.height
})

function getTotalPages() {
  return Math.ceil(iconSelect.getFilteredIcons(iconSelect.activeTab.value).length / iconSelect.pageSize)
}
function getCurrentPage() {
  return iconSelect.currentPages.value[iconSelect.activeTab.value] || 1
}
function getVisiblePages(): number[] {
  const total = getTotalPages()
  const current = getCurrentPage()
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>()
  pages.add(1)
  pages.add(total)
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.add(i)
  }
  return Array.from(pages).sort((a, b) => a - b)
}
function hasPrevEllipsis(): boolean {
  const pages = getVisiblePages()
  return pages.length > 1 && pages[1] - pages[0] > 1
}
function hasNextEllipsis(): boolean {
  const pages = getVisiblePages()
  return pages.length > 1 && pages[pages.length - 1] - pages[pages.length - 2] > 1
}
function jumpPrev() {
  iconSelect.currentPages.value[iconSelect.activeTab.value] = Math.max(1, getCurrentPage() - 3)
}
function jumpNext() {
  iconSelect.currentPages.value[iconSelect.activeTab.value] = Math.min(getTotalPages(), getCurrentPage() + 3)
}

const popupStyle = computed(() => {
  if (!wrapperRef.value || !iconSelect.visible.value) return {}
  const rect = wrapperRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const estimatedHeight = iconSelect.contentHeight.value + 40
  const style: Record<string, string> = {
    height: `${iconSelect.contentHeight.value}px`
  }

  if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
    style.bottom = 'calc(100% + 8px)'
    style.top = 'auto'
  } else {
    style.top = 'calc(100% + 8px)'
    style.bottom = 'auto'
  }

  const estimatedWidth = 400
  const spaceRight = window.innerWidth - rect.left
  if (spaceRight < estimatedWidth) {
    style.right = '0'
    style.left = 'auto'
  } else {
    style.left = '0'
    style.right = 'auto'
  }

  return style
})
</script>

<style scoped>
.fx-icon-select {
  position: relative;
  width: 100%;
}

.fx-icon-select-input {
  width: 100%;
  padding: 8px 30px 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  min-height: 36px;
  position: relative;
}

.fx-icon-select-input:hover {
  border-color: #409eff;
}

.fx-icon-select-prefix {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.fx-icon-select-placeholder-text {
  color: #909399;
  font-size: 14px;
}

.fx-icon-select-value {
  font-size: 13px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.fx-icon-select-placeholder {
  font-size: 14px;
  color: #c0c4cc;
  flex: 1;
}

.fx-icon-select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: transform 0.3s;
  user-select: none;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  width: 14px;
  height: 14px;
  color: #c0c4cc;
}

.fx-icon-select-arrow :deep(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.fx-icon-select-arrow.is-reverse {
  transform: translateY(-50%) rotate(180deg);
}

.fx-icon-select-popover {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 400px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.fx-icon-select-tabs {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 8px;
  flex-shrink: 0;
}

.fx-icon-select-tab {
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.fx-icon-select-tab.active {
  color: #409eff;
  border-bottom-color: #409eff;
}

.fx-icon-select-tab:hover {
  color: #409eff;
}

.fx-icon-select-tab-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.fx-icon-select-search-wrapper {
  position: relative;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.fx-icon-select-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  pointer-events: none;
}

.fx-icon-select-search-icon :deep(svg) {
  width: 14px;
  height: 14px;
  fill: #c0c4cc;
}

.fx-icon-select-search {
  width: 100%;
  padding: 8px 28px 8px 30px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}

.fx-icon-select-search:focus {
  border-color: #409eff;
}

.fx-icon-select-search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 12px;
  color: #c0c4cc;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: color 0.2s, background 0.2s;
}

.fx-icon-select-search-clear:hover {
  color: #909399;
  background: #f0f2f5;
}

.fx-icon-select-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
  overflow: auto;
  padding: 4px 0;
  min-height: 80px;
  flex: 1;
}

.fx-icon-select-grid:has(.fx-icon-select-empty) {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-template-columns: none;
}

.fx-icon-select-grid::-webkit-scrollbar {
  width: 6px;
}

.fx-icon-select-grid::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.fx-icon-select-grid::-webkit-scrollbar-thumb:hover {
  background: #a0a4a8;
}

.fx-icon-select-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  padding: 12px 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.fx-icon-select-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
  color: #409eff;
}

.fx-icon-select-item.active {
  border-color: #409eff;
  background: #409eff;
  color: #fff;
}

.fx-icon-select-item.active :deep(svg) {
  fill: currentColor;
}

.fx-icon-select-item.active .icon-name {
  color: #fff;
}

.fx-icon-select-item .icon-name {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.2;
  color: #909399;
  text-align: center;
  word-break: break-all;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.fx-icon-select-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  width: 100%;
}

.fx-icon-select-empty-text {
  margin-top: 12px;
  font-size: 14px;
  color: #909399;
}

.fx-icon-select-pagination {
  margin-top: 10px;
  padding: 8px 0 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #e4e7ed;
}

.pagination-total {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.pagination-btn {
  min-width: 28px;
  height: 28px;
  padding: 0 4px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  color: #606266;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, border-color 0.2s;
}

.pagination-btn:hover:not(:disabled):not(.active) {
  color: #409eff;
  border-color: #409eff;
}

.pagination-btn.active {
  color: #fff;
  background: #409eff;
  border-color: #409eff;
  cursor: default;
}

.pagination-btn:disabled {
  cursor: not-allowed;
  color: #c0c4cc;
  border-color: #e4e7ed;
  background: #fff;
}

.pagination-arrow {
  color: #606266;
}

.pagination-ellipsis {
  font-size: 10px;
  letter-spacing: 2px;
  color: #c0c4cc;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.2s;
}

.pagination-ellipsis:hover {
  color: #409eff;
}
</style>
