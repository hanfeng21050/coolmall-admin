<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="dataForm">
          <el-form-item label="分类">
            <category-cascader :catelog-path.sync="catelogPath" />
          </el-form-item>
          <el-form-item label="品牌">
            <brand-select style="width:160px" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="dataForm.status" style="width:160px" clearable>
              <el-option label="新建" :value="0" />
              <el-option label="上架" :value="1" />
              <el-option label="下架" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="检索">
            <el-input v-model="dataForm.key" style="width:160px" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSpuInfo">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <spuinfo :cat-id="catId" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CategoryCascader from '../common/category-cascader'
import BrandSelect from '../common/brand-select'
import Spuinfo from './spuinfo'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { CategoryCascader, Spuinfo, BrandSelect },
  props: {},
  data() {
    // 这里存放数据
    return {
      catId: 0,
      catelogPath: [],
      dataForm: {
        status: '',
        key: '',
        brandId: 0,
        catelogId: 0
      },
      catPathSub: null,
      brandIdSub: null
    }
  },
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created() {},
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
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {
    // eslint-disable-next-line no-undef
    PubSub.unsubscribe(this.catPathSub)
    // eslint-disable-next-line no-undef
    PubSub.unsubscribe(this.brandIdSub)
  },
  destroyed() {},
  activated() {},
  // 方法集合
  methods: {
    searchSpuInfo() {
      console.log('搜索条件', this.dataForm)
      // eslint-disable-next-line no-undef
      PubSub.publish('dataForm', this.dataForm)
    }
  }
}
</script>
