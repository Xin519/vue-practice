<template>
  <div class="alloc-menu">
    <el-card>
      <div slot="header">
        <span>分配菜单</span>
        <el-button
          icon="el-icon-back"
          size="mini"
          style="float: right"
          @click="goBack()"
          >返回</el-button
        >
      </div>

      <el-tree
        ref="menu-tree"
        :data="menus"
        node-key="id"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        show-checkbox
        default-expand-all
      ></el-tree>

      <div style="text-align: center">
        <el-button @click="resetChecked">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
// 分配菜单
import Vue from 'vue'
import { Tree } from 'element-ui'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  async created () {
    await this.loadMenus()
    this.loadRoleMenus()
  },
  methods: {
    async loadRoleMenus () { // 获取选中数组
      const { data } = await getRoleMenus(this.roleId)
      this.getCheckedKeys(data.data)
    },
    getCheckedKeys (menus: any) { // 递归往checkedKeys数组push id
      menus.forEach((menu: any) => {
        if (menu.selected) {
          // this.checkedKeys.push(menu.id as never)
          this.checkedKeys = [...this.checkedKeys, menu.id] as any
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList)
        }
      })
    },
    resetChecked () { // 清空
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    },
    async onSave () { // 保存
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      // 拿到选中节点的数据 id 列表
      // 请求提交保存
      await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      })
      this.$message.success('操作成功')
      this.goBack()
    },
    async loadMenus () { // tree 的数据
      const { data } = await getMenuNodeList()
      this.menus = data.data
    },
    goBack () {
      this.$router.back() // back() 返回
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
