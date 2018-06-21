/**
 * @Author: sunshiqiang
 * @Date: 2018-03-05 15:15:33
 * @Title: 红包发放限额配置
 */

import React, { Component } from 'react'
import api from 'Contants/api'
import { Col, Button, Modal, Form, InputNumber } from 'antd'

const FormItem = Form.Item

class IssuanceOfQuotas extends Component {
  constructor(props) {
    console.log(props.form)
    super(props)
    this.state = {
      modalVisible: false,
      data: {},
      searchParams: {}
    }
  }

  componentWillMount() {
    this._loadData()
  }

  handleOk = async (e) => {
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) return
      const res = await api.redEnvelope.issuanceOfQuotas.update(values)
      if (res) {
        this.setState({
          modalVisible: false
        })
        this._loadData()
      }
    })
  }
  showModal = () => {
    this.props.form.resetFields()
    this.setState({
      modalVisible: true,
    })
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    })
  }
  _loadData = async () => {
    const data = await api.redEnvelope.issuanceOfQuotas.data({}) || {}
    this.setState({ data })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { data } = this.state
    return <div>
      <Col><Button type='primary'
                   onClick={this.showModal}>修改</Button></Col>
      <Col span={12} style={{ textAlign: 'right', padding: '15px', fontSize: '16px' }}>单次红包最大发放限额</Col>
      <Col span={12} style={{ height: '54px', fontSize: '16px', padding: '15px' }}>{data.maxTotalAmount}</Col>
      <Col span={12} style={{ textAlign: 'right', padding: '15px', fontSize: '16px' }}>单个红包最大领取限额</Col>
      <Col span={12} style={{ height: '54px', fontSize: '16px', padding: '15px' }}>{data.maxSingleAmount}</Col>
      <Modal
        title='修改红包发放限额'
        visible={this.state.modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form style={{ marginBottom: '10px' }} onSubmit={this.handleOk}>
          <FormItem
            label='单次红包最大发放限额'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
          >
            {getFieldDecorator('maxTotalAmount', {
              rules: [{
                required: true,
                message: '请输入数字，最多保留两小数',
                pattern: /^\d+(.\d{1,2})?$/,
              }],
              initialValue: data.maxTotalAmount
            })(
              <InputNumber
                min={0}
                max={999999999999999}
                style={{ width: '100%' }}
                step={0.01}
              />
            )}
          </FormItem>
          <FormItem
            label='单个红包最大领取限额'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
          >
            {getFieldDecorator('maxSingleAmount', {
              rules: [{
                required: true,
                message: '请输入数字，最多保留两小数',
                pattern: /^\d+(.\d{1,2})?$/,
              }],
              initialValue: data.maxSingleAmount
            })(
              <InputNumber
                min={0}
                max={999999999999999}
                style={{ width: '100%' }}
                step={0.01}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  }
}

export default Form.create()(IssuanceOfQuotas)
