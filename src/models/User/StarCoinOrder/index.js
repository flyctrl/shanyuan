/*
* @Author: chengbs
* @Date:   2018-03-05 15:38:52
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-22 18:32:24
*/
import React, { Component } from 'react'
import { Table, Input, Select, DatePicker, Pagination, message } from 'antd'
import fetch from 'Util/fetch.js'
import api from 'Src/contants/api'
import { starPayIdMap, starAccountIdMap } from '../nameMaps'

const Search = Input.Search
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

class StarCoinOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderList: [],
      loading: true,
      totalSize: 1,
      payId: 'recordNo',
      userId: 'userNo',
      paySearchValue: '',
      userSearchValue: '',
      searchOpt: {
        currentPage: 1,
        pageSize: 10,
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
    const { payId, userId, paySearchValue, userSearchValue, searchOpt } = this.state
    fetch(api.accountXQBExchangeList, {
      currentPage: 1,
      pageSize: 10,
      ...searchOpt,
      [payId]: paySearchValue,
      [userId]: userSearchValue,
      ...params
    }).then(res => {
      this.setState({
        loading: false
      })
      if (res.code === 0 && res.data) {
        this.setState({
          totalSize: res.data.data.page.totalRowsAmount,
          orderList: res.data.data.tradeList
        })
      } else {
        message.error(res.errmsg)
      }
    })
  }

  searchByOrderId(mark, value) {
    let payVal = this.refs.paySearch.input.refs.input.value
    let userVal = this.refs.userSearch.input.refs.input.value

    if (!value.replace(/^\s|\s$/, '')) {
      let searchOpt = this.state.searchOpt
      let searchInput = { userNo: '', accountNo: '', recordNo: '', payOrderId: '' }
      searchOpt.currentPage = 1
      this.setState({
        searchOpt
      })
      if (mark === 'user') { // 点击用户搜索
        if (payVal !== '') { // 支付不为空
          searchInput = { userNo: '', accountNo: '' }
          this.setState({
            userSearchValue: ''
          })
        } else {
          this.setState({
            paySearchValue: '',
            userSearchValue: ''
          })
        }
      } else if (mark === 'pay') { // 点击支付搜索
        if (userVal !== '') { // 用户不为空
          searchInput = { recordNo: '', payOrderId: '' }
          this.setState({
            paySearchValue: ''
          })
        } else {
          this.setState({
            paySearchValue: '',
            userSearchValue: ''
          })
        }
      }
      this.fetchOrderList(searchInput)
      return
    }

    if (mark === 'user') {
      const { userId, payId } = this.state
      this.fetchOrderList({
        [userId]: value,
        [payId]: payVal,
        currentPage: 1
      })
      this.setState({
        userSearchValue: value,
        paySearchValue: payVal
      })
    } else if (mark === 'pay') {
      const { payId, userId } = this.state
      this.fetchOrderList({
        [payId]: value,
        [userId]: userVal,
        currentPage: 1
      })
      this.setState({
        paySearchValue: value,
        userSearchValue: userVal
      })
    }
  }

  change(name, value) {
    if (name === 'payId') {
      this.setState({
        payId: value,
      })
    } else if (name === 'userId') {
      this.setState({
        userId: value,
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

  render() {
    const columns = [
      {
        title: '兑换记录号',
        dataIndex: 'recordNo',
        key: 'recordNo'
      },
      {
        title: '用户ID',
        dataIndex: 'userNo',
        key: 'userNo',
      },
      {
        title: '账户ID',
        dataIndex: 'accountNo',
        key: 'accountNo',
      },
      {
        title: '兑换时间',
        dataIndex: 'exchangeDate',
        key: 'exchangeDate'
      },
      {
        title: '兑换数量',
        dataIndex: 'exchangeNumber',
        key: 'exchangeNumber'
      },
      {
        title: '支付订单号',
        dataIndex: 'payOrderId',
        key: 'payOrderId'
      },
      {
        title: '支付状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
        render: (text) => {
          return (
            { 1: '待支付', 2: '已支付' }[text]
          )
        }
      }
    ]
    const payIdOption = Object.keys(starPayIdMap).map((index) => {
      return (
        <Option key={index}>{starPayIdMap[index]}</Option>
      )
    })
    const accountIdOption = Object.keys(starAccountIdMap).map((index) => {
      return (
        <Option key={index}>{starAccountIdMap[index]}</Option>
      )
    })
    let dateFormat = 'YYYY-MM-DD'
    return (
      <div style={{ position: 'relative' }} id='select-area'>
        <div style={{ paddingBottom: '20px', position: 'relative' }}>
          <Select defaultValue='userNo' style={{ width: 90 }} onChange={this.change.bind(this, 'userId')}
                  getPopupContainer={() => document.getElementById('select-area')}>
            {accountIdOption}
          </Select>
          <Search
            placeholder='请输入ID查询'
            ref='userSearch'
            style={{ paddingLeft: 5, width: 180, verticalAlign: 'top' }}
            onSearch={this.searchByOrderId.bind(this, 'user')}
          />
          <Select defaultValue='recordNo' style={{ width: 90, marginLeft: 20 }} onChange={this.change.bind(this, 'payId')}
                  getPopupContainer={() => document.getElementById('select-area')}>
            {payIdOption}
          </Select>
          <Search
            placeholder='请输入订单号查询'
            ref='paySearch'
            style={{ paddingLeft: 5, width: 180, verticalAlign: 'top' }}
            onSearch={this.searchByOrderId.bind(this, 'pay')}
          />
          <div id='date-area' style={{ position: 'absolute', left: '580px', top: '0px' }}>
            <RangePicker getCalendarContainer={() => document.getElementById('date-area')} format={dateFormat}
                         onChange={this.dateChange.bind(this)}/>
          </div>
        </div>
        <Table loading={this.state.loading} columns={columns} dataSource={this.state.orderList}
               rowKey={record => record.recordNo} pagination={false}/>
        <Pagination onChange={this.pageChange.bind(this)} style={{ margin: '10px', textAlign: 'right' }}
                    pageSize={this.state.searchOpt.pageSize} defaultCurrent={1}
                    current={this.state.searchOpt.currentPage} total={this.state.totalSize}/>
      </div>
    )
  }
}

export default StarCoinOrder
