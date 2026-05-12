<script setup lang="ts" vapor>
import { ref, computed } from "vue"
import type { IconString } from "@/types/fx-icon-types"
import { useIconSelect, FxIcon } from "@fuxishi/svg-icon"
import { dependencies } from "virtual:demo-deps"

const selectedIcon = ref<IconString | "">("")
const wrapperRef = ref<HTMLElement | null>(null)
const hoveredEllipsis = ref<'prev' | 'next' | null>(null)

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

const emit = {
  'update:modelValue': (value: string) => {
    selectedIcon.value = value as IconString | ""
  }
}

const iconSelect = useIconSelect({
  modelValue: () => selectedIcon.value,
  onSelect: (value) => emit['update:modelValue'](value),
  placeholder: '请选择图标',
  height: 418
})

const popupStyle = computed(() => {
  if (!wrapperRef.value || !iconSelect.visible.value) return {}
  const rect = wrapperRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const estimatedHeight = iconSelect.contentHeight.value + 40
  const style: Record<string, string> = {}

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

<template>
  <div class="layout">
    <aside class="sidebar">
      <h3>依赖检测</h3>
      <ul class="dep-list">
        <li v-for="(version, name) in dependencies" :key="name" :title="`${name}: ${version}`">
          <span class="dep-name">{{ name }}</span>
          <span class="dep-version">{{ version }}</span>
        </li>
      </ul>
    </aside>

    <div class="demo">
      <h1>@fuxishi/svg-icon Demo (Custom)</h1>

      <section>
        <h2>Element Plus 图标 (ep:xxx)</h2>
        <div class="icon-list">
          <div class="icon-item">
            <FxIcon name="ep:home-filled" size="32px" color="#409eff" />
            <span>ep:home-filled</span>
          </div>
          <div class="icon-item">
            <FxIcon name="ep:user" size="32px" color="#67c23a" />
            <span>ep:user</span>
          </div>
          <div class="icon-item">
            <FxIcon name="ep:setting" size="32px" color="#e6a23c" />
            <span>ep:setting</span>
          </div>
          <div class="icon-item">
            <FxIcon name="ep:search" size="32px" color="#f56c6c" />
            <span>ep:search</span>
          </div>
          <div class="icon-item">
            <FxIcon name="ep:check" size="32px" />
            <span>ep:check</span>
          </div>
        </div>
      </section>

      <section>
        <h2>Ant Design 图标 (ant-design:xxx)</h2>
        <div class="icon-list">
          <div class="icon-item">
            <FxIcon name="ant-design:home-outlined" size="32px" color="#409eff" />
            <span>ant-design:home-outlined</span>
          </div>
          <div class="icon-item">
            <FxIcon name="ant-design:user-outlined" size="32px" color="#67c23a" />
            <span>ant-design:user-outlined</span>
          </div>
          <div class="icon-item">
            <FxIcon name="ant-design:setting-outlined" size="32px" color="#e6a23c" />
            <span>ant-design:setting-outlined</span>
          </div>
          <div class="icon-item">
            <FxIcon name="ant-design:search-outlined" size="32px" color="#f56c6c" />
            <span>ant-design:search-outlined</span>
          </div>
        </div>
      </section>

      <section>
        <h2>本地 SVG 图标 (svg:xxx)</h2>
        <div class="icon-list">
          <div class="icon-item">
            <FxIcon name="svg:star" size="32px" color="#f56c6c" />
            <span>svg:star</span>
          </div>
          <div class="icon-item">
            <FxIcon name="svg:heart" size="32px" color="#f56c6c" />
            <span>svg:heart</span>
          </div>
          <div class="icon-item">
            <FxIcon name="svg:check" size="32px" color="#67c23a" />
            <span>svg:check</span>
          </div>
          <div class="icon-item">
            <FxIcon name="svg:common-batch-processing" size="32px" color="#f56c6c" />
            <span>svg:batch-processing</span>
          </div>
          <div class="icon-item">
            <FxIcon name="svg:statusCode-404-not-found-01" size="32px" color="#f56c6c" />
            <span>svg:statusCode-404-not-found-01</span>
          </div>
          <div class="icon-item">
            <FxIcon name="svg:test-test-test-a-not-found-01" size="32px" />
            <span>svg:test-test-test-a-not-found-01</span>
          </div>
        </div>
      </section>

      <section>
        <h2>不同尺寸</h2>
        <div class="icon-list">
          <FxIcon name="ep:home-filled" size="16px" />
          <FxIcon name="ep:home-filled" size="24px" />
          <FxIcon name="ep:home-filled" size="32px" />
          <FxIcon name="ep:home-filled" size="48px" />
          <FxIcon name="ep:home-filled" :size="64" />
        </div>
      </section>

      <section>
        <h2>自定义图标选择器（useIconSelect API）</h2>
        <div class="select-demo">
          <div class="fx-icon-select custom-select-wrapper" ref="wrapperRef">
            <div class="custom-select-input" @click="iconSelect.handleInputClick">
              <span class="custom-input-prefix">
                <FxIcon v-if="selectedIcon" :name="selectedIcon" :size="16" />
                <span v-else class="custom-placeholder">图标</span>
              </span>
              <span v-if="selectedIcon" class="custom-input-text">{{ selectedIcon }}</span>
              <span v-else class="custom-input-placeholder">{{ iconSelect.placeholder }}</span>
              <span
                class="custom-arrow"
                :class="{ 'is-reverse': iconSelect.visible.value }"
              >▼</span>
            </div>

            <div
              v-if="iconSelect.visible.value"
              ref="popupRef"
              class="fx-icon-select-popover custom-popup"
              :style="popupStyle"
              @click.stop
            >
              <div class="custom-tabs">
                <button
                  v-for="tab in iconSelect.tabs.value"
                  :key="tab.key"
                  class="custom-tab"
                  :class="{ active: iconSelect.activeTab.value === tab.key }"
                  @click="iconSelect.activeTab.value = tab.key"
                >{{ tab.label }}</button>
              </div>

              <div class="custom-tab-content">
                <div class="custom-search-wrapper">
                  <span class="custom-search-icon"><FxIcon name="ep:search" :size="14" color="#c0c4cc" /></span>
                  <input
                    class="custom-search"
                    :value="iconSelect.searchTexts.value[iconSelect.activeTab.value]"
                    placeholder="搜索图标..."
                    @input="(e: Event) => { iconSelect.searchTexts.value[iconSelect.activeTab.value] = (e.target as HTMLInputElement).value }"
                  />
                  <span
                    v-if="iconSelect.searchTexts.value[iconSelect.activeTab.value]"
                    class="custom-search-clear"
                    @click="iconSelect.searchTexts.value[iconSelect.activeTab.value] = ''"
                  >✕</span>
                </div>
                <div
                  :ref="(el: any) => iconSelect.setListRef(iconSelect.activeTab.value, el as HTMLElement | null)"
                  class="custom-icon-grid"
                >
                  <div
                    v-for="icon in iconSelect.getPaginatedIcons(iconSelect.activeTab.value)"
                    :key="icon"
                    class="custom-icon-item"
                    :class="{ active: iconSelect.isSelected(iconSelect.activeTab.value, icon) }"
                    @click="iconSelect.handleSelectIcon(iconSelect.activeTab.value, icon)"
                  >
                    <FxIcon :name="`${iconSelect.activeTab.value}:${icon}`" :size="20" />
                    <span class="icon-name">{{ icon }}</span>
                  </div>
                  <div v-if="iconSelect.getFilteredIcons(iconSelect.activeTab.value).length === 0" class="custom-empty">
                    <FxIcon name="svg:common-empty" :size="96" color="#dcdfe6" />
                    <span class="custom-empty-text">未找到图标</span>
                  </div>
                </div>
                <div v-if="iconSelect.getFilteredIcons(iconSelect.activeTab.value).length > 0" class="custom-pagination">
                  <span class="pagination-total">共 {{ iconSelect.getFilteredIcons(iconSelect.activeTab.value).length }} 个图标</span>
                  <div class="pagination-controls">
                    <button
                      class="pagination-btn pagination-arrow"
                      :disabled="getCurrentPage() <= 1"
                      @click="iconSelect.currentPages.value[iconSelect.activeTab.value] = getCurrentPage() - 1"
                    ><FxIcon name="ep:arrow-left-bold" :size="12" /></button>

                    <template v-for="(p, idx) in getVisiblePages()" :key="p">
                      <span
                        v-if="idx === 0 && hasPrevEllipsis()"
                        class="pagination-ellipsis"
                        @mouseenter="hoveredEllipsis = 'prev'"
                        @mouseleave="hoveredEllipsis = null"
                        @click="jumpPrev"
                      >
                        <FxIcon v-if="hoveredEllipsis === 'prev'" name="ep:arrow-left-bold" :size="12" />
                        <template v-else>•••</template>
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
                        <FxIcon v-if="hoveredEllipsis === 'next'" name="ep:arrow-right-bold" :size="12" />
                        <template v-else>•••</template>
                      </span>
                    </template>

                    <button
                      class="pagination-btn pagination-arrow"
                      :disabled="getCurrentPage() >= getTotalPages()"
                      @click="iconSelect.currentPages.value[iconSelect.activeTab.value] = getCurrentPage() + 1"
                    ><FxIcon name="ep:arrow-right-bold" :size="12" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p v-if="selectedIcon">
            已选择： <FxIcon :name="selectedIcon" :size="20" /> {{ selectedIcon }}
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f5f7fa;
}

.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  min-width: 260px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  padding: 24px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.sidebar h3 {
  margin: 0 0 16px;
  color: #303133;
  font-size: 16px;
}

.dep-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dep-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f2f3f5;
}

