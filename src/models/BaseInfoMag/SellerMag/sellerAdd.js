/*
* @Author: chengbaosheng
* @Date:   2017-08-17 10:59:46
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-21 16:43:13
*/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Checkbox, Button, Select, Row, Col, Modal } from 'antd'
import * as urls from 'Src/contants/url'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'
import style from '../style.css'
import { getAllScope } from '../constant'
import { setDisabledScope } from 'Src/contants/tooler'
import md5 from 'md5'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
}

class AddInfoForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      AllScopeOptions: [],
      scopeOptions: [],
      confirmDirty: false,
      operatorSubOptions: []
    }
  }

  hadleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const newScopeId = fieldsValue.businessScopId.join(',')
      fetch(api.addSellerList, {
        ...fieldsValue, ...{ businessScopId: newScopeId, merchantAccountPassword: md5(fieldsValue.merchantAccountPassword), confirm: md5(fieldsValue.confirm) }
      }).then((res) => {
        if (res.code === 0) {
          const modalAdd = Modal.success({ title: '提示', content: '添加成功' })
          setTimeout(() => {
            modalAdd.destroy()
            window.location.href = urls.SELLERMAG
          }, 1000)
        } else {
          Modal.error({ title: '提示', content: res.errmsg })
        }
      })
    })
  }

  handleSelectChange(value, option) {
    this.setState({ scopeOptions: setDisabledScope(option.props.businessScopId, this.state.AllScopeOptions) })
    this.props.form.setFieldsValue({ businessScopId: [] })
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('merchantAccountPassword')) {
      callback('您输入的两次密码不一致')
    } else {
      callback()
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  componentWillMount() {
    let AllScopeOptions = getAllScope()
    this.setState({
      AllScopeOptions: AllScopeOptions,
      scopeOptions: AllScopeOptions
    })
    fetch(api.getOptorList, {
      step: 2,
      pageSize: 100
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          operatorSubOptions: res.data.operatorInfos
        })
      } else {
        Modal.error({ title: '提示', 'content': res.errmsg })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.hadleSubmit.bind(this)}>
        <FormItem {...formItemLayout} label='商户名称'>
        {
          getFieldDecorator('merchantName', {
            rules: [{ required: true, message: '请输入商户名称' }],
          })(
            <Input placeholder='商户名称' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='联系人姓名'>
        {
          getFieldDecorator('linkMan', {
            rules: [{ required: true, message: '请输入联系人姓名' }],
          })(
            <Input placeholder='联系人姓名' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='联系人电话'>
          <Row gutter={10}>
            <Col span={14}>
              {
                getFieldDecorator('contactNumber', {
                  rules: [
                    { required: true, message: '请输入联系人电话' },
                    // { pattern: /^((0\d{2,3}-\d{7,8})|(1[35847]\d{9}))$/, message: '请输入正确格式的号码' }
                  ],
                })(
                  <Input placeholder='联系人电话' />
                )
              }
            </Col>
            <Col span={10}>
              <em>固定电话格式：区号-号码</em>
            </Col>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout} label='联系人邮箱'>
        {
          getFieldDecorator('email', {
            rules: [{ type: 'email', message: '请输入正确格式的邮箱' }],
          })(
            <Input placeholder='联系人邮箱' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='商户账号'>
          {
            getFieldDecorator('merchantAccountName', {
              rules: [{ required: true, message: '请输入商户账号' }],
            })(
              <Input placeholder='请输入商户账号' />
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='商户密码'
        >
          {getFieldDecorator('merchantAccountPassword', {
            rules: [{
              required: true, message: '请输入商户密码',
            }, { pattern: /^.{6,20}$/, message: '格式错误，密码长度6~20位字符' }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input placeholder='请输入商户密码' type='password' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='确认密码'
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '请输入确认密码',
            }, { pattern: /^.{6,20}$/, message: '格式错误，密码长度6~20位字符' }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input placeholder='请输入确认密码' type='password' onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label='所属子运营方'>
          {
            getFieldDecorator('operatorId', {
              rules: [{ required: true, message: '请选择所属子运营方' }],
            })(
              <Select onSelect={this.handleSelectChange.bind(this)} placeholder='--请选择所属子运营方--'>
                {
                  this.state.operatorSubOptions.map((options, i) => {
                    return (<Option key={i} businessScopId={options.businessScopId} value={(options.id).toString()}>{options.operatorName}</Option>)
                  })
                }
              </Select>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label='经营范围'>
          {
            getFieldDecorator('businessScopId', {
              rules: [{ required: true, message: '请选择经营范围' }],
              initialValue: []
            })(
              <CheckboxGroup options={this.state.scopeOptions} />
            )
          }
        </FormItem>
        <FormItem {...formTailLayout}>
          <Button type='primary' htmlType='submit'>保存</Button>
          <Button className={style['mgl20']}><Link to={urls.SELLERMAG}>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}

const WrapperAddInfoForm = Form.create()(AddInfoForm)

class SellerAdd extends Component {
  render() {
    return (
      <WrapperAddInfoForm />
    )
  }
}

export default SellerAdd
