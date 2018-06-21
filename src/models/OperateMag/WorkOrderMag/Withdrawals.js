/**
 * @Author: sunshiqiang
 * @Date: 2017-09-28 16:13:23
 * @Title: 工单详情（提现）
 */

import React, { Component } from 'react'
import api from 'Src/contants/api'
import { Button, Table, Row, Col, Popconfirm } from 'antd'
import { getQueryString, addCommas } from 'Contants/tooler'

class Withdrawals extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: getQueryString('id'),
      baseInfo: {},
      userInfo: {},
      accountInfo: {},
      cardInfo: [],
    }
  }

  componentWillMount = async () => {
    this._loadBaseInfo()
    const data = await this._loadUserInfo()
    this._loadWOrderCon(data)
  }

  handleAudit = async (e, result) => {
    await api.operateMag.workOrderMag.Withdrawals.audit({
      id: this.state.id,
      result
    })
    this._loadBaseInfo()
    const data = await this._loadUserInfo()
    this._loadWOrderCon(data)
  }

  // 工单基本信息
  _loadBaseInfo = async () => {
    const baseInfo = await api.operateMag.workOrderMag.Withdrawals.baseInfo({
      id: this.state.id,
    }) || {}
    this.setState({ baseInfo })
  }

  // 提现信息
  _loadUserInfo = async () => {
    const data = await api.operateMag.workOrderMag.Withdrawals.list({
      applyId: this.state.id,
      pageSize: '10',
      currentPage: '1',
    }) || {}
    const userInfo = data.changeOrderInfos && data.changeOrderInfos[0] ? data.changeOrderInfos[0] : {}
    this.setState({ userInfo })
    return userInfo.userId
  }

  // 工单内容
  _loadWOrderCon = async (searchNumber) => {
    const wOrderCon = await api.operateMag.workOrderMag.Withdrawals.userAccountInfo({
      searchNumber,
      searchType: 2
    }) || {}
    const accountInfo = wOrderCon.accountInfo || {}
    const cardInfo = wOrderCon.cardInfo || []
    this.setState({ accountInfo, cardInfo })
  }

  render() {
    const style0 = { width: '100px', display: 'inline-block', lineHeight: '2em' }
    const { accountInfo, cardInfo, baseInfo, userInfo } = this.state
    const columns = [{
      title: '卡号',
      dataIndex: 'cardNo',
      key: 'cardNo',
    }, {
      title: '发卡时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: '卡状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => <span>{['失效', '绑定', '冻结'][text]}</span>
    }, {
      title: '发卡地点',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '运营点情况',
      dataIndex: 'content',
      key: 'content',
    }]
    return <div>
      <Row>工单基本信息</Row>
      <Row style={{ marginBottom: '15px' }}>
        <Col span={7} offset={3}><span style={style0}>工单号</span><span>{baseInfo.id}</span></Col>
        <Col span={7}><span style={style0}>工类类型</span>{['', '充值', '提现'][baseInfo.workType]}</Col>
        <Col span={7}><span style={style0}>工单状态</span>{['', '待处理', '', '已完成', '已撤销', ''][baseInfo.workStatus]}</Col>
        <Col span={7} offset={3}><span style={style0}>提单时间</span><span>{baseInfo.gmtCreated}</span></Col>
        <Col span={7}><span style={style0}>发起人</span>{baseInfo.applyUserName}</Col>
        <Col span={7} offset={3}><span
          style={style0}>审核人</span><span>{[3, 4].indexOf(baseInfo.workStatus) !== -1 ? baseInfo.applyUserName : ''}</span></Col>
      </Row>
      <Row>工单内容</Row>
      <Row style={{ marginBottom: '15px' }}>
        <Col span={7} offset={3}><span style={style0}>用户ID</span><span>{accountInfo.userNumber}</span></Col>
        <Col span={7}><span style={style0}>账户ID</span>{accountInfo.accountId}</Col>
        <Col span={7}><span style={style0}>用户手机号码</span>{accountInfo.mobileNo}</Col>
        <Col span={7} offset={3}><span
          style={style0}>账户状态</span><span>{['失效', '正常', '冻结', '提现中'][accountInfo.status]}</span></Col>
        <Col span={24} style={{ height: '20px' }}/>
        <Col span={7} offset={3}><span style={style0}>内部账户金额</span><span>{addCommas(accountInfo.balanceIn)}</span></Col>
        <Col span={7}><span style={style0}>优惠账户金额</span>{addCommas(accountInfo.balancePresent)}</Col>
        <Col span={7}><span style={style0}>外部账户金额</span>{addCommas(accountInfo.balanceOut)}</Col>
        <Col span={7} offset={3}><span style={style0}>星球币账户金额</span><span>{addCommas(accountInfo.balanceXqb)}</span></Col>
        <Col span={21} offset={3} style={{ marginTop: '20px' }}>实体消费卡情况</Col>
        <Col span={21} offset={3} style={{ marginTop: '15px' }}>
          <Table
            columns={columns}
            rowKey='id'
            dataSource={cardInfo}
            pagination={false}
          />
        </Col>
      </Row>
      <Row>提现信息</Row>
      <Row style={{ marginBottom: '30px' }}>
        <Col span={7} offset={3}><span style={style0}>用户姓名</span><span>{userInfo.userName}</span></Col>
        <Col span={7}><span style={style0}>用户手机号码</span>{userInfo.phone}</Col>
        <Col span={7}><span style={style0}>用户身份证号</span>{userInfo.idNo}</Col>
        {userInfo.recvAcctType === 4 ? <Col span={7} offset={3}><span style={style0}>银行卡号</span><span>{userInfo.recvAcctNo}</span></Col> : null}
        <Col span={7}><span style={style0}>开户行</span>{userInfo.recverName}</Col>
        <Col span={7}><span style={style0}>提现金额</span>{addCommas(userInfo.amount)}</Col>
      </Row>
      {baseInfo.workStatus === 1 ? <div style={{ textAlign: 'center' }}>
        <Popconfirm title='确认撤销?' onConfirm={e => this.handleAudit(e, 2)} okText='是' cancelText='否'>
          <Button style={{ marginRight: '15px' }}>撤销操作</Button>
        </Popconfirm>
        <Popconfirm title='确认清空账户?' onConfirm={e => this.handleAudit(e, 1)} okText='是' cancelText='否'>
          <Button type='primary'>清空账户</Button>
        </Popconfirm>
      </div> : null}
    </div>
  }
}

export default Withdrawals
