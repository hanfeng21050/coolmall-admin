<template>
  <div>
    <base-attr :attrtype="0" />
  </div>
</template>

<script>
import BaseAttr from './baseattr'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { BaseAttr },
  props: {},
  data() {
    // 这里存放数据
    return {}
  },
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created() {},
  mounted() {},
  // 方法集合
  methods: {}
}
</script>
