import fetch from '@/utils/fetch'
export function page(query) {
  return fetch({
    url: '/api/alarm/alertInfo/pagelist',
    method: 'get',
    params: query
  })
}
export function getalertInfoList(obj) {
  return fetch({
    url: 'api/alarm/alertInfo/query',
    method: 'get',
    data: obj
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/alarm/alertInfo/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/alarm/alertInfo/' + id,
    method: 'put',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/api/alarm/alertInfo/' + id,
    method: 'get'
  })
}
