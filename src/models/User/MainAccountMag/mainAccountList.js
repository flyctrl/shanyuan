/*
* @Author: baosheng
* @Date:   2017-10-25 10:37:36
* @Last Modified by:   baosheng
* @Last Modified time: 2017-11-15 13:54:52
*/
import React, { Component } from 'react'
import { Table, Dropdown, Menu, Icon, Row, Col, Modal, Input } from 'antd'
import { Link } from 'react-router-dom'
import * as urls from 'Src/contants/url'
import style from './style.css'
import api from 'Src/contants/api'
import fetch from 'Src/utils/fetch'

const Search = Input.Search
export default class MainAccountList extends Component {
  constructor(props) {
    super()
    this.state = {
      pagination: { current: 1, pageSize: 10 },
      params: {},
      merchantShops: [],
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    this.listFetch({
      pageSize: pagination.pageSize,
      currentPage: pagination.current,
      ...this.state.params
    })
  }

  listFetch(params = {}, callback) {
    this.setState({ loading: true })
    fetch(api.queryPageBusinessPlatformList, {
      pageSize: this.state.pagination.pageSize,
      ...params,
    }).then((res) => {
      if (res.code === 0) {
        const data = res.data
        const merchantShops = data.businessPlatformInfos
        const pagination = { ...this.state.pagination }
        pagination.total = data.page.totalRowsAmount

        this.setState({
          loading: false,
          merchantShops,
          pagination,
        })

        if (callback) {
          callback()
        }
      } else {
        Modal.error({ title: '提示', 'content': res.errmsg })
      }
    })
  }
  // 搜索
  hadleOnSearch(value) {
    let searchJson = { platformName: value.replace(/\s/g, '') }
    this.setState({ params: { ...searchJson }, pagination: { current: 1 }})
    this.listFetch({
      currentPage: 1, ...searchJson
    })
  }

  componentDidMount() {
    this.listFetch()
  }
  render() {
    const columns = [{
      title: 'ID',
      dataIndex: 'platformAccessNo',
      key: 'platformAccessNo',
    }, {
      title: '主体账户名称',
      dataIndex: 'platformAccessName',
      key: 'platformAccessName',
    }, {
      title: '操作',
      dataIndex: 'opt',
      key: 'opt',
      width: 50,
      render(text, record) {
        const menu = (
          <Menu>
            <Menu.Item>
              <Link to={{
                pathname: urls.MAINACCOUNTDETAIL,
                state: { accountNumber: record.platformAccessNo }
              }} className={style['action-detail']}>详情</Link>
            </Menu.Item>
          </Menu>
        )
        return (
          <Dropdown overlay={menu} placement='bottomCenter'>
            <Icon style={{ fontSize: 18 }} type='bars' />
          </Dropdown>
        )
      }
    }]

    return (
      <div>
        <Row>
          <Col span={24}>
            <Search
              placeholder={'请输入主体账户ID或名称'}
              style={{ width: 180, marginTop: 5 }}
              onSearch={this.hadleOnSearch.bind(this)}
            />
          </Col>
        </Row>
        <Table dataSource={this.state.merchantShops} rowKey={record => record.id} columns={columns} style={{ marginTop: 20 }} pagination={this.state.pagination} onChange={this.handleTableChange} />
      </div>
    )
  }
}
