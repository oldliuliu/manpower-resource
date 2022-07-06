import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
  token: getToken()// 设置token的共享状态
}
// 修改状态
const mutations = {
  setToken (state, token) {
    state.token = token // 将数据设置给vuex
    // 同步缓存
    setToken(token)
  },
  removeToken (state) {
    state.token = null // 将vuex的数据置空
    removeToken()// 同步到缓存
  }
}
// 执行异步
const actions = {
  async login (context, data) {
    // 调用api接口
    const result = await login(data)// 拿到token
    context.commit('setToken', result)// 设置token
    // axios加了一层data
    /* if (result.data.success) {
      // 如果为true，表示登录成功
      context.commit('setToken', result)
    } */
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
