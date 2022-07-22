<template>
  <div>
    <!-- 工作日历 -->
    <div>
      <!-- 年和月 -->
      <el-row type="flex" justify="end">
        <!-- 年 用组件给定一个日期 日期获取年  前五年加后五年 -->
        <el-select
          v-model="currentYear"
          size="small"
          style="width: 120px"
          @change="dataChange"
        >
          <el-option
            v-for="item in yearList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-select
          v-model="currentMonth"
          size="small"
          style="width: 120px; margin-left: 10px"
          @change="dataChange"
        >
          <!-- 循环 -->
          <el-option
            v-for="item in 12"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-row>
      <!-- 放置一个日历组件 -->
      <el-calendar v-model="currentDate">
        <template v-slot:dateCell="{ date, data }"
          ><div class="date-content">
            <span class="text"> {{ data.day | getDay }}</span>
            <span v-if="isWeek(date)" class="rest">休</span>
          </div>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    getDay (value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date() // 没有传递值 就获取当前的日期
    }
  },
  data () {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null,
      yearList: [] // 要遍历的年的数组
    }
  },
  created () {
    // 获取当前年份
    this.currentYear = this.startDate.getFullYear()// 得到当前的年份
    this.currentMonth = this.startDate.getMonth() + 1 // 当前月份
    // 快速生成数组的方法
    this.yearList = Array.from(Array(11), (v, i) => this.currentYear + i - 5)
    // 钩子函数执行完毕之后
    this.dataChange() // 主动调用一下方法
  },
  methods: {
    dataChange () {
      // 生成新的日期
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)// 以一号开始
    },
    isWeek (value) {
      return value.getDay() === 6 || value.getDay() === 0
    }
  }
}
</script>

<style  scoped>
::v-deep .el-calendar-day {
  height: auto;
}
::v-deep .el-calendar-table__row td,
::v-deep .el-calendar-table tr td:first-child,
::v-deep .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
::v-deep .el-calendar__header {
  display: none;
}
</style>
