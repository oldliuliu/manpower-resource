export const imageerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted (dom, options) {
    // options是 指令中的变量的解释  其中有一个属性叫做 value
    // dom 表示当前指令作用的dom对象
    // dom认为此时就是图片
    dom.src = dom.src || options.value // 初始化的时候有值赋值没值进行默认赋值
    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
    dom.onerror = function () {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value// 不能写死
    }
  },
  // 该函数跟inserted一样也是一个钩子函数
  componentUpdated (dom, options) {
    // 该钩子函数会在当前指令作用的组件 更新数据完毕后 执行
    // inserted只会一次
    // 组件初始化 一旦进入inserted 组件会进入componentUpdated
    dom.src = dom.src || options.value
  }
}
