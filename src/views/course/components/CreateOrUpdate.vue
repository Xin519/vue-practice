<template>
  <div class="CreateOrUpdate">
    <el-card>
      <div slot="header">
        <el-steps :active="activeStep" finish-status="success" simple>
          <el-step
            v-for="(item, index) in steps"
            :key="index"
            :title="item.title"
            :icon="item.icon"
            @click.native="activeStep = index"
          ></el-step>
          <!-- 1，给vue组件绑定事件时候，必须加上native ，不然不会生效（监听根元素的原生事件，使用 .native 修饰符）
            2，等同于在自组件中：
            子组件内部处理click事件然后向外发送click事件：$emit("click".fn) -->
        </el-steps>
      </div>
      <el-form label-width="80px">
        <!-- 基本信息 -->
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              style="margin-bottom: 10px"
              v-model="course.previewFirstField"
              type="textarea"
              placeholder="概述1"
            ></el-input>
            <el-input
              v-model="course.previewSecondField"
              type="textarea"
              placeholder="概述2"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number
              v-model="course.sortNum"
              label="描述文字"
            ></el-input-number>
          </el-form-item>
        </div>
        <!-- 课程封面 -->
        <div v-show="activeStep === 1">
          <!--
            upload 上传文件组件，它支持自动上传，你只需要把上传需要参数配置一下就可以了
            -->
          <!--
            1. 组件需要根据绑定的数据进行图片预览
            2. 组件需要把上传成功的图片地址同步到绑定的数据中
            v-model 的本质还是父子组件通信
              1. 它会给子组件传递一个名字叫 value 的数据（Props）
              2. 默认监听 input 事件，修改绑定的数据（自定义事件）
            -->
          <el-form-item label="课程封面">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="介绍封面"> </el-form-item>
        </div>
        <!-- 销售信息 -->
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input v-model.number="course.discounts" type="number">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input v-model.number="course.price" type="number">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model.number="course.sales" type="number">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="course.discountsTag"></el-input>
          </el-form-item>
        </div>
        <!-- 秒杀信息 -->
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关">
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="course.activityCourseDTO.endTime"
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input
                v-model.number="course.activityCourseDTO.amount"
                type="number"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input
                v-model.number="course.activityCourseDTO.stock"
                type="number"
              >
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <!-- 课程详情 -->
        <div v-show="activeStep === 4">
          课程详情
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="handleSave">保存</el-button>
          </el-form-item>
        </div>
        <el-form-item
          style="text-align: center"
          v-if="activeStep >= 0 && activeStep < 4"
        >
          <el-button @click="activeStep++">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
// 课程管理
import Vue from 'vue'

export default Vue.extend({
  name: 'CreateOrUpdate',
  components: {},
  data () {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息', icon: 'el-icon-edit' },
        { title: '课程封面', icon: 'el-icon-edit' },
        { title: '销售信息', icon: 'el-icon-edit' },
        { title: '秒杀活动', icon: 'el-icon-edit' },
        { title: '课程详情', icon: 'el-icon-edit' }
      ],
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0, // 0：未发布，1：已发布
        sales: 0,
        activityCourse: false, // 是否开启活动秒杀
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: '',
        imageUrl: ''
      }
    }
  },
  methods: {
    handleSave () {
      console.log('handleSave')
    },
    handleAvatarSuccess (res: any, file: any) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload (file: any) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
})
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
::v-deep.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
