/*
* @Author: chengbaosheng
* @Date:   2017-09-05 14:25:40
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-14 16:47:36
*/
import api from 'Src/contants/api'
import { baseUrl } from 'Src/utils/index'

function getConstantajax(apiurl) {
  let newdata = []
  const url = baseUrl + apiurl
  const xhr = new XMLHttpRequest()
  xhr.open('POST', url, false)
  xhr.withCredentials = true
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
      newdata = JSON.parse(xhr.responseText)['data']
    }
  }
  xhr.send(null)
  return newdata
}
function getAllScope() {
  return getConstantajax(api.getAllBusinessScope)
}
function getAllIndustry() {
  return getConstantajax(api.getAllIndustryInfo)
}
function getAllTown() {
  return getConstantajax(api.getAllTown)
}

const ShopMode = [
  { name: '线下', value: '0' },
  { name: '线上', value: '1' },
]
const shopStatus = [
  { name: '无效', value: '0' },
  { name: '有效', value: '1' },
  { name: '无', value: '2' }
]

export { getAllScope, getAllIndustry, getAllTown, ShopMode, shopStatus }
