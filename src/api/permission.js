import request from '@/utils/httpRequest'

export function getRouters() {
  return request({
    url: request.adornUrl('/sys/router/getRouterTree'),
    method: 'get'
  })
}
