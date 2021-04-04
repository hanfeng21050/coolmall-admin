<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="订单号">
        <el-input v-model="dataForm.orderSn" placeholder="参数名" style="width:200px" clearable />
      </el-form-item>
      <el-form-item label="会员id">
        <el-input v-model="dataForm.memberId" placeholder="会员id" style="width:100px" clearable />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="dataForm.status" placeholder="订单状态" clearable>
          <el-option label="" value="" />
          <el-option label="待支付" value="0" />
          <el-option label="待发货" value="1" />
          <el-option label="待收货" value="2" />
          <el-option label="已完成" value="3" />
          <el-option label="已关闭" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('order:order:delete')" type="danger" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="memberId" header-align="center" align="center" label="会员id" />
      <el-table-column prop="orderSn" header-align="center" align="center" width="200" label="订单号" />
      <!--       <el-table-column prop="couponId" header-align="center" align="center" label="使用的优惠券">
      </el-table-column> -->
      <el-table-column prop="createTime" header-align="center" align="center" width="200" label="创建时间" />
      <el-table-column prop="memberUsername" header-align="center" align="center" label="用户名" width="100" />
      <el-table-column prop="totalAmount" header-align="center" align="center" label="订单总额" width="100" />
      <el-table-column prop="payAmount" header-align="center" align="center" label="应付总额" width="100" />
      <el-table-column prop="freightAmount" header-align="center" align="center" label="运费金额" width="100" />
      <!-- <el-table-column prop="promotionAmount" header-align="center" align="center" label="促销优化金额（促销价、满减、阶梯价）">
      </el-table-column>
      <el-table-column prop="integrationAmount" header-align="center" align="center" label="积分抵扣金额">
      </el-table-column>
      <el-table-column prop="couponAmount" header-align="center" align="center" label="优惠券抵扣金额">
      </el-table-column>
      <el-table-column prop="discountAmount" header-align="center" align="center" label="后台调整订单使用的折扣金额">
      </el-table-column>-->
      <el-table-column prop="payType" header-align="center" align="center" label="支付方式" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.payType === 0 ? '线上支付' : '货到付款' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="订单状态" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ getOrderStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryCompany" header-align="center" align="center" label="物流公司" width="100" />
      <el-table-column prop="deliverySn" header-align="center" align="center" label="物流单号" width="200" />
      <el-table-column prop="autoConfirmDay" header-align="center" align="center" label="自动确认时间(天)" width="100" />
      <el-table-column prop="integration" header-align="center" align="center" label="可以获得的积分" width="100" />
      <el-table-column prop="growth" header-align="center" align="center" label="可以获得的成长值" width="100" />
      <!--       <el-table-column prop="billType" header-align="center" align="center" label="发票类型[0->不开发票；1->电子发票；2->纸质发票]">
      </el-table-column>
      <el-table-column prop="billHeader" header-align="center" align="center" label="发票抬头">
      </el-table-column>
      <el-table-column prop="billContent" header-align="center" align="center" label="发票内容">
      </el-table-column>
      <el-table-column prop="billReceiverPhone" header-align="center" align="center" label="收票人电话">
      </el-table-column>
      <el-table-column prop="billReceiverEmail" header-align="center" align="center" label="收票人邮箱">
      </el-table-column> -->
      <el-table-column prop="receiverName" header-align="center" align="center" label="收货人姓名" width="100" />
      <el-table-column prop="receiverPhone" header-align="center" align="center" label="收货人电话" width="120" />
      <el-table-column prop="receiverPostCode" header-align="center" align="center" label="邮编" width="100" />
      <el-table-column prop="receiverProvince" header-align="center" align="center" label="省份/直辖市" width="150" />
      <el-table-column prop="receiverCity" header-align="center" align="center" label="城市" width="150" />
      <el-table-column prop="receiverRegion" header-align="center" align="center" label="区" width="150" />
      <el-table-column prop="receiverDetailAddress" header-align="center" align="center" width="150" label="详细地址" show-overflow-tooltip />
      <el-table-column prop="note" header-align="center" align="center" label="订单备注" width="150" show-overflow-tooltip />
      <el-table-column prop="confirmStatus" header-align="center" align="center" label="收货状态">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.confirmStatus === 0 ? '已收货' : '未收货' }}</span>
        </template>
      </el-table-column>
      <!--       <el-table-column prop="useIntegration" header-align="center" align="center" label="下单时使用的积分">
      </el-table-column> -->
      <!--       <el-table-column prop="paymentTime" header-align="center" align="center" label="支付时间" width="100">
      </el-table-column>
      <el-table-column prop="deliveryTime" header-align="center" align="center" label="发货时间" width="100">
      </el-table-column>
      <el-table-column prop="receiveTime" header-align="center" align="center" label="收货时间" width="100">
      </el-table-column>
      <el-table-column prop="commentTime" header-align="center" align="center" label="评价时间">
      </el-table-column>
      <el-table-column prop="modifyTime" header-align="center" align="center" label="修改时间">
      </el-table-column> -->
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
import AddOrUpdate from './order-add-or-update'
export default {
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {
        orderSn: ''
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
    console.log('接收到', this.$route.query.memberId)
    if (this.$route.query.memberId) {
      this.dataForm.memberId = this.$route.query.memberId
    }
    this.getDataList()
  },
  methods: {
    getOrderStatus(status) {
      if (status === 0) {
        return '待支付'
      } else if (status === 1) {
        return '已支付'
      } else if (status === 2) {
        return '待发货'
      } else if (status === 3) {
        return '已完成'
      } else if (status === 4) {
        return '已关闭'
      }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/order/order/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          orderSn: this.dataForm.orderSn,
          memberId: this.dataForm.memberId,
          payType: this.dataForm.payType,
          status: this.dataForm.status
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
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
          return item.id
        })
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/order/order/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
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
    }
  }
}
</script>
