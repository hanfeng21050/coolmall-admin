<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="120px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="快递名称" prop="expressName">
        <el-input v-model="dataForm.expressName" placeholder="快递名称" />
      </el-form-item>
      <el-form-item label="快递代码" prop="expressCode">
        <el-input v-model="dataForm.expressCode" placeholder="快递代码" />
      </el-form-item>
      <el-form-item label="是否启用" prop="showStatus">
        <el-radio-group v-model="dataForm.showStatus">
          <el-radio-button label="1">是</el-radio-button>
          <el-radio-button label="0">否</el-radio-button>
        </el-radio-group>
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
        expressName: '',
        expressCode: '',
        showStatus: ''
      },
      dataRule: {
        expressName: [
          { required: true, message: '快递名称不能为空', trigger: 'blur' }
        ],
        expressCode: [
          { required: true, message: '快递代码不能为空', trigger: 'blur' }
        ],
        showStatus: [
          {
            required: true,
            message: '是否启用 1:是  0:否不能为空',
            trigger: 'blur'
          }
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
            url: this.$http.adornUrl(`/shop/express/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.expressName = data.express.expressName
              this.dataForm.expressCode = data.express.expressCode
              this.dataForm.showStatus = data.express.showStatus
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
              `/shop/express/${!this.dataForm.id ? 'save' : 'update'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              expressName: this.dataForm.expressName,
              expressCode: this.dataForm.expressCode,
              showStatus: this.dataForm.showStatus
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
