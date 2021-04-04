<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="活动专题">
        <!-- <el-input v-model="dataForm.subjectId" placeholder="专题id"></el-input> -->
        <el-select v-model="dataForm.subject" value-key="id" placeholder="请选择">
          <el-option v-for="subject in subjects" :key="subject.id" :label="subject.name" :value="subject" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品">
        <el-tag v-for="sku in skuSelected" :key="sku.skuId" closable :type="'warning'" style="margin:0 5px;" :disable-transitions="true" @close="handleSkuClose(sku.skuId)">
          {{ sku.skuName }}
        </el-tag>
        <el-button type="text" @click="openInnerDialog">选择商品</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

    <el-dialog width="50%" title="商品选择" :visible.sync="innerVisible" append-to-body>
      <el-form :inline="true" :model="innerForm">
        <el-form :inline="true" :model="innerForm">
          <el-form-item label="分类">
            <category-cascader :catelog-path.sync="catelogPath" />
          </el-form-item>
          <el-form-item label="品牌">
            <brand-select style="width:160px" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input-number v-model="innerForm.price.min" style="width:160px" :min="0" />-
            <el-input-number v-model="innerForm.price.max" style="width:160px" :min="0" />
          </el-form-item>
          <el-form-item label="检索">
            <el-input v-model="innerForm.key" style="width:160px" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getSkuList">查询</el-button>
          </el-form-item>
        </el-form>
      </el-form>
      <el-table ref="multipleTable" v-loading="loading" border :data="skus" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" header-align="center" align="center" width="55" />
        <el-table-column prop="skuId" label="id" header-align="center" align="center" width="100" />
        <el-table-column prop="skuName" header-align="center" align="center" label="商品名称" />
        <el-table-column prop="price" header-align="center" align="center" label="商品价格" width="200" />
      </el-table>
      <el-pagination :page-size="limit" :current-page="page" layout="prev, pager, next" :total="total" background @current-change="currentChange" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="danger" @click="addSku">添加所选商品</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import CategoryCascader from '../common/category-cascader'
import BrandSelect from '../common/brand-select'
export default {
  components: {
    CategoryCascader,
    BrandSelect
  },
  data() {
    return {
      catPathSub: null,
      brandIdSub: null,
      loading: false,
      visible: false,
      innerVisible: false,
      subjects: [],
      dataForm: {
        id: 0,
        subject: {}
      },
      dataRule: {
        name: [
          { required: true, message: '专题名字不能为空', trigger: 'blur' }
        ],
        subjectId: [
          { required: true, message: '专题id不能为空', trigger: 'blur' }
        ],
        skuId: [{ required: true, message: 'sku_id不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
      },
      skus: [],
      skuSelected: [],
      multipleSelection: [],
      innerForm: {
        key: '',
        brandId: '',
        catelogId: '',
        price: {
          min: 0,
          max: 0
        }
      },
      page: 1,
      limit: 10,
      total: 0,
      catelogPath: []
    }
  },
  created() {},
  mounted() {
    // eslint-disable-next-line no-undef
    this.catPathSub = PubSub.subscribe('catPath', (msg, val) => {
      this.innerForm.catelogId = val[val.length - 1]
    })
    // eslint-disable-next-line no-undef
    this.brandIdSub = PubSub.subscribe('brandId', (msg, val) => {
      this.innerForm.brandId = val
    })
  },
  methods: {
    init(id) {
      this.skus = []
      this.skuSelected = []
      this.multipleSelection = []
      this.innerForm = {
        key: '',
        brandId: '',
        catelogId: '',
        price: {
          min: 0,
          max: 0
        }
      }

      this.getSubjectList()
      this.visible = true
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/coupon/homesubjectsku/saveSkuBatch`
            ),
            method: 'post',
            data: this.$http.adornData({
              name: this.dataForm.subject.name,
              subjectId: this.dataForm.subject.id,
              skuList: this.skuSelected
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

    // 获取专题活动
    getSubjectList() {
      this.$http({
        url: this.$http.adornUrl('/coupon/homesubject/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: 1,
          limit: 9999,
          status: '1'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.subjects = data.page.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    // 移除商品
    handleSkuClose(skuId) {
      this.skuSelected = this.skuSelected.filter(sku => {
        return sku.skuId !== skuId
      })
    },

    // 打开选择商品的弹出框
    openInnerDialog() {
      this.innerVisible = true
      this.getSkuList()
    },

    // 获取数据列表
    getSkuList() {
      this.loading = true
      this.$http({
        url: this.$http.adornUrl('/product/skuinfo/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.page,
          limit: this.limit,
          key: this.innerForm.key,
          catelogId: this.innerForm.catelogId,
          brandId: this.innerForm.brandId,
          min: this.innerForm.price.min,
          max: this.innerForm.price.max
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.skus = data.page.list
          this.total = data.page.totalCount
        } else {
          this.skus = []
          this.total = 0
        }
        this.loading = false
      })
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },

    // 页数改变
    currentChange(val) {
      this.page = val
      this.getSkuList()
    },

    // 添加所选商品
    addSku() {
      this.skuSelected = this.multipleSelection
      this.innerVisible = false
    }
  }
}
</script>
<style scoped>
</style>
