<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form ref="dataForm" status-icon :model="dataForm" :rules="dataRule" label-width="120px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="采购商品id" prop="skuId">
        <el-input v-model="dataForm.skuId" placeholder="采购商品id" />
        <i slot="prefix" class="el-input__icon el-icon-user-solid" />
      </el-form-item>
      <el-form-item label="采购商品" prop="skuName">
        <el-input v-model="dataForm.skuName" disabled placeholder="采购商品" />
      </el-form-item>
      <el-form-item label="商品价格" prop="skuPrice">
        <el-input v-model="dataForm.skuPrice" disabled placeholder="商品价格" />
      </el-form-item>
      <el-form-item label="采购数量" prop="skuNum">
        <el-input v-model="dataForm.skuNum" placeholder="采购数量" />
      </el-form-item>
      <el-form-item label="仓库" prop="wareId">
        <el-select v-model="dataForm.wareId" placeholder="请选择仓库" clearable>
          <el-option v-for="w in wareList" :key="w.id" :label="w.name" :value="w.id" />
        </el-select>
      </el-form-item>
      <!-- [0新建，1已分配，2正在采购，3已完成，4采购失败] -->
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择状态" clearable>
          <el-option label="新建" :value="0"></el-option>
          <el-option label="已分配" :value="1"></el-option>
          <el-option label="正在采购" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
          <el-option label="采购失败" :value="4"></el-option>
        </el-select>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    var skuIdCheck = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('采购商品id不能为空'))
      } else if (!/^[0-9]*$/.test(value)) {
        return callback(new Error('采购商品id只能为数字'))
      } else {
        this.$http({
          url: this.$http.adornUrl('/product/skuinfo/info/' + value),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({ data }) => {
          if (data && data.code === 0) {
            if (!data.skuInfo || data.skuInfo === null) {
              callback(new Error('商品不存在'))
            } else {
              this.dataForm.skuName = data.skuInfo.skuName
              this.dataForm.skuPrice = data.skuInfo.price
              callback()
            }
          } else {
            callback(new Error('商品不存在'))
          }
        })
      }
    }

    return {
      visible: false,
      wareList: [],
      dataForm: {
        id: 0,
        purchaseId: '',
        skuId: '',
        skuName: '',
        skuNum: '',
        skuPrice: '',
        wareId: '',
        status: 0
      },
      dataRule: {
        skuId: [
          { validator: skuIdCheck, trigger: 'blur' }
        ],
        skuNum: [
          { required: true, message: '采购数量不能为空', trigger: 'blur' }
        ],
        wareId: [{ required: true, message: '仓库id不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getWares()
  },
  methods: {
    getWares() {
      this.$http({
        url: this.$http.adornUrl('/ware/wareinfo/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: 1,
          limit: 500
        })
      }).then(({ data }) => {
        this.wareList = data.page.list
      })
    },
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/ware/purchasedetail/info/${this.dataForm.id}`
            ),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.purchaseId = data.purchaseDetail.purchaseId
              this.dataForm.skuId = data.purchaseDetail.skuId
              this.dataForm.skuNum = data.purchaseDetail.skuNum
              this.dataForm.skuPrice = data.purchaseDetail.skuPrice
              this.dataForm.wareId = data.purchaseDetail.wareId
              this.dataForm.status = data.purchaseDetail.status
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/ware/purchasedetail/${!this.dataForm.id ? 'save' : 'update'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              purchaseId: this.dataForm.purchaseId,
              skuId: this.dataForm.skuId,
              skuNum: this.dataForm.skuNum,
              skuPrice: this.dataForm.skuPrice,
              wareId: this.dataForm.wareId,
              status: this.dataForm.status
            })
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
      })
    }
  }
}
</script>
