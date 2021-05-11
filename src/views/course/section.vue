<template>
  <div class="course-section">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>内容管理</span>
        <el-button
          icon="el-icon-back"
          size="mini"
          style="float: right"
          @click="goBack()"
          >返回</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
// 内容管理
import Vue from 'vue'

export default Vue.extend({
  name: 'CourseSection',
  components: {},
  methods: {
    goBack () {
      this.$router.back() // back() 返回
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
