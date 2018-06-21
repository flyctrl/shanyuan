/*
* @Author: chengbaosheng
* @Date:   2017-08-17 13:48:52
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-14 17:33:25
*/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Checkbox, Button, Select, Row, Col, Cascader, Modal } from 'antd'
import * as urls from 'Src/contants/url'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'
import { city } from './city'
import style from '../style.css'
import md5 from 'md5'
import { getAllScope, getAllTown, ShopMode, shopStatus } from '../constant'
import { setDisabledScope } from 'Src/contants/tooler'

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
      changePosData: '',
      confirmDirty: false,
      AllScopeOptions: [],
      scopeOptions: [],
      operators: [
        {
          id: '',
          operatorName: '',
          operatorNumber: 0,
          sonOperators: [
            {
              id: '',
              operatorNumber: '',
              operatorName: '',
              merchants: [
                {
                  id: '',
                  merchantNumber: '',
                  merchantName: '',
                }
              ]
            }
          ]
        }
      ],
      operatorName: '',
      sonOperators: [],
      sonOperatorName: '',
      merchants: [],
      merchantName: '',
      merchantNumber: '',
      operatorId: '',
      sonOperatorId: '',
      merchantId: '',
      merchantShops: [],
      estateOptions: [],
      isSelfSupport: false,
      townletOptions: [],
      townletNo: '无'
    }
  }

  hanleOperatorChange = (value) => {
    const operator = this.state.operators.filter((operator) => {
      return operator.operatorNumber === value
    })[0]
    const sonOperators = operator.sonOperators
    if (typeof sonOperators[0].merchants === 'undefined') {
      this.setState({
        sonOperators: sonOperators,
        operatorName: operator.operatorName,
        operatorId: operator.id
      })
      this.props.form.setFieldsValue({
        businessScopId: [],
        parentOperatorId: operator.operatorName,
        operatorId: '',
        merchantInfoId: ''
      })
    } else {
      this.setState({
        sonOperators: sonOperators,
        operatorName: operator.operatorName,
        merchants: sonOperators[0].merchants,
        sonOperatorName: sonOperators[0].operatorName,
        merchantName: sonOperators[0].merchants[0].merchantName,
        merchantNumber: sonOperators[0].merchants[0].merchantNumber,
        operatorId: operator.id,
        sonOperatorId: sonOperators[0].id,
        merchantId: sonOperators[0].merchants[0].id
      })
      this._getUsableScope(sonOperators[0].merchants[0].id)
      this.props.form.setFieldsValue({
        businessScopId: [],
        parentOperatorId: operator.operatorName,
        operatorId: sonOperators[0].operatorName,
        merchantInfoId: sonOperators[0].merchants[0].merchantName
      })
    }
  }

  handleSonOperatorChange = (value) => {
    const sonOperator = this.state.sonOperators.filter((sonOperator) => {
      return sonOperator.operatorNumber === value
    })[0]
    if (typeof sonOperator.merchants === 'undefined') {
      this.setState({
        sonOperatorName: sonOperator.operatorName,
        sonOperatorId: sonOperator.id
      })
      this.props.form.setFieldsValue({
        businessScopId: [],
        operatorId: sonOperator.operatorName,
        merchantInfoId: ''
      })
    } else {
      this.setState({
        sonOperatorName: sonOperator.operatorName,
        merchants: sonOperator.merchants,
        merchantName: sonOperator.merchants[0].merchantName,
        merchantNumber: sonOperator.merchants[0].merchantNumber,
        sonOperatorId: sonOperator.id,
        merchantId: sonOperator.merchants[0].id
      })
      this._getUsableScope(sonOperator.merchants[0].id)
      this.props.form.setFieldsValue({
        businessScopId: [],
        operatorId: sonOperator.operatorName,
        merchantInfoId: sonOperator.merchants[0].merchantName
      })
    }
  }

  handleShopChange = (value) => {
    const merchant = this.state.merchants.filter((merchant) => {
      return merchant.merchantNumber === value
    })[0]

    this.setState({
      merchantName: merchant.merchantName,
      merchantNumber: merchant.merchantNumber,
      merchantId: merchant.id
    })
    this._getUsableScope(merchant.id)
    this.props.form.setFieldsValue({
      businessScopId: [],
      merchantInfoId: merchant.merchantName
    })
  }

  handleSelfSupport = (value) => {
    if (parseInt(value) === 0) { // 自营
      this.setState({
        isSelfSupport: true
      })
      this._getAllIndustry()
    } else {
      this.setState({
        isSelfSupport: false
      })
    }
  }

  handleTownletSelect = (value) => {
    this.setState({
      townletNo: value
    })
  }

  hadleSubmit(e) {
    e.preventDefault()
    const _t = this
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const newScopeId = fieldsValue.businessScopId.join(',')
      fieldsValue['storeAddress'] = _t.state.changePosData + fieldsValue['storeAddress']
      fetch(api.addShopList, {
        ...fieldsValue, ...{ shopAccountPassword: md5(fieldsValue['shopAccountPassword']), businessScopId: newScopeId, parentOperatorId: this.state.operatorId, operatorId: this.state.sonOperatorId, merchantInfoId: this.state.merchantId }
      }).then((res) => {
        if (res.code === 0) {
          const modalAdd = Modal.success({ title: '提示', content: '添加成功' })
          setTimeout(() => {
            modalAdd.destroy()
            window.location.href = urls.SHOPMAG
          }, 1000)
        } else {
          Modal.error({ title: '提示', content: res.errmsg })
        }
      })
    })
  }

  // 密码的验证：handleConfirmBlur、checkPassword、checkConfirm
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致')
    } else {
      callback()
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  // 选择位置信息
  onPositionChange(value) {
    const _t = this
    let newVal = ''
    value.map((vals) => {
      newVal += vals + '-'
    })
    _t.setState({ changePosData: newVal })
  }

  _getUsableScope(id) { // 根据父级id获取可用的经营范围
    fetch(api.getSellList, {
      id: id,
      pageSize: 100
    }).then((res) => {
      if (res.code === 0) {
        this.setState({ scopeOptions: setDisabledScope(res.data.merchantInfos[0].businessScopId, this.state.AllScopeOptions) })
      } else {
        Modal.error({ title: '提示', 'content': res.errmsg })
      }
    })
  }

  async _getAllIndustry() { // 获取所有产业
    let estateOptions = await api.estateConfig.getAllIndustryInfo({}) || []
    let newEstateOptions = []
    estateOptions.map((item, value, index) => {
      newEstateOptions.push({ name: item['label'], value: item['value'] })
    })
    this.setState({
      estateOptions: newEstateOptions
    })
  }

  componentDidMount() {
    let ScopeOptions = getAllScope()
    let townOpitions = getAllTown()
    this.setState({
      AllScopeOptions: ScopeOptions,
      scopeOptions: ScopeOptions,
      townletOptions: townOpitions
    })
    fetch(api.queryShopAccount, {}).then(res => {
      const operators = res.data
      this.setState({
        operators,
        operatorName: operators[0].operatorName,
        sonOperators: operators[0]['sonOperators'],
        sonOperatorName: operators[0]['sonOperators'][0].operatorName,
        merchants: operators[0]['sonOperators'][0]['merchants'],
        merchantName: operators[0]['sonOperators'][0]['merchants'][0].merchantName,
        merchantNumber: operators[0]['sonOperators'][0]['merchants'][0].merchantNumber,
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const _t = this
    const operatorOptions = this.state.operators.map((operator, i) => {
      return (
        <Option style={{ padding: '0 8px' }} key={operator.operatorNumber}>{operator.operatorName}</Option>
      )
    })
    const sonOperatorOptions = this.state.sonOperators.map((sonOperator, i) => {
      return (
        <Option style={{ padding: '0 8px' }} key={sonOperator.operatorNumber}>{sonOperator.operatorName}</Option>
      )
    })
    const merchantOptions = this.state.merchants.map((merchant, i) => {
      return (
        <Option style={{ padding: '0 8px' }} key={merchant.merchantNumber}>{merchant.merchantName}</Option>
      )
    })

    const estateOptions = this.state.estateOptions.map((options, i) => {
      return (<Option style={{ padding: '0 8px' }} key={i} value={options.value.toString()}>{options.name}</Option>)
    })
    let estateItem = null
    if (this.state.isSelfSupport) {
      estateItem = <FormItem {...formItemLayout} style={{ display: this.state.isSelfSupport ? 'block' : 'none' }} label='所属产业'>
          {
            getFieldDecorator('industryNo', {})(
              <Select placeholder='--请选择所属产业--'>
                {estateOptions}
              </Select>
            )
          }
        </FormItem>
    }

    const townletOptions = this.state.townletOptions.map((options, i) => {
      return (<Option style={{ padding: '0 8px' }} key={i} value={options.value.toString()}>{options.label}</Option>)
    })
    return (
      <Form onSubmit={this.hadleSubmit.bind(this)}>
        <FormItem {...formItemLayout} label='店铺名称'>
        {
          getFieldDecorator('shopName', {
            rules: [{ required: true, message: '请输入店铺名称' }],
          })(
            <Input placeholder='店铺名称' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='店铺账号'>
        {
          getFieldDecorator('shopAccountName', {
            rules: [{ required: true, message: '请输入店铺账号' }],
          })(
            <Input placeholder='店铺账号' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='店铺密码'>
        {
          getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入店铺密码'
            }, {
              pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/, message: '密码格式错误，密码由字母和数字组成6~20位字符'
            }, {
              validator: this.checkConfirm
            }],
          })(
            <Input type='password' placeholder='店铺密码' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='确认密码'>
        {
          getFieldDecorator('shopAccountPassword', {
            rules: [{
              required: true, message: '请输入确认密码'
            }, {
              validator: this.checkPassword
            }],
          })(
            <Input type='password' placeholder='确认密码' onBlur={this.handleConfirmBlur} />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='店铺联系方式'>
        {
          getFieldDecorator('contactInformation', {
            rules: [{ required: true, message: '请输入店铺联系方式' }]
          })(
            <Input placeholder='店铺联系方式' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='联系人姓名'>
        {
          getFieldDecorator('contactName', {
            rules: [{ required: true, message: '请输入联系人姓名' }],
          })(
            <Input placeholder='联系人姓名' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='联系人手机号码'>
        {
          getFieldDecorator('contactNumber', {
            rules: [
              { required: true, message: '请输入手机号码' },
              // { pattern: /^(1[358479]\d{9})$/, message: '请输入正确格式的手机号码' }
            ],
          })(
            <Input style={{ width: '100%' }} placeholder='联系人手机号码' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='联系人邮箱'>
        {
          getFieldDecorator('contactMailbox', {
            rules: [{ type: 'email', message: '请输入正确格式的邮箱' }],
          })(
            <Input placeholder='联系人邮箱' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='店铺面积'>
          <Row gutter={10}>
            <Col span={16}>
              {
                getFieldDecorator('storeArea', {})(
                  <Input type='Number' placeholder='店铺面积' />
                )
              }
            </Col>
            <Col span={8}>
              ㎡
            </Col>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout} label='经营方式'>
          <div style={{ position: 'relative', height: 28 }} id='modeArea'>
          {
            getFieldDecorator('mode', {
              rules: [{ required: true, message: '请选择经营方式' }],
            })(
              <Select getPopupContainer={() => document.getElementById('modeArea')} placeholder='--请选择经营方式--'>
                {
                  ShopMode.map((options, i) => {
                    return (<Option style={{ padding: '0 8px' }} key={i} value={options.value.toString()}>{options.name}</Option>)
                  })
                }
              </Select>
            )
          }
          </div>
        </FormItem>
        <FormItem {...formItemLayout} style={{ height: '60px' }} label='位置信息'>
          <Row gutter={5}>
            <Col span={16} className={style['mgb10']}>
              <div style={{ position: 'relative', height: 28 }} id='storeAddressArea'>
              {
                getFieldDecorator('storeAddress', {
                  rules: [{
                    validator(rule, value, callback) {
                      if (_t.state.changePosData.length < 1) {
                        callback('请选择地区')
                      }
                      callback()
                    }
                  }, {
                    required: true, message: '请填写详细地址'
                  }],
                })(
                  <div>
                    <Cascader options={city} getPopupContainer={() => document.getElementById('storeAddressArea')} onChange={this.onPositionChange.bind(this)} placeholder='请选择地区' />
                    <Input placeholder='详细地址' type='text' />
                  </div>
                )
              }
              </div>
            </Col>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout} label='经度'>
        {
          getFieldDecorator('longitude', {})(
            <Input placeholder='经度' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='维度'>
        {
          getFieldDecorator('latitude', {})(
            <Input placeholder='维度' />
          )
        }
        </FormItem>
        <FormItem {...formItemLayout} label='所属运营方'>
          <div style={{ position: 'relative', height: 28 }} id='parentOperatorArea'>
          {
            getFieldDecorator('parentOperatorId', {
              rules: [{ required: true, message: '请选择所属运营方' }]
            })(
              <Select placeholder='--请选择所属运营方--' getPopupContainer={() => document.getElementById('parentOperatorArea')} onChange={this.hanleOperatorChange}>
                {operatorOptions}
              </Select>
            )
          }
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label='所属子运营方'>
          <div style={{ position: 'relative', height: 28 }} id='operatorIdArea'>
          {
            getFieldDecorator('operatorId', {
              rules: [{ required: true, message: '请选择所属子运营方' }]
            })(
              <Select placeholder='--请选择所属子运营方--' getPopupContainer={() => document.getElementById('operatorIdArea')} onChange={this.handleSonOperatorChange}>
                {sonOperatorOptions}
              </Select>
            )
          }
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label='所属商户'>
          <div style={{ position: 'relative', height: 28 }} id='merchantInfoArea'>
          {
            getFieldDecorator('merchantInfoId', {
              rules: [{ required: true, message: '请选择所属商户' }]
            })(
              <Select placeholder='--请选择所属商户--' getPopupContainer={() => document.getElementById('merchantInfoArea')} onChange={this.handleShopChange}>
                {merchantOptions}
              </Select>
            )
          }
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label='经营范围'>
          {
            getFieldDecorator('businessScopId', {
              rules: [{ required: true, message: '请选择经营范围' }],
            })(
              <CheckboxGroup options={this.state.scopeOptions} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label='标记'>
          {
            getFieldDecorator('shopStatus', {
              initialValue: '2'
            })(
              <Select placeholder='--请选择标记--'>
                {
                  shopStatus.map((options, i) => {
                    return (<Option style={{ padding: '0 8px' }} key={i} value={options.value.toString()}>{options.name}</Option>)
                  })
                }
              </Select>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label='是否自营'>
          {
            getFieldDecorator('selfSupport', {
              rules: [{ required: true, message: '请选择是否自营' }]
            })(
              <Select placeholder='--请选择--' onChange={this.handleSelfSupport.bind(this)}>
                <Option style={{ padding: '0 8px' }} key={0} value='0'>是</Option>
                <Option style={{ padding: '0 8px' }} key={1} value='1'>否</Option>
              </Select>
            )
          }
        </FormItem>
        {estateItem}
        <FormItem {...formItemLayout} label='所属小镇'>
          <div>
            {
              getFieldDecorator('townNo')(
                <Select style={{ width: '50%' }} placeholder='--请选择所属小镇--' onChange={this.handleTownletSelect.bind(this)}>
                  {townletOptions}
                </Select>
              )
            }
          <label style={{ marginLeft: '20px' }}>小镇编号：{this.state.townletNo}</label>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label='是否关联供应链'>
          {
            getFieldDecorator('relatedSupplyChain', {
              rules: [{ required: true, message: '请选择是否关联供应链' }]
            })(
              <Select placeholder='--请选择--'>
                <Option style={{ padding: '0 8px' }} key={0} value='0'>是</Option>
                <Option style={{ padding: '0 8px' }} key={1} value='1'>否</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem {...formTailLayout}>
          <Button type='primary' htmlType='submit'>保存</Button>
          <Button className={style['mgl20']}><Link to={urls.SHOPMAG}>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}

const WrapperAddInfoForm = Form.create()(AddInfoForm)

class ShopAdd extends Component {
  render() {
    return (
      <WrapperAddInfoForm />
    )
  }
}

export default ShopAdd
