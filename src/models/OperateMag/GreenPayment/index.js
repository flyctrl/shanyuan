/**
 * @Author: sunshiqiang
 * @Date: 2017-12-04 17:28:41
 * @Title: 绿色代付授权
 */

import React, { Component } from 'react'
import api from 'Src/contants/api'
import { Table, Dropdown, Menu, Icon, Button, Modal, Form, Input } from 'antd'

const MenuItem = Menu.Item
const FormItem = Form.Item

class GreenPayment extends Component {
  constructor() {
    super()
    this.state = {
      tableList: {},
      visible: false,
      loading: false,
    }
  }

  componentWillMount() {
    this._loadList()
  }

  async _loadList(currentPage) {
    const tableList = await api.operateMag.greenPayment.list({
      pageSize: '10',
      currentPage: currentPage || '1'
    }) || {}
    this.setState({ tableList })
  }

  handleClick = ({ key }, id) => {
    const _this = this
    if (key === 'del') {
      Modal.confirm({
        title: '提示',
        content: '是否确认删除？',
        okText: '是',
        cancelText: '否',
        async onOk() {
          const data = await api.operateMag.greenPayment.del({ id })
          data && _this._loadList()
        }
      })
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    })
    const { resetFields } = this.props.form
    resetFields()
  }
  handleChange = (currentPage) => {
    this._loadList(currentPage)
  }
  handleCancel = () => {
    this.setState({ visible: false })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ loading: true })
        const data = await api.operateMag.greenPayment.add(values)
        this.setState({ loading: false, visible: false })
        data && this._loadList()
      }
    })
  }

  render() {
    const { tableList, visible, loading } = this.state
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '代理付款人ID',
      dataIndex: 'userNumberFrom',
      key: 'userNumberFrom',
    }, {
      title: '代理付款人工号',
      dataIndex: 'memberNoFrom',
      key: 'memberNoFrom',
    }, {
      title: '付款人ID',
      dataIndex: 'userNumberTo',
      key: 'userNumberTo',
    }, {
      title: '付款人工号',
      dataIndex: 'memberNoTo',
      key: 'memberNoTo',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <Dropdown overlay={<Menu
            onClick={(obj) => this.handleClick(obj, record.id)}>
            <MenuItem key='del'>删除</MenuItem>
          </Menu>} placement='bottomCenter'>
            <Icon style={{ fontSize: 18 }} type='bars'/>
          </Dropdown>
        )
      }
    }]
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    return (
      <div>
        <Button
          type='primary'
          style={{ marginBottom: '10px' }}
          onClick={this.showModal}>新增</Button>
        <Modal
          visible={visible}
          width={400}
          title={<p style={{ textAlign: 'center' }}>授权绿色代付</p>}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key='back' size='large' onClick={this.handleCancel}>取消</Button>,
            <Button key='submit' type='primary' size='large' loading={loading} onClick={this.handleSubmit}>
              确认
            </Button>,
          ]}
        >
          <Form>
            <FormItem label='代理付款人工号'
                      {...formItemLayout}>
              {getFieldDecorator('memberNoFrom', {
                initialValue: '',
                rules: [
                  { required: true, message: '请输入7位数字工号' },
                  { pattern: /^\d{7}$/, message: '请输入7位数字工号' }
                ]
              })(
                <Input
                  style={{ width: 220, marginRight: '0' }}
                />
              )}
            </FormItem>
            <FormItem label='付款人工号'
                      {...formItemLayout}>
              {getFieldDecorator('memberNoTo', {
                rules: [
                  { required: true, message: '请输入7位数字工号' },
                  { pattern: /^\d{7}$/, message: '请输入7位数字工号' }
                ],
                initialValue: '',
              })(
                <Input
                  style={{ width: 220, marginRight: '0' }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
        <Table
          columns={columns}
          rowKey='id'
          dataSource={tableList.payAccountBindInfos}
          pagination={{
            showQuickJumper: true,
            total: tableList.page ? tableList.page.totalRowsAmount : 0,
            onChange: this.handleChange,
            pageSize: 10,
            current: tableList.page ? tableList.page.currentPage : 1,
          }}/>
      </div>)
  }
}

export default Form.create()(GreenPayment)
