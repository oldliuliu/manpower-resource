import request from '@/utils/request'

/**
 *登录接口的封装
 * @param {*} data
 * @returns
 */
export function login (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户的基本资料
 * @returns
 */
export function getUserInfo () {
  return request({
    method: 'POST',
    url: 'sys/profile'
  })
}

/** *
 *
 * 获取用户基本信息 现在写完全为了显示头像
*/

export function getUserDetailById (id) {
  return request({
    url: `/sys/user${id}`
  })
}

export function logout () {

}
