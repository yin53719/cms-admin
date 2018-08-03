import fetch from '@/utils/fetch';

export function getScopeList(obj) {
    return fetch({
        url: '/api/alarm/ruleScope/all',
        method: 'get',
        data: obj
    });
}