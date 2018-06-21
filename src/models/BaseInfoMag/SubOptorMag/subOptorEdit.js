/*
* @Author: chengbaosheng
* @Date:   2017-08-16 19:04:25
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-20 14:20:39
*/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Checkbox, Table, Button, Select, Modal, message } from 'antd'
import * as urls from 'Src/contants/url'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'
import style from '../style.css'
import { getScopeOption, setDisabledScope } from 'Src/contants/tooler'
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

class EditInfoForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      AllScopeOptions: [],
      scopeOptions: [],
      operatorPatOptions: [],
      formData: {},
      parentId: '',
      pagination: [],
      tabData: [],
      params: {}
    }
  }

  hadleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const newScopeId = fieldsValue.businessScopId.join(',')
      fetch(api.editOptorList, {
        ...fieldsValue, ...{ businessScopId: newScopeId, parentId: this.state.parentId }
      }).then((res) => {
        if (res.code === 0) {
          const modalEdit = Modal.success({ title: '提示', content: '修改成功' })
          setTimeout(() => {
            modalEdit.destroy()
            window.location.href = urls.SUBOPTORMAG
          }, 1000)
        } else {
          Modal.error({ title: '提示', content: res.errmsg })
        }
      })
    })
  }

  getTableById(params = {}) {
    fetch(api.getSellList, {
      pageSize: 10,
      ...params,
    }).then((res) => {
      if (res.code === 0) {
        const data = res.data
        const pagination = { ...this.state.pagination }
        pagination.total = data.page.totalRowsAmount
        pagination.pageSize = 10
        this.setState({ pagination: pagination })
        this.setState({ tabData: data.merchantInfos })
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

  handleSelectChange(value, option) {
    this.setState({ scopeOptions: setDisabledScope(option.props.businessScopId, this.state.AllScopeOptions) })
    this.props.form.setFieldsValue({ businessScopId: [] })
    this.setState({ parentId: value })
  }

  _getUsableScope(id) { // 根据父级id获取可用的经营范围
    fetch(api.getOptorDetail, {
      id: id
    }).then((res) => {
      if (res.code === 0) {
        this.setState({ scopeOptions: setDisabledScope(res.data.businessScopId, this.state.AllScopeOptions) })
      } else {
        Modal.error({ title: '提示', 'content': res.errmsg })
      }
    })
  }

  componentWillMount() {
    let ScopeOptions = getAllScope()
    this.setState({
      AllScopeOptions: ScopeOptions,
      scopeOptions: ScopeOptions
    }, () => {
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
    })
  }

  componentDidMount() {
    fetch(api.getOptorDetail, {
      id: this.props.urlId
    }).then((res) => {
      if (res.code === 0) {
        this.getTableById({ operatorId: res.data['id'] })
        this.setState({ params: { operatorId: res.data['id'] }})
        this.setState({ parentId: res.data.parentId })
        this.setState({ formData: res.data })
        this._getUsableScope(res.data.parentId)
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
      dataIndex: 'merchantId',
      key: 'merchantId'
    }, {
      title: '商户名称',
      dataIndex: 'merchantName',
      key: 'merchantName'
    }, {
      title: '经营范围',
      dataIndex: 'businessScopId',
      key: 'businessScopId',
      render: (text) => {
        return getScopeOption(text, this.state.AllScopeOptions)
      }
    },
    ]
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
        <FormItem {...formItemLayout} label='子运营方ID'>
        {
          getFieldDecorator('operatorNumber', {
            initialValue: this.state.formData['operatorNumber']
          })(
            <Input disabled={true} />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='子运营方名称'>
        {
          getFieldDecorator('operatorName', {
            rules: [{ required: true, message: '请输入子运营方名称' }],
            initialValue: this.state.formData['operatorName']
          })(
            <Input placeholder='子运营方名称' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='所属运营方'>
          {
            getFieldDecorator('parentId', {
              rules: [{ required: true, message: '请选择所属运营方' }],
              initialValue: this.state.formData['parentOperatorName']
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
              initialValue: _t._stringToAry(_t.state.formData['businessScopId'])
            })(
              <CheckboxGroup options={this.state.scopeOptions} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label='商户情况'>
          <Table size='small' columns={columns} pagination={this.state.pagination} onChange={this.handleTableChange.bind(this)} dataSource={this.state.tabData} rowKey={record => record.id} />
        </FormItem>
        <FormItem {...formTailLayout}>
          <Button type='primary' htmlType='submit'>保存</Button>
          <Button className={style['mgl20']}><Link to={urls.SUBOPTORMAG}>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}

const WrapperEditInfoForm = Form.create()(EditInfoForm)

class SubOptorEdit extends Component {
  render() {
    return (
      <WrapperEditInfoForm urlId={this.props.match.location.state['id']} step={this.props.match.location.state['step']} />
    )
  }
}

export default SubOptorEdit
