import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
  userInfo: {}, // 这里定义一个空对象
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
  },
  // 删除用户信息
  setUserInfo (state, result) {
    // 更新一个对象
    state.userInfo = result // 响应式
  },
  // 删除用户信息
  reomveUserInfo (state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login (context, data) {
    // 调用api接口
    const result = await login(data)// 拿到token
    context.commit('setToken', result)// 设置token
    // axios加了一层data
    setTimeStamp()// 设置时间戳
  },
  // 获取用户资料action
  async getUserInfo (context) {
    const result = await getUserInfo()// result就是用户的基本资料
    const baseInfo = await getUserDetailById(result.userId)// 为了获取头像
    const baseResult = { ...result, ...baseInfo }// 将两个接口结果合并
    // 此时已经获取到了用户的基本资料 迫不得已 为了头像再次调用一个接口
    context.commit('setUserInfo', baseResult)// 提交到mutations
    // 加一个点睛之笔  这里这一步，暂时用不到，但是请注意，这给我们后边会留下伏笔
    return baseResult // 这里为什么要返回 为后面埋下伏笔
  },
  // 登出
  logout (context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('reomveUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
