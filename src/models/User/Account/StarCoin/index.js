/*
* @Author: chengbs
* @Date:   2018-03-01 16:48:45
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-14 15:11:28
*/
import React, { Component } from 'react'
import { Table, DatePicker, Pagination, message } from 'antd'
import fetch from 'Src/utils/fetch'
import api from 'Src/contants/api'
const RangePicker = DatePicker.RangePicker

class StarcoinList extends Component {
  constructor(props) {
    super(props)
    let accountId = props.match.match.params.accountId
    this.state = {
      accountId: accountId,
      transactionList: [],
      loading: false,
      totalSize: 1,
      searchOpt: {
        userNo: accountId,
        currentPage: 1,
        pageSize: 10,
        endDate: '',
        startDate: ''
      }
    }
  }
  // componentDidMount() {
  //   this.fetchTransactionList()
  // }
  dateChange(dates, value) {
    let opt = this.state.searchOpt
    opt.startDate = value[0] || ''
    opt.endDate = value[1] || ''
    opt.currentPage = 1
    this.fetchTransactionList(opt)
    this.setState({
      searchOpt: opt
    })
  }
  pageChange(page) {
    let opt = this.state.searchOpt
    opt.currentPage = page
    this.fetchTransactionList(opt)
    this.setState({
      searchOpt: opt
    })
  }
  fetchTransactionList(params) {
    this.setState({
      loading: true
    })
    fetch(api.accountXQBTradeList, Object.assign({
      currentPage: 1,
      pageSize: 20
    }, params || {})).then(res => {
      this.setState({
        loading: false
      })
      if (res.code === 0 && res.data) {
        if (res.data.code === 0) {
          this.setState({
            totalSize: res.data.data.page.totalRowsAmount,
            transactionList: res.data.data.tradeList
          })
        } else {
          this.setState({
            transactionList: [],
            totalSize: 1
          })
          message.error(res.data.errmsg, 2)
        }
      } else {
        this.setState({
          transactionList: [],
          totalSize: 1
        })
        message.error(res.errmsg, 2)
      }
    })
  }
  render() {
    const columns = [
      {
        title: '交易时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },
      {
        title: '变动数量',
        dataIndex: 'transAmount',
        key: 'transAmount',
      },
      {
        title: '变动前数量',
        dataIndex: 'preBalance',
        key: 'preBalance'
      },
      {
        title: '变动后数量',
        dataIndex: 'balance',
        key: 'balance'
      },
      {
        title: '交易类型',
        dataIndex: 'cdflag',
        key: 'cdflag',
        render: (text) => {
          return (
            { 'C': '增加', 'D': '减少' }[text]
          )
        }
      },
      {
        title: '备注',
        dataIndex: 'memo',
        key: 'memo'
      }
    ]

    let dateFormat = 'YYYY-MM-DD'
    return (
      <div style={{ position: 'relative', paddingBottom: '30px' }}>
        <div style={{ paddingBottom: '20px' }}>
          按照日期查询： <RangePicker format={ dateFormat } onChange={this.dateChange.bind(this)}/>
        </div>
        <div style={{ position: 'absolute', fontSize: '20px', right: 0, fontWeight: '800', top: '-68px' }}>
          用户ID:  &nbsp; {this.state.accountId}
        </div>
        <div>
          <Table loading={this.state.loading} rowKey='id' columns={columns} dataSource={this.state.transactionList} pagination= { false } />
          <Pagination onChange={this.pageChange.bind(this)} style={{ margin: '10px', cssFloat: 'right' }} pageSize={this.state.searchOpt.pageSize} defaultCurrent={1} current={this.state.searchOpt.currentPage} total={this.state.totalSize}/>
        </div>
      </div>
    )
  }
}
export default StarcoinList
