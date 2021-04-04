<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form :inline="true" :model="dataForm">
          <el-form-item label="分类">
            <category-cascader :catelog-path.sync="catelogPath" />
          </el-form-item>
          <el-form-item label="品牌">
            <brand-select style="width:160px" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input-number v-model="dataForm.price.min" style="width:160px" :min="0" />-
            <el-input-number v-model="dataForm.price.max" style="width:160px" :min="0" />
          </el-form-item>
          <el-form-item label="检索">
            <el-input v-model="dataForm.key" style="width:160px" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSkuInfo">查询</el-button>
          </el-form-item>
        </el-form>
      </el-form>
    </div>
    <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;" @selection-change="selectionChangeHandle" @expand-change="getSkuDetails">
      <el-table-column type="expand">
        <template slot-scope="scope">
          商品标题：{{ scope.row.skuTitle }}
          <br>
          商品副标题：{{ scope.row.skuSubtitle }}
          <br>
          商品描述：{{ scope.row.skuDesc }}
          <br>
          分类ID：{{ scope.row.catalogId }}
          <br>
          SpuID：{{ scope.row.spuId }}
          <br>
          品牌ID：{{ scope.row.brandId }}
          <br>
        </template>
      </el-table-column>
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="skuId" header-align="center" align="center" label="id" width="50" />
      <el-table-column prop="skuName" header-align="center" align="center" label="名称" />
      <el-table-column prop="skuDefaultImg" header-align="center" align="center" label="默认图片">
        <template slot-scope="scope">
          <img :src="scope.row.skuDefaultImg" style="width:80px;height:80px;">
        </template>
      </el-table-column>
      <el-table-column prop="price" header-align="center" align="center" label="价格" />
      <el-table-column prop="saleCount" header-align="center" align="center" label="销量" />
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="previewHandle(scope.row.skuId)">预览</el-button> -->
          <!-- <el-button type="text" size="small" @click="commentHandle(scope.row.skuId)">评论</el-button> -->
          <el-button type="text" size="small" @click="stockHandle(scope.row.skuId)">库存管理</el-button>
          <!-- <el-dropdown
            @command="handleCommand(scope.row,$event)"
            size="small"
            split-button
            type="text"
          >
            更多
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="uploadImages">上传图片</el-dropdown-item>
              <el-dropdown-item command="seckillSettings">参与秒杀</el-dropdown-item>
              <el-dropdown-item command="reductionSettings">满减设置</el-dropdown-item>
              <el-dropdown-item command="discountSettings">折扣设置</el-dropdown-item>
              <el-dropdown-item command="memberPriceSettings">会员价格</el-dropdown-item>
              <el-dropdown-item command="stockSettings">库存管理</el-dropdown-item>
              <el-dropdown-item command="couponSettings">优惠劵</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
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
      dataForm: {
        key: '',
        brandId: '',
        catelogId: '',
        price: {
          min: 0,
          max: 0
        }
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      catelogPath: []
    }
  },
  created() {
    this.getDataList()
  },
  mounted() {
    // eslint-disable-next-line no-undef
    this.catPathSub = PubSub.subscribe('catPath', (msg, val) => {
      this.dataForm.catelogId = val[val.length - 1]
    })
    // eslint-disable-next-line no-undef
    this.brandIdSub = PubSub.subscribe('brandId', (msg, val) => {
      this.dataForm.brandId = val
    })
  },
  beforeDestroy() {
    // eslint-disable-next-line no-undef
    PubSub.unsubscribe(this.catPathSub)
    // eslint-disable-next-line no-undef
    PubSub.unsubscribe(this.brandIdSub)
  },
  methods: {
    getSkuDetails(row, expand) {
      // sku详情查询
      console.log('展开某行...', row, expand)
    },
    // 处理更多指令
    handleCommand(row, command) {
      console.log('~~~~~', row, command)
      if (command === 'stockSettings') {
        this.$router.push({ path: '/ware-sku', query: { skuId: row.skuId }})
      }
    },
    stockHandle(skuId) {
      this.$router.push({ path: '/ware-sku', query: { skuId: skuId }})
    },
    searchSkuInfo() {
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/product/skuinfo/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          catelogId: this.dataForm.catelogId,
          brandId: this.dataForm.brandId,
          min: this.dataForm.price.min,
          max: this.dataForm.price.max
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
    }
  }
}
</script>
