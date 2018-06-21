/*
* @Author: chengbaosheng
* @Date:   2017-09-05 18:52:30
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-19 18:42:53
*/
import { ScopeOptions } from './constant'
export const getScopeOption = (text) => {
  if (typeof text === 'undefined' || text === null) {
    return
  }
  let textAry = []
  let result = ''
  if (text.indexOf(',') > 0) {
    textAry = text.split(',')
  } else {
    textAry.push(text)
  }
  ScopeOptions.forEach((value, index, arry) => {
    for (let i = 0; i < textAry.length; i++) {
      if (value['value'] === textAry[i]) {
        result += value['label'] + '，'
      }
    }
  })
  return result.substring(0, result.length - 1)
}

export const setDisabledScope = (aryStr) => {
  let ary = []
  let resultAry = []
  if (aryStr.indexOf(',') > 0) {
    ary = aryStr.split(',')
  } else {
    ary.push(aryStr)
  }
  for (let i = 0; i < ScopeOptions.length; i++) {
    let bool = false
    for (let j = 0; j < ary.length; j++) {
      if (ScopeOptions[i].value === ary[j]) {
        resultAry.push({ ...ScopeOptions[i], ...{ disabled: false, checked: false }})
        bool = true
      }
    }
    if (!bool) {
      resultAry.push({ ...ScopeOptions[i], ...{ disabled: true, checked: false }})
    }
  }
  return resultAry
}

export const returnFloat = (number) => {
  let value = Math.round(parseFloat(number) * 100) / 100
  let xsd = value.toString().split('.')
  if (xsd.length === 1) {
    value = value.toString() + '.00'
    return value
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      value = value.toString() + '0'
    }
    return value
  }
}
