/**
 * 菜单相关请求模块
 */

import request from '@/utils/request'

// 菜单保存修改
export const createOrUpdateMenu = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

// 获取顶级菜单列表 -1 展示全部顶级菜单列表  id 为当前菜单明细 + 部顶级菜单列表
export const getEditMenuInfo = (id: string | number = -1) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: { // axios 会把 params 转换为 key=value&key=value 的数据格式放到 url 后面(以?分割)
      id
    }
  })
}

//   获取菜单列表
export const getAllMenus = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

// 删除菜单
export const deleteMenu = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}
