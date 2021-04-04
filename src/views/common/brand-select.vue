<template>
  <div>
    <el-select v-model="brandId" placeholder="请选择" filterable clearable>
      <el-option v-for="item in brands" :key="item.brandId" :label="item.brandName" :value="item.brandId" />
    </el-select>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      catId: 0,
      brands: [
        {
          label: 'a',
          value: 1
        }
      ],
      brandId: '',
      subscribe: null
    }
  },
  computed: {},
  watch: {
    brandId(val) {
      this.PubSub.publish('brandId', val)
    }
  },
  created() {},
  mounted() {
    // 监听三级分类消息的变化
    // eslint-disable-next-line no-undef
    this.subscribe = PubSub.subscribe('catPath', (msg, val) => {
      this.catId = val[val.length - 1]
      this.getCatBrands()
    })
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {
    // eslint-disable-next-line no-undef
    PubSub.unsubscribe(this.subscribe)
  },
  destroyed() {},
  activated() {},
  // 方法集合
  methods: {
    getCatBrands() {
      this.$http({
        url: this.$http.adornUrl('/product/categorybrandrelation/brands/list'),
        method: 'get',
        params: this.$http.adornParams({
          catId: this.catId
        })
      }).then(({ data }) => {
        this.brands = data.data
      })
    }
  }
}
</script>
