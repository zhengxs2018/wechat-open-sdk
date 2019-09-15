import axios from 'axios'

import { WX_API_BASE_URL } from './constants'

const client = axios.create({
  baseURL: WX_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 2000
})

client.interceptors.response.use(function(response): any {
  const result = response.data

  // cSpell: disable-next-line
  if (result !== null && typeof result === 'object' && 'errcode' in result) {
    // cSpell: disable-next-line
    return result.errcode === 0 ? result : Promise.reject(Error(result.errmsg))
  }

  return result
})

export default client
