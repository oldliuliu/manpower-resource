<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
            >导入excel</el-button
          >
          <el-button size="small" type="danger" @click="exportData"
            >导出excel</el-button
          >
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
          <el-table-column width="120px" label="头像" align="center">
            <!-- 插槽 -->
            <template v-slot="{ row }">
              <img
                v-imageerror="require('@/assets/common/tt.jpg')"
                :src="row.staffPhoto"
                alt=""
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                @click="showQrCode(row.staffPhoto)"
              />
            </template>
          </el-table-column>
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
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
                >查看</el-button
              >
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
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import AddEmployee from '@/views/employees/components/add-employee.vue'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
import { getEmployeeList, delEmployee } from '@/api/employees'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
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
      showDialog: false, // 关闭弹出层
      showCodeDialog: false
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
    },
    exportData () {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 导出excel
      import('@/vendor/Export2Excel').then(async excel => {
        /*  excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        }) */
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)// 返回的data就是 要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_table_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表',
          multiHeader, // 复杂表头
          merges// 合并选项
        })
      })
    },
    // 将表头数据相对应
    formatJson (headers, rows) {
      return rows.map(item => {
        // item就是一个对象
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          // debugger
          return item[headers[key]]
        })
      })
      // 不能这么写 因为要处理时间格式问题
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
    },
    showQrCode (url) {
      if (url) {
        // url存在的情况下 才弹出
        this.showCodeDialog = true // 数据更新  页面回立刻弹出？ 页面是异步的不会立刻弹出
        // nexttick在上一次数据更新完毕，页面渲染之后
        this.$nextTick(() => {
          // 可以确认有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url)// 将地址转化为二维码
          // 如果转的二维码后面的信息是一个地址  就会跳转到该地址 如果不是就会显示内容
        })
      } else {
        this.$message.warning('用户未上传')
      }
    }
  }
}
</script>

<style>
</style>
