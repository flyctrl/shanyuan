/*
* @Author: chengbaosheng
* @Date:   2017-08-17 09:31:37
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-21 16:43:24
*/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Checkbox, Table, Button, Select, Row, Col, Modal, message } from 'antd'
import ChangePwd from './changePwd'
import * as urls from 'Src/contants/url'
import { getAllScope } from '../constant'
import { getScopeOption, setDisabledScope } from 'Src/contants/tooler'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'
import style from '../style.css'

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
      operatorSubOptions: [],
      formData: {},
      operatorId: '',
      visible: false,
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
      fetch(api.editSellerList, {
        ...fieldsValue, ...{ businessScopId: newScopeId, operatorId: this.state.operatorId }
      }).then((res) => {
        if (res.code === 0) {
          const modalEdit = Modal.success({ title: '提示', content: '修改成功' })
          setTimeout(() => {
            modalEdit.destroy()
            window.location.href = urls.SELLERMAG
          }, 1000)
        } else {
          Modal.error({ title: '提示', content: res.errmsg })
        }
      })
    })
  }

  getTableById(params = {}) {
    fetch(api.getShopList, {
      pageSize: 10,
      ...params,
    }).then((res) => {
      if (res.code === 0) {
        const data = res.data
        const pagination = { ...this.state.pagination }
        pagination.total = data.page.totalRowsAmount
        this.setState({ pagination: pagination })
        this.setState({ tabData: data.merchantShops })
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
    pager.pageSize = 10
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
    this.setState({ operatorId: value })
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

  handlePwdChange() {
    this.setState({ visible: true })
  }
  hadlePwdCancel() {
    this.setState({ visible: false })
  }

  componentWillMount() {
    let ScopeOptions = getAllScope()
    this.setState({
      AllScopeOptions: ScopeOptions,
      scopeOptions: ScopeOptions
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

  componentDidMount() {
    fetch(api.getSellerDetail, {
      Id: this.props.urlId
    }).then((res) => {
      if (res.code === 0) {
        this.getTableById({ merchantInfoId: res.data['id'] })
        this.setState({ params: { merchantInfoId: res.data['id'] }})
        this.setState({ operatorId: res.data.operatorInfoId })
        this.setState({ formData: res.data })
        this._getUsableScope(res.data.operatorInfoId)
      } else {
        Modal.error({ title: '提示', 'content': res.errmsg })
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: 'ID',
      dataIndex: 'shopNumber',
      key: 'shopNumber'
    }, {
      title: '店铺名称',
      dataIndex: 'shopName',
      key: 'shopName'
    }, {
      title: '经营范围',
      dataIndex: 'businessScopId',
      key: 'businessScopId',
      render: (text) => {
        return getScopeOption(text, this.state.AllScopeOptions)
      }
    },
    ]
    const _t = this
    return (
      <div>
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
          <FormItem {...formItemLayout} label='商户ID'>
          {
            getFieldDecorator('merchantId', {
              initialValue: this.state.formData['merchantId']
            })(
              <Input disabled={true} />
            )
          }
          </FormItem>
          <FormItem {...formItemLayout} label='商户名称'>
          {
            getFieldDecorator('merchantName', {
              rules: [{ required: true, message: '请输入商户名称' }],
              initialValue: this.state.formData['merchantName']
            })(
              <Input placeholder='商户名称' />
            )
          }
          </FormItem>
          <FormItem {...formItemLayout} label='联系人姓名'>
          {
            getFieldDecorator('linkMan', {
              rules: [{ required: true, message: '请输入联系人姓名' }],
              initialValue: this.state.formData['linkMan']
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
                    initialValue: this.state.formData['contactNumber']
                  })(
                    <Input style={{ width: '100%' }} placeholder='手机号或固定电话' />
                  )
                }
              </Col>
              <Col span={10}>
                <em>固定电话格式：区号-号码</em>
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label='联系人邮箱'>
            {getFieldDecorator('email', {
              rules: [{ type: 'email', message: '请输入正确格式的邮箱' }],
              initialValue: this.state.formData['email']
            })(
              <Input placeholder='联系人邮箱' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='商户账号'>
            {
              getFieldDecorator('merchantAccountName', {
                rules: [{ required: true, message: '请输入商户账号' }],
                initialValue: this.state.formData['merchantAccountName']
              })(
                <Input placeholder='请输入商户账号' />
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label='商户密码'>
            <Button type='primary' onClick={this.handlePwdChange.bind(this)}>修改密码</Button>
          </FormItem>
          <FormItem {...formItemLayout} label='所属子运营方'>
            {
              getFieldDecorator('operatorId', {
                rules: [{ required: true, message: '请选择所属子运营方' }],
                initialValue: this.state.formData['operatorName']
              })(
                <Select onSelect={this.handleSelectChange.bind(this)} placeholder='--请选择所属子运营方--'>
                  {
                    this.state.operatorSubOptions.map((options, i) => {
                      return (<Option key={i} businessScopId={options.businessScopId} value={options.id.toString()}>{options.operatorName}</Option>)
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
          <FormItem {...formItemLayout} label='店铺情况'>
            <Table size='small' columns={columns} pagination={this.state.pagination} dataSource={this.state.tabData} onChange={this.handleTableChange.bind(this)} rowKey={record => record.id} />
          </FormItem>
          <FormItem {...formTailLayout}>
            <Button type='primary' htmlType='submit'>保存</Button>
            <Button className={style['mgl20']}><Link to={urls.SELLERMAG}>取消</Link></Button>
          </FormItem>
        </Form>
        {
          this.state.visible &&
          <Modal
          title='修改密码'
          width={340}
          visible={this.state.visible}
          closable={false}
          footer={null}
          >
            <ChangePwd hadlePwdCancel={this.hadlePwdCancel.bind(this)} urlId={this.props.urlId} />
          </Modal>
        }
      </div>
    )
  }
}

const WrapperEditInfoForm = Form.create()(EditInfoForm)

const SellerEdit = ({ match }) => {
  return (
    <WrapperEditInfoForm urlId={match.location.state['id']} />
  )
}

export default SellerEdit
