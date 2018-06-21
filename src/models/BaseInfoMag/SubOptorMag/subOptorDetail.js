/*
* @Author: chengbaosheng
* @Date:   2017-08-16 17:56:22
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-20 14:16:24
*/
import React, { Component } from 'react'
import { Modal, message } from 'antd'
import * as urls from 'Src/contants/url'
import DetailList from '../detailList'
import { getAllScope } from '../constant'
import { getScopeOption } from 'Src/contants/tooler'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'

class SubOptorDetail extends Component {
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
    fetch(api.getSellList, {
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
          title: '商户情况',
          value: data.merchantInfos
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
    fetch(api.getOptorDetail, {
      Id: this.props.match.location.state['id']
    }).then((res) => {
      if (res.code === 0) {
        _t.getTableById({ operatorId: res.data['id'] })
        _t.setState({ params: { operatorId: res.data['id'] }})
        const newBase = [{
          key: 'operatorNumber',
          title: '子运营方ID',
          value: res.data['operatorNumber']
        }, {
          key: 'operatorName',
          title: '子运营方名称',
          value: res.data['operatorName']
        }, {
          key: 'parentOperatorName',
          title: '所属运营方',
          value: res.data['parentOperatorName']
        }, {
          key: 'businessScopId',
          title: '经营范围',
          value: getScopeOption(res.data['businessScopId'], this.state.ScopeOptions)
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
      dataIndex: 'merchantId',
      key: 'merchantId'
    }, {
      title: '商户名称',
      dataIndex: 'merchantName',
      key: 'merchantName'
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
        backUrl={urls.SUBOPTORMAG}
        pagination={this.state.pagination}
        onChange={this.handleTableChange.bind(this)}
      />
    )
  }
}

export default SubOptorDetail
