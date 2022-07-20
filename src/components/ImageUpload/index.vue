<template>
  <div>
    <!-- 给action一个#号 -->
    <el-upload
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :http-request="upload"
      :before-upload="beforeUpload"
      action="#"
      :limit="1"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      v-if="showPercent"
      :percentage="percent"
      style="width: 180px"
    ></el-progress>
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import Cos from 'cos-js-sdk-v5' // 引入腾讯云
// 实例化参数
const cos = new Cos({
  SecretId: 'AKIDBCzXP2QZS6WhdJlywe7LJ2cyAC5qUw99', // 身份识别id
  SecretKey: 'oNhlaA0iEWZP1OWQ7aooZ8JOI0VnupX1'// 身份密钥
})
export default {
  filters: {},
  components: {},
  props: {
    limit: {
      default: 1,
      type: Number
    }
  },
  data () {
    return {
      percent: 0, // 记录当前的百分比
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: null, // 记录当前正在上传的uid
      showPercent: false
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完够了
    fileComputed () {
      return this.fileList.length === this.limit
    }
  },
  watch: {},
  created () { },
  methods: {
    preview (file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove (file, fileList) {
      // file是点击删除的文件
      //   将原来的文件给排除掉了 剩下的就是最新的数组了
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      this.fileList = fileList
    },
    handleChange (file, fileList) {
      // 如果当前fileList里面没有文件，就会往里追加
      this.fileList = fileList.map(item => item)
    },
    beforeUpload (file) {
      // 先检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        // 如果不存在
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 上传终止
      } else {
        //  检查大小
        const maxSize = 5 * 1204 * 1024
        if (maxSize < file.size) {
          // 超过限制文件的大小
          this.$message.error('片大小最大不能超过5M')
          return false
        }
        // 已经确定当前上传的就是这个file
        this.currentFileUid = file.uid
        this.showPercent = true
        return true // 记得返回 return true
      }
    },
    upload (params) {
      if (params.file) {
        cos.putObject({
          Bucket: 'shiyong-1312981050', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // data返回数据后该如何处理
          console.log(err || data)
          if (!err && data.statusCode === 200) {
            // 此时说明文件上传成功，需要返回地址
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的uid
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload为true表示图片上传完毕
                // 保存=>图片大小=>上传速度快慢=>要根据有没有upload这个标记去保存
              }
              return item
            })
            // 将上传成功的地址 回写到了fileList钟
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
