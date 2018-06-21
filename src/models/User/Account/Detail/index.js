/**
 * Created by Webstorm.
 * @author taoqili
 * @date 2017/8/16
 */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Button } from 'antd'
import * as urls from 'Src/contants/url'
import fetch from 'Src/utils/fetch'
import api from 'Src/contants/api'

class AccountDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      accountId: props.match.match.params.accountId,
      accountDetail: {
        balance: 0,
        balanceIn: 0,
        balanceOut: 0,
        balancePresent: 0,
        balanceXqb: 0
      },
      cardInfo: []
    }
  }
  componentDidMount() {
    this.fetchAccountDetail()
  }
  fetchAccountDetail() {
    fetch(api.getUserAccountDetail, { userNumber: this.state.accountId }).then(res => {
      if (res.code === 0 && res.data) {
        this.setState({
          accountDetail: res.data.accountInfo,
          cardInfo: res.data.cardInfo
        })
      }
    })
  }
  render() {
    let accountDetail = this.state.accountDetail
    let cardInfo = this.state.cardInfo
    let columns = [
      {
        title: '卡号',
        dataIndex: 'cardNo',
        key: 'cardNo',
      },
      {
        title: '发卡时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '卡状态',
        dataIndex: 'status',
        key: 'status',
        render: text => (
          { '0': '失效', '1': '绑定', '2': '冻结' }[text]
        )
      },
      {
        title: '发卡地点',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '运营点情况',
        dataIndex: 'content',
        key: 'content',
      }
    ]
    let cardInfoComponent = cardInfo && cardInfo.length
      ? (
        <div>
          <p style={{ fontSize: '16px', lineHeight: 3 }}>实体消费卡情况</p>
          <Table columns={columns} dataSource={this.state.cardInfo}/>
        </div>
      )
      : ''
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', fontSize: '16px', right: 0, top: '-68px' }}>
          用户ID:  &nbsp; {accountDetail.userNumber}
        </div>
        <Row style={{ fontSize: '15px', lineHeight: 3 }} >
          <Col span={12}>账户情况</Col>
          <Col span={12}>
            <Link to={ `${urls.USER_TRANSACTION_LIST}/${this.state.accountId}` }>
              <Button type='primary'>交易记录</Button>
            </Link>
            <Link to={ `${urls.USER_STARCOIN_LIST}/${this.state.accountId}` }>
              <Button type='primary' style={{ 'marginLeft': 20 }}>星球币记录</Button>
            </Link>
          </Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} style={{ color: '#108ee9' }}>账户ID: </Col>
          <Col span={9}>{ accountDetail.accountId }</Col>
          <Col span={3} style={{ color: '#108ee9' }}>账户金额:</Col>
          <Col span={9}>{ accountDetail.balance.toFixed(2) }</Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} style={{ color: '#108ee9' }}>内部账户金额:</Col>
          <Col span={9}>{ accountDetail.balanceIn.toFixed(2) }</Col>
          <Col span={3} style={{ color: '#108ee9' }}>优惠账户金额:</Col>
          <Col span={9}>{ accountDetail.balancePresent.toFixed(2) }</Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} style={{ color: '#108ee9' }}>外部账户金额:</Col>
          <Col span={9}> { accountDetail.balanceOut.toFixed(2)}</Col>
          <Col span={3} style={{ color: '#108ee9' }}>星球币账户金额:</Col>
          <Col span={9}>{ accountDetail.balanceXqb.toFixed(2) }</Col>
        </Row>
        {cardInfoComponent}
      </div>
    )
  }
}
export default AccountDetail
