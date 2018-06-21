/*
* @Author: chengbaosheng
* @Date:   2017-08-17 13:20:51
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-14 17:26:34
*/
import React, { Component } from 'react'
import { Modal } from 'antd'
import * as urls from 'Src/contants/url'
import DetailList from '../detailList'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'
import { getAllScope, ShopMode, getAllIndustry, getAllTown } from '../constant'
import { getScopeOption } from 'Src/contants/tooler'

class ShopDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseInfo: [],
      pagination: [],
      estateOptions: [],
      townOptions: []
    }
  }
  _changeMode(text) {
    let result = ''
    ShopMode.forEach((value, index, arry) => {
      if (value['value'] === text) {
        result = value['name']
      }
    })
    return result
  }
  _changeStatus(text) {
    if (text !== '') {
      return parseInt(text) === 1 ? '有效' : '无效'
    } else {
      return '无'
    }
  }

  _getAllIndustry() { // 获取所有产业
    let estateOptions = getAllIndustry()
    let newEstateOptions = []
    estateOptions.map((item, value, index) => {
      newEstateOptions.push({ name: item['label'], value: item['value'] })
    })
    this.setState({
      estateOptions: newEstateOptions
    })
  }

  getIndustryName(id) {
    let estateOptions = this.state.estateOptions
    if (id !== '') {
      let findval = estateOptions.find(item => {
        return item.value === id
      })
      return findval['name']
    } else {
      return '无'
    }
  }

  _getAllTown() { // 获取所有小镇
    let townOptions = getAllTown()
    let newTownOptions = []
    townOptions.map((item, value, index) => {
      newTownOptions.push({ name: item['label'], value: item['value'] })
    })
    this.setState({
      townOptions: newTownOptions
    })
  }
  getTownName(id) {
    let townOptions = this.state.townOptions
    if (id !== '') {
      let findval = townOptions.find(item => {
        return item.value === id
      })
      return findval['name']
    } else {
      return '无'
    }
  }
  componentWillMount() {
    this._getAllIndustry()
    this._getAllTown()
    let ScopeOptions = getAllScope()
    fetch(api.getShopDetail, {
      Id: this.props.match.location.state['id']
    }).then((res) => {
      if (res.code === 0) {
        const newBase = [{
          key: 'shopNumber',
          title: '店铺ID',
          value: res.data['shopNumber']
        }, {
          key: 'shopName',
          title: '店铺名称',
          value: res.data['shopName']
        }, {
          key: 'shopAccountName',
          title: '店铺账号',
          value: res.data['shopAccountName']
        }, {
          key: 'contactInformation',
          title: '店铺联系方式',
          value: res.data['contactInformation']
        }, {
          key: 'contactName',
          title: '联系人姓名',
          value: res.data['contactName']
        }, {
          key: 'contactNumber',
          title: '联系人电话',
          value: res.data['contactNumber']
        }, {
          key: 'contactMailbox',
          title: '联系人邮箱',
          value: res.data['contactMailbox']
        }, {
          key: 'storeArea',
          title: '店铺面积',
          value: res.data['storeArea']
        }, {
          key: 'mode',
          title: '经营方式',
          value: this._changeMode(res.data['mode'])
        }, {
          key: 'storeAddress',
          title: '位置信息',
          value: res.data['storeAddress']
        }, {
          key: 'longitude',
          title: '经度',
          value: res.data['longitude']
        }, {
          key: 'latitude',
          title: '纬度',
          value: res.data['latitude']
        }, {
          key: 'operatorName',
          title: '所属子运营方',
          value: res.data['operatorName']
        }, {
          key: 'merchantName',
          title: '所属商户',
          value: res.data['merchantName']
        }, {
          key: 'businessScopId',
          title: '经营范围',
          value: getScopeOption(res.data['businessScopId'], ScopeOptions)
        }, {
          key: 'shopStatus',
          title: '标记',
          value: this._changeStatus(res.data['shopStatus'])
        }, {
          key: 'selfSupport',
          title: '是否自营',
          value: { '0': '是', '1': '否' }[res.data['selfSupport']]
        }, {
          key: 'industryNo',
          title: '所属产业',
          value: this.getIndustryName(res.data['industryNo'])
        }, {
          key: 'townNo',
          title: '所属小镇',
          value: this.getTownName(res.data['townNo'])
        }, {
          key: 'relatedSupplyChain',
          title: '是否关联供应链',
          value: { '0': '是', '1': '否' }[res.data['relatedSupplyChain']]
        }]
        this.setState({ baseInfo: newBase })
      } else {
        Modal.error({ title: '提示', content: res.errmsg })
      }
    })
  }
  render() {
    return (
      <DetailList baseInfo={this.state.baseInfo} backUrl={urls.SHOPMAG} />
    )
  }
}

export default ShopDetail
