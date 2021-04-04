<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="店铺编号" prop="shopSn">
        <el-input v-model="dataForm.shopSn" placeholder="店铺编号" />
      </el-form-item>
      <el-form-item label="店铺所有人" prop="userId">
        <el-select v-model="dataForm.userId" filterable placeholder="请选择">
          <el-option v-for="item in userList" :key="item.userId" :label="item.username" :value="item.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否自营" prop="isSelf">
        <el-radio-group v-model="dataForm.isSelf">
          <el-radio-button label="1">是</el-radio-button>
          <el-radio-button label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="店铺名称" prop="shopName">
        <el-input v-model="dataForm.shopName" placeholder="店铺名称" />
      </el-form-item>
      <el-form-item label="店主名称" prop="shopKeeper">
        <el-input v-model="dataForm.shopKeeper" placeholder="店主名称" />
      </el-form-item>
      <el-form-item label="店主手机号" prop="telephone">
        <el-input v-model="dataForm.telephone" placeholder="店主手机号" />
      </el-form-item>
      <el-form-item label="店铺图标" prop="shopImg">
        <single-upload v-model="dataForm.shopImg" />
      </el-form-item>
      <el-form-item label="地址" prop="shopAddress">
        <el-input v-model="dataForm.shopAddress" placeholder="地址" />
      </el-form-item>
      <el-form-item label="银行id" prop="bankId">
        <el-input v-model="dataForm.bankId" placeholder="银行id" />
      </el-form-item>
      <el-form-item label="银行卡号" prop="bankNo">
        <el-input v-model="dataForm.bankNo" placeholder="银行卡号" />
      </el-form-item>
      <el-form-item label="店铺状态" prop="shopActive">
        <el-radio-group v-model="dataForm.shopActive">
          <el-radio-button label="1">营业中</el-radio-button>
          <el-radio-button label="0">休息中</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="店铺状态" prop="shopStatus">
        <el-radio-group v-model="dataForm.shopStatus">
          <el-radio-button label="1">已审核</el-radio-button>
          <el-radio-button label="0">未审核</el-radio-button>
          <el-radio-button label="-1">停用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="店铺公告" prop="shopNotice">
        <el-input v-model="dataForm.shopNotice" placeholder="店铺公告" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SingleUpload from '@/components/upload/singleUpload'
export default {
  components: { SingleUpload },
  data() {
    return {
      visible: false,
      userList: [],
      dataForm: {
        id: 0,
        shopSn: '',
        userId: '',
        isSelf: '1',
        shopName: '',
        shopKeeper: '',
        telephone: '',
        shopImg: '',
        shopAddress: '',
        bankId: '',
        bankNo: '',
        shopActive: '',
        shopStatus: '',
        statusDesc: '',
        showStatus: '',
        createTime: '',
        noSettledOrderNum: '',
        noSettledOrderFee: '',
        shopNotice: ''
      },
      dataRule: {
        shopSn: [
          { required: true, message: '店铺编号不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '店铺所有人id不能为空', trigger: 'blur' }
        ],
        isSelf: [
          { required: true, message: '是否自营不能为空', trigger: 'blur' }
        ],
        shopName: [
          { required: true, message: '店铺名称不能为空', trigger: 'blur' }
        ],
        shopKeeper: [
          { required: true, message: '店主名称不能为空', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '店主手机号不能为空', trigger: 'blur' }
        ],
        shopImg: [
          { required: true, message: '店铺图标不能为空', trigger: 'blur' }
        ],
        shopAddress: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        bankId: [
          { required: true, message: '银行id不能为空', trigger: 'blur' }
        ],
        bankNo: [
          { required: true, message: '银行卡号不能为空', trigger: 'blur' }
        ],
        shopActive: [
          {
            required: true,
            message: '店铺状态 1:营业中  0:休息中不能为空',
            trigger: 'blur'
          }
        ],
        shopStatus: [
          {
            required: true,
            message: '店铺状态 -1: 停用  0: 未审核  1:审核不能为空',
            trigger: 'blur'
          }
        ],
        statusDesc: [
          {
            required: true,
            message: '状态说明, 一般用于停用说明不能为空',
            trigger: 'blur'
          }
        ],
        showStatus: [
          { required: true, message: '删除状态不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        noSettledOrderNum: [
          { required: true, message: '未结算的订单数不能为空', trigger: 'blur' }
        ],
        noSettledOrderFee: [
          {
            required: true,
            message: '未结算的订单金额不能为空',
            trigger: 'blur'
          }
        ],
        shopNotice: [
          { required: true, message: '店铺公告不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dataForm: {
      handler(val, oldVal) {
        if (val) {
          const user = this.userList.filter((item) => {
            return item.userId === val.userId
          })[0]
          if (user) {
            this.dataForm.shopKeeper = user.username
          }
        }
      },
      deep: true
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.getUserList()
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/shop/shop/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.shopSn = data.shop.shopSn
              this.dataForm.userId = data.shop.userId
              this.dataForm.isSelf = data.shop.isSelf
              this.dataForm.shopName = data.shop.shopName
              this.dataForm.shopKeeper = data.shop.shopKeeper
              this.dataForm.telephone = data.shop.telephone
              this.dataForm.shopImg = data.shop.shopImg
              this.dataForm.shopAddress = data.shop.shopAddress
              this.dataForm.bankId = data.shop.bankId
              this.dataForm.bankNo = data.shop.bankNo
              this.dataForm.shopActive = data.shop.shopActive
              this.dataForm.shopStatus = data.shop.shopStatus
              this.dataForm.statusDesc = data.shop.statusDesc
              this.dataForm.showStatus = data.shop.showStatus
              this.dataForm.createTime = data.shop.createTime
              this.dataForm.noSettledOrderNum = data.shop.noSettledOrderNum
              this.dataForm.noSettledOrderFee = data.shop.noSettledOrderFee
              this.dataForm.shopNotice = data.shop.shopNotice
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
              `/shop/shop/${!this.dataForm.id ? 'save' : 'update'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              shopSn: this.dataForm.shopSn,
              userId: this.dataForm.userId,
              isSelf: this.dataForm.isSelf,
              shopName: this.dataForm.shopName,
              shopKeeper: this.dataForm.shopKeeper,
              telephone: this.dataForm.telephone,
              shopImg: this.dataForm.shopImg,
              shopAddress: this.dataForm.shopAddress,
              bankId: this.dataForm.bankId,
              bankNo: this.dataForm.bankNo,
              shopActive: this.dataForm.shopActive,
              shopStatus: this.dataForm.shopStatus,
              statusDesc: this.dataForm.statusDesc,
              showStatus: this.dataForm.showStatus,
              createTime: this.dataForm.createTime,
              noSettledOrderNum: this.dataForm.noSettledOrderNum,
              noSettledOrderFee: this.dataForm.noSettledOrderFee,
              shopNotice: this.dataForm.shopNotice
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
    },
    // 获取管理员列表
    getUserList() {
      this.$http({
        url: this.$http.adornUrl('/sys/user/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: 1,
          limit: 500
        })
      }).then(({ data }) => {
        this.userList = data.page.list
      })
    }
  }
}
</script>
