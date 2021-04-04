<template>
  <div>
    <el-select v-model="shopId" placeholder="请选择" filterable clearable>
      <el-option v-for="item in shops" :key="item.id" :label="item.shopName" :value="item.id" />
    </el-select>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      shops: [],
      shopId: undefined
    }
  },
  computed: {},
  watch: {
    shopId(val) {
      this.PubSub.publish('shopId', val)
    }
  },
  created() {
    this.getShopList()
  },
  beforeDestroy() {
    // eslint-disable-next-line no-undef
    PubSub.unsubscribe(this.subscribe)
  },
  destroyed() {},
  activated() {},
  methods: {
    getShopList() {
      this.$http({
        url: this.$http.adornUrl('/shop/shop/list'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          const { page } = data
          this.shops = page.list
        } else {
          this.$notify({
            title: data.code,
            message: data.msg,
            type: 'error',
            duration: 1500
          })
        }
      })
    }
  }
}
</script>
<style scoped>

</style>
