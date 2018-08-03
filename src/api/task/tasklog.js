import fetch from '@/utils/fetch';
export function page(query) {
    return fetch({ 
        url: '/api/task/taskManager/tasklogs',
        method: 'get',
        params: query
    });
}