<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="dataForm">
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="dataList" row-key="id" border style="width: 100%; text-align:center">
      <el-table-column prop="meta.title" align="center" min-width="150" label="名称" />
      <el-table-column prop="name" align="center" min-width="150" label="路由名称" />
      <el-table-column prop="component" align="center" min-width="150" label="路由组件" />
      <el-table-column prop="path" align="center" min-width="150" label="访问路径" />
      <el-table-column prop="redirect" align="center" min-width="150" label="重定向" />
      <el-table-column prop="meta.affix" align="center" min-width="150" label="是否固定">
        <template slot-scope="scope">
          <i v-if="scope.row.meta.affix" class="el-icon-success" style="color:green" />
          <i v-else class="el-icon-error" />
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <icon-svg :icon-class="scope.row.meta.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:menu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('sys:menu:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import AddOrUpdate from './menu2-add-or-update'
export default {
  components: {
    AddOrUpdate
  },
  data() {
    return {
      addOrUpdateVisible: false,
      dataList: [],
      dataForm: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getDataList()
  },
  mounted() {},
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/router/getRouterTree'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataList = data.data
        this.dataListLoading = false
      })
    },

    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/router/delete/${id}`),
            method: 'post',
            data: this.$http.adornData()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style scoped></style>
