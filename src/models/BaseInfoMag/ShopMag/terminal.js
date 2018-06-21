/*
* @Author: chengbaosheng
* @Date:   2017-08-17 16:01:11
* @Last Modified by:   chengbaosheng
* @Last Modified time: 2017-09-12 13:15:19
*/
import React, { Component } from 'react'
import { Table, Icon, Modal, Row, Col, Button } from 'antd'
import style from '../style.css'
import axios from 'axios'
// import fetch from 'Util/fetch'
import api from 'Src/contants/api'

function addNewEle(jsonAry, addJson) {
  let newJsonAry = []
  try {
    jsonAry.map((jsonArys, index) => {
      if (typeof addJson !== 'undefined') {
        for (let key in addJson) {
          jsonArys[key] = addJson[key]
        }
      }
      newJsonAry.push(jsonArys)
    })
    return newJsonAry
  } catch (e) {
    alert(e.name + ':' + e.message)
  }
}

class Terminal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temaData: [],
      deviceData: [],
      visible: false,
      selectData: []
    }

    this.temaColumns = [{
      title: 'ID',
      dataIndex: 'Id',
      key: 'Id',
    }, {
      title: '名称',
      dataIndex: 'devName',
      key: 'devName',
    }, {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record, index) => {
        return (
          <input onChange={this.hadleAmount.bind(this, index)} style={{ width: '30%', textAlign: 'center', borderRadius: '3px', border: '1px solid #D9D9D9' }} value={text} />
        )
      }
    }, {
      title: '操作',
      key: 'action',
      render: (text, record, index) => (
        <a className={style['tem-action-btn']} onClick={this.hadleDelClick.bind(this, index)}><Icon type='minus-circle-o' /></a>
      ),
    }]

    this.deviceColumns = [{
      title: 'ID',
      dataIndex: 'Id',
      key: 'Id'
    }, {
      title: '名称',
      dataIndex: 'devName',
      key: 'devName'
    }]
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.temaData) {
      this.setState({ temaData: nextProps.temaData })
    }
  }

  componentWillMount() {
    if (this.props.temaData) {
      this.setState({ temaData: this.props.temaData })
    }

    const _t = this
    axios(api.getTerminalDeviceList, {
      method: 'GET'
    }).then(function(data) {
      const res = data['data']
      if (res.code === 0) {
        _t.setState({ deviceData: addNewEle(res.data, { 'amount': 1 }) })
      } else {
        Modal.error({ title: '提示', 'content': res.errmsg })
      }
    })
  }

  // 修改数量文本框
  hadleAmount(index, e) {
    let amState = this.state.temaData
    amState[index]['amount'] = parseInt(e.target.value)
    this.setState({ temaData: amState })
    if (this.props.onTemClick) {
      this.props.onTemClick(this.state.temaData)
    }
  }

  // 添加按钮
  hadleAddClick() {
    this.setState({
      visible: true,
    })
  }

  // 删除操作
  hadleDelClick(index) {
    let delState = []
    delState = this.state.temaData
    delState.splice(index, 1)
    this.setState({ temaData: delState })
  }

  // 添加设备并更新数据，如果已存在记录则是数量加1，不会去覆盖
  handleOk() {
    let newSetData = []
    newSetData = [...this.state.temaData, ...this.state.selectData]
    this.setState({ temaData: [], selectData: [] })
    this.setState({ temaData: newSetData, visible: false }, () => {
      if (this.props.onTemClick) {
        this.props.onTemClick(this.state.temaData)
      }
    })
  }

  // 取消添加设备
  handleCancel() {
    this.setState({ visible: false })
  }

  onTemClick() {
    if (this.props.onTemClick) {
      this.props.onTemClick(this.state.temaData)
    }
  }

  _containsAry(ary, ele) {
    for (let k in ary) {
      if (ary[k] === ele) {
        return true
      }
    }
    return false
  }

  render() {
    let newDeviceData = []
    newDeviceData = this.state.deviceData
    let newtemaData = []
    newtemaData = this.state.temaData
    let idAry = []
    for (let i = 0; i < newDeviceData.length; i++) {
      for (let j = 0; j < newtemaData.length; j++) {
        if (newDeviceData[i]['Id'] === newtemaData[j]['Id']) {
          idAry.push(newDeviceData[i]['Id'])
        }
      }
    }

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectData: selectedRows })
      },
      getCheckboxProps: (record) => {
        return { disabled: this._containsAry(idAry, record.Id) }
      },
    }
    return (
      <Row onClick={this.onTemClick.bind(this)}>
        <Col><Button onClick={this.hadleAddClick.bind(this)}>增加设备</Button></Col>
        <Col className={style['mgt10']}>
          <Table columns={this.temaColumns} dataSource={this.state.temaData} pagination={false} rowKey={record => record.Id} />
        </Col>
        {this.state.visible && <Modal title='添加设备' visible={this.state.visible} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
          <Table rowSelection={rowSelection} columns={this.deviceColumns} dataSource={this.state.deviceData} rowKey={record => record.Id} pagination={false} />
        </Modal>}
      </Row>
    )
  }
}

export default Terminal
