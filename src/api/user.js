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

export function getInfo (token) {

}

export function logout () {

}
