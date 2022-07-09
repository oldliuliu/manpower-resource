import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间
/* import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance */
// 创建一个axios的实例
const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000// 定义5秒超时
}

)
// 请求拦截器
service.interceptors.request.use(config => {
  // config 是请求配置信息
  // 注入token
  if (store.getters.token) {
    // 只有在有token的情况下 才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果它为true表示 过期了
      // token没用了 因为超时了
      store.dispatch('user/logout')// 登出
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须要返回的
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  // axios 默认加了一层data
  const { success, message, data } = response.data
  // 要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进行token? 不能 应该catch
    Message.error(message)// 提示错误信息
    return Promise.reject(new Error(message))
  }
}, error => {
  // error 信息 里面 response的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示token已经超时了
    store.dispatch('user/logout')// 登出删除token
    router.push('login')
  } else {
    Message.error(error.message)// 提示错误信息
  }

  return Promise.reject(error)// 返回执行错误 让当前的执行链跳出成功，直接进入catch
})
// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut () {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime / timeStamp) / 1000 > TimeOut
}
export default service
