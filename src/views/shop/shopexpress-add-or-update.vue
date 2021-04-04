<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="快递公司Id" prop="expressId">
        <el-input v-model="dataForm.expressId" placeholder="快递公司Id" />
      </el-form-item>
      <el-form-item label="是否启用 0:未启用  1: 启用" prop="isEnable">
        <el-input v-model="dataForm.isEnable" placeholder="是否启用 0:未启用  1: 启用" />
      </el-form-item>
      <el-form-item label="是否默认 0: 否  1:是" prop="isDefault">
        <el-input v-model="dataForm.isDefault" placeholder="是否默认 0: 否  1:是" />
      </el-form-item>
      <el-form-item label="0: 无效  1: 有效" prop="showStatus">
        <el-input v-model="dataForm.showStatus" placeholder="0: 无效  1: 有效" />
      </el-form-item>
      <el-form-item label="店铺id" prop="shopId">
        <el-input v-model="dataForm.shopId" placeholder="店铺id" />
      </el-form-item>
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
    return {
      visible: false,
      dataForm: {
        id: 0,
        expressId: '',
        isEnable: '',
        isDefault: '',
        showStatus: '',
        shopId: ''
      },
      dataRule: {
        expressId: [
          { required: true, message: '快递公司Id不能为空', trigger: 'blur' }
        ],
        isEnable: [
          { required: true, message: '是否启用 0:未启用  1: 启用不能为空', trigger: 'blur' }
        ],
        isDefault: [
          { required: true, message: '是否默认 0: 否  1:是不能为空', trigger: 'blur' }
        ],
        showStatus: [
          { required: true, message: '0: 无效  1: 有效不能为空', trigger: 'blur' }
        ],
        shopId: [
          { required: true, message: '店铺id不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/shop/shopexpress/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.expressId = data.shopExpress.expressId
              this.dataForm.isEnable = data.shopExpress.isEnable
              this.dataForm.isDefault = data.shopExpress.isDefault
              this.dataForm.showStatus = data.shopExpress.showStatus
              this.dataForm.shopId = data.shopExpress.shopId
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
            url: this.$http.adornUrl(`/shop/shopexpress/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'expressId': this.dataForm.expressId,
              'isEnable': this.dataForm.isEnable,
              'isDefault': this.dataForm.isDefault,
              'showStatus': this.dataForm.showStatus,
              'shopId': this.dataForm.shopId
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
