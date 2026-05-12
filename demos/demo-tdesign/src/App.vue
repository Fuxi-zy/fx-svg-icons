<script setup lang="ts">
import { ref } from "vue"
import type { IconString } from "@/types/fx-icon-types"
import { dependencies } from "virtual:demo-deps"

const selectedIcon = ref<IconString | "">("")
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <h3>依赖检测</h3>
      <ul class="dep-list">
        <li v-for="(version, name) in dependencies" :key="name">
          <t-tooltip :content="`${name}: ${version}`" placement="right">
            <span class="dep-name">{{ name }}</span>
          </t-tooltip>
          <span class="dep-version">{{ version }}</span>
        </li>
      </ul>
    </aside>

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
      <h2>本地 SVG 图标 (svg:xxx)</h2>
      <div class="icon-list">
        <div class="icon-item">
          <FxIcon name="svg:star" size="32px" color="#d54941" />
          <span>svg:star</span>
        </div>
        <div class="icon-item">
          <FxIcon name="svg:heart" size="32px" color="#d54941" />
          <span>svg:heart</span>
        </div>
        <div class="icon-item">
          <FxIcon name="svg:check" size="32px" color="#0052d9" />
          <span>svg:check</span>
        </div>
        <div class="icon-item">
          <FxIcon name="svg:common-batch-processing" size="32px" color="#d54941" />
          <span>svg:batch-processing</span>
        </div>
        <div class="icon-item">
          <FxIcon name="svg:statusCode-404-not-found-01" size="32px" color="#d54941" />
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
      <h2>图标选择器（自动检测 TDesign）</h2>
      <div class="select-demo">
        <FxIconSelect v-model="selectedIcon" />
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
  background: #f3f3f3;
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
  color: #0052d9;
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
</style>
