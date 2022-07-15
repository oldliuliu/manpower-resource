<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <!-- 作用域插槽加过滤器 -->
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template v-slot="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="changPage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 放置弹出层 -->
    <!-- sync修饰符 -->
    <AddEmployee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import AddEmployee from '@/views/employees/components/add-employee.vue'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
import { getEmployeeList, delEmployee } from '@/api/employees'
export default {
  name: 'Employees',
  components: {
    AddEmployee
  },
  data () {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      showDialog: false// 关闭弹出层
    }
  },
  created () {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList () {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // newPage是最新的页码
    changPage (newPage) {
      this.page.page = newPage // 赋值最新的页码
      this.getEmployeeList()// 重新拉取数据
    },
    // 格式化聘用形式
    formatEmployment (row, column, cellValue, index) {
      // 要去找1的位置
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async delEmployee (id) {
      try {
        await this.$confirm('你确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除该员工成功')
        this.getEmployeeList() // 重新拉去数据
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>
</style>
