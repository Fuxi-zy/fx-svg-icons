<template>
  <div class="fx-icon-select fx-icon-select--naive">
    <n-popover
      :show="iconSelect.visible.value"
      trigger="manual"
      placement="bottom-start"
      :show-arrow="false"
      :style="{ width: '400px', padding: '0' }"
      :content-style="{ padding: '0', overflow: 'hidden' }"
      @update:show="(val: boolean) => { if (!val) iconSelect.closePopover() }"
    >
      <template #trigger>
        <n-input
          :value="iconSelect.inputValue.value"
          :placeholder="iconSelect.placeholder"
          readonly
          @click="iconSelect.handleInputClick"
        >
          <template #prefix>
            <FxIcon v-if="modelValue" :name="modelValue" :size="16" />
            <span v-else class="icon-placeholder">图标</span>
          </template>
          <template #suffix>
            <span class="arrow-icon" :class="{ 'is-reverse': iconSelect.visible.value }">
              <n-icon :size="14" :component="ArrowDownIcon" />
            </span>
          </template>
        </n-input>
      </template>

      <div class="icon-select-content" :style="{ height: `${iconSelect.contentHeight.value}px` }" @click.stop>
        <n-tabs
          :value="iconSelect.activeTab.value"
          type="line"
          size="small"
          :tabs-padding="12"
          @update:value="(val: string | number) => { iconSelect.activeTab.value = String(val) }"
        >
          <n-tab-pane v-for="tab in iconSelect.tabs.value" :key="tab.key" :name="tab.key" :tab="tab.label">
            <div class="tab-content" :style="{ height: `${iconSelect.tabContentHeight.value}px` }">
              <n-input
                :value="iconSelect.searchTexts.value[tab.key]"
                :placeholder="`搜索${tab.label}图标`"
                clearable
                size="small"
                class="search-input"
                @update:value="(val: string) => { iconSelect.searchTexts.value[tab.key] = val }"
              >
                <template #prefix>
                  <n-icon :size="14" :component="SearchIcon" />
                </template>
              </n-input>
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
                <n-empty v-if="iconSelect.getFilteredIcons(tab.key).length === 0" description="未找到图标" size="small" />
              </div>
              <div v-if="iconSelect.getFilteredIcons(tab.key).length > 0" class="icon-pagination">
                <span class="pagination-total">共 {{ iconSelect.getFilteredIcons(tab.key).length }} 个图标</span>
                <n-pagination
                  :page="iconSelect.currentPages.value[tab.key] || 1"
                  :page-size="iconSelect.pageSize"
                  :item-count="iconSelect.getFilteredIcons(tab.key).length"
                  :page-slot="5"
                  size="small"
                  class="pagination-controls"
                  @update:page="(val: number) => { iconSelect.currentPages.value[tab.key] = val }"
                />
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-popover>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import searchSvgRaw from './assets/search.svg?raw'
import arrowDownSvgRaw from './assets/arrow-down.svg?raw'
import { FxIcon, useIconSelect, type FxIconSelectProps } from '@fuxishi/svg-icon'

const SearchIcon = defineComponent({
  name: 'SearchIcon',
  render() {
    return h('span', { innerHTML: searchSvgRaw })
  }
})

const ArrowDownIcon = defineComponent({
  name: 'ArrowDownIcon',
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
.fx-icon-select--naive {
  width: 100%;
}

.icon-placeholder {
  color: #c2c2c2;
  font-size: 14px;
}

.arrow-icon {
  transition: transform 0.3s;
  cursor: pointer;
  color: #c2c2c2;
  display: inline-flex;
  align-items: center;
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
  background: #c2c2c2;
  border-radius: 3px;
}

.icon-list::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  padding: 12px 8px;
  border: 1px solid #e0e0e6;
  border-radius: 3px;
  cursor: pointer;
  background: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.icon-item:hover {
  border-color: var(--n-primary-color, #18a058);
  background: #e8f5e9;
  color: var(--n-primary-color, #18a058);
}

.icon-item.active {
  border-color: var(--n-primary-color, #18a058);
  background: var(--n-primary-color, #18a058);
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
  border-top: 1px solid #efeff5;
}

.pagination-total {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  flex-shrink: 0;
}

.pagination-controls {
  flex-shrink: 0;
}
</style>
