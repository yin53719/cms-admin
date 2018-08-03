import request from '@/utils/request'

export function findOfficialUser(params) {
    return request({
      url: '/community/user/saicUser/findOfficialUser',
      method: 'get',
      params:params
    })
  }