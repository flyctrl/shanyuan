// import storage from '../utils/storage'
import axios from 'axios'
import { baseUrl, lgoinUrl } from './index'

let fetcher = axios.create({
  method: 'post',
  baseURL: baseUrl,
  withCredentials: 'include',
  transformRequest: [function (data) {
    // const userInfo = storage.get('userInfo')
    // if (userInfo && data && !data.NOUSERINFO) {
    //   data.accessToken = userInfo.accessToken
    // }
    // data.accessToken = 'c33367701511b4f6020ec61ded352059'
    return JSON.stringify(data)
  }],
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }
})

fetcher.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

fetcher.interceptors.response.use(function (response) {
  if (response.data.code === 89001 || response.data.code === 81001 || response.data.code === 2) {
    // location.href = lgoinUrl + '?url=' + window.location.href
    window.location.href = lgoinUrl
  }
  return response.data
}, function (error) {
  return Promise.reject(error)
})

export default fetcher.post
