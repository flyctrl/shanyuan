/*
* @Author: chengbaosheng
* @Date:   2017-08-15 19:55:01
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-20 13:37:40
*/
import React, { Component } from 'react'
import { Modal, message } from 'antd'
import * as urls from 'Src/contants/url'
import DetailList from '../detailList'
import { getScopeOption } from 'Src/contants/tooler'
import { getAllScope } from '../constant'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'

class OperatorDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ScopeOptions: [],
      baseInfo: [],
      pagination: {},
      tabData: {},
      params: {}
    }
  }

  getTableById(params = {}) {
    fetch(api.getOptorList, {
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
          title: '子运营方情况',
          value: data.operatorInfos
        }
        this.setState({ pagination: { ...pagination }})
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
      id: this.props.match.location.state['id']
    }).then((res) => {
      if (res.code === 0) {
        _t.getTableById({ parentId: res.data['id'] })
        _t.setState({ params: { parentId: res.data['id'] }})
        let newBase = [{
          key: 'operatorNumber',
          title: '运营方ID',
          value: res.data['operatorNumber']
        }, {
          key: 'operatorName',
          title: '运营方名称',
          value: res.data['operatorName']
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
      dataIndex: 'operatorNumber',
      key: 'operatorNumber'
    }, {
      title: '运营方名称',
      dataIndex: 'operatorName',
      key: 'operatorName'
    }, {
      title: '经营范围',
      dataIndex: 'businessScopId',
      key: 'businessScopId',
      render: (text) => {
        return getScopeOption(text, this.state.ScopeOptions)
      }
    }
    ]
    return (
      <DetailList
        baseInfo={this.state.baseInfo}
        columns={columns}
        tabData={this.state.tabData}
        backUrl={urls.OPERATORMAG}
        pagination={this.state.pagination}
        onChange={this.handleTableChange.bind(this)}
      />
    )
  }
}

export default OperatorDetail
