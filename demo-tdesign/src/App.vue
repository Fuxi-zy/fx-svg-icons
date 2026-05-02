<script setup lang="ts">
import { ref } from "vue"
import type { IconString } from "@/types/fx-icon-types"

const selectedIcon = ref<IconString | "">("")
</script>

<template>
  <div class="demo">
    <h1>@fuxishi/svg-icon Demo (TDesign)</h1>

    <section>
      <h2>Element Plus 图标 (ep:xxx)</h2>
      <div class="icon-list">
        <div class="icon-item">
          <FxIcon name="ep:home-filled" size="32px" color="#0052d9" />
          <span>ep:home-filled</span>
        </div>
        <div class="icon-item">
          <FxIcon name="ep:user" size="32px" color="#0052d9" />
          <span>ep:user</span>
        </div>
        <div class="icon-item">
          <FxIcon name="ep:setting" size="32px" color="#e37318" />
          <span>ep:setting</span>
        </div>
        <div class="icon-item">
          <FxIcon name="ep:search" size="32px" color="#d54941" />
          <span>ep:search</span>
        </div>
      </div>
    </section>

    <section>
      <h2>Ant Design 图标 (ant-design:xxx)</h2>
      <div class="icon-list">
        <div class="icon-item">
          <FxIcon name="ant-design:home-outlined" size="32px" color="#0052d9" />
          <span>ant-design:home-outlined</span>
        </div>
        <div class="icon-item">
          <FxIcon name="ant-design:user-outlined" size="32px" color="#0052d9" />
          <span>ant-design:user-outlined</span>
        </div>
        <div class="icon-item">
          <FxIcon name="ant-design:setting-outlined" size="32px" color="#e37318" />
          <span>ant-design:setting-outlined</span>
        </div>
        <div class="icon-item">
          <FxIcon name="ant-design:search-outlined" size="32px" color="#d54941" />
          <span>ant-design:search-outlined</span>
        </div>
      </div>
    </section>

    <section>
      <h2>图标选择器（自动检测 TDesign）</h2>
      <div class="select-demo">
        <FxIconSelect v-model="selectedIcon" />
        <p v-if="selectedIcon">
          已选择： <FxIcon :name="selectedIcon" :size="20" /> {{ selectedIcon }}
        </p>
      </div>
    </section>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f3f3f3;
}

.demo {
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
</style>
