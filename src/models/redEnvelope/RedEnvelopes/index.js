/**
 * @Author: sunshiqiang
 * @Date: 2018-01-25 16:14:30
 * @Title: 红包发放记录
 */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as urls from 'Contants/url'
import api from 'Contants/api'
import { Table, Dropdown, Menu, Icon, DatePicker, Select, Form, Input
} from 'antd'

const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item
const Option = Select.Option

class RedEnvelopes extends Component {
  constructor(props) {
    console.log(props.form)
    super(props)
    this.state = {
      tableList: {},
      searchParams: {}
    }
  }

  componentWillMount() {
    this._loadList()
  }

  handelSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values['range-picker'].length) {
          values.startDate = values['range-picker'][0].format('YYYY-MM-DD')
          values.endDate = values['range-picker'][1].format('YYYY-MM-DD')
        }
        this.setState({
          searchParams: {
            packetType: values.packetType,
            startDate: values.startDate || '',
            endDate: values.endDate || '',
            [values.orderType]: values.orderNum,
          }
        }, () => {
          this._loadList()
        })
      }
    })
  }
  handlePaginationChange = (currentPage) => {
    this._loadList({ currentPage })
  }

  _loadList = async (params = {}) => {
    const tableList = await api.redEnvelope.redEnvelopes.list({
      pageSize: '10',
      currentPage: params.currentPage || '1',
      ...this.state.searchParams
    }) || {}
    this.setState({ tableList })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { tableList } = this.state
    const columns = [{
      title: '发放订单号',
      dataIndex: 'packetNo',
      key: 'packetNo',
    }, {
      title: '平台号',
      dataIndex: 'sysNo',
      key: 'sysNo',
    }, {
      title: '交易时间',
      dataIndex: 'payTime',
      key: 'payTime',
    }, {
      title: '发放总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text, record) => <span>{text.toFixed(2)}</span>
    }, {
      title: '红包类型',
      dataIndex: 'packetType',
      key: 'packetType',
      render: (text, record) => <span>{['', '定额红包', '拼手气红包'][text]}</span>
    }, {
      title: '支付订单号',
      dataIndex: 'payOrderId',
      key: 'payOrderId',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <Dropdown
            overlay={<Menu>
              <Menu.Item><Link to={{
                pathname: urls.REDENVELOPE_REDENVELOPES_DETAIL,
                search: `?id=${record.id}`
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
          <FormItem label='红包类型'>
            {getFieldDecorator('packetType', {
              initialValue: ''
            })(
              <Select style={{ width: 120 }}>
                <Option value=''>全部</Option>
                <Option value='1'>定额红包</Option>
                <Option value='2'>拼手气红包</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='时间'>
            {getFieldDecorator('range-picker', {
              initialValue: ''
            })(
              <RangePicker
                format='YYYY-MM-DD'
              />
            )}
          </FormItem>
          <FormItem label='订单号'>
            {getFieldDecorator('orderType', {
              initialValue: 'packetNo'
            })(
              <Select style={{ width: 120 }}>
                <Option value='packetNo'>发放订单号</Option>
                <Option value='payOrderId'>支付订单号</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('orderNum', {
              initialValue: ''
            })(
              <Input.Search
                onSearch={this.handelSearch}
                style={{ width: 200 }}
              />
            )}
          </FormItem>
        </Form>
        <Table
          columns={columns}
          rowKey='id'
          dataSource={tableList.redpacketResps}
          pagination={{
            showQuickJumper: true,
            total: tableList.page && tableList.page.totalRowsAmount,
            onChange: this.handlePaginationChange,
            pageSize: 10,
            current: tableList.page && tableList.page.currentPage
          }}/>
      </div>)
  }
}

export default Form.create()(RedEnvelopes)
