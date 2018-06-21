/*
* @Author: baosheng
* @Date:   2017-10-09 13:54:40
* @Last Modified by:   baosheng
* @Last Modified time: 2017-10-13 15:06:54
*/

import React, { Component } from 'react'
import api from 'Src/contants/api'
import { baseUrl } from 'Util/index'
import { Row, Col, Table, Button, Popconfirm } from 'antd'
import { getQueryString, addCommas } from 'Contants/tooler'

class Recharge extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: getQueryString('id'),
      tableList: {},
      detial: {}
    }
    console.log(this.state)
  }

  componentWillMount() {
    this._loadDetial()
    this._loadList()
  }

  handlePaginationChange = (currentPage) => {
    this._loadList({ currentPage })
  }

  handleAudit = async (e, result) => {
    await api.operateMag.workOrderMag.Recharge.audit({
      id: this.state.id,
      result
    })
    this._loadDetial()
    this._loadList()
  }

  _loadDetial = async () => {
    const detial = await api.operateMag.workOrderMag.Recharge.detial({
      id: this.state.id,
    }) || {}
    this.setState({ detial })
  }
  _loadList = async (params = {}) => {
    const tableList = await api.operateMag.workOrderMag.Recharge.list({
      applyId: this.state.id,
      pageSize: '10',
      currentPage: params.currentPage || '1',
    }) || {}
    this.setState({ tableList })
  }

  render() {
    const style0 = { width: '100px', display: 'inline-block', lineHeight: '2em' }
    const { tableList, detial, id } = this.state
    const columns = [{
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '充值账户',
      dataIndex: 'recvAcctType',
      key: 'recvAcctType',
      render: (text) => <span>{['', '外部账户', '内部账户', '星球币'][text]}</span>
    }, {
      title: '充值金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => <span>{addCommas(text)}</span>
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    }]
    if (detial.workStatus !== 1) {
      columns.push({
        title: '充值结果',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        render: (text) => <span>{['', '', '', '成功', '撤销', '失败'][text]}</span>
      })
    }
    return <div>
      <Row>工单基本信息 <a style={{ float: 'right' }}
                     href={`${baseUrl}${api.operateMag.workOrderMag.Recharge.export}${id}`}
                     download><Button type='primary'>批量导出</Button></a> </Row>
      <Row style={{ marginBottom: '15px' }}>
        <Col span={7} offset={3}><span style={style0}>工单号</span><span>{detial.id}</span></Col>
        <Col span={7}><span style={style0}>工类类型</span>{['', '充值', '提现'][detial.workType]}</Col>
        <Col span={7}><span style={style0}>工单状态</span>{['', '待处理', '', '已完成', '已撤销', ''][detial.workStatus]}</Col>
        <Col span={7} offset={3}><span style={style0}>提单时间</span><span>{detial.gmtCreated}</span></Col>
        <Col span={7}><span
          style={style0}>完成时间</span>{[3, 4].indexOf(detial.workStatus) !== -1 ? detial.gmtModified : ''}</Col>
        <Col span={7}><span style={style0}>发起人</span>{detial.applyUserName}</Col>
        <Col span={7} offset={3}><span
          style={style0}>受理人</span><span>{[3, 4].indexOf(detial.workStatus) !== -1 ? detial.applyUserName : ''}</span></Col>
      </Row>
      <Row>充值信息</Row>
      <Row style={{ marginBottom: '15px', marginTop: '15px' }}>
        <Col span={21} offset={3}>
          {tableList.changeOrderInfos ? <Table
            columns={columns}
            rowKey='id'
            dataSource={tableList.changeOrderInfos}
            pagination={{
              showQuickJumper: true,
              total: tableList.page.totalRowsAmount,
              onChange: this.handlePaginationChange,
              pageSize: 10,
              currentPage: tableList.page.currentPage
            }}
          /> : null}
        </Col>
      </Row>
      {detial.workStatus === 1 ? <div style={{ textAlign: 'center' }}>
        <Popconfirm title='确认撤销?' onConfirm={e => this.handleAudit(e, 2)} okText='是' cancelText='否'>
          <Button style={{ marginRight: '15px' }}>撤销操作</Button>
        </Popconfirm>
        <Popconfirm title='确认充值?' onConfirm={e => this.handleAudit(e, 1)} okText='是' cancelText='否'>
          <Button type='primary'>确认充值</Button>
        </Popconfirm>
      </div> : null}
    </div>
  }
}

export default Recharge
