<template>
  <div id="app">
    <!-- 跟路由出口 -->
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component // 类的装饰器
export default class App extends Vue {

}
// export default Vue.extend({
// })
</script>

<style lang="scss" scoped></style>
