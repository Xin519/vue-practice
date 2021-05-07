<template>
  <div class="resource">
    <resource-list />
  </div>
</template>

<script lang="ts">
// 资源管理
import Vue from 'vue'
import ResourceList from './components/list.vue'

export default Vue.extend({
  name: 'ResourceIndex',
  components: {
    ResourceList
  }
})
</script>

<style lang="scss" scoped>

</style>
