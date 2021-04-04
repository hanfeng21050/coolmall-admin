import request from '@/utils/httpRequest'

export function login(data) {
  return request({
    url: request.adornUrl('/sys/login'),
    method: 'post',
    data: request.adornData(data, false)
  })
}

export function getInfo() {
  console.log(222)
  return request({
    url: request.adornUrl('/sys/user/info'),
    method: 'get'
  })
}

export function logout() {
  return request({
    url: request.adornUrl('/sys/logout'),
    method: 'get'
  })
}
