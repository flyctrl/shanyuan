/**
 * Created by Webstorm.
 * @author taoqili
 * @date 2017/8/16
 */
import React, { Component } from 'react'
import { Table, Input, Select, DatePicker, Menu, Dropdown, Icon, Button, Pagination, message } from 'antd'
import { Link } from 'react-router-dom'
// import moment from 'moment'
import * as urls from 'Src/contants/url'
import fetch from 'Util/fetch.js'
import api from 'Src/contants/api'
import { baseUrl } from 'Src/utils'
import { payTypeMap, payMethodMap, payStatusMap, payIdMap } from '../nameMaps'

const Search = Input.Search
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

class OrderList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderList: [],
      loading: true,
      totalSize: 1,
      payId: 'payOrderId',
      searchValue: '',
      searchOpt: {
        currentPage: 1,
        pageSize: 20,
        payType: '',
        payMethod: '',
        payStatus: '',
        startDate: '',
        endDate: ''
      }
    }
  }

  componentDidMount() {
    const { payId } = this.state
    this.fetchOrderList({
      [ payId ]: ''
    })
  }

  pageChange(page) {
    let opt = this.state.searchOpt
    opt.currentPage = page
    this.fetchOrderList(opt)
    this.setState({
      searchOpt: opt
    })
  }

  fetchOrderList = (params = {}) => {
    this.setState({
      loading: true
    })
    const { payId, searchValue, searchOpt } = this.state
    if (searchOpt.payType === '0') {
      searchOpt.payType = ''
    }
    if (searchOpt.payMethod === '0') {
      searchOpt.payMethod = ''
    }
    if (searchOpt.payStatus === '0') {
      searchOpt.payStatus = ''
    }
    fetch(api.getUserOrderList, {
      currentPage: 1,
      pageSize: 20,
      ...searchOpt,
      [payId]: searchValue,
      ...params
    }).then(res => {
      this.setState({
        loading: false
      })
      if (res.code === 0 && res.data) {
        this.setState({
          totalSize: res.data.page.totalRowsAmount,
          orderList: res.data.outerOrders
        })
      } else {
        message.error(res.errmsg)
      }
    })
  }

  searchByOrderId(value) {
    const { payId } = this.state
    if (!value.replace(/^\s|\s$/, '')) {
      let searchOpt = this.state.searchOpt
      searchOpt.currentPage = 1
      this.setState({
        searchValue: '',
        searchOpt
      }, function() {
        this.fetchOrderList({ [payId]: '' })
      })
      return
    }
    this.fetchOrderList({
      [payId]: value
    })
    this.setState({
      searchValue: value
    })
  }

  change(name, value) {
    if (name === 'payId') {
      this.setState({
        payId: value,
      })
    } else {
      let opt = this.state.searchOpt
      opt[name] = value
      this.setState({
        searchOpt: opt,
      })
    }
  }

  dateChange(dates, value) {
    let opt = this.state.searchOpt
    opt.startDate = value[0]
    opt.endDate = value[1]
    this.setState({
      searchOpt: opt
    })
  }

  exportData() {
    const { payId, searchValue } = this.state
    location.href = `${baseUrl}${api.exportOrderList}?${params2query(Object.assign({}, this.state.searchOpt, {
      pageSize: 2000,
      [payId]: searchValue
    }))}`

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
    const columns = [
      {
        title: '支付订单号',
        dataIndex: 'payOrderId',
        key: 'payOrderId'
      },
      {
        title: '平台号',
        dataIndex: 'accessBusinessPartner',
        key: 'accessBusinessPartner',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '支付金额',
        dataIndex: 'realAmount',
        key: 'realAmount',
        render: text => (
          text ? text.toFixed(2) : ''
        )
      },
      {
        title: '交易类型',
        dataIndex: 'payType',
        key: 'payType',
        render: (text) => {
          return (
            payTypeMap[text]
          )
        }
      },
      {
        title: '支付方式',
        dataIndex: 'payMethodNumber',
        key: 'payMethodNumber',
        render: (text) => {
          return (
            payMethodMap[text]
          )
        }
      },
      {
        title: '支付状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          return (
            payStatusMap[text]
          )
        }
      },
      {
        title: '交易订单号',
        dataIndex: 'outerOrderId',
        key: 'outerOrderId',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          let menu = (
            <Menu>
              <Menu.Item>
                <Link to={`${urls.USER_ORDER_DETAIL}/${record.payOrderId}`}>详情</Link>
              </Menu.Item>
            </Menu>
          )
          return (
            <div>
              <Dropdown overlay={menu} placement='bottomCenter'>
                <Icon style={{ fontSize: 18 }} type='bars'/>
              </Dropdown>
            </div>
          )
        }
      }
    ]
    const payTypeOption = Object.keys(payTypeMap).map((index) => {
      return (
        <Option key={index}>{payTypeMap[index]}</Option>
      )
    })
    const payMethodOption = Object.keys(payMethodMap).map((index) => {
      return (
        <Option key={index}>{payMethodMap[index]}</Option>
      )
    })
    const payStatusOption = Object.keys(payStatusMap).map((index) => {
      return (
        <Option key={index}>{payStatusMap[index]}</Option>
      )
    })
    const payIdOption = Object.keys(payIdMap).map((index) => {
      return (
        <Option key={index}>{payIdMap[index]}</Option>
      )
    })
    let dateFormat = 'YYYY-MM-DD'
    // let today = (function () {
    //   let date = new Date()
    //   return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    // })()
    return (
      <div style={{ position: 'relative' }} id='select-area'>
        <div style={{ paddingBottom: '20px', position: 'relative' }}>
          <span>交易类型：</span>
          <Select defaultValue='0' style={{ width: 120 }} onChange={this.change.bind(this, 'payType')}
                  getPopupContainer={() => document.getElementById('select-area')}>
            {payTypeOption}
          </Select>
          <span>　支付方式：</span>
          <Select defaultValue='0' style={{ width: 120 }} onChange={this.change.bind(this, 'payMethod')}
                  getPopupContainer={() => document.getElementById('select-area')}>
            {payMethodOption}
          </Select>
          <span>　支付状态：</span>
          <Select defaultValue='0' style={{ width: 120 }} onChange={this.change.bind(this, 'payStatus')}
                  getPopupContainer={() => document.getElementById('select-area')}>
            {payStatusOption}
          </Select>
          <span>　订单号：</span>
          <Select defaultValue='payOrderId' style={{ width: 120 }} onChange={this.change.bind(this, 'payId')}
                  getPopupContainer={() => document.getElementById('select-area')}>
            {payIdOption}
          </Select>
          <Search
            placeholder='请输入订单号查询'
            style={{ paddingLeft: 10, width: 200, verticalAlign: 'top' }}
            onSearch={this.searchByOrderId.bind(this)}
          />
          <div id='date-area' style={{ position: 'absolute', right: '5px', top: '-70px' }}>
            <span>　按日期查询：</span>
            <RangePicker getCalendarContainer={() => document.getElementById('date-area')} format={dateFormat}
                         onChange={this.dateChange.bind(this)}/>
            <Button style={{ marginLeft: '20px' }} type='primary' onClick={this.exportData.bind(this)}>批量导出</Button>
          </div>
        </div>
        <Table loading={this.state.loading} columns={columns} dataSource={this.state.orderList}
               rowKey={record => record.payOrderId} pagination={false}/>
        <Pagination onChange={this.pageChange.bind(this)} style={{ margin: '10px', textAlign: 'right' }}
                    pageSize={this.state.searchOpt.pageSize} defaultCurrent={1}
                    current={this.state.searchOpt.currentPage} total={this.state.totalSize}/>
      </div>
    )
  }
}

export default OrderList
