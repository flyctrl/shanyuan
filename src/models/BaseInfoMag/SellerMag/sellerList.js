/*
* @Author: chengbaosheng
* @Date:   2017-08-17 09:10:16
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-20 14:26:30
*/
import React, { Component } from 'react'
import InfoList from '../infoList'
import * as urls from 'Src/contants/url'
import api from 'Src/contants/api'
import { getAllScope } from '../constant'
import { getScopeOption } from 'Src/contants/tooler'

class SellerList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ScopeOptions: []
    }
    this.acitonUrl = {
      editUrl: urls.SELLEREDIT,
      detailUrl: urls.SELLERDETAIL,
      addUrl: urls.SELLERADD,
      delUrl: api.deleteSellerList,
      sucUrl: urls.SELLERMAG,
      dataSourceUrl: api.getSellList
    }
  }
  componentWillMount() {
    let ScopeOptions = getAllScope()
    this.setState({
      ScopeOptions
    })
  }
  render() {
    const columns = [{
      title: 'ID',
      dataIndex: 'merchantId',
      key: 'merchantId',
    }, {
      title: '商户名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
    }, {
      title: '经营范围',
      dataIndex: 'businessScopId',
      key: 'businessScopId',
      render: (text) => {
        return getScopeOption(text, this.state.ScopeOptions)
      }
    }, {
      title: '所属子运营方',
      dataIndex: 'operatorName',
      key: 'operatorName',
    }]
    return (
      <InfoList columns={columns} acitonUrl={this.acitonUrl} searchDesc='商户' listType='seller' />
    )
  }
}

export default SellerList
