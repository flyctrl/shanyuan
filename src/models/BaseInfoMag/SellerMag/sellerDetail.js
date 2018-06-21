/*
* @Author: chengbaosheng
* @Date:   2017-08-17 09:18:36
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-20 14:01:05
*/
import React, { Component } from 'react'
import { Modal, message } from 'antd'
import * as urls from 'Src/contants/url'
import DetailList from '../detailList'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'
import { getAllScope } from '../constant'
import { getScopeOption } from 'Src/contants/tooler'

class SellerDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ScopeOptions: [],
      baseInfo: [],
      pagination: [],
      tabData: [],
      params: {}
    }
  }

  getTableById(params = {}) {
    fetch(api.getShopList, {
      pageSize: 10,
      ...params,
    }).then((res) => {
      if (res.code === 0) {
        const data = res.data
        const pagination = { ...this.state.pagination }
        pagination.total = data.page.totalRowsAmount
        pagination.pageSize = 10
        const newTabData = {
          key: 'station',
          title: '店铺情况',
          value: data.merchantShops
        }
        this.setState({ pagination: pagination })
        this.setState({ tabData: newTabData })
      } else {
        message.error(res.errmsg)
      }
    })
  }

  handleTableChange(pagination, filters) {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    this.getTableById({
      pageSize: pagination.pageSize,
      currentPage: pagination.current,
      ...this.state.params,
    })
  }

  componentWillMount() {
    let ScopeOptions = getAllScope()
    this.setState({
      ScopeOptions
    })
  }
  componentDidMount() {
    const _t = this
    fetch(api.getSellerDetail, {
      Id: this.props.match.location.state['id']
    }).then((res) => {
      if (res.code === 0) {
        _t.getTableById({ merchantInfoId: res.data['id'] })
        _t.setState({ params: { merchantInfoId: res.data['id'] }})
        const newBase = [{
          key: 'merchantId',
          title: '商户ID',
          value: res.data['merchantId']
        }, {
          key: 'merchantName',
          title: '商户名称',
          value: res.data['merchantName']
        }, {
          key: 'contactName',
          title: '联系人姓名',
          value: res.data['contactName']
        }, {
          key: 'contactNumber',
          title: '联系人电话',
          value: res.data['contactNumber']
        }, {
          key: 'email',
          title: '联系人邮箱',
          value: res.data['email']
        }, {
          key: 'operatorName',
          title: '所属子运营方',
          value: res.data['operatorName']
        }, {
          key: 'businessScopId',
          title: '经营范围',
          value: getScopeOption(res.data['businessScopId'], this.state.ScopeOptions)
        }, {
          key: 'merchantAccountName',
          title: '商户账号',
          value: res.data['merchantAccountName']
        }]
        this.setState({ baseInfo: newBase })
      } else {
        Modal.error({ title: '提示', content: res.errmsg })
      }
    })
  }
  render() {
    const columns = [{
      title: 'ID',
      dataIndex: 'shopNumber',
      key: 'shopNumber'
    }, {
      title: '店铺名称',
      dataIndex: 'shopName',
      key: 'shopName'
    }, {
      title: '经营范围',
      dataIndex: 'businessScopId',
      key: 'businessScopId',
      render: (text) => {
        return getScopeOption(text, this.state.ScopeOptions)
      }
    },
    ]
    return (
      <DetailList
        baseInfo={this.state.baseInfo}
        columns={columns}
        tabData={this.state.tabData}
        backUrl={urls.SELLERMAG}
        pagination={this.state.pagination}
        onChange={this.handleTableChange.bind(this)}
      />
    )
  }
}

export default SellerDetail
