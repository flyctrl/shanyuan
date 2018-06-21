/*
* @Author: chengbaosheng
* @Date:   2017-08-31 15:49:33
* @Last Modified by:   baosheng
* @Last Modified time: 2017-10-16 14:16:51
*/
import React, { Component } from 'react'
import { Row, Col, Select, Input, Table, Button, Modal, message } from 'antd'
import { SuicaForm } from './suicaForm'
import style from '../style.css'
import api from 'Src/contants/api'
import fetch from 'Util/fetch'
import { returnFloat } from 'Src/contants/tooler'

const Option = Select.Option
const Search = Input.Search
const confirm = Modal.confirm
const _changeAcStatus = (st) => {
  switch (st) {
    case 0 :
      return '失效'
    case 1 :
      return '正常'
    case 2 :
      return '冻结'
    case 3 :
      return '退款中'
  }
}
const _changeSearchType = (value) => {
  switch (parseInt(value)) {
    case 1 :
      return '手机号码'
    case 2 :
      return '账号ID'
    case 3 :
      return '消费卡卡号'
  }
}
const isEmptyObject = (obj) => {
  for (var key in obj) {
    return false
  }
  return true
}
class AccStateList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modleKey: new Date().getTime(),
      visible: false,
      searchType: 1,
      searchNumber: '',
      accountInfo: {
        userNumber: '',
        accountId: '',
        mobileNo: '',
        status: '',
        balanceIn: '',
        balancePresent: '',
        balanceOut: '',
        balanceXqb: '',
      },
      dataSource: [],
    }
  }

  // 失效卡事件
  handleLose() {
    const newSource = this.state.dataSource
    let cardNumber = 0
    if (newSource.length > 0) {
      newSource.forEach((value, index) => {
        if (value.status === 1) {
          cardNumber = value.cardNo
        }
      })
    }
    if (cardNumber === 0) {
      message.warning('无有效卡')
      return
    }
    this._confirmLose(cardNumber)
  }
  _confirmLose(cardNumber) {
    const _t = this
    confirm({
      title: '提示',
      content: '是否确认将【卡' + cardNumber + '】置于失效状态',
      onOk() {
        fetch(api.cardInvalid, {
          userNumber: _t.state.accountInfo.userNumber,
          cardNumber: cardNumber
        }).then((res) => {
          if (res.code === 0) {
            const sucArt = Modal.success({
              title: '提示',
              content: '操作成功'
            })
            setTimeout(() => {
              sucArt.destroy()
            }, 800)
            _t.searchForList({ searchType: _t.state.searchType, searchNumber: _t.state.searchNumber })
          } else {
            message.error(res.errmsg)
          }
        })
      }
    })
  }

  // 账户退卡提现事件
  handleSuica() {
    this.setState({ modleKey: new Date().getTime(), visible: true })
  }
  handleModalCancel() {
    this.setState({ visible: false })
  }

  // 取消退款事件
  handleCancelRefund() {
    const _t = this
    confirm({
      title: '提示',
      content: '是否确认取消退款',
      onOk() {
        fetch(api.cardUnRefund, {
          userNumber: _t.state.accountInfo.userNumber
        }).then((res) => {
          if (res.code === 0) {
            const sucArt = Modal.success({
              title: '提示',
              content: '操作成功'
            })
            setTimeout(() => {
              sucArt.destroy()
            }, 800)
            _t.setState({ accountInfo: { ..._t.state.accountInfo, ...{ status: 1 }}})
          } else {
            message.error(res.errmsg)
          }
        })
      }
    })
  }

  // 清空账户事件
  handleClearAcc() {
    const _t = this
    confirm({
      title: '提示',
      content: '是否确认取消退款',
      onOk() {
        fetch(api.accountZero, {
          userNumber: _t.state.accountInfo.userNumber
        }).then((res) => {
          if (res.code === 0) {
            const sucArt = Modal.success({
              title: '提示',
              content: '操作成功'
            })
            setTimeout(() => {
              sucArt.destroy()
            }, 800)
            _t.setState({ accountInfo: { ..._t.state.accountInfo, ...{ status: 1, balanceIn: 0, balancePresent: 0, balanceOut: 0 }}})
          } else {
            message.error(res.errmsg)
          }
        })
      }
    })
  }

  searchForList(params = {}) {
    fetch(api.userAccountInfo, params).then((res) => {
      if (res.code === 0) {
        const data = res.data
        if (isEmptyObject(data.accountInfo)) {
          message.error('无此' + _changeSearchType(params.searchType))
          return false
        } else {
          this.setState({
            accountInfo: { ...data.accountInfo },
            dataSource: [...data.cardInfo]
          })
        }
      } else {
        message.error(res.errmsg)
      }
    })
  }
  handleSelect(value) {
    this.setState({ searchType: value })
  }
  handleSearch(value) {
    const searchType = this.state.searchType
    if (value.length === 0) {
      message.error(_changeSearchType(searchType) + '不能为空')
      return false
    }
    this.setState({ searchNumber: value })
    this.searchForList({ searchNumber: value, searchType })
  }

  handleChangeStu() {
    const _t = this
    this.setState({ accountInfo: { ..._t.state.accountInfo, ...{ status: 3 }}})
  }

  render() {
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
      render: (text, record) => {
        switch (text) {
          case 0 :
            return '失效'
          case 1 :
            return '有效'
          case 2 :
            return '冻结'
        }
      }
    }, {
      title: '发卡地点',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '运营点情况',
      dataIndex: 'content',
      key: 'content',
    }]

    const _t = this
    return (
      <div>
        <Row>
          <Col span={24}>
            <Select defaultValue='1' onChange={this.handleSelect.bind(this)} style={{ width: 100, marginRight: '10px' }}>
              <Option value='1'>手机号码</Option>
              <Option value='2'>用户ID</Option>
              <Option value='3'>消费卡卡号</Option>
            </Select>
            <Search onSearch={this.handleSearch.bind(this)} style={{ width: 200 }} />
          </Col>
        </Row>
        <Row style={{ marginTop: '15px' }}>
          <Col className={style['state-col']} span={12}><label>用户ID：</label><span>{this.state.accountInfo.userNumber}</span></Col>
          <Col className={style['state-col']} span={12}><label>账户ID：</label><span>{this.state.accountInfo.accountId}</span></Col>
          <Col className={style['state-col']} span={12}><label>用户手机号码：</label><span>{this.state.accountInfo.mobileNo}</span></Col>
          <Col className={style['state-col']} span={12}><label>账户状态：</label><span>{_changeAcStatus(_t.state.accountInfo.status)}</span></Col>
          <Col className={style['state-col']} span={12}><label>内部账户金额：</label><span>{returnFloat(this.state.accountInfo.balanceIn)}</span></Col>
          <Col className={style['state-col']} span={12}><label>优惠账户金额：</label><span>{returnFloat(this.state.accountInfo.balancePresent)}</span></Col>
          <Col className={style['state-col']} span={12}><label>外部账户金额：</label><span>{returnFloat(this.state.accountInfo.balanceOut)}</span></Col>
          <Col className={style['state-col']} span={12}><label>星球币账户金额：</label><span>{this.state.accountInfo.balanceXqb}</span></Col>
        </Row>
        <Row className={style['mgt20']}>
          <Col className={style['state-col']} span={24}><label>实体消费卡情况</label></Col>
          <Col span={24} className={style['mgt10']}>
            <Table dataSource={this.state.dataSource} columns={columns} rowKey={record => record.cardNo} />
          </Col>
        </Row>
        <Row className={style['mgt20']}>
          <Col span={8}></Col>
          {
            // <Col><Button onClick={this.handleCancelRefund.bind(this)}>取消退款</Button><Button onClick={this.handleClearAcc.bind(this)} type='primary' className={style['mgl20']}>清空账户</Button></Col>
            this.state.accountInfo.status === 3 ? null
            : (<Col><Button onClick={this.handleLose.bind(this)} type='primary'>失效卡</Button><Button onClick={this.handleSuica.bind(this)} type='primary' className={style['mgl20']}>账户退卡/提现</Button></Col>)
          }
          <Col span={8}></Col>
        </Row>
        <Modal
          key={this.state.modleKey}
          visible={this.state.visible}
          title='退卡 / 提现信息录入'
          onCancel={this.handleModalCancel.bind(this)}
          footer={null}
        >
        <SuicaForm userNumber={this.state.accountInfo.userNumber} onCancel={this.handleModalCancel.bind(this)} onChangeStatus={this.handleChangeStu.bind(this)} />
        </Modal>
      </div>
    )
  }
}

export default AccStateList
