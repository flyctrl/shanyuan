/*
* @Author: chengbaosheng
* @Date:   2017-08-17 13:14:35
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-20 14:11:40
*/
import React, { Component } from 'react'
import InfoList from '../infoList'
import * as urls from 'Src/contants/url'
import api from 'Src/contants/api'
import { getAllScope } from '../constant'
import { getScopeOption } from 'Src/contants/tooler'
class ShopList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ScopeOptions: []
    }
    this.acitonUrl = {
      editUrl: urls.SHOPEDIT,
      detailUrl: urls.SHOPDETAIL,
      addUrl: urls.SHOPADD,
      sucUrl: urls.SHOPMAG,
      dataSourceUrl: api.getShopList
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
      dataIndex: 'shopNumber',
      key: 'shopNumber',
    }, {
      title: '店铺名称',
      dataIndex: 'shopName',
      key: 'shopName',
    }, {
      title: '经营范围',
      dataIndex: 'businessScopId',
      key: 'businessScopId',
      render: (text) => {
        return getScopeOption(text, this.state.ScopeOptions)
      }
    }, {
      title: '所属商户',
      dataIndex: 'merchantName',
      key: 'merchantName',
    }, {
      title: '所属运营方',
      dataIndex: 'parentOperatorName',
      key: 'parentOperatorName',
    }, {
      title: '标记',
      dataIndex: 'shopStatus',
      key: 'shopStatus',
      render: (text) => {
        if (parseInt(text) === 0) {
          return '无效'
        } else if (parseInt(text) === 1) {
          return '有效'
        } else if (parseInt(text) === 2) {
          return '无'
        }
      }
    }]
    return (
      <InfoList columns={columns} acitonUrl={this.acitonUrl} searchDesc='店铺' listType='shoper' />
    )
  }
}

export default ShopList
