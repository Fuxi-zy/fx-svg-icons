<template>
  <slot v-bind="iconSelect" />
</template>

<script setup lang="ts">
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
</script>
