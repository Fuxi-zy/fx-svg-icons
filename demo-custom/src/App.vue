<script setup lang="ts" vapor>
import { ref } from "vue"
import type { IconString } from "@/types/fx-icon-types"
import { useIconSelect, FxIcon } from "@fuxishi/svg-icon"
import { dependencies } from "virtual:demo-deps"

const selectedIcon = ref<IconString | "">("")

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
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <h3>依赖检测</h3>
      <ul class="dep-list">
        <li v-for="(version, name) in dependencies" :key="name">
          <span class="dep-name">{{ name }}</span>
          <span class="dep-version">{{ version }}</span>
        </li>
      </ul>
    </aside>

    <div class="demo">
      <h1>@fuxishi/svg-icon Demo (Custom)</h1>
      <p class="desc">此示例不使用任何 UI 框架，直接通过 <code>useIconSelect</code> API 自定义渲染图标选择器。</p>

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
        <h2>自定义图标选择器 (useIconSelect API)</h2>
        <div class="select-demo">
          <div class="custom-select-wrapper">
            <input
              class="custom-select-input"
              :value="iconSelect.inputValue.value"
              :placeholder="iconSelect.placeholder"
              readonly
              @click="iconSelect.handleInputClick"
            />
            <span
              class="custom-arrow"
              :class="{ 'is-reverse': iconSelect.visible.value }"
              @click="iconSelect.handleInputClick"
            >▼</span>

            <div v-if="iconSelect.visible.value" class="custom-popup" @click.stop>
              <div class="custom-tabs">
                <button
                  v-for="tab in iconSelect.tabs.value"
                  :key="tab.key"
                  class="custom-tab"
                  :class="{ active: iconSelect.activeTab.value === tab.key }"
                  @click="iconSelect.activeTab.value = tab.key"
                >{{ tab.label }}</button>
              </div>

              <div class="custom-tab-content" :style="{ height: `${iconSelect.contentHeight.value - 40}px` }">
                <input
                  class="custom-search"
                  :value="iconSelect.searchTexts.value[iconSelect.activeTab.value]"
                  placeholder="搜索图标..."
                  @input="(e: Event) => { iconSelect.searchTexts.value[iconSelect.activeTab.value] = (e.target as HTMLInputElement).value }"
                />
                <div
                  :ref="(el: any) => iconSelect.setListRef(iconSelect.activeTab.value, el as HTMLElement | null)"
                  class="custom-icon-grid"
                  :style="{ height: `${iconSelect.iconListHeight.value}px` }"
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
                    未找到图标
                  </div>
                </div>
                <div v-if="iconSelect.getFilteredIcons(iconSelect.activeTab.value).length > 0" class="custom-pagination">
                  <span class="pagination-total">共 {{ iconSelect.getFilteredIcons(iconSelect.activeTab.value).length }} 个</span>
                  <div class="pagination-btns">
                    <button
                      :disabled="(iconSelect.currentPages.value[iconSelect.activeTab.value] || 1) <= 1"
                      @click="iconSelect.currentPages.value[iconSelect.activeTab.value] = Math.max(1, (iconSelect.currentPages.value[iconSelect.activeTab.value] || 1) - 1)"
                    >上一页</button>
                    <span class="pagination-page">{{ iconSelect.currentPages.value[iconSelect.activeTab.value] || 1 }} / {{ Math.ceil(iconSelect.getFilteredIcons(iconSelect.activeTab.value).length / iconSelect.pageSize) }}</span>
                    <button
                      :disabled="(iconSelect.currentPages.value[iconSelect.activeTab.value] || 1) >= Math.ceil(iconSelect.getFilteredIcons(iconSelect.activeTab.value).length / iconSelect.pageSize)"
                      @click="iconSelect.currentPages.value[iconSelect.activeTab.value] = Math.min(Math.ceil(iconSelect.getFilteredIcons(iconSelect.activeTab.value).length / iconSelect.pageSize), (iconSelect.currentPages.value[iconSelect.activeTab.value] || 1) + 1)"
                    >下一页</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p v-if="selectedIcon" class="selected-info">
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
  margin-bottom: 12px;
}

.desc {
  color: #909399;
  margin-bottom: 40px;
  font-size: 14px;
}

.desc code {
  background: #f0f2f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #409eff;
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

.selected-info {
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
  outline: none;
  transition: border-color 0.2s;
}

.custom-select-input:hover {
  border-color: #409eff;
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
}

.custom-arrow.is-reverse {
  transform: translateY(-50%) rotate(180deg);
}

.custom-popup {
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
}

.custom-tabs {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 8px;
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

.custom-search {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 8px;
}

.custom-search:focus {
  border-color: #409eff;
}

.custom-tab-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.custom-icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
  overflow: auto;
  min-height: 80px;
}

.custom-icon-grid::-webkit-scrollbar {
  width: 6px;
}

.custom-icon-grid::-webkit-scrollbar-thumb {
  background: #dcdcdc;
  border-radius: 3px;
}

.custom-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.custom-icon-item:hover {
  border-color: #409eff;
  background: #ecf2fe;
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
  color: #909399;
  text-align: center;
  word-break: break-all;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.custom-empty {
  text-align: center;
  color: #c0c4cc;
  padding: 40px 0;
}

.custom-pagination {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pagination-total {
  font-size: 12px;
  color: #909399;
}

.pagination-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btns button {
  padding: 4px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  color: #606266;
}

.pagination-btns button:hover:not(:disabled) {
  color: #409eff;
  border-color: #409eff;
}

.pagination-btns button:disabled {
  cursor: not-allowed;
  color: #c0c4cc;
  border-color: #e4e7ed;
}

.pagination-page {
  font-size: 12px;
  color: #606266;
}
</style>
