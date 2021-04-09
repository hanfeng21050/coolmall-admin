<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="120px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="上级菜单" prop="parentId">
        <el-cascader ref="myCascader" v-model="dataForm.parentId" :show-all-levels="false" :options="menuList" :props="props" @change="parentMenuChangeHandle" />
      </el-form-item>
      <el-form-item label="路由标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="该名称会显示在侧边栏" />
      </el-form-item>
      <el-form-item label="路由名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="路由名称, 全局唯一" />
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input v-model="dataForm.path" placeholder="路由访问地址" />
      </el-form-item>
      <el-form-item label="组件" prop="component">
        <el-input v-model="dataForm.component" placeholder="组件" />
      </el-form-item>
      <el-form-item label="面包屑点击" prop="redirect">
        <el-input v-model="dataForm.redirect" placeholder="面包屑点击" />
      </el-form-item>
      <el-form-item label="是否固定" prop="affix">
        <el-switch v-model="dataForm.affix" active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item label="不缓存页面" prop="noCache">
        <el-switch v-model="dataForm.noCache" active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" :min="0" :max="999" label="描述文字" controls-position="right" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover ref="iconListPopover" placement="bottom-start" trigger="click" popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-inner">
                <div class="mod-menu__icon-list">
                  <el-button v-for="(item, index) in iconList" :key="index" :class="{ 'is-active': item === dataForm.icon }" @click="iconActiveHandle(item)">
                    <icon-svg :icon-class="item" />
                  </el-button>
                </div>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input" />
          </el-col>
          <el-col :span="2" class="icon-list__tips">
            <el-tooltip placement="top" effect="light">
              <div slot="content">全站推荐使用SVG Sprite, 详细请参考:<a href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js" target="_blank">icons/index.js</a>描述</div>
              <i class="el-icon-warning" />
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Icon from '@/icons'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: undefined,
        parentId: undefined,
        path: '',
        component: '',
        name: '',
        redirect: 'noRedirect',
        alwaysShow: false,
        hidden: false,
        sort: 0,
        level: 0,
        activeMenu: '',
        affix: false,
        breadcrumb: '',
        icon: '',
        noCache: false,
        roles: '',
        title: ''
      },
      dataRule: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }]
      },
      menuList: [],
      props: {
        value: 'id',
        label: 'title',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  created() {
    this.iconList = Icon.getNameList()
  },
  methods: {
    init(id) {
      this.defaultExpandedKeys = []
      this.dataForm.id = id || 0
      this.$http({
        url: this.$http.adornUrl('/sys/router/getRouterTree'),
        method: 'get',
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          const root = {
            id: '0',
            title: '一级菜单',
            level: -1,
            children: data.data
          }
          this.menuList = [root]
        })
        .then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        })
        .then(() => {
          if (!this.dataForm.id) {
            // 新增
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/sys/router/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              const { router } = data
              console.log(router)
              this.dataForm.id = router.id
              this.dataForm.affix = router.affix
              this.dataForm.alwaysShow = router.alwaysShow
              this.dataForm.activeMenu = router.activeMenu
              this.dataForm.component = router.component
              this.dataForm.breadcrumb = router.breadcrumb
              this.dataForm.hidden = router.hidden
              this.dataForm.icon = router.icon
              this.dataForm.name = router.name
              this.dataForm.noCache = router.noCache
              this.dataForm.parentId = router.level === 0 ? router.parentId + '' : router.parentId
              this.dataForm.path = router.path
              this.dataForm.redirect = router.redirect
              this.dataForm.roles = router.roles
              this.dataForm.title = router.title
              this.dataForm.sort = router.sort
              this.dataForm.level = router.level
            })
          }
        })
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName
    },
    // 表单提交
    dataFormSubmit() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/router/${!this.dataForm.id ? 'save' : 'update'}`
        ),
        method: 'post',
        data: this.$http.adornData(this.dataForm, false)
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
          this.$notify({
            title: data.code,
            message: data.msg,
            type: 'error',
            duration: 1500
          })
        }
      })
    },
    // 选中上级菜单
    parentMenuChangeHandle(val) {
      const node = this.$refs.myCascader.getCheckedNodes()
      this.dataForm.level = node[0].data.level + 1
      console.log(this.dataForm.level)
    }
  }
}
</script>

<style lang="scss">
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    width: 458px;
    overflow: hidden;
  }
  &__icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &__icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
</style>
