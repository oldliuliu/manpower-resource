<template>
  <div class="dashboard-container">
    <el-card class="tree-card">
      <!-- 用了一个行列布局 -->
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        style="height: 40px"
      >
        <el-col>
          <span>二次颜电商门户网站（老板跑路了）</span>
        </el-col>
        <el-col :span="4">
          <el-row type="flex" justify="end">
            <!-- 两个内容 -->
            <el-col>负责人</el-col>
            <el-col>
              <!-- 下拉菜单 element -->
              <el-dropdown>
                <span> 操作<i class="el-icon-arrow-down" /> </span>
                <!-- 下拉菜单 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加子部门</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
