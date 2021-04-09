import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import AppMain from '@/layout/components/AppMain'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
    }]
  },

  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/category',
    name: 'product',
    meta: {
      title: '商品系统',
      icon: 'product'
    },
    children: [
      {
        path: 'category',
        component: () => import('@/views/product/category'),
        name: 'category',
        meta: { title: '分类维护', icon: 'tree' }
      },
      {
        path: 'brand',
        component: () => import('@/views/product/brand'),
        name: 'brand',
        meta: { title: '品牌管理', icon: 'tree' }
      },
      {
        path: 'attr',
        name: 'attr',
        component: AppMain,
        meta: { title: '平台属性', icon: 'tree' },
        redirect: '/pms/attr/attrgroup',
        children: [
          {
            path: 'attrgroup',
            component: () => import('@/views/product/attrgroup'),
            name: 'attrgroup',
            meta: { title: '属性分组', icon: 'tree' }
          },
          {
            path: 'baseattr',
            component: () => import('@/views/product/baseattr'),
            name: 'baseattr',
            meta: { title: '基本属性', icon: 'tree' }
          },
          {
            path: 'saleattr',
            component: () => import('@/views/product/saleattr'),
            name: 'saleattr',
            meta: { title: '销售属性', icon: 'tree' }
          }
        ]
      },
      {
        path: 'manager',
        name: 'manager',
        component: AppMain,
        meta: { title: '商品维护', icon: 'tree' },
        redirect: '/pms/manager/add',
        children: [
          {
            path: 'add',
            component: () => import('@/views/product/spuadd'),
            name: 'add',
            meta: { title: '添加商品', icon: 'tree' }
          },
          {
            path: 'spumanager',
            component: () => import('@/views/product/spu'),
            name: 'spumanager',
            meta: { title: 'spu管理', icon: 'tree' }
          },
          {
            path: 'skumanager',
            component: () => import('@/views/product/manager'),
            name: 'skumanager',
            meta: { title: 'sku管理', icon: 'tree' }
          }
        ]
      }
    ]
  },

  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/wareinfo',
    name: 'ware',
    meta: {
      title: '库存系统',
      icon: 'example'
    },
    children: [
      {
        path: 'wareinfo',
        component: () => import('@/views/ware/wareinfo'),
        name: 'wareinfo',
        meta: { title: '仓库管理', icon: 'user' }
      },
      {
        path: 'sku',
        component: () => import('@/views/ware/sku'),
        name: 'sku',
        meta: { title: '商品库存', icon: 'user' }
      },
      {
        path: 'purchase',
        component: AppMain,
        name: 'purchase',
        meta: { title: '采购', icon: 'user' },
        redirect: '/wms/purchase/purchaseorder',
        children: [
          {
            path: 'purchaseorder',
            component: () => import('@/views/ware/purchase'),
            name: 'purchaseorder',
            meta: { title: '采购单', icon: 'user' }
          },
          {
            path: 'purchaseitem',
            component: () => import('@/views/ware/purchaseitem'),
            name: 'purchaseitem',
            meta: { title: '采购需求', icon: 'user' }
          }
        ]
      }
    ]

  },

  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order',
    meta: {
      title: '订单系统',
      icon: 'component'
    },
    children: [
      {
        path: 'order',
        component: () => import('@/views/order/order'),
        name: 'order',
        meta: {
          title: '订单系统',
          icon: 'component'
        }
      },
      {
        path: 'deliver',
        component: () => import('@/views/order/order-deliver'),
        name: 'deliver',
        meta: {
          title: '订单发货',
          icon: 'component'
        }
      }
    ]
  },
  {
    path: '/sms',
    component: Layout,
    redirect: '/sms/homeadv',
    meta: {
      title: '活动&优惠系统',
      icon: 'component'
    },
    children: [
      {
        path: 'homeadv',
        component: () => import('@/views/coupon/homeadv'),
        name: 'homeadv',
        meta: {
          title: '页轮播广告管理',
          icon: 'component'
        }
      },
      {
        path: 'homesubject',
        component: () => import('@/views/coupon/homesubject'),
        name: 'homesubject',
        meta: {
          title: '专题活动',
          icon: 'component'
        }
      },
      {
        path: 'homesubjectsku',
        component: () => import('@/views/coupon/homesubjectsku'),
        name: 'homesubjectsku',
        meta: {
          title: '专题商品',
          icon: 'component'
        }
      }
    ]
  },
  {
    path: '/ums',
    component: Layout,
    redirect: '/ums/member',
    meta: {
      title: '用户系统',
      icon: 'component'
    },
    children: [
      {
        path: 'member',
        component: () => import('@/views/member/member'),
        name: 'member',
        meta: {
          title: '会员管理',
          icon: 'component'
        }
      },
      {
        path: 'level',
        component: () => import('@/views/member/level'),
        name: 'level',
        meta: {
          title: '会员等级',
          icon: 'component'
        }
      },
      {
        path: 'growthchangehistory',
        component: () => import('@/views/member/growthchangehistory'),
        name: 'growthchangehistory',
        meta: {
          title: '成长值变化',
          icon: 'component'
        }
      }
    ]
  },
  {
    path: '/smt',
    component: Layout,
    redirect: '/ums/shop',
    meta: {
      title: '店铺系统',
      icon: 'component'
    },
    children: [
      {
        path: 'shop',
        component: () => import('@/views/shop/shop'),
        name: 'shop',
        meta: {
          title: '门店管理',
          icon: 'component'
        }
      },
      {
        path: 'express',
        component: () => import('@/views/shop/express'),
        name: 'express',
        meta: {
          title: '快递管理',
          icon: 'component'
        }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
