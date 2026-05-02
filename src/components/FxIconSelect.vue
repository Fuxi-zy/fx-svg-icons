<template>
  <component
    v-if="resolvedPreset"
    :is="resolvedPreset"
    :model-value="modelValue"
    :placeholder="placeholder"
    :height="height"
    @update:model-value="emit('update:modelValue', $event)"
  />
  <slot v-else v-bind="iconSelect" />
</template>

<script setup lang="ts">
import { shallowRef, getCurrentInstance, onMounted, markRaw, type Component } from 'vue'
import { useIconSelect } from '../composables/useIconSelect'
import type { FxIconSelectProps } from '../types'

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

const resolvedPreset = shallowRef<Component | null>(null)

// 预设加载器映射
const presetLoaders: Record<string, () => Promise<{ default: Component }>> = {
  'element-plus': () => import('./presets/element-plus.vue'),
  'naive': () => import('./presets/naive.vue'),
  'antdv': () => import('./presets/antdv.vue'),
  'tdesign': () => import('./presets/tdesign.vue')
}

// UI 库全局组件映射
const presetDetectors: Record<string, string> = {
  'element-plus': 'ElPopover',
  'naive': 'NPopover',
  'antdv': 'APopover',
  'tdesign': 'TPopup'
}

function detectPreset(): string | null {
  const instance = getCurrentInstance()
  const globals = instance?.appContext?.components || {}
  for (const [preset, componentName] of Object.entries(presetDetectors)) {
    if (componentName in globals) return preset
  }
  return null
}

onMounted(() => {
  const preset = detectPreset()
  if (preset && presetLoaders[preset]) {
    presetLoaders[preset]().then(mod => {
      resolvedPreset.value = markRaw(mod.default)
    })
  }
})
</script>
