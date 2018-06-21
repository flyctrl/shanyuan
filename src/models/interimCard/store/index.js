/**
 * @Author: sunshiqiang
 * @Date: 2017-12-04 14:33:05
 * @Title: 临时卡库存管理
 */

import React, { Component } from 'react'
import * as urls from 'Src/contants/url'
import { Link } from 'react-router-dom'
import api from 'Src/contants/api'
import { Table, Dropdown, Menu, Icon, Button, Modal } from 'antd'

class Store extends Component {
  constructor() {
    super()
    this.state = {
      tableList: {}
    }
  }

  componentWillMount() {
    this._loadList()
  }

  async _loadList(currentPage) {
    const tableList = await api.interimCard.store.list({
      pagesize: '10',
      status: '-1',
      page: currentPage || '1'
    }) || {}
    this.setState({ tableList })
  }

  handleDel = (e, batch) => {
    const _this = this
    Modal.confirm({
      title: '提示',
      content: '是否确认删除？',
      okText: '是',
      cancelText: '否',
      onOk() {
        (async (batch) => {
          const data = await api.interimCard.store.del({ batch })
          data && _this._loadList()
        })(batch)
      }
    })
  }
  handleMake = (e, batch) => {
    const _this = this
    Modal.confirm({
      title: '提示',
      content: '是否确认制卡？',
      okText: '是',
      cancelText: '否',
      onOk() {
        (async (batch) => {
          const data = await api.interimCard.store.detial1.make({ batch })
          data && _this._loadList()
        })(batch)
      }
    })
  }
  handleInStore = (e, batch) => {
    const _this = this
    Modal.confirm({
      title: '提示',
      content: '是否确认入库？',
      okText: '是',
      cancelText: '否',
      onOk() {
        (async (batch) => {
          const data = await api.interimCard.store.detial1.inStore({ batch })
          data && _this._loadList()
        })(batch)
      }
    })
  }
  handleChange = (currentPage) => {
    this._loadList(currentPage)
  }

  _menuMap(record) {
    switch (record.status) {
      case 0: // 未制卡
        return (
          <Menu>
            <Menu.Item>
              <a onClick={e => this.handleMake(e, record.batch)}>制卡</a>
            </Menu.Item>
            <Menu.Item>
              <Link to={{
                pathname: urls.INTERIMCARD_STORE_EDIT,
                search: `?batch=${record.batch}`,
              }}>修改</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={{
                pathname: urls.INTERIMCARD_STORE_DETIAL1,
                search: `?batch=${record.batch}`
              }}>详情</Link>
            </Menu.Item>
            <Menu.Item>
              <a onClick={e => this.handleDel(e, record.batch)}>删除</a>
            </Menu.Item>
          </Menu>
        )
      case 1: // 未入库
        return (
          <Menu>
            <Menu.Item>
              <a onClick={e => this.handleInStore(e, record.batch)}>入库</a>
            </Menu.Item>
            <Menu.Item>
              <Link to={{
                pathname: urls.INTERIMCARD_STORE_DETIAL1,
                search: `?batch=${record.batch}`,
              }}>详情</Link>
            </Menu.Item>
          </Menu>
        )
      case 2: // 库存中
      case 3: // 已投放部分
      case 4: // 已全部投放
        return (
          <Menu>
            <Menu.Item>
              <Link to={{
                pathname: urls.INTERIMCARD_STORE_DETIAL2,
                search: `?batch=${record.batch}`,
              }}>详情</Link>
            </Menu.Item>
          </Menu>
        )
      default:
        return <Menu>
        </Menu>
    }
  }

  render() {
    const { tableList } = this.state
    const columns = [{
      title: '批次号',
      dataIndex: 'batch',
      key: 'batch',
    }, {
      title: '配置时间',
      dataIndex: 'gmtCreated',
      key: 'gmtCreated',
    }, {
      title: '卡片数量',
      dataIndex: 'num',
      key: 'num',
    }, {
      title: '流转状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        const map = ['未制卡', '未入库', '库存中', '已部分投放', '已全部投放']
        return (<span>{map[text]}</span>)
      },
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <Dropdown overlay={this._menuMap(record)} placement='bottomCenter'>
            <Icon style={{ fontSize: 18 }} type='bars'/>
          </Dropdown>
        )
      }
    }]

    return (
      <div>
        <Button
          type='primary'
          style={{ marginBottom: '10px' }}><Link to={urls.INTERIMCARD_STORE_ADD}>新增</Link></Button>
        <Table
          columns={columns}
          rowKey='id'
          dataSource={tableList.datas}
          pagination={{
            showQuickJumper: true,
            total: tableList.total,
            onChange: this.handleChange,
            pageSize: 10,
            current: tableList.currPageNo
          }}/>
      </div>)
  }
}

export default Store

