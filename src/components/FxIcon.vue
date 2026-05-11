<template>
  <Icon
    :icon="props.name"
    :class="iconClass"
    :style="iconStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { FxIconProps } from '../types'

const props = withDefaults(defineProps<FxIconProps>(), {
  size: '16px',
  color: 'currentColor',
  customClass: ''
})

/** 图标样式 */
const iconStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.size) {
    const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size
    style.width = sizeValue
    style.height = sizeValue
    style.fontSize = sizeValue
  }

  if (props.color) {
    style.color = props.color
    style.fill = 'currentColor'
  }

  return style
})

/** 根据 name 生成类名 */
const nameClass = computed(() => {
  const name = (props.name != null ? String(props.name) : '').trim()
  const colonIndex = name.indexOf(':')

  if (colonIndex === -1) {
    return `local-svg-${name}`
  }

  const prefix = name.substring(0, colonIndex)
  const iconName = name.substring(colonIndex + 1).replace(/\.svg$/, '').replace(/\//g, '-')

  if (prefix === 'svg') {
    return `local-svg-${iconName}`
  }
  return `iconify-${prefix}-${iconName}`
})

/** 图标类名 */
const iconClass = computed(() => {
  const classes = ['fx-icon', nameClass.value]
  if (props.customClass) classes.push(props.customClass)
  return classes.join(' ')
})
</script>

<style scoped>
.fx-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.fx-icon svg {
  width: 100%;
  height: 100%;
}
</style>
