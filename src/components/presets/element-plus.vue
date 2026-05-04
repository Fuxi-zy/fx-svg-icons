<template>
  <div class="fx-icon-select">
    <el-popover
      v-model:visible="iconSelect.visible.value"
      placement="bottom-start"
      :width="400"
      trigger="manual"
      popper-class="fx-icon-select-popover"
      :popper-style="{ height: `${iconSelect.contentHeight.value}px` }"
    >
      <template #reference>
        <el-input
          :model-value="iconSelect.inputValue.value"
          :placeholder="iconSelect.placeholder"
          readonly
          @click="iconSelect.handleInputClick"
        >
          <template #prefix>
            <FxIcon v-if="modelValue" :name="modelValue" :size="16" />
            <span v-else class="icon-placeholder">图标</span>
          </template>
          <template #suffix>
            <el-icon class="arrow-icon" :class="{ 'is-reverse': iconSelect.visible.value }">
              <ArrowDown />
            </el-icon>
          </template>
        </el-input>
      </template>

      <div class="icon-select-content" :style="{ height: `${iconSelect.contentHeight.value}px` }" @click.stop>
        <el-tabs v-model="iconSelect.activeTab.value" class="icon-tabs" @click.stop>
          <el-tab-pane v-for="tab in iconSelect.tabs.value" :key="tab.key" :label="tab.label" :name="tab.key">
            <div class="tab-content" :style="{ height: `${iconSelect.tabContentHeight.value}px` }">
              <el-input
                v-model="iconSelect.searchTexts.value[tab.key]"
                :placeholder="`搜索${tab.label}图标`"
                clearable
                class="search-input"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <div
                :ref="(el: any) => iconSelect.setListRef(tab.key, el as HTMLElement | null)"
                class="icon-list"
                :class="{ 'is-empty': iconSelect.getFilteredIcons(tab.key).length === 0 }"
                :style="{ height: `${iconSelect.iconListHeight.value}px` }"
              >
                <div
                  v-for="icon in iconSelect.getPaginatedIcons(tab.key)"
                  :key="icon"
                  class="icon-item"
                  :class="{ active: iconSelect.isSelected(tab.key, icon) }"
                  @click="iconSelect.handleSelectIcon(tab.key, icon)"
                >
                  <FxIcon :name="`${tab.key}:${icon}`" :size="20" />
                  <span class="icon-name">{{ icon }}</span>
                </div>
                <el-empty v-if="iconSelect.getFilteredIcons(tab.key).length === 0" :image-size="80" description="未找到图标" />
              </div>
              <div v-if="iconSelect.getFilteredIcons(tab.key).length > 0" class="icon-pagination">
                <span class="pagination-total">共 {{ iconSelect.getFilteredIcons(tab.key).length }} 个图标</span>
                <el-pagination
                  v-model:current-page="iconSelect.currentPages.value[tab.key]"
                  :page-size="iconSelect.pageSize"
                  :total="iconSelect.getFilteredIcons(tab.key).length"
                  :pager-count="5"
                  size="small"
                  layout="prev, pager, next"
                  class="pagination-controls"
                  @click.stop
                />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import searchSvgRaw from '../../assets/search.svg?raw'
import arrowDownSvgRaw from '../../assets/arrow-down.svg?raw'
import FxIcon from '../FxIcon.vue'
import { useIconSelect } from '../../composables/useIconSelect'
import type { FxIconSelectProps } from '../../types'

const Search = defineComponent({
  name: 'Search',
  render() {
    return h('span', { innerHTML: searchSvgRaw })
  }
})

const ArrowDown = defineComponent({
  name: 'ArrowDown',
  render() {
    return h('span', { innerHTML: arrowDownSvgRaw })
  }
})

const props = withDefaults(defineProps<FxIconSelectProps>(), {
  placeholder: '请选择图标',
  height: 418
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const iconSelect = useIconSelect({
  modelValue: () => props.modelValue,
  onSelect: (value) => emit('update:modelValue', value),
  placeholder: props.placeholder,
  height: props.height
})
</script>

<style scoped>
.fx-icon-select {
  width: 100%;
}

.icon-placeholder {
  color: #c0c4cc;
  font-size: 14px;
}

.arrow-icon {
  transition: transform 0.3s;
  cursor: pointer;
}

.arrow-icon.is-reverse {
  transform: rotate(180deg);
}

.icon-select-content {
  width: 400px;
  padding: 0;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.icon-tabs {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.icon-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 12px;
  flex-shrink: 0;
}

.icon-tabs :deep(.el-tabs__content) {
  flex: 1;
  min-height: 0;
  padding: 0;
  overflow: hidden;
}

.icon-tabs :deep(.el-tabs__body),
.icon-tabs :deep(.el-tabs__panel),
.icon-tabs :deep(.el-tab-pane) {
  height: 100%;
  overflow: hidden;
}

.tab-content {
  padding: 12px;
  overflow: hidden;
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.search-input {
  margin-bottom: 12px;
  flex-shrink: 0;
}

.icon-list {
  flex-shrink: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
  padding: 4px 0;
  min-height: 80px;
}

.icon-list.is-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-template-columns: none;
}

.icon-list::-webkit-scrollbar {
  width: 6px;
}

.icon-list::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.icon-list::-webkit-scrollbar-thumb:hover {
  background: #a0a4a8;
}

.icon-item {
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

.icon-item:hover {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9, #ecf5ff);
  color: var(--el-color-primary);
}

.icon-item.active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary);
  color: #fff;
}

.icon-item.active :deep(svg) {
  fill: currentColor;
}

.icon-item.active .icon-name {
  color: #fff;
}

.icon-item .icon-name {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.2;
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

.icon-pagination {
  margin-top: 10px;
  padding: 8px 0 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--el-border-color-lighter);
}

.pagination-total {
  font-size: 12px;
  color: var(--el-text-color-regular);
  flex-shrink: 0;
}

.pagination-controls {
  flex-shrink: 0;
}
</style>

<style>
.el-popper.fx-icon-select-popover {
  padding: 0 !important;
  overflow: hidden !important;
  max-height: none !important;
  box-sizing: border-box !important;
}

.el-popper.fx-icon-select-popover .el-popper__arrow {
  display: none;
}
</style>
