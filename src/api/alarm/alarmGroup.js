import fetch from '@/utils/fetch'
export function addruleGroup(obj) {
    return fetch({
        url: '/api/alarm/ruleGroup/',
        method: 'post',
        data: obj
    });
}

export function addAll(query) {
    return fetch({
        url: '/api/alarm/ruleGroup/add',
        method: 'post',
        data: query
    });
}

export function detail(id) {
    return fetch({
        url: '/api/alarm/ruleGroup/detail/'+id,
        method: 'get', 
    });
}