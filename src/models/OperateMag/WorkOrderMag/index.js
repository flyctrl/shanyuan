/**
 * @Author: sunshiqiang
 * @Date: 2017-09-28 16:00:46
 * @Title: 工单管理
 */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as urls from 'Contants/url'
import api from 'Src/contants/api'
import { Table, Dropdown, Menu, Icon, Select, DatePicker, Form } from 'antd'
import moment from 'moment'

const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item
const Option = Select.Option

class WorkOrderMag extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tableList: {},
      workType: '',
      workStatus: '',
      startDate: moment(new Date()).format('YYYY-MM-DD'),
      endDate: moment(new Date()).format('YYYY-MM-DD'),
    }
  }

  componentWillMount() {
    this._loadList()
    console.log(moment(new Date()).format('YYYY-MM-DD'))
  }

  handlePaginationChange = (currentPage) => {
    this._loadList({ currentPage })
  }
  handleWorkTypeChange = (workType) => {
    this._loadList({ workType })
    this.setState({ workType })
  }
  handleWorkStatusChange = (workStatus) => {
    this._loadList({ workStatus })
    this.setState({ workStatus })
  }
  handleDateChange = (value) => {
    let startDate = ''
    let endDate = ''
    if (value.length) {
      startDate = value[0].format('YYYY-MM-DD')
      endDate = value[1].format('YYYY-MM-DD')
    }
    this._loadList({ startDate, endDate })
    this.setState({ startDate, endDate })
  }
  _loadList = async (params = {}) => {
    const tableList = await api.operateMag.workOrderMag.list({
      pageSize: '10',
      currentPage: params.currentPage || '1',
      workType: params.workType === undefined ? this.state.workType : params.workType,
      workStatus: params.workStatus === undefined ? this.state.workStatus : params.workStatus,
      startDate: params.startDate === undefined ? this.state.startDate : params.startDate,
      endDate: params.endDate === undefined ? this.state.endDate : params.endDate,
    }) || {}
    this.setState({ tableList })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { tableList } = this.state
    const columns = [{
      title: '工单号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '工单类型',
      dataIndex: 'workType',
      key: 'workType',
      render: (text, record) => <span>{['', '充值', '提现'][text]}</span>
    }, {
      title: '提单时间',
      dataIndex: 'gmtCreated',
      key: 'gmtCreated',
    }, {
      title: '发起人',
      dataIndex: 'applyUserName',
      key: 'applyUserName',
    }, {
      title: '完成状态',
      dataIndex: 'workStatus',
      key: 'workStatus',
      render: (text, record) => <span>{['', '待处理', '', '已完成', '已撤销', ''][text]}</span>
    }, {
      title: '完成时间',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      render: (text, record) => <span>{[3, 4].indexOf(record.workStatus) !== -1 ? text : ''}</span>
    }, {
      title: '审核人',
      dataIndex: 'auditUserName',
      key: 'auditUserName',
      render: (text, record) => <span>{[3, 4].indexOf(record.workStatus) !== -1 ? record.applyUserName : ''}</span>
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        if (record.workType === 2) {
          return <Dropdown
            overlay={<Menu>
              <Menu.Item><Link to={{
                pathname: urls.OPERATEMAG_WORKORDERMAG_WITHDRAWALS,
                search: `?id=${record.id}`
              }}>详情</Link>
              </Menu.Item>
            </Menu>} placement='bottomCenter'>
            <Icon style={{ fontSize: 18 }} type='bars'/>
          </Dropdown>
        }
        if (record.workType === 1) {
          return <Dropdown
            overlay={<Menu>
              <Menu.Item><Link to={{
                pathname: urls.OPERATEMAG_WORKORDERMAG_RECHARGE,
                search: `?id=${record.id}`
              }}>详情</Link>
              </Menu.Item>
            </Menu>} placement='bottomCenter'>
            <Icon style={{ fontSize: 18 }} type='bars'/>
          </Dropdown>
        }
      }
    }]
    return (
      <div>
        <Form layout='inline' style={{ marginBottom: '10px' }}>
          <FormItem label='工单类型'>
            {getFieldDecorator('workType', {
              initialValue: ''
            })(
              <Select style={{ width: 120 }} onChange={this.handleWorkTypeChange}>
                <Option value=''>全部</Option>
                <Option value='1'>充值 </Option>
                <Option value='2'>提现</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='工单类型'>
            {getFieldDecorator('workStatus', {
              initialValue: ''
            })(
              <Select style={{ width: 120 }} onChange={this.handleWorkStatusChange}>
                <Option value=''>全部</Option>
                <Option value='1'>待处理 </Option>
                <Option value='3'>已完成</Option>
                <Option value='4'>已撤销</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='时间段'>
            {getFieldDecorator('range-picker', {
              initialValue: [moment(new Date(), 'HH:mm:ss'), moment(new Date(), 'HH:mm:ss')]
            })(
              <RangePicker
                format='YYYY-MM-DD'
                onChange={this.handleDateChange}
              />
            )}
          </FormItem>
        </Form>
        {tableList.workOrderInfos ? <Table
          columns={columns}
          rowKey='id'
          dataSource={tableList.workOrderInfos}
          pagination={{
            showQuickJumper: true,
            total: tableList.page.totalRowsAmount,
            onChange: this.handlePaginationChange,
            pageSize: 10,
            currentPage: tableList.page.currentPage
          }}/> : null}
      </div>)
  }
}

export default Form.create()(WorkOrderMag)

