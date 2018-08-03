import fetch from '@/utils/fetch';

export function groupUserlist(query) {
    return fetch({
        url: '/api/alarm/userGroupAlert/getGroupUserlist',
        method: 'get',
        params: query
    });
}