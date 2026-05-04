<template>
  <div class="fx-icon-select fx-icon-select--tdesign">
    <t-popup
      :visible="iconSelect.visible.value"
      trigger="manual"
      placement="bottom-left"
      :show-arrow="false"
      :overlay-style="{ width: '400px', padding: '0' }"
      :overlay-inner-style="{ padding: '0', overflow: 'hidden' }"
      @visible-change="(val: boolean) => { if (!val) iconSelect.closePopover() }"
    >
      <template #content>
        <div class="icon-select-content" :style="{ height: `${iconSelect.contentHeight.value}px` }" @click.stop>
          <t-tabs
            :value="iconSelect.activeTab.value"
            size="medium"
            @change="(val: string | number) => { iconSelect.activeTab.value = String(val) }"
          >
            <t-tab-panel v-for="tab in iconSelect.tabs.value" :key="tab.key" :value="tab.key" :label="tab.label">
              <div class="tab-content" :style="{ height: `${iconSelect.tabContentHeight.value}px` }">
                <t-input
                  :value="iconSelect.searchTexts.value[tab.key]"
                  :placeholder="`搜索${tab.label}图标`"
                  clearable
                  size="small"
                  class="search-input"
                  @change="(val: string) => { iconSelect.searchTexts.value[tab.key] = val }"
                >
                  <template #prefixIcon>
                    <SearchIcon class="search-icon" style="color: var(--td-text-color-placeholder, #c0c4cc)" />
                  </template>
                </t-input>
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
                  <t-empty v-if="iconSelect.getFilteredIcons(tab.key).length === 0" title="未找到图标" size="small" />
                </div>
                <div v-if="iconSelect.getFilteredIcons(tab.key).length > 0" class="icon-pagination">
                  <span class="pagination-total">共 {{ iconSelect.getFilteredIcons(tab.key).length }} 个图标</span>
                  <t-pagination
                    :current="iconSelect.currentPages.value[tab.key] || 1"
                    :page-size="iconSelect.pageSize"
                    :total="iconSelect.getFilteredIcons(tab.key).length"
                    size="small"
                    :show-page-size="false"
                    :total-content="false"
                    :max-page-btn="5"
                    class="pagination-controls"
                    @current-change="(val: number) => { iconSelect.currentPages.value[tab.key] = val }"
                  />
                </div>
              </div>
            </t-tab-panel>
          </t-tabs>
        </div>
      </template>

      <t-input
        :value="iconSelect.inputValue.value"
        :placeholder="iconSelect.placeholder"
        readonly
        @click="iconSelect.handleInputClick"
      >
        <template #prefixIcon>
          <FxIcon v-if="modelValue" :name="modelValue" :size="16" />
          <span v-else class="icon-placeholder">图标</span>
        </template>
        <template #suffixIcon>
          <ChevronDownIcon
            class="arrow-icon"
            :class="{ 'is-reverse': iconSelect.visible.value }"
            style="color: var(--td-text-color-placeholder, #c0c4cc)"
          />
        </template>
      </t-input>
    </t-popup>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import searchSvgRaw from '../../assets/search.svg?raw'
import arrowDownSvgRaw from '../../assets/arrow-down.svg?raw'
import FxIcon from '../FxIcon.vue'
import { useIconSelect } from '../../composables/useIconSelect'
import type { FxIconSelectProps } from '../../types'

const SearchIcon = defineComponent({
  name: 'SearchIcon',
  render() {
    return h('span', { innerHTML: searchSvgRaw })
  }
})

const ChevronDownIcon = defineComponent({
  name: 'ChevronDownIcon',
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
.fx-icon-select--tdesign {
  width: 100%;
}

.icon-placeholder {
  color: var(--td-text-color-placeholder, #c0c4cc);
  font-size: 14px;
}

.arrow-icon {
  transition: transform 0.3s;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  width: 14px;
  height: 14px;
}

.search-icon {
  display: inline-flex;
  align-items: center;
  width: 16px;
  height: 16px;
}

.search-icon :deep(svg),
.arrow-icon :deep(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor;
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
  background: #dcdcdc;
  border-radius: 3px;
}

.icon-list::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  padding: 12px 8px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.icon-item:hover {
  border-color: var(--td-brand-color, #0052d9);
  background: #ecf2fe;
  color: var(--td-brand-color, #0052d9);
}

.icon-item.active {
  border-color: var(--td-brand-color, #0052d9);
  background: var(--td-brand-color, #0052d9);
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
  border-top: 1px solid #e7e7e7;
}

.pagination-total {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.pagination-controls {
  flex: 1;
  min-width: 0;
}

.pagination-controls :deep(.t-pagination) {
  justify-content: flex-end;
}
</style>
