import store from '@/store'
// 做一个混入对象
export default {
  // 混入对象是组件的选项对象
  methods: {
    // 检查权限 要么有 要么没有 key就是要检查的点
    checkPermission (key) {
      // 去用户信息里面找 porints中有没有key  如果有 则认为有权限 如果没有则认为不能点击
      const { userInfo } = store.state.user
      if (userInfo.roles.poinits && userInfo.roles.poinits.length) {
        return userInfo.roles.poinits.some(item => item === key)
      }
      return false // 如果没有进去 就没有权限
    }
  }
}
