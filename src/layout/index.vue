<template>
  <div class="layout">
    <!-- 布局 -->
    <h3>header</h3>
    <h3>left nav</h3>
    <!-- 子路由出口 -->
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LayoutIndex'
})
</script>

<style lang="scss" scoped>

</style>
