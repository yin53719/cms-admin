import fetch from '@/utils/fetch';

export function page(query) {
    return fetch({
        url: '/zc/swagger-ui.html',
        method: 'get',
        params: query
    });
}