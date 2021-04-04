<template>
  <div>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
    <el-tree ref="menuTree" render-after-expand :data="menus" :props="defaultProps" node-key="catId" :filter-node-method="filterNode" :highlight-current="true" @node-click="nodeclick" />
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      filterText: '',
      menus: [],
      expandedKey: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  computed: {},

  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
    }
  },
  created() {
    this.getMenus()
  },

  methods: {

    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getMenus() {
      this.$http({
        url: this.$http.adornUrl('/product/category/list/tree'),
        method: 'get'
      }).then(({ data }) => {
        this.menus = data.data
      })
    },
    nodeclick(data, node, component) {
      console.log('子组件category的节点被点击', data, node, component)
      this.$emit('tree-node-click', data, node, component)
    }
  }
}
</script>
