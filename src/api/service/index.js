import fetch from '@/utils/fetch';

export function getService() {
    return fetch({
        url: '/api/service/allInst',
        method: 'get'
    })
}

export function delInstance(appID, instanceID) {
    return fetch({
        url: '/api/service/delete/' + appID + '/' + instanceID,
        method: 'delete'
    })
}