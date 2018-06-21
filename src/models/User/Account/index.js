/**
 * Created by Webstorm.
 * @author taoqili
 * @date 2017/8/16
 */
import React, { Component } from 'react'
import { Table, Input, Menu, Dropdown, Icon, Pagination, Select } from 'antd'
import { Link } from 'react-router-dom'
import * as urls from 'Src/contants/url'

const Search = Input.Search
import fetch from 'Src/utils/fetch'
import api from 'Src/contants/api'
import { userStatusMap } from '../nameMaps'
const Option = Select.Option

class AccountList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      totalSize: 1,
      pageSize: 20,
      pageNum: 1,
      accountList: [],
      searchKey: 'accountSerach'
    }
  }

  componentDidMount() {
    const { searchKey } = this.state
    this.fetchAccountList({
      [ searchKey ]: ''
    })
  }

  fetchAccountList = (params = {}) => {
    this.setState({
      loading: true
    })
    fetch(api.getUserAccountList, {
      pageNum: 1,
      pageSize: 20,
      ...params
    }).then(res => {
      this.setState({
        loading: false
      })
      if (res.code === 0 && res.data) {
        this.setState({
          totalSize: res.data.total,
          accountList: res.data.accountList
        })
      } else {
        this.setState({
          accountList: []
        })
      }
    })
  }
  handleChange = (value) => {
    this.setState({
      searchKey: value
    })
  }

  pageChange(page) {
    this.fetchAccountList({
      pageNum: page,
      pageSize: this.state.pageSize
    })
    this.setState({
      pageNum: page
    })
  }

  search(value) {
    if (!value.replace(/^\s|\s$/, '')) {
      this.fetchAccountList()
      return
    }
    const { searchKey } = this.state
    this.fetchAccountList({
      [ searchKey ]: value
    })
  }

  render() {
    const columns = [
      {
        title: '用户ID',
        dataIndex: 'userNumber',
        key: 'userNumber',
      },
      {
        title: '账户ID',
        dataIndex: 'accountId',
        key: 'accountId',
      },
      {
        title: '账户状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          return (
            userStatusMap[text]
          )
        }
      },
      {
        title: '是否关联消费卡',
        dataIndex: 'isRelationCard',
        key: 'isRelationCard',
        render: text => {
          return (
            +text === 1 ? '是' : '否'
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          let menu = (
            <Menu>
              <Menu.Item>
                <Link to={`${urls.USER_ACCOUNT_DETAIL}/${record.userNumber}`}>详情</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={`${urls.USER_TRANSACTION_LIST}/${record.userNumber}`}>交易记录</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={`${urls.USER_STARCOIN_LIST}/${record.userNumber}`}>星球币记录</Link>
              </Menu.Item>
            </Menu>
          )
          return (
            <div>
              <Dropdown overlay={menu} placement='bottomCenter'>
                <Icon style={{ fontSize: 18 }} type='bars'/>
              </Dropdown>
            </div>
          )
        }
      }
    ]
    return (
      <div>
        <Select defaultValue='accountSerach' style={{ width: 120, margin: '0 10px 10px 0', verticalAlign: 'top' }} onChange={this.handleChange}>
          <Option value='accountSerach'>用户ID</Option>
          <Option value='accountId'>账户ID</Option>
        </Select>
        <Search
          placeholder='请输入ID查询'
          style={{ width: 200 }}
          onSearch={this.search.bind(this)}
        />
        <Table loading={this.state.loading} columns={columns} rowKey='userNumber' dataSource={this.state.accountList} pagination={false}/>
        <Pagination onChange={this.pageChange.bind(this)} style={{ margin: '10px', textAlign: 'right' }}
                    pageSize={this.state.pageSize} defaultCurrent={1} current={this.state.pageNum}
                    total={this.state.totalSize}/>
      </div>
    )
  }
}

export default AccountList
