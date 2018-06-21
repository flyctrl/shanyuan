/*
* @Author: chengbaosheng
* @Date:   2017-08-16 13:14:25
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-20 13:39:55
*/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Checkbox, Table, Button, Modal, message } from 'antd'
import * as urls from 'Src/contants/url'
import { getAllScope } from '../constant'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'
import style from '../style.css'
import { getScopeOption } from 'Src/contants/tooler'

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

class EditInfoForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ScopeOptions: [],
      formData: {},
      pagination: {},
      tabData: [],
      params: {}
    }
  }
  hadleSubmit(e) {
    e.preventDefault()
    const _t = this
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      let addJson = {}
      if (parseInt(_t.props.step) === 1) {
        addJson = { parentId: -1, businessScopId: fieldsValue['businessScopId'].join(',') }
      }
      fetch(api.editOptorList, {
        ...fieldsValue, ...addJson
      }).then((res) => {
        if (res.code === 0) {
          const modalEdit = Modal.success({ title: '提示', content: '修改成功' })
          setTimeout(() => {
            modalEdit.destroy()
            window.location.href = urls.OPERATORMAG
          }, 1000)
        } else {
          Modal.error({ title: '提示', content: res.errmsg })
        }
      })
    })
  }

  getTableById(params = {}) {
    fetch(api.getOptorList, {
      pageSize: 10,
      ...params,
    }).then((res) => {
      if (res.code === 0) {
        const data = res.data
        const pagination = { ...this.state.pagination }
        pagination.total = data.page.totalRowsAmount
        pagination.pageSize = 10
        this.setState({ pagination: pagination })
        this.setState({ tabData: data.operatorInfos })
      } else {
        message.error(res.errmsg)
      }
    })
  }

  _stringToAry(strary) {
    if (typeof strary !== 'undefined') {
      return strary.split(',')
    }
    return strary
  }

  handleTableChange(pagination, filters) {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    this.getTableById({
      pageSize: pagination.pageSize,
      currentPage: pagination.current,
      ...this.state.params,
    })
  }

  componentWillMount() {
    let ScopeOptions = getAllScope()
    this.setState({
      ScopeOptions
    })
    fetch(api.getOptorDetail, {
      id: this.props.urlId
    }).then((res) => {
      if (res.code === 0) {
        this.getTableById({ parentId: res.data['id'] })
        this.setState({ params: { parentId: res.data['id'] }})
        this.setState({ formData: res.data })
      } else {
        Modal.error({ title: '提示', 'content': res.errmsg })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const _t = this
    const columns = [{
      title: 'ID',
      dataIndex: 'operatorNumber',
      key: 'operatorNumber'
    }, {
      title: '子运营方名称',
      dataIndex: 'operatorName',
      key: 'operatorName'
    }, {
      title: '经营范围',
      dataIndex: 'businessScopId',
      key: 'businessScopId',
      render: (text) => {
        return getScopeOption(text, this.state.ScopeOptions)
      }
    },
    ]
    if (typeof _t.state.formData['businessScopId'] === 'undefined') {
      return (<div></div>)
    }
    return (
      <Form onSubmit={this.hadleSubmit.bind(this)} >
        <FormItem style={{ display: 'none' }}>
        {
          getFieldDecorator('id', {
            initialValue: this.state.formData['id']
          })(
            <Input disabled={true} />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='运营方ID'>
        {
          getFieldDecorator('operatorNumber', {
            initialValue: this.state.formData['operatorNumber']
          })(
            <Input disabled={true} />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='运营方名称'>
        {
          getFieldDecorator('operatorName', {
            rules: [{ required: true, message: '请输入运营方名称' }],
            initialValue: this.state.formData['operatorName']
          })(
            <Input placeholder='运营方名称' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='经营范围'>
          {
            getFieldDecorator('businessScopId', {
              rules: [{ required: true, message: '请选择经营范围' }],
              initialValue: _t._stringToAry(_t.state.formData['businessScopId'])
            })(
              <CheckboxGroup options={this.state.ScopeOptions} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label='子运营方情况'>
          <Table size='small' columns={columns} pagination={this.state.pagination} onChange={this.handleTableChange.bind(this)} dataSource={this.state.tabData} rowKey={record => record.id} />
        </FormItem>
        <FormItem {...formTailLayout}>
          <Button type='primary' htmlType='submit'>保存</Button>
          <Button className={style['mgl20']}><Link to={urls.OPERATORMAG}>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}

const WrapperEditInfoForm = Form.create()(EditInfoForm)

class OperatorEdit extends Component {
  render() {
    return (
      <WrapperEditInfoForm urlId={this.props.match.location.state['id']} step={this.props.match.location.state['step']} />
    )
  }
}

export default OperatorEdit