.dep-list li:last-child {
  border-bottom: none;
}

.dep-name {
  font-size: 13px;
  color: #606266;
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
  cursor: default;
}

.dep-version {
  font-size: 12px;
  color: #409eff;
  font-family: monospace;
  flex-shrink: 0;
}

.demo {
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  color: #303133;
  margin-bottom: 40px;
}

h2 {
  color: #606266;
  font-size: 18px;
  margin-bottom: 16px;
}

section {
  margin-bottom: 40px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.icon-list {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.icon-item span {
  font-size: 12px;
  color: #909399;
  font-family: monospace;
}

.select-demo {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.select-demo p {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
}

/* 自定义选择器样式 */
.custom-select-wrapper {
  position: relative;
  width: 100%;
}

.custom-select-input {
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

.custom-select-input:hover {
  border-color: #409eff;
}

.custom-input-prefix {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.custom-placeholder {
  color: #909399;
  font-size: 14px;
}

.custom-input-text {
  font-size: 13px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.custom-input-placeholder {
  font-size: 14px;
  color: #c0c4cc;
  flex: 1;
}

.custom-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #c0c4cc;
  cursor: pointer;
  transition: transform 0.3s;
  user-select: none;
  line-height: 1;
}

.custom-arrow.is-reverse {
  transform: translateY(-50%) rotate(180deg);
}

.custom-popup {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 400px;
  height: 418px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.custom-tabs {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 8px;
  flex-shrink: 0;
}

.custom-tab {
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.custom-tab.active {
  color: #409eff;
  border-bottom-color: #409eff;
}

.custom-tab:hover {
  color: #409eff;
}

.custom-search-wrapper {
  position: relative;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.custom-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  pointer-events: none;
}

.custom-search {
  width: 100%;
  padding: 8px 28px 8px 30px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}

.custom-search:focus {
  border-color: #409eff;
}

.custom-search-clear {
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

.custom-search-clear:hover {
  color: #909399;
  background: #f0f2f5;
}

.custom-tab-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.custom-icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
  overflow: auto;
  padding: 4px 0;
  min-height: 80px;
  flex: 1;
}

.custom-icon-grid:has(.custom-empty) {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-template-columns: none;
}

.custom-icon-grid::-webkit-scrollbar {
  width: 6px;
}

.custom-icon-grid::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.custom-icon-grid::-webkit-scrollbar-thumb:hover {
  background: #a0a4a8;
}

.custom-icon-item {
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

.custom-icon-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
  color: #409eff;
}

.custom-icon-item.active {
  border-color: #409eff;
  background: #409eff;
  color: #fff;
}

.custom-icon-item.active .icon-name {
  color: #fff;
}

.custom-icon-item .icon-name {
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

.custom-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  width: 100%;
}

.custom-empty-text {
  margin-top: 12px;
  font-size: 14px;
  color: #909399;
}

.custom-pagination {
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
