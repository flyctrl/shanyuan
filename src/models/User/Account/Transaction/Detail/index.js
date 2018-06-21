/**
 * Created by Webstorm.
 * @author taoqili
 * @date 2017/8/16
 */
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Row, Col, Table } from 'antd'
// import * as urls from 'Src/contants/url'
import { payTypeMap } from '../../../nameMaps'
import fetch from 'Util/fetch.js'
import api from 'Src/contants/api'

class TransactionDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userNumber: props.match.match.params.transactionId,
      payOrderId: props.match.match.params.payOrderId,
      log: [],
      transactionDetail: {
        tradeBalance: 0
      }
    }
  }
  componentDidMount() {
    this.fetchTransactionDetail()
  }
  fetchTransactionDetail() {
    fetch(api.getUserTransactionDetail, { userNumber: this.state.userNumber, payOrderId: this.state.payOrderId }).then(res => {
      if (res.code === 0 && res.data && res.data.beforeTradeLog && res.data.tradeLog && res.data.afterTradeLog) {
        let before = res.data.beforeTradeLog
        let nowData = res.data.tradeLog
        let after = res.data.afterTradeLog
        let log = (function() {
          let map = {
            'before': { title: '变动前', data: before },
            'nowData': { title: '变动金额', data: nowData },
            'after': { title: '变动后', data: after }
          }
          let ret = []
          Object.keys(map).forEach((index) => {
            let item = map[index]
            let data = item.data
            ret.push({
              type: item.title,
              balanceMain: data.balanceMain.toFixed(2),
              balanceIn: data.balanceIn.toFixed(2),
              balanceOut: data.balanceOut.toFixed(2),
              balancePresent: data.balancePresent.toFixed(2),
            })
          })
          return ret
        })()
        this.setState({
          transactionDetail: res.data,
          log: log
        })
      } else {
        this.setState({
          transactionDetail: {
            tradeBalance: 0
          },
          log: []
        })
      }
    })
  }
  render() {
    let detail = this.state.transactionDetail
    const columns = [
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: '总金额',
        dataIndex: 'balanceMain',
        key: 'balanceMain',
      },
      {
        title: '内部账户',
        dataIndex: 'balanceIn',
        key: 'balanceIn',
      },
      {
        title: '外部账户',
        dataIndex: 'balanceOut',
        key: 'balanceOut',
      },
      {
        title: '优惠账户',
        dataIndex: 'balancePresent',
        key: 'balancePresent'
      }
    ]
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', fontSize: '20px', right: 0, fontWeight: '800', top: '-68px' }}>
          用户ID:  &nbsp; {this.state.userNumber}
        </div>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} style={{ color: '#108ee9' }}>交易订单号: </Col>
          <Col span={9}>{ detail.outerOrderId }</Col>
          <Col span={3} style={{ color: '#108ee9' }}>支付订单号:</Col>
          <Col span={9}>{ detail.payOrderId }</Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} style={{ color: '#108ee9' }}>交易时间:</Col>
          <Col span={9}>{ detail.outerOrderCreateTime }</Col>
          <Col span={3} style={{ color: '#108ee9' }}>交易类型:</Col>
          <Col span={9}>{ payTypeMap[detail.payType] }</Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} style={{ color: '#108ee9' }}>交易金额</Col>
          <Col span={9}>{ detail.tradeBalance.toFixed(2) }</Col>
          <Col span={3} style={{ color: '#108ee9' }}></Col>
          <Col span={9}></Col>
        </Row>
        <Table columns={columns} dataSource={this.state.log}/>
      </div>
    )
  }
}
export default TransactionDetail
