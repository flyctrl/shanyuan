/*
* @Author: chengbaosheng
* @Date:   2017-08-31 17:39:50
* @Last Modified by:   baosheng
* @Last Modified time: 2017-10-16 15:10:55
*/
import React, { Component } from 'react'
import { Input, Button, Form, message, Modal } from 'antd'
import style from '../style.css'
import api from 'Src/contants/api'
import fetch from 'Util/fetch'

const FormItem = Form.Item
const confirm = Modal.confirm
class SuicaFormEle extends Component {
  constructor(props) {
    super(props)
    console.log('constructor')
  }
  handleSuicaCancel() {
    this.props.onCancel()
  }
  hadleSubmit(e) {
    const _t = this
    e.preventDefault()
    confirm({
      title: '是否确认提交工单？',
      okText: '是',
      cancelText: '否',
      onOk() {
        _t.onSubmitData()
      }
    })
  }
  onSubmitData() {
    const _t = this
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      fetch(api.withdrawApply, fieldsValue).then((res) => {
        if (res.code === 0) {
          const sucArt = Modal.success({
            title: '提示',
            content: '操作成功'
          })
          setTimeout(() => {
            sucArt.destroy()
          }, 800)
          _t.props.onChangeStatus()
          _t.props.onCancel()
        } else {
          message.error(res.errmsg)
        }
      })
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    }
    const formBtnLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12, offset: 7 }
    }
    return (
      <Form onSubmit={this.hadleSubmit.bind(this)}>
      <FormItem {...formItemLayout} style={{ display: 'none' }}>
          {getFieldDecorator('userNo', {
            rules: [{ required: true, message: '请输入用户编码' }],
            initialValue: this.props.userNumber
          })(
            <Input type='text' />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label='用户名'>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名' }]
          })(
            <Input type='text' />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label='用户手机号码'>
          {getFieldDecorator('phone', {
            rules: [
              { required: true, message: '请输入用户手机号码' },
              { pattern: /^(1[35847]\d{9})$/, message: '手机号码格式错误' },
            ]
          })(
            <Input type='text' />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label='用户身份证号'>
          {getFieldDecorator('idNo', {
            rules: [
              { required: true, message: '请输入用户身份证号' },
              { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证格式错误' }
            ]
          })(
            <Input type='text' />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label='用户银行卡号'>
          {getFieldDecorator('bankCardNo', {
            rules: [
              { required: true, message: '请输入用户银行卡号' },
              { pattern: /^\d{16}|\d{19}$/, message: '银行卡号格式错误' }
            ]
          })(
            <Input type='text' />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label='开户行'>
          {getFieldDecorator('bankName', {
            rules: [{ required: true, message: '请输入开户行' }]
          })(
            <Input type='text' />
          )}
        </FormItem>
        <FormItem {...formBtnLayout}>
          <Button onClick={this.handleSuicaCancel.bind(this)}>取消</Button>
          <Button className={style['mgl20']} type='primary' htmlType='submit'>提交工单</Button>
        </FormItem>
      </Form>
    )
  }
}

export const SuicaForm = Form.create()(SuicaFormEle)
