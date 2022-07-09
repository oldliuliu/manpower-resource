// 导出员工的路由规则
import Layout from '@/layout'

export default {
  // 员工管理
  path: '/employees', // 路由地址 /employees
  name: 'employees', // 给路由模块的一级路由加一个name属性， 这个属性 我们后面会在做权限的时候用到
  component: Layout,
  children: [
    {
      // 二级路由的path什么都不用写的时候 此时他表示二级路由的默认路由
      path: '', // 这里不用写 什么都不用写表示 /employees 不但有布局 layout =>员工主页
      component: () => import('@/views/employees'),
      // 路由元信息，一个存储数据的地方，可以放任何内容
      meta: {
        title: '员工管理', // 这里用title表示左侧导航读取了这里的title属性
        icon: 'peoples'
      }
    }
  ]
}
// // 当你的访问地址 是 /employees的时候 layout组件会显示 此时 你的二级路由的默认组件  也会显示

// // 导出属于员工的路由规则
// import Layout from '@/layout'
// //  {  path: '', component: '' }
// // 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
// export default {
//   path: '/employees', // 路径
//   name: 'employees', // 给路由规则加一个name
//   component: Layout, // 组件
//   // 配置二级路的路由表
//   children: [{
//     path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
//     component: () => import('@/views/employees'),
//     // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
//     meta: {
//       title: '员工管理' // meta属性的里面的属性 随意定义 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
//     }
//   }]
// }

// // 当你的访问地址 是 /employees的时候 layout组件会显示 此时 你的二级路由的默认组件  也会显示
