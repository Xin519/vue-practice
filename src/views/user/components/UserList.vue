<template>
  <div class="userList">
    <el-card>
      <div slot="header">
        <el-form :inline="true" :model="filterParams" ref="filter-form">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="filterParams.phone"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="rangeDate">
            <el-date-picker
              v-model="filterParams.rangeDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item  style="float: right;">
            <el-button type="primary" @click="handleQuery" :disabled="loading"
              >查询</el-button
            >
            <el-button :disabled="loading" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
        <el-table
      :data="users"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column
        prop="id"
        label="用户ID"
        width="130">
      </el-table-column>
      <el-table-column
        prop="name"
        label="头像"
        width="80">
        <template slot-scope="scope">
          <img width="30px" :src="scope.row.portrait || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
        width="300">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleSelectRole(scope.row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible"
      width="35%"
    >
      <el-select style="width:100%" v-model="roleIdList" multiple placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAllocRole"
        >确 定</el-button>
      </span>
    </el-dialog>
    </el-card>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { getUserPages } from '@/services/user'
import { getAllRoles, getUserRoles, allocateUserRoles } from '@/services/role'

export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      users: [],
      filterParams: {
        currentPage: 1,
        pageSize: 100,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      loading: true,
      dialogVisible: false,
      roles: [],
      roleIdList: [],
      currentUser: null // 分配角色的当前用户
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    async loadUsers () {
      this.loading = true
      const { rangeDate } = this.filterParams
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
      } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await getUserPages(this.filterParams)
      this.users = data.data.records
      this.loading = false
    },
    handleReset () { // 重置
      (this.$refs['filter-form'] as Form).resetFields()
      this.loadUsers()
    },
    handleQuery () { // 查询
      this.filterParams.currentPage = 1
      this.loadUsers()
    },
    async handleSelectRole (role: any) { // 打开分配角色对话框
      this.currentUser = role
      // 加载角色列表
      const { data } = await getAllRoles()
      this.roles = data.data
      // 加载用的配置的角色
      const { data: { data: userRoles } } = await getUserRoles((this.currentUser as any).id)
      this.roleIdList = userRoles.map((item: any) => item.id)

      // 展示对话框
      this.dialogVisible = true
    },
    async handleAllocRole () { // 分配角色
      const { data } = await allocateUserRoles({
        userId: (this.currentUser as any).id,
        roleIdList: this.roleIdList
      })
      this.$message.success('操作成功')
      this.dialogVisible = false
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
