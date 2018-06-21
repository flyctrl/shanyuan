/**
 * Created by Webstorm.
 * @author taoqili
 * @date 2017/8/16
 */
import React, { Component } from 'react'
import { Table, Row, Col, Card, Menu, Dropdown, Icon, DatePicker, Button, Pagination } from 'antd'
import { Link } from 'react-router-dom'
// import moment from 'moment'
import * as urls from 'Src/contants/url'
import fetch from 'Src/utils/fetch'
import api from 'Src/contants/api'
import { baseUrl } from 'Src/utils'
const RangePicker = DatePicker.RangePicker

class TransactionList extends Component {
  constructor(props) {
    super(props)
    let accountId = props.match.match.params.accountId
    this.state = {
      accountId: accountId,
      transactionList: [],
      loading: true,
      totalSize: 1,
      accountInfo: {
        grandTradeBalance: 0,
        grandRechargeBalance: 0,
        realRechargeBalance: 0,
        balanceMain: 0
      },
      searchOpt: {
        userNumber: accountId,
        pageNum: 1,
        pageSize: 20,
        endDate: '',
        startDate: ''
      }
    }
  }
  componentDidMount() {
    this.fetchTransactionList()
  }
  dateChange(dates, value) {
    let opt = this.state.searchOpt
    opt.startDate = value[0] || ''
    opt.endDate = value[1] || ''
    opt.pageNum = 1
    this.fetchTransactionList(opt)
    this.setState({
      searchOpt: opt
    })
  }
  pageChange(page) {
    let opt = this.state.searchOpt
    opt.pageNum = page
    this.fetchTransactionList(opt)
    this.setState({
      searchOpt: opt
    })
  }
  fetchTransactionList(params) {
    this.setState({
      loading: true
    })
    fetch(api.getUserTransactionList, Object.assign({
      pageNum: 1,
      pageSize: 20
    }, params || {})).then(res => {
      this.setState({
        loading: false
      })
      if (res.code === 0 && res.data) {
        this.setState({
          totalSize: res.data.total,
          transactionList: res.data.tradeList,
          accountInfo: res.data.accountinfo
        })
      } else {
        this.setState({
          transactionList: [],
          totalSize: 1,
          accountInfo: {
            grandTradeBalance: 0,
            grandRechargeBalance: 0,
            realRechargeBalance: 0,
            balanceMain: 0
          }
        })
      }
    })
  }
  exportData() {
    location.href = `${baseUrl}${api.exportTransactionList}?${params2query(Object.assign({}, this.state.searchOpt, { pageSize: 2000 }))}`
    function params2query(params) {
      if (typeof params !== 'object') return ''
      var queries = []
      for (var i in params) {
        if (params.hasOwnProperty(i)) {
          params[i] && queries.push(i + '=' + params[i])
        }
      }
      return queries.join('&')
    }
  }
  render() {
    let accountInfo = this.state.accountInfo || {}
    const columns = [
      {
        title: '交易订单号',
        dataIndex: 'outerOrderId',
        key: 'outerOrderId'
      },
      {
        title: '交易时间',
        dataIndex: 'outerOrderCreateTime',
        key: 'outerOrderCreateTime',
      },
      {
        title: '交易金额',
        dataIndex: 'tradeBalance',
        key: 'tradeBalance',
        render: text => (
          text.toFixed(2)
        )
      },
      {
        title: '变动前金额',
        dataIndex: 'preBalance',
        key: 'preBalance',
        render: text => (
          text.toFixed(2)
        )
      },
      {
        title: '变动后金额',
        dataIndex: 'afterBalance',
        key: 'afterBalance',
        render: text => (
          text.toFixed(2)
        )
      },
      {
        title: '交易类型',
        dataIndex: 'payType',
        key: 'payType',
        render: (text) => {
          return (
            { '1': '收入', '2': '支出', '3': '退款' }[text]
          )
        }
      },
      {
        title: '支付订单号',
        dataIndex: 'payOrderId',
        key: 'payOrderId',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          let menu = (
            <Menu>
              <Menu.Item>
                <Link to={`${urls.USER_TRANSACTION_DETAIL}/${this.state.accountId}/${record.payOrderId}`}>详情</Link>
              </Menu.Item>
            </Menu>
          )
          return (
            <div>
              <Dropdown overlay={menu} placement='bottomCenter'>
                <Icon style={{ fontSize: 18 }} type='bars' />
              </Dropdown>
            </div>
          )
        }
      }
    ]

    let dateFormat = 'YYYY-MM-DD'
    // let today = (function () {
    //   let date = new Date()
    //   return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    // })()
    // defaultValue={[moment(today, dateFormat), moment(today, dateFormat)]}
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', 'right': 0 }}>
          <Button type='primary' onClick={ this.exportData.bind(this) }>批量导出</Button>
        </div>
        <div style={{ paddingBottom: '20px' }}>
          按照日期查询： <RangePicker format={ dateFormat } onChange={this.dateChange.bind(this)}/>
        </div>
        <div style={{ position: 'absolute', fontSize: '20px', right: 0, fontWeight: '800', top: '-68px' }}>
          用户ID:  &nbsp; {this.state.accountId}
        </div>
        <div>
          <div style={{ background: '#f7f7f7', padding: '10px', marginBottom: '20px', textAlign: 'center' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card title='累计交易金额' bodyStyle={{ fontSize: '24px' }} bordered={false}>￥{accountInfo.grandTradeBalance.toFixed(2)}</Card>
              </Col>
              <Col span={6}>
                <Card title='累计充值金额' bodyStyle={{ fontSize: '24px' }} bordered={false}>￥{accountInfo.grandRechargeBalance.toFixed(2)}</Card>
              </Col>
              <Col span={6}>
                <Card title='实际充值金额' bodyStyle={{ fontSize: '24px' }} bordered={false}>￥{accountInfo.realRechargeBalance.toFixed(2)}</Card>
              </Col>
              <Col span={6}>
                <Card title='账户金额' bodyStyle={{ fontSize: '24px' }} bordered={false}>￥{accountInfo.balanceMain.toFixed(2)}</Card>
              </Col>
            </Row>
          </div>
          <Table loading={this.state.loading} columns={columns} dataSource={this.state.transactionList} pagination= { false } />
          <Pagination onChange={this.pageChange.bind(this)} style={{ margin: '10px', cssFloat: 'right' }} pageSize={this.state.searchOpt.pageSize} defaultCurrent={1} current={this.state.searchOpt.pageNum} total={this.state.totalSize}/>
        </div>
      </div>
    )
  }
}
export default TransactionList
