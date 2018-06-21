/**
 * Created by Webstorm.
 * @author taoqili
 * @date 2017/8/16
 */
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import fetch from 'Src/utils/fetch'
import api from 'Src/contants/api'
import { payTypeMap, payMethodMap, payStatusMap } from '../../nameMaps'

class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      payOrderId: props.match.match.params.orderId,
      orderDetail: {
        realAmount: 0
      }
    }
  }
  componentDidMount() {
    this.fetchOrderDetail()
  }
  fetchOrderDetail() {
    fetch(api.getUserOrderDetail, { payOrderId: this.state.payOrderId }).then(res => {
      if (res.code === 0 && res.data) {
        this.setState({
          orderDetail: res.data
        })
      }
    })
  }
  render() {
    let detail = this.state.orderDetail || {}
    return (
      <div>
        <h3>订单详情</h3>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} offset={1} style={{ color: '#108ee9' }}>支付订单ID: </Col>
          <Col span={9}>{ detail.payOrderId }</Col>
          <Col span={3} style={{ color: '#108ee9' }}>交易订单ID: </Col>
          <Col span={8}>{ detail.outerOrderId }</Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} offset={1} style={{ color: '#108ee9' }}>平台号:</Col>
          <Col span={9}>{ detail.accessBusinessPartner }</Col>
          <Col span={3} style={{ color: '#108ee9' }}>业务号:</Col>
          <Col span={8}>{ detail.bussinessNo }</Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} offset={1} style={{ color: '#108ee9' }}>交易主体ID:</Col>
          <Col span={9}>{ detail.userNumber }</Col>
          <Col span={3} style={{ color: '#108ee9' }}>交易对手ID:</Col>
          <Col span={8}>{ detail.shopNum }</Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} offset={1} style={{ color: '#108ee9' }}>交易类型:</Col>
          <Col span={9}>{ payTypeMap[detail.payType] }</Col>
          <Col span={3} style={{ color: '#108ee9' }}>订单状态:</Col>
          <Col span={8}>{ payStatusMap[detail.status] }</Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} offset={1} style={{ color: '#108ee9' }}>支付金额:</Col>
          <Col span={9}>{ detail.realAmount.toFixed(2) }</Col>
          <Col span={3}></Col>
          <Col span={8}></Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} offset={1} style={{ color: '#108ee9' }}>支付方式:</Col>
          <Col span={9}>{ payMethodMap[detail.payMethodNumber] }</Col>
          <Col span={3} style={{ color: '#108ee9' }}>支付通道:</Col>
          <Col span={8}>{ payMethodMap[detail.payMethodNumber] }</Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} offset={1} style={{ color: '#108ee9' }}>银行卡ID:</Col>
          <Col span={9}>{ detail.cardId }</Col>
          <Col span={3}></Col>
          <Col span={8}></Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} offset={1} style={{ color: '#108ee9' }}>通道提交时间:</Col>
          <Col span={9}>{ detail.createTime }</Col>
          <Col span={3}></Col>
          <Col span={8}></Col>
        </Row>
        <Row style={{ lineHeight: 4 }}>
          <Col span={3} offset={1} style={{ color: '#108ee9' }}>通道支付时间:</Col>
          <Col span={9}>{ detail.payTime }</Col>
          <Col span={3}></Col>
          <Col span={8}></Col>
        </Row>
        <hr/>
        <h4 style={{ lineHeight: 2, marginTop: 10 }}>数据字典</h4>
        <Row>
          <Col span={18}>*交易主体：发起交易的一方，通常为个人</Col>
          <Col span={18}>*交易对手：交易主体的收款方或付款方，通常为商户</Col>
        </Row>
      </div>
    )
  }
}

export default OrderDetail
