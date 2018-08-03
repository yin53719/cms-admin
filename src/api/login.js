import fetch from '@/utils/fetch'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return fetch({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function logout() {
  return fetch({
    url: '/api/logout',
    method: 'get'
  })
}

export function getUserInfo() {
  return fetch({
    url: '/api/menus',
    method: 'get',
  })
}