<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <tree-tools :tree-node="company" :is-root="true" @AddDepts="AddDepts" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <TreeTools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @AddDepts="AddDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置弹出层组件 -->
    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />

  </div>
</template>

<script>
import TreeTools from '@/views/departments/components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Department',
  components: {
    TreeTools,
    AddDept
  },
  data () {
    return {
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      company: {},
      showDialog: false, // 显示窗体
      node: null, // 记录当前的node节点
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },
  computed: {
    showTitle () {
      return this.formdata.id ? '编辑部门' : '新增子部门'
    }
  },
  created () {
    this.getDepartments()
  },
  methods: {
    // debugger 调试专用
    async getDepartments () {
      this.loading = true
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '')// 需要将其转化成树形结构
      // console.log(res)
      this.loading = false
    },
    AddDepts (node) {
      // 监听tree-tools中点击添加部门事件
      this.showDialog = true// 显示弹出层
      this.node = node
    },
    editDepts (node) {
      this.showDialog = true // 弹出层
      this.node = node
      // 应该在这里调用获取部门详情的方法
      // console.log(this.$refs.addDept)
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
