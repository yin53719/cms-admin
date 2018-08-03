import fetch from '@/utils/fetch';

export function pagelist(query) {
    return fetch({
        url: '/api/alarm/ruleGroup/pagelist',
        method: 'get',
        params: query
    });
}
 
export function delObj(id) {
    return fetch({
        url: '/api/alarm/ruleGroup/' + id,
        method: 'delete'
    })
}

 
export function putObj(id, obj) {
    return fetch({
      url: '/api/alarm/ruleGroup/' + id,
      method: 'put',
      data: obj
    })
  }

 