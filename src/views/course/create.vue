<template>
  <div class="course-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加课程</span>
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
// 添加
import Vue from 'vue'

export default Vue.extend({
  name: 'CourseCreate',
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
