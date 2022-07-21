// vuex的权限模块
import { constantRoutes, asyncRoutes } from '@/router'
// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes (state, newRoutes) {
    // 下面这么写不对 不是语法不对 是业务不对
    // state.routes = [...state.routes, ...newRoutes]
    // 有一种情况  张三 登录 获取了动态路由 追加到路由上  李四登录 4个动态路由
    // 应该是每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes, ...newRoutes]// 每次都是新的路由
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户所拥有的菜单权限
  // menus:["settings","permissions"]
  // asyncRoutes是所有动态路由
  // asyncRoutes  [{path: 'setting',name: 'setting'},{}]
  filterRoutes (context, menus) {
    const routes = []
    // 筛选出动态路由中和menus中能够对上的路由
    menus.forEach(key => {
      // key就是标识
      // asyncRoutes 找 有没有对象的name属性 key的  找不到就没有权限 找到了就筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key))// 找到了一个数组，找到了可能是元素 也可能是一个空字符串
    })
    // 得到routes是所有模块中满足路由权限的数组
    // routes就是当前用户所拥有的路由权限
    context.commit('setRoutes', routes)// 将动态路由交给mutations
    return routes // 这个理为什么还要return satate数据是用来显示左侧菜单用的 return 是给路由addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
