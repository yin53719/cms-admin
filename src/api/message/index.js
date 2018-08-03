import fetch from '@/utils/fetch';

export function getMessageList(query) {
    return fetch({
        url: '/api/message/mq/page',
        method: 'post',
        data: query
    });
}

export function getMessage(id) {
    return fetch({
        url: '/api/message/mq/mqMessage/' + id,
        method: 'get'
    })
}

export function getConsumedInfoList(id) {
    return fetch({
        url: '/api/message/mq/consumedInfo/list/' + id,
        method: 'get'
    })
}

export function resendMessage(msgKey, type) {
    return fetch({
        url: '/api/message/mq/resendMessage/' + msgKey + '/' + type,
        method: 'post'
    })
}

export function resendMessageByserviceUrl(msgKey, type, serviceUrl) {
    return fetch({
        url: '/api/message/mq/resendMessage/' + msgKey + '/' + type + '?serviceUrl=' + serviceUrl,
        method: 'post'
    })
}