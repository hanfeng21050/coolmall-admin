<template>
  <div v-loading="loading" class="mod-config">
    <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="spuName" header-align="center" align="center" label="名称" />
      <el-table-column prop="spuDescription" header-align="center" align="center" label="描述" />
      <el-table-column prop="catalogId" header-align="center" align="center" label="分类" />
      <el-table-column prop="brandId" header-align="center" align="center" label="品牌" />
      <el-table-column prop="publishStatus" header-align="center" align="center" label="上架状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.publishStatus == 0">新建</el-tag>
          <el-tag v-if="scope.row.publishStatus == 1">已上架</el-tag>
          <el-tag v-if="scope.row.publishStatus == 2">已下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间" />
      <el-table-column prop="updateTime" header-align="center" align="center" label="修改时间" />
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.publishStatus == 0" type="text" size="small" @click="productUp(scope.row.id)">上架</el-button>
          <el-button v-else-if="scope.row.publishStatus == 1" type="text" size="small" @click="productDown(scope.row.id)">下架</el-button>
          <el-button v-else-if="scope.row.publishStatus == 2" type="text" size="small" @click="productUp(scope.row.id)">重新上架</el-button>
          <el-button v-if="scope.row.publishStatus != 1" type="text" size="small" @click="attrUpdateShow(scope.row)">规格</el-button>
          <el-button v-if="scope.row.publishStatus != 1" type="text" size="small" @click="deleteSpu(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    catId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      dataSub: null,
      dataForm: {},
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  created() {
    this.getDataList()
  },
  mounted() {
    // eslint-disable-next-line no-undef
    this.dataSub = PubSub.subscribe('dataForm', (msg, val) => {
      this.dataForm = val
      this.getDataList()
    })
  },
  beforeDestroy() {
    // eslint-disable-next-line no-undef
    PubSub.unsubscribe(this.dataSub)
  },
  methods: {
    productUp(id) {
      this.loading = true
      this.$http({
        url: this.$http.adornUrl('/product/spuinfo/' + id + '/up'),
        method: 'post'
      })
        .then(({ data }) => {
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
        .finally(() => {
          this.loading = false
        })
    },
    productDown(id) {
      this.loading = true
      this.$http({
        url: this.$http.adornUrl('/product/spuinfo/down'),
        method: 'post',
        data: this.$http.adornData([id], false)
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
      }).finally(() => {
        this.loading = false
      })
    },
    attrUpdateShow(row) {
      console.log(row)
      this.$router.push({
        path: '/product-attrupdate',
        query: { spuId: row.id, catalogId: row.catalogId }
      })
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      const param = {}
      Object.assign(param, this.dataForm, {
        page: this.pageIndex,
        limit: this.pageSize
      })
      this.$http({
        url: this.$http.adornUrl('/product/spuinfo/list'),
        method: 'get',
        params: this.$http.adornParams(param)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {},
    // 删除
    deleteSpu(spuId) {
      this.loading = true
      this.$http({
        url: this.$http.adornUrl('/product/spuinfo/delete'),
        method: 'post',
        data: this.$http.adornData([spuId], false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 1500
          })
          this.getDataList()
        } else {
          this.$notify({
            title: data.code,
            message: data.msg,
            type: 'error',
            duration: 1500
          })
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
