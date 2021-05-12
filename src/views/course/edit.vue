<template>
  <div class="course-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>编辑课程</span>
        <!-- <el-button
          icon="el-icon-back"
          size="mini"
          style="float: right"
          @click="goBack()"
          >返回</el-button
        > -->
        <create-or-update />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
// 编辑
import Vue from 'vue'
import CreateOrUpdate from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'CourseEdit',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    CreateOrUpdate
  },
  methods: {
    goBack () {
      this.$router.back() // back() 返回
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
