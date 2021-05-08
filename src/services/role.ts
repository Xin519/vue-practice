/**
 * 角色相关请求模块
 */

import request from '@/utils/request'

// 列表
export const getRoles = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

// 删除
export const deleteRole = (id: string | number) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

// 添加/编辑
export const createOrUpdate = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

// 明细
export const getRoleById = (id: string | number) => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}
