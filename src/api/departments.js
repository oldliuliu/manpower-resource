import request from '@/utils/request'

/**
 *
 * @returns 获取住址架构数据
 */

export function getDepartments () {
  return request({
    url: 'company/department'
  })
}

/**
 *根据id根据部门  接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 * @param {*} id
 * @returns
 */
export function delDepartments (id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
/**
 *新增部门接口
 * @param {*} data
 * @returns
 */
export function addDepartments (data) {
  return request({
    url: ' /company/department',
    method: 'post',
    data
  })
}

/** *
 * 获取部门详情
 * ***/
export function getDepartDetail (id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 编辑部门
 *
 * ***/
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
