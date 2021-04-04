<template>
  <div>
    <el-cascader v-model="paths" filterable clearable placeholder="试试搜索：手机" :options="categorys" :props="setting" />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    catelogPath: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    // 这里存放数据
    return {
      setting: {
        value: 'catId',
        label: 'name',
        children: 'children'
      },
      categorys: [],
      paths: this.catelogPath
    }
  },
  watch: {
    catelogPath(v) {
      this.paths = this.catelogPath
    },
    paths(v) {
      this.$emit('update:catelogPath', v)
      // 还可以使用pubsub-js进行传值
      this.PubSub.publish('catPath', v)
    }
  },
  created() {
    this.getCategorys()
  },
  // 方法集合
  methods: {
    getCategorys() {
      this.$http({
        url: this.$http.adornUrl('/product/category/list/tree'),
        method: 'get'
      }).then(({ data }) => {
        this.categorys = data.data
      })
    }
  }
}
</script>
