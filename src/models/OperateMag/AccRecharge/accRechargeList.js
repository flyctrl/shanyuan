/*
* @Author: chengbaosheng
* @Date:   2017-08-30 15:36:02
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-21 16:46:04
*/
import React, { Component } from 'react'
import { Row, Col, Button, Input, Table, Icon, Dropdown, Menu, message } from 'antd'
import RechargeArt from './rechargeArt'
import api from 'Src/contants/api'
import fetch from 'Util/fetch'
import style from '../style.css'

const Search = Input.Search
// const phoneReg = /^(1[35847]\d{9})$/
class AccRechargeList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pagination: [],
      loading: false,
      artSource: {
        type: 'single',
        visible: false,
        title: '',
        isClose: true
      },
      postSource: {
        userNumber: '',
        mobileNo: ''
      },
      dataSource: []
    }

    // 表格下拉菜单
    this.menu = (record) => (
      <Menu>
        <Menu.Item><a onClick={this.handleSingleRec.bind(this, record)}>充值</a></Menu.Item>
      </Menu>
    )

    // 表头
    this.columns = [{
      title: '用户手机号码',
      dataIndex: 'mobileNo',
      key: 'mobileNo',
    }, {
      title: '用户姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '用户ID',
      dataIndex: 'userNo',
      key: 'userNo',
    }, {
      title: '用户类型',
      dataIndex: 'clientType',
      key: 'clientType',
      render: (text) => {
        if (text === 1) {
          return '内部用户'
        } else if (text === 2) {
          return '外部用户'
        }
      }
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Dropdown overlay={this.menu(record)} placement='bottomCenter'>
          <Icon style={{ fontSize: 18 }} type='bars' />
        </Dropdown>
      )
    }]
  }

  // 根据手机号码搜索
  handleSearchByPhone = (value) => {
    // const _t = this
    // console.log('refs:', _t.refs.SearchText)
    if (value === '') {
      message.error('请输入手机号码')
    } else {
      this.listFetch({ mobileNo: value })
    }
  }

  // 获取（搜索）数据
  listFetch = (params = { mobileNo: '' }) => {
    fetch(api.userRechargeList, params).then((res) => {
      if (res.code === 0) {
        if (res.data.mobileNo) {
          this.setState({
            dataSource: [{
              mobileNo: res.data['mobileNo'],
              name: res.data['name'],
              userNo: res.data['userNo'],
              clientType: res.data['clientType']
            }],
            artSource: {
              type: 'single',
              visible: false,
              title: '',
              isClose: true
            }
          })
        } else {
          this.setState({
            dataSource: [],
            artSource: {
              type: 'single',
              visible: false,
              title: '',
              isClose: true
            }
          })
        }
      } else {
        message.error(res.errmsg)
      }
    })
  }

  // 分页
  handleTableChange(pagination, filters) {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    this.listFetch({
      pageSize: pagination.pageSize,
      currentPage: pagination.current,
      ...filters,
    })
  }

  // 单个充值事件
  handleSingleRec = (record) => {
    this.setState({ artSource: { type: 'single', visible: true, isClose: false, title: '单个账号充值' }, postSource: { userNumber: record.userNo, mobileNo: record.mobileNo, clientType: record.clientType }})
  }

  // 批量充值事件
  handleBatchRec = () => {
    this.setState({ artSource: { type: 'batch', visible: true, isClose: false, title: '批量充值' }})
  }

  handleCancel = () => {
    this.setState({ artSource: { type: 'single', visible: false, isClose: true, title: '' }})
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={24}><Button type='primary' onClick={this.handleBatchRec}>批量充值</Button></Col>
          <Col className={style['mgt20']} span={24}>
            <span>用户手机号码：</span>
            <Search
              placeholder='请输入手机号码'
              style={{ width: 200 }}
              onSearch={this.handleSearchByPhone}
             />
          </Col>
          <Col className={style['mgt20']} span={24}>
            <Table
            pagination={this.state.pagination}
            loading={this.state.loading}
            columns={this.columns}
            dataSource={this.state.dataSource}
            rowKey={record => record.userNo}
            onChange={this.handleTableChange}
            />
          </Col>
        </Row>
        <RechargeArt handleCancel={this.handleCancel} artSource={this.state.artSource} postSource={this.state.postSource} />
      </div>
    )
  }
}

export default AccRechargeList
