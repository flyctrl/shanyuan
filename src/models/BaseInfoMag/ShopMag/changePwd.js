/*
* @Author: chengbaosheng
* @Date:   2017-08-22 09:44:59
* @Last Modified by:   chengbaosheng
* @Last Modified time: 2017-09-12 13:14:01
*/
import React, { Component } from 'react'
import { Form, Input, Modal, Button, notification } from 'antd'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'
import md5 from 'md5'
import style from '../style.css'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const formTailLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16, offset: 6 },
}
class EditPwdForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false
    }
  }
  // 密码的验证：handleConfirmBlur、checkPassword、checkConfirm
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次密码输入不一致')
    } else {
      callback()
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form
    if (value === form.getFieldValue('oldPassword')) {
      callback('新密码不能与旧密码相同')
    }
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  hadlePwdCancel() {
    if (this.props.hadlePwdCancel) {
      this.props.hadlePwdCancel()
    }
  }

  hadlePwdSubmit(e) {
    e.preventDefault()
    // let idJson = { userId: this.props.urlId }
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const changePwdJson = {
        id: this.props.urlId,
        originPassword: md5(fieldsValue.originPassword),
        confirmPassword: md5(fieldsValue.confirmPassword)
      }
      fetch(api.changePassword, changePwdJson).then((res) => {
        if (res.code === 0) {
          notification['success']({
            message: '提示',
            description: '密码修改成功',
            duration: 1.5
          })
          setTimeout(() => {
            if (this.props.hadlePwdCancel) {
              this.props.hadlePwdCancel()
            }
          }, 500)
        } else {
          Modal.error({ title: '提示', content: res.errmsg })
        }
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
        <Form onSubmit={this.hadlePwdSubmit.bind(this)}>
          <FormItem {...formItemLayout} label='原始密码'>
          {
            getFieldDecorator('originPassword', {
              rules: [
                { required: true, message: '请输入原始密码' }
              ],
            })(
              <Input type='password' placeholder='请输入原始密码' />
            )
          }
          </FormItem>
          <FormItem {...formItemLayout} label='新密码'>
          {
            getFieldDecorator('newPassword', {
              rules: [
                { required: true, message: '请输入新密码' },
                { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/, message: '格式错误，由字母和数字组成6~20位字符' },
                { validator: this.checkConfirm }
              ],
            })(
              <Input type='password' placeholder='请输入新密码' />
            )
          }
          </FormItem>
          <FormItem {...formItemLayout} label='确认新密码'>
          {
            getFieldDecorator('confirmPassword', {
              rules: [
                { required: true, message: '请输入确认新密码' },
                { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/, message: '格式错误，由字母和数字组成6~20位字符' },
                { validator: this.checkPassword }
              ],
            })(
              <Input type='password' placeholder='请输入确认新密码' onBlur={this.handleConfirmBlur} />
            )
          }
          </FormItem>
          <FormItem {...formTailLayout}>
            <Button type='primary' htmlType='submit'>保存</Button>
            <Button className={style['mgl20']} onClick={this.hadlePwdCancel.bind(this)}>取消</Button>
          </FormItem>
        </Form>
    )
  }
}

const WrapperChangePwdForm = Form.create()(EditPwdForm)

class ChangePwd extends Component {
  render() {
    return (
      <WrapperChangePwdForm hadlePwdCancel={this.props.hadlePwdCancel.bind(this)} urlId={this.props.urlId} />
    )
  }
}

export default ChangePwd
