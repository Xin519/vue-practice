<template>
  <div class="course-view">
    <el-card>
      <div slot="header">
        <div>课程：</div>
        <div>阶段：</div>
        <div>课时：</div>
      </div>
      <el-form label-width="40px">
        <el-form-item label="视频">
          <input ref="video-file" type="file" />
        </el-form-item>
        <el-form-item label="封面">
          <input ref="image-file" type="file" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="authUpload" :disabled='disabled'>开始上传</el-button>
          <el-button @click="goBack()" :disabled='disabled'>返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
// 视频上传
/* eslint-disable */
import Vue from 'vue'
import {
  aliyunImagUploadAddressAdnAuth,
  aliyunVideoUploadAddressAdnAuth,
  transCodeVideo,
  getAliyunTransCodePercent
} from '@/services/aliyun-oss'

export default Vue.extend({
  name: 'CourseView',
  data () {
    return {
      uploader: null,
      videoId: null,
      imageUrl: '',
      fileName: '',
      disabled:false
    }
  },
  computed: {
    video () {
      return this.$refs['video-file']
    },
    image () {
      return this.$refs['image-file']
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    authUpload () {
      this.disabled = true
    //   获取上传的文件
      const videoFile = (this.video as any).files[0]
      const imageFile = (this.image as any).files[0]
      const uploader = this.uploader as any
      //   将用户所选的文件添加到上传列表
      //   一旦开始上传 就会按照列表添加顺序开始上传
      uploader.addFile(videoFile, null, null, null, '{"Vod":{}}')
      uploader.addFile(imageFile, null, null, null, '{"Vod":{}}')

      //   开始上传
      uploader.startUpload() // 触发 onUploadstarted() 事件
    },
    initUploader () {
      // 初始化上传
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值，值的来源https://help.aliyun.com/knowledge_detail/37196.html
        userId: 1618139964448548,
        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: 'cn-shanghai',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo: any) => {

        // 调用我们的后端获取文件上传凭证
          let uploadAuthInfo = null
          if (uploadInfo.isImage) { // 如果uploadInfo.isImage存在 上传图片
            const { data } = await aliyunImagUploadAddressAdnAuth()
            this.imageUrl = data.data.imageURL
            uploadAuthInfo = data.data
          } else { // 上传视频
            const { data } = await aliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageUrl
            })
            this.fileName = uploadInfo.file.name
            this.videoId = data.data.videoId
            uploadAuthInfo = data.data
          }

        // 调用 uploader.setUploadAuthAndAddress 设置上传凭证
          ;(this.uploader as any).setUploadAuthAndAddress(
            uploadInfo,
            uploadAuthInfo.uploadAuth,
            uploadAuthInfo.uploadAddress,
            uploadAuthInfo.videoId || uploadAuthInfo.imageId
          )
        // 设置好上传凭证没有问题 上传开始

        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo: any) {
          console.log('onUploadSucceed', uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo: any, code: any, message: any) {
          this.$message.error('文件上传失败')
          console.log('onUploadFailed')
        },
        // 文件上传进度，单位：字节
        onUploadProgress: function (uploadInfo: any, totalSize: any, loadedPercent: any) {
          console.log('uploadInfo', uploadInfo)
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo: any) {
          this.$message.error('上传凭证超时')
          console.log('onUploadTokenExpired')
        },
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo: any) => {
          // console.log(uploadInfo)
          // console.log({
          //   lessonId: this.$route.query.lessonId,
          //   fileId: this.videoId,
          //   coverImageUrl: this.imageUrl,
          //   fileName: this.fileName
          // })
          const { data } = await transCodeVideo({ // 转码
            lessonId: this.$route.query.lessonId, // 阶段id
            fileId: this.videoId, // 视频id
            coverImageUrl: this.imageUrl, // image地址
            fileName: this.fileName // 视频名
          })
          
          const Timer = setInterval(async () => { // 循环查询转码进度
             const { data } = await getAliyunTransCodePercent(this.$route.query.lessonId as any)
             console.log('转码进度', data.data)

             if(data.data === 100) { // 转码完成
               this.disabled = false
               window.clearInterval(Timer)
               this.$message('视频上传转码完成')
             }
          }, 3000)
        }
      })
    },
    goBack () {
      this.$router.back() // back() 返回
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
