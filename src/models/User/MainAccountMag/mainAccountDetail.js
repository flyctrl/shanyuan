/*
* @Author: baosheng
* @Date:   2017-10-25 10:37:53
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-14 14:50:14
*/
import React, { Component } from 'react'
import { Row, Col, DatePicker, Card, Table, Modal } from 'antd'
const { RangePicker } = DatePicker
import moment from 'moment'
import api from 'Src/contants/api'
import fetch from 'Src/utils/fetch'
// import { baseUrl } from 'Src/utils'

const columns = [{
  title: '交易订单号',
  dataIndex: 'outerOrderId',
  key: 'outerOrderId',
}, {
  title: '交易时间',
  dataIndex: 'outerOrderCreateTime',
  key: 'outerOrderCreateTime',
}, {
  title: '交易金额',
  dataIndex: 'tradeBalance',
  key: 'tradeBalance',
}, {
  title: '变动前金额',
  dataIndex: 'preBalance',
  key: 'preBalance'
}, {
  title: '变动后金额',
  dataIndex: 'afterBalance',
  key: 'afterBalance'
}, {
  title: '交易类型',
  dataIndex: 'payType',
  key: 'payType',
}, {
  title: '支付订单号',
  dataIndex: 'payOrderId',
  key: 'payOrderId'
}]

export default class MainAccountDetail extends Component {
  constructor() {
    super()
    this.state = {
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      pagination: { current: 1, pageSize: 5 },
      data: {
        accountinfo: {},
        tradeList: [],
      }
    }
  }
  handleRangeChange = (date) => {
    if (date.length !== 0) {
      const startDate = date[0].format('YYYY-MM-DD')
      const endDate = date[1].format('YYYY-MM-DD')

      this.setState({
        startDate,
        endDate,
      }, () => {
        this.doQuery()
      })
    }
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    }, () => {
      this.doQuery()
    })
  }
  // exportData() {
  //   const accountNumber = this.props.match.location.state.accountNumber
  //   location.href = `${baseUrl}${api.exportOrderList}?${params2query({
  //     currentPage: this.state.pagination.current,
  //     pageSize: 2000,
  //     accountNumber: accountNumber,
  //     startDate: this.state.startDate,
  //     endDate: this.state.endDate
  //   })}`

  //   function params2query(params) {
  //     if (typeof params !== 'object') return ''
  //     var queries = []
  //     for (var i in params) {
  //       if (params.hasOwnProperty(i)) {
  //         params[i] && queries.push(i + '=' + params[i])
  //       }
  //     }
  //     return queries.join('&')
  //   }
  // }
  doQuery() {
    const accountNumber = this.props.match.location.state.accountNumber
    fetch(api.platformAccountTradeList, {
      // shopNumber: '12235',
      currentPage: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      accountNumber: accountNumber,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    }).then((res) => {
      if (res.code === 0) {
        const data = res.data
        const pagination = { ...this.state.pagination }
        pagination.total = data.total
        data.tradeList.forEach((trade, index) => {
          trade.key = index
          trade.preBalance = trade.preBalance.toFixed(2)
          trade.afterBalance = trade.afterBalance.toFixed(2)
          trade.tradeBalance = trade.tradeBalance.toFixed(2)
          trade.payType = trade.payType === 1 ? '收入' : trade.payType === 2 ? '支出' : '退款'
        })
        this.setState({
          data,
          pagination,
        })
      } else {
        Modal.error({ title: '提示', 'content': res.errmsg })
      }
    })
  }
  componentDidMount() {
    this.doQuery()
  }
  render() {
    const data = this.state.data
    const dateFormat = 'YYYY-MM-DD'
    // const url = `${baseUrl}${api.exportshopAccountTradeList}?startDate=${this.state.startDate}&endDate=${this.state.endDate}&accountNumber=${this.props.match.location.state.accountNumber}`
    return (
      <div>
        <div style={{ fontSize: '20px', height: '28px', width: '100%', textAlign: 'right' }}>{this.props.match.location.state.accountNumber} ID:{this.props.match.location.state.accountNumber}</div>
        <div style={{ width: '100%', height: '30px', marginTop: '20px' }}>
          <RangePicker style={{ marginLeft: '30px', float: 'left' }} defaultValue={[moment(this.state.startDate, dateFormat), moment(this.state.endDate, dateFormat)]} format={dateFormat} onChange={this.handleRangeChange} />
          {
          // <Button type='primary' style={{ marginLeft: '30px', float: 'right' }} onClick={this.exportData.bind(this)} icon='download'>批量导出</Button>
          }
        </div>
        <div style={{ marginTop: '30px', background: '#f7f7f7', padding: '10px', marginBottom: '20px', textAlign: 'center' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Card title='累计交易金额' bordered={false} style={{ fontSize: '20px' }}>¥{data.accountinfo.grandTradeBalance || 0.00}</Card>
            </Col>
            <Col span={6}>
              <Card title='累计交易笔数' bordered={false} style={{ fontSize: '20px' }}>{data.accountinfo.grandTrandeCount || 0.00}</Card>
            </Col>
            <Col span={6}>
              <Card title='时段交易金额' bordered={false} style={{ fontSize: '20px' }}>¥{data.accountinfo.timeTradeBalance || 0.00}</Card>
            </Col>
            <Col span={6}>
              <Card title='时段交易笔数' bordered={false} style={{ fontSize: '20px' }}>{data.accountinfo.timeTrandeCount || 0.00}</Card>
            </Col>
          </Row>
        </div>
        <Table dataSource={data.tradeList} columns={columns} style={{ marginTop: '30px' }} pagination={this.state.pagination} onChange={this.handleTableChange} />
      </div>
    )
  }
}
