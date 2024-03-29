<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.key" placeholder="参数名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        <!-- <el-button v-if="isAuth('member:member:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('member:member:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="username" header-align="center" align="center" label="用户名" />
      <el-table-column prop="nickname" header-align="center" align="center" label="昵称" />
      <el-table-column prop="mobile" header-align="center" align="center" label="手机号码" />
      <el-table-column prop="email" header-align="center" align="center" label="邮箱" />
      <el-table-column prop="gender" header-align="center" align="center" label="性别">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.gender === 0 ? '男' : scope.row.gender === 1 ? '女' : '保密' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="birth" header-align="center" align="center" label="生日">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ birthFormat(new Date(scope.row.birth)) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="city" header-align="center" align="center" label="所在城市" />
      <el-table-column prop="job" header-align="center" align="center" label="职业" />
      <el-table-column prop="sign" header-align="center" align="center" label="个性签名" />
      <el-table-column prop="integration" header-align="center" align="center" label="积分" />
      <el-table-column prop="growth" header-align="center" align="center" label="成长值" />
      <el-table-column prop="status" header-align="center" align="center" label="启用状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row.id, $event)" />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="注册时间" />
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small">送券</el-button> -->
          <el-button type="text" size="small" @click="orderHandle(scope.row.id)">查订单</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import { dateFormat } from '@/utils'
import AddOrUpdate from './member-add-or-update'
export default {
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {
        key: ''
      },
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
  methods: {
    // 跳转到订单页面
    orderHandle(memberId) {
      this.$router.push({ path: 'order-order', query: { memberId: memberId }})
    },
    birthFormat(date) {
      return dateFormat('YYYY-mm-dd', date)
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/member/member/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key
        })
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
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 修改状态
    changeStatus(id, status) {
      this.$http({
        url: this.$http.adornUrl('/member/member/switchStatus'),
        method: 'post',
        data: this.$http.adornData({
          id: id,
          status: status
        }, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    }
    // 删除
    //   deleteHandle (id) {
    //     var ids = id ? [id] : this.dataListSelections.map(item => {
    //       return item.id
    //     })
    //     this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       this.$http({
    //         url: this.$http.adornUrl('/member/member/delete'),
    //         method: 'post',
    //         data: this.$http.adornData(ids, false)
    //       }).then(({data}) => {
    //         if (data && data.code === 0) {
    //           this.$message({
    //             message: '操作成功',
    //             type: 'success',
    //             duration: 1500,
    //             onClose: () => {
    //               this.getDataList()
    //             }
    //           })
    //         } else {
    //           this.$message.error(data.msg)
    //         }
    //       })
    //     })
    //   }
  }
}
</script>
