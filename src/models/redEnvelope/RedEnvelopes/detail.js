/**
 * @Author: sunshiqiang
 * @Date: 2018-01-25 16:36:47
 * @Title: 红包详情
 */

import React, { Component } from 'react'
import { Row, Col, Table } from 'antd'
import api from 'Contants/api'
import styles from './detail.css'
import { getQueryString } from 'Contants/tooler'

class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: getQueryString('id'),
      tableList: {},
      detaildata: {}
    }
  }

  componentWillMount() {
    this._loadDetailData()
    this._loadList()
  }

  _loadDetailData = async () => {
    const detaildata = await api.redEnvelope.redEnvelopes.detail({
      id: this.state.id
    }) || {}
    this.setState({ detaildata })
  }
  _loadList = async (currentPage = 1) => {
    const tableList = await api.redEnvelope.redEnvelopes.receive({
      pageSize: '10',
      currentPage,
      id: this.state.id
    }) || {}
    this.setState({ tableList })
  }

  render() {
    const { tableList, detaildata } = this.state
    const columns = [{
      title: '领取人ID',
      dataIndex: 'userNo',
      key: 'userNo',
    }, {
      title: '领取时间',
      dataIndex: 'gmtCreated',
      key: 'gmtCreated',
    }, {
      title: '领取金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => <span>{text.toFixed(2)}</span>,
    }, {
      title: '领取类型',
      dataIndex: 'operateType',
      key: 'operateType',
      render: (text) => <span>{['', '领取', '退还'][text]}</span>,
    }, {
      title: '支付订单号',
      dataIndex: 'payOrderId',
      key: 'payOrderId',
    }, {
      title: '领取订单号',
      dataIndex: 'id',
      key: 'id',
    }]
    return <div className={styles.layout}>
      <Row className={styles.title}>红包发放详情：</Row>
      <Row>
        <Col span={12}>
          <div className={styles.left}>
            <p><span>发放订单ID</span><span>{detaildata.packetNo}</span></p>
            <p><span>平台号</span><span>{detaildata.sysNo}</span></p>
            <p><span>红包类型</span><span>{['', '定额红包', '拼手气红包'][detaildata.packetType]}</span></p>
            <p><span>发放总金额</span><span>{detaildata.totalAmount && detaildata.totalAmount.toFixed(2)}</span></p>
            <p><span>剩余金额</span><span>{detaildata.leftAmount && detaildata.leftAmount.toFixed(2)}</span></p>
            <p><span>红包状态</span><span>{[5, 6].indexOf(detaildata.packetStatus) !== -1 ? '过期' : '有效'}</span></p>
            <p><span>红包发放时间</span><span>{detaildata.gmtCreated}</span></p>
            <p><span>完整领取时间</span><span>{detaildata.lastDrawnTime}</span></p>
          </div>
        </Col>
        <Col span={12} className={styles.right}>
          <p><span>支付订单ID</span><span>{detaildata.payOrderId}</span></p>
          <p><span>红包发放主体ID</span><span>{detaildata.userNo}</span></p>
          <p><span>单个红包金额</span><span>{detaildata.maxSingleAmount && detaildata.maxSingleAmount.toFixed(2)}</span></p>
          <p><span>发放数量</span><span>{detaildata.totalNumber}</span></p>
          <p><span>剩余数量</span><span>{detaildata.leftNumber}</span></p>
          <p><span>备注</span><span>{detaildata.attachedInfo}</span></p>
          <p><span>过期时间</span><span>{detaildata.expireTime}</span></p>
        </Col>
      </Row>
      <Row className={styles.title}>数据字典：</Row>
      <Row>
        <Col offset={2} span={22}>*红包发放主体：发放红包的一方，通常为个人</Col>
        <Col offset={2} span={22}>*完整领取时间：最后一个红包的领取时间</Col>
      </Row>
      <Row className={styles.table}>
        <Col span={24} className={styles.title}>红包领取详情:</Col>
        <Col span={24}><Table
          columns={columns}
          rowKey='id'
          dataSource={tableList.redpacketOperateResps}
          pagination={{
            showQuickJumper: true,
            total: tableList.page && tableList.page.totalRowsAmount,
            onChange: this._loadList,
            pageSize: tableList.page && tableList.page.pageSize || 10,
            current: tableList.page && tableList.page.currentPage
          }}/>
        </Col>
      </Row>
    </div>
  }
}

export default Detail
