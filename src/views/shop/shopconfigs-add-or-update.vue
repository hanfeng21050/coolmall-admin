<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="店铺id" prop="shopId">
        <el-input v-model="dataForm.shopId" placeholder="店铺id" />
      </el-form-item>
      <el-form-item label="门店标题" prop="shopTitle">
        <el-input v-model="dataForm.shopTitle" placeholder="门店标题" />
      </el-form-item>
      <el-form-item label="门店关键词" prop="shopKeyWords">
        <el-input v-model="dataForm.shopKeyWords" placeholder="门店关键词" />
      </el-form-item>
      <el-form-item label="门店描述" prop="shopDesc">
        <el-input v-model="dataForm.shopDesc" placeholder="门店描述" />
      </el-form-item>
      <el-form-item label="门店顶部图片" prop="shopBanner">
        <el-input v-model="dataForm.shopBanner" placeholder="门店顶部图片" />
      </el-form-item>
      <el-form-item label="门店广告" prop="shopAds">
        <el-input v-model="dataForm.shopAds" placeholder="门店广告" />
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
        shopId: '',
        shopTitle: '',
        shopKeyWords: '',
        shopDesc: '',
        shopBanner: '',
        shopAds: ''
      },
      dataRule: {
        shopId: [
          { required: true, message: '店铺id不能为空', trigger: 'blur' }
        ],
        shopTitle: [
          { required: true, message: '门店标题不能为空', trigger: 'blur' }
        ],
        shopKeyWords: [
          { required: true, message: '门店关键词不能为空', trigger: 'blur' }
        ],
        shopDesc: [
          { required: true, message: '门店描述不能为空', trigger: 'blur' }
        ],
        shopBanner: [
          { required: true, message: '门店顶部图片不能为空', trigger: 'blur' }
        ],
        shopAds: [
          { required: true, message: '门店广告不能为空', trigger: 'blur' }
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
            url: this.$http.adornUrl(`/shop/shopconfigs/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.shopId = data.shopConfigs.shopId
              this.dataForm.shopTitle = data.shopConfigs.shopTitle
              this.dataForm.shopKeyWords = data.shopConfigs.shopKeyWords
              this.dataForm.shopDesc = data.shopConfigs.shopDesc
              this.dataForm.shopBanner = data.shopConfigs.shopBanner
              this.dataForm.shopAds = data.shopConfigs.shopAds
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
            url: this.$http.adornUrl(`/shop/shopconfigs/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'shopId': this.dataForm.shopId,
              'shopTitle': this.dataForm.shopTitle,
              'shopKeyWords': this.dataForm.shopKeyWords,
              'shopDesc': this.dataForm.shopDesc,
              'shopBanner': this.dataForm.shopBanner,
              'shopAds': this.dataForm.shopAds
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
