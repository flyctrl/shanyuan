/*
* @Author: chengbaosheng
* @Date:   2017-08-16 18:27:27
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-20 14:13:20
*/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Checkbox, Button, Select, Modal } from 'antd'
import * as urls from 'Src/contants/url'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'
import style from '../style.css'
import { setDisabledScope } from 'Src/contants/tooler'
import { getAllScope } from '../constant'

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
      operatorPatOptions: []
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
            window.location.href = urls.SUBOPTORMAG
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

  componentWillMount() {
    let ScopeOptions = getAllScope()
    this.setState({
      AllScopeOptions: ScopeOptions,
      scopeOptions: ScopeOptions
    })
  }

  componentDidMount() {
    fetch(api.getOptorList, {
      step: 1,
      pageSize: 100
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          operatorPatOptions: res.data.operatorInfos
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
        <FormItem style={{ display: 'none' }}>
          {
            getFieldDecorator('step', {
              rules: [{ required: true, message: '运营方等级' }],
              initialValue: 2
            })(
              <Input/>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label='子运营方名称'>
          {
            getFieldDecorator('operatorName', {
              rules: [{ required: true, message: '请输入子运营方名称' }],
            })(
              <Input placeholder='子运营方名称' />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label='所属运营方'>
          {
            getFieldDecorator('parentId', {
              rules: [{ required: true, message: '请选择所属运营方' }],
            })(
              <Select onSelect={this.handleSelectChange.bind(this)} placeholder='--请选择所属运营方--'>
                {
                  this.state.operatorPatOptions.map((options, i) => {
                    return (<Option key={options.id} businessScopId={options.businessScopId} value={options.id.toString()}>{options.operatorName}</Option>)
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
          <Button className={style['mgl20']}><Link to={urls.SUBOPTORMAG}>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}

const WrapperAddInfoForm = Form.create()(AddInfoForm)

class SubOptorAdd extends Component {
  render() {
    return (
      <WrapperAddInfoForm />
    )
  }
}

export default SubOptorAdd
