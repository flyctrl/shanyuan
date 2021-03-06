/**
 * @Author: sunshiqiang
 * @Date: 2017-08-31 11:04:16
 * @Title: 消费卡使用管理
 */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as urls from 'Contants/url'
import api from 'Src/contants/api'
import { Table, Dropdown, Menu, Icon, DatePicker, Form } from 'antd'
// import moment from 'moment'

const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item

class Use extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tableList: {},
      startTime: '',
      endTime: '',
    }
  }

  componentWillMount() {
    this._loadList()
  }

  handlePaginationChange = (currentPage) => {
    this._loadList({ currentPage })
  }
  handleDateChange = (value) => {
    let startTime = ''
    let endTime = ''
    if (value.length) {
      startTime = value[0].format('YYYY-MM-DD')
      endTime = value[1].format('YYYY-MM-DD')
    }
    this._loadList({ startTime, endTime })
    this.setState({ startTime, endTime })
  }
  _loadList = async (params = {}) => {
    const tableList = await api.expenseCard.use.list({
      pagesize: '10',
      page: params.currentPage || '1',
      startTime: params.startTime === undefined ? this.state.startTime : params.startTime,
      endTime: params.endTime === undefined ? this.state.endTime : params.endTime,
    }) || {}
    this.setState({ tableList })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { tableList } = this.state
    const columns = [{
      title: '投放批次号',
      dataIndex: 'batch',
      key: 'batch',
    }, {
      title: '投放时间',
      dataIndex: 'gmtCreated',
      key: 'gmtCreated',
    }, {
      title: '卡片数量',
      dataIndex: 'count',
      key: 'count',
    }, //   {
    //   title: '使用数量',
    //   dataIndex: 'countUsed',
    //   key: 'countUsed',
    // },
    {
      title: '投放对象',
      dataIndex: 'address02',
      key: 'address02',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <Dropdown
            overlay={<Menu>
              <Menu.Item><Link to={{
                pathname: urls.EXPENSECARD_USE_DETAIL,
                search: `?batch=${record.batch}&numberFrom=${record.fromnum}&numberTo=${record.tonum}&exportId=${record.id}`
              }}>详情</Link></Menu.Item>
            </Menu>} placement='bottomCenter'>
            <Icon style={{ fontSize: 18 }} type='bars'/>
          </Dropdown>
        )
      }
    }]
    return (
      <div>
        <Form layout='inline' style={{ marginBottom: '10px' }}>
          <FormItem label='投放时间'>
            {getFieldDecorator('range-picker')(
              <RangePicker
                format='YYYY-MM-DD'
                onChange={this.handleDateChange}
              />
            )}
          </FormItem>
        </Form>
        <Table
          columns={columns}
          rowKey='id'
          dataSource={tableList.datas}
          pagination={{
            showQuickJumper: true,
            total: tableList.total,
            onChange: this.handlePaginationChange,
            pageSize: 10,
            current: tableList.currPageNo,
          }}/>
      </div>)
  }
}

export default Form.create()(Use)
