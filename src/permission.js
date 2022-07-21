// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
// 路由的前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开启进度条
  //  首先判断有无token
  if (store.getters.token) {
    //   如果有token 继续判断是不是去登录页
    if (to.path === '/login') {
      //  表示去的是登录页
      next('/') // 跳到主页
      NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
    } else {
      // 只有放过的时候才去获取用户资料
      // 是每次都获取吗
      // 如果当前vuex中有用户的资料的id 表示 已经有资料了 不需要获取了 如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果，没有id才表示当前用户资料没有获取过
        // async 函数所return的内容 用 await就可以接收到
        const { roles } = await store.dispatch('user/getUserInfo')
        // 如果说后续 需要根据用户资料获取数据的化 泽瑞必须改成 同步
        // 筛选用户的可用路由
        // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值化 必须 加 await或者是then
        // actions是做异步操作的
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // addRoutes 必须用 next（地址）  不能用next（）
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加到路由表)// 添加动态路由到路由表 铺路
        // 添加完动态路由之后
        next(to.path)// 相当于跳到对应的地址 相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，在从门外往里进一次，跳转之前，把路铺好，再次进来的时候
      }
      next() // 直接放行
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
      NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
    }
  }
})
// 后置守卫
router.afterEach(function () {
  NProgress.done() // 关闭进度条
})
