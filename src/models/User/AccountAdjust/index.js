/**
 * @Author: sunshiqiang
 * @Date: 2018-03-01 15:49:49
 * @Title: 账户调整管理
 */

import React, { Component } from 'react'
import { Form, Tabs, Input, Select, Button, Popconfirm, InputNumber } from 'antd'
// import * as urls from 'Src/contants/url'

import api from 'Src/contants/api'

const Option = Select.Option
const TabPane = Tabs.TabPane
const FormItem = Form.Item

class AccountAdjust extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabValue: '1'
    }
  }

  handleTabs = (tabValue) => {
    this.props.form.resetFields()
    this.setState({ tabValue })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.log(values)
        switch (this.state.tabValue) {
          case '1':
            await api.user.accountAdjust.adjustUserAccount(values)
            break
          case '2':
            await api.user.accountAdjust.adjustShopAccount(values)
            break
          case '3':
            await api.user.accountAdjust.adjustOperatorAccount(values)
            break
          default :
            break
        }
        this.state.tabValue === '1' && this.props.form.resetFields(['amount'])
      } else {
        this.state.tabValue === '1' && this.props.form.resetFields(['amount'])
      }
    })
  }
  // _filterNum = (key) => { // 过滤非数字字符和非正数
  //   const { setFieldsValue } = this.props.form
  //   return (value) => {
  //     console.log(value)
  //     const oldValue = value
  //     const newValue = Number(value.replace(/\D*/g, '')).toString()
  //     if (newValue.length !== oldValue.length) {
  //       setFieldsValue({ [key]: newValue })
  //     }
  //     return newValue
  //   }
  // }
  render() {
    const { tabValue } = this.state
    const { getFieldDecorator, getFieldsValue } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 8
        },
      },
    }
    const arr = getFieldsValue(['intAmount', 'extAmount', 'presentAmount'])
    // 加法函数，用来得到精确的加法结果
    // 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    // 调用：accAdd(arg1,arg2)
    // 返回值：arg1加上arg2的精确结果
    function accAdd(arg1, arg2) {
      var r1, r2, m
      try {
        r1 = arg1.toString().split('.')[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split('.')[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      return (arg1 * m + arg2 * m) / m
    }
    let amount
    if (!(arr.intAmount === undefined & arr.extAmount === undefined & arr.presentAmount === undefined)) {
      let { intAmount = 0, extAmount = 0, presentAmount = 0 } = arr
      amount = accAdd(accAdd(intAmount, extAmount), presentAmount)
    }
    return <div>
      <Tabs defaultActiveKey='1' onChange={this.handleTabs}>
        <TabPane tab='用户账户调整' key='1'/>
        <TabPane tab='店铺账户调整' key='2'/>
        <TabPane tab='主体账户调整' key='3'/>
      </Tabs>
      <Form onSubmit={this.handleSubmit} style={{ paddingTop: '10px' }}>
        {tabValue === '1' ? <FormItem
          {...formItemLayout}
          label='用户ID'
        >
          {getFieldDecorator('userNumber', {
            rules: [{
              required: true, message: '请输入正确的用户ID',
            }],
          })(
            <Input
              maxLength={32}
            />
          )}
        </FormItem> : null}
        {tabValue === '2' ? <FormItem
          {...formItemLayout}
          label='店铺ID'
        >
          {getFieldDecorator('shopNumber', {
            rules: [{
              required: true, message: '请输入正确的店铺ID'
            }],
          })(
            <Input
              maxLength={32}
            />
          )}
        </FormItem> : null}
        {tabValue === '3' ? <FormItem
          {...formItemLayout}
          label='主体ID'
        >
          {getFieldDecorator('operatorNumber', {
            rules: [{
              required: true, message: '请输入正确的主体ID'
            }],
          })(
            <Input
              maxLength={32}
            />
          )}
        </FormItem> : null}
        <FormItem
          {...formItemLayout}
          label='总变动金额'
        >
          {getFieldDecorator('amount', {
            rules: [{
              required: true, message: '请输入数字，最多保留两小数',
              pattern: /^\d+(.\d{1,2})?$/,
            }],
            initialValue: amount
          })(
            <InputNumber
              disabled={tabValue === '1'}
              min={0}
              max={9999999999999999}
              step={0.01}
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
        {tabValue === '1' ? <FormItem
          {...formItemLayout}
          label='内部账户变动金额'
        >
          {getFieldDecorator('intAmount', {
            rules: [{
              required: true, message: '请输入数字，最多保留两小数',
              pattern: /^\d+(.\d{1,2})?$/,
            }],
          })(
            <InputNumber
              min={0.00}
              max={999999999999999}
              step={0.01}
              style={{ width: '100%' }}
            />
          )}
        </FormItem> : null}
        {tabValue === '1' ? <FormItem
          {...formItemLayout}
          label='外部账户变动金额'
        >
          {getFieldDecorator('extAmount', {
            rules: [{
              required: true, message: '请输入数字，最多保留两小数',
              pattern: /^\d+(.\d{1,2})?$/,
            }],
          })(
            <InputNumber
              min={0}
              max={999999999999999}
              step={0.01}
              style={{ width: '100%' }}
            />
          )}
        </FormItem> : null}
        {tabValue === '1' ? <FormItem
          {...formItemLayout}
          label='优惠账户变动金额'
        >
          {getFieldDecorator('presentAmount', {
            rules: [{
              required: true, message: '请输入数字，最多保留两小数',
              pattern: /^\d+(.\d{1,2})?$/,
            }],
          })(
            <InputNumber
              onKeyUp={this.handleNumChange}
              min={0}
              max={999999999999999}
              step={0.01}
              style={{ width: '100%' }}
            />
          )}
        </FormItem> : null}
        <FormItem
          {...formItemLayout}
          label='支付订单号'
        >
          {getFieldDecorator('payOrderId', {
            rules: [{
              required: true, message: '请输入正确的支付订单号'
            }],
          })(
            <Input
              maxLength={64}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='交易订单号'
        >
          {getFieldDecorator('outerOrderId', {
            rules: [{
              required: false, message: '请输入正确的交易订单号'
            }],
          })(
            <Input
              maxLength={64}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='类型'
        >
          {getFieldDecorator('adjustType', {
            rules: [{
              required: true, message: '请输入正确的类型',
            }],
            initialValue: '1'
          })(
            <Select>
              <Option value='1'>调入</Option>
              <Option value='2'>调出</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='备注'
        >
          {getFieldDecorator('reason', {
            rules: [{
              required: true, message: '请输入备注',
            }],
          })(
            <Input
              type={'textarea'}
              placeholder={'最大50个字'}
              rows={4}
              maxLength={50}
            />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Popconfirm title='是否确认调整？' onConfirm={e => this.handleSubmit(e)} okText='是' cancelText='否'>
            <Button type='primary' htmlType='submit' size='large'>确认</Button>
          </Popconfirm>
        </FormItem>
      </Form>
    </div>
  }
}

export default Form.create()(AccountAdjust)
