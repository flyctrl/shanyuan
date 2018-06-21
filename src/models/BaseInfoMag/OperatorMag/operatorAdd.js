/*
* @Author: chengbaosheng
* @Date:   2017-08-16 15:04:45
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-20 13:32:17
*/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Checkbox, Button, Modal } from 'antd'
import * as urls from 'Src/contants/url'
import { getAllScope } from '../constant'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'
import style from '../style.css'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
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
      ScopeOptions: []
    }
  }
  hadleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const newScopeId = fieldsValue.businessScopId.join(',')
      fetch(api.addOptorList, { ...fieldsValue, ...{ businessScopId: newScopeId }}).then((res) => {
        if (res.code === 0) {
          const modalAdd = Modal.success({ title: '提示', content: '添加成功' })
          setTimeout(() => {
            modalAdd.destroy()
            window.location.href = urls.OPERATORMAG
          }, 1000)
        } else {
          Modal.error({ title: '提示', content: res.errmsg })
        }
      })
    })
  }
  componentWillMount() {
    let ScopeOptions = getAllScope()
    this.setState({
      ScopeOptions
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.hadleSubmit.bind(this)}>
        <FormItem style={{ display: 'none' }}>
          {
            getFieldDecorator('step', {
              rules: [{ required: true, message: '运营方等级' }],
              initialValue: 1
            })(
              <Input/>
            )
          }
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {
            getFieldDecorator('parentId', {
              rules: [{ required: true, message: '上级运营方编号' }],
              initialValue: -1
            })(
              <Input/>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label='运营方名称'>
        {
          getFieldDecorator('operatorName', {
            rules: [{ required: true, message: '请输入运营方名称' }],
          })(
            <Input type='text' placeholder='运营方名称' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='经营范围'>
          {
            getFieldDecorator('businessScopId', {
              rules: [{ required: true, message: '请选择经营范围' }],
            })(
              <CheckboxGroup options={this.state.ScopeOptions} />
            )
          }
        </FormItem>
        <FormItem {...formTailLayout}>
          <Button type='primary' htmlType='submit'>保存</Button>
          <Button className={style['mgl20']}><Link to={urls.OPERATORMAG}>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}

const WrapperAddInfoForm = Form.create()(AddInfoForm)

class OperatorAdd extends Component {
  render() {
    return (
      <WrapperAddInfoForm />
    )
  }
}

export default OperatorAdd
