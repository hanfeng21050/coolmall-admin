import { constantRoutes } from '@/router'
import { getRouters } from '@/api/permission'
import Layout from '@/layout'
import AppMain from '@/layout/components/AppMain'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    if (route.children && route.children.length > 0) {
      filterAsyncRoutes(route.children, roles)
    }
    if (route.component === 'Layout') {
      route.component = Layout
    } else if (route.commonent === 'AppMain') {
      route.component = AppMain
    } else {
      let subView = route.component
      subView = subView.replace(/^\/*/g, '')
      route.component = resolve => require([`@/views/${subView}`], resolve)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getRouters().then(response => {
        const { data } = response

        const routes = data.data
        filterAsyncRoutes(routes, roles)
        commit('SET_ROUTES', routes)
        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
