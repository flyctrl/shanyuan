/*
* @Author: chengbaosheng
* @Date:   2017-08-18 14:09:44
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-14 17:32:02
*/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Checkbox, Button, Select, Row, Col, Cascader, Modal } from 'antd'
import * as urls from 'Src/contants/url'
import { city } from './city'
import ChangePwd from './changePwd'
import { getAllScope, ShopMode, shopStatus, getAllIndustry, getAllTown } from '../constant'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'
import style from '../style.css'
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
class EditInfoForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sellWayOptions: [],
      changePosData: '',
      formData: {},
      visible: false,
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
      industryOptions: [],
      townOptions: []
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
    if (typeof sonOperator.merchants[0] === 'undefined') {
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
    this.props.form.setFieldsValue({ businessScopId: [] })
    this.props.form.setFieldsValue({ merchantInfoId: merchant.merchantName })
  }

  hadleSubmit(e) {
    e.preventDefault()
    const _t = this
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      fieldsValue['storeAddress'] = _t.state.changePosData + fieldsValue['storeAddress']
      const newScopeId = fieldsValue.businessScopId.join(',')
      fetch(api.editShopList, {
        ...fieldsValue, ...{ parentOperatorId: this.state.operatorId, operatorId: this.state.sonOperatorId, merchantInfoId: this.state.merchantId, businessScopId: newScopeId }
      }).then((res) => {
        if (res.code === 0) {
          const modalEdit = Modal.success({ title: '提示', content: '修改成功' })
          setTimeout(() => {
            modalEdit.destroy()
            window.location.href = urls.SHOPMAG
          }, 1000)
        } else {
          Modal.error({ title: '提示', content: res.errmsg })
        }
      })
    })
  }

  _stringToAry(strary) {
    if (typeof strary !== 'undefined') {
      return strary.split(',')
    }
    return strary
  }

  _getUsableScope(id) { // 根据父级id获取可用的经营范围
    fetch(api.getSellerDetail, {
      id: id
    }).then((res) => {
      if (res.code === 0) {
        this.setState({ scopeOptions: setDisabledScope(res.data.businessScopId, this.state.AllScopeOptions) })
      } else {
        Modal.error({ title: '提示', 'content': res.errmsg })
      }
    })
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

  handlePwdChange() {
    this.setState({ visible: true })
  }
  hadlePwdCancel() {
    this.setState({ visible: false })
  }

  getShopDetail() {
    const _t = this
    let cascAry = []
    fetch(api.getShopDetail, {
      Id: _t.props.urlId
    }).then((res) => {
      if (res.code === 0) {
        _t.setState({
          operatorName: res.data['parentOperatorName'],
          sonOperatorName: res.data['operatorName'],
          merchantName: res.data['merchantName'],
          operatorId: res.data['parentOperatorId'],
          sonOperatorId: res.data['operatorId'],
          merchantId: res.data['businessMerchantInfoId']
        })

        const operators = this.state.operators
        const operatorIndex = this._getIndexById(this.state.operatorId, operators)
        _t.setState({
          sonOperators: operators[operatorIndex]['sonOperators'],
          merchants: operators[operatorIndex]['sonOperators'][0]['merchants']
        })

        _t.setState({ formData: res.data }, () => {
          // 设置Cascader的默认值
          let posStr = ''
          if (typeof _t.state.formData['storeAddress'] !== 'undefined') {
            if (_t.state.formData['storeAddress'] === null || _t.state.formData['storeAddress'] === '') {
              cascAry = []
            } else {
              _t.state.formData['storeAddress'].split('-').map((newAry, index) => {
                if (index < 3) {
                  posStr += newAry + '-'
                  cascAry.push(newAry)
                }
              })
            }
            _t.setState({ changePosData: posStr })
            _t.refs.cascaderPos.setState({ value: cascAry })
          }
        })
        this._getUsableScope(res.data.businessMerchantInfoId)
      } else {
        Modal.error({ title: '提示', content: res.errmsg })
      }
    })
  }

  _getIndexById(id, jsonAry) {
    let result = 0
    jsonAry.forEach((value, index, arry) => {
      if (value['id'] === id) {
        result = index
      }
    })
    return result
  }
  // getIndustryName(id) {
  //   let estateOptions = this.state.industryOptions
  //   let newEstateOptions = []
  //   estateOptions.map((item, value, index) => {
  //     newEstateOptions.push({ name: item['label'], value: item['value'] })
  //   })
  //   console.log(newEstateOptions)
  //   console.log(id)
  //   if (id !== '' && id !== undefined) {
  //     let findval = newEstateOptions.find(item => {
  //       return item.value === id
  //     })
  //     console.log(findval)
  //     return findval['name']
  //   } else {
  //     return '无'
  //   }
  // }
  componentWillMount() {
    let ScopeOptions = getAllScope()
    let industryOptions = getAllIndustry()
    let townOptions = getAllTown()
    this.setState({
      AllScopeOptions: ScopeOptions,
      scopeOptions: ScopeOptions,
      industryOptions,
      townOptions
    })
  }
  componentDidMount() {
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
      }, () => {
        this.getShopDetail()
      })
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const _t = this
    let cascInput = ''
    if (typeof this.state.formData['storeAddress'] !== 'undefined') {
      if (this.state.formData['storeAddress'] === null || this.state.formData['storeAddress'] === '') {
        cascInput = []
      } else {
        const cascInputAry = this.state.formData['storeAddress'].split('-')
        cascInput = cascInputAry[cascInputAry.length - 1]
      }
    } else {
      cascInput = []
    }

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

    const estateOptions = this.state.industryOptions.map((options, i) => {
      return (<Option style={{ padding: '0 8px' }} key={i} value={options.value.toString()}>{options.label}</Option>)
    })

    const townOptions = this.state.townOptions.map((options, i) => {
      return (<Option style={{ padding: '0 8px' }} key={i} value={options.value.toString()}>{options.label}</Option>)
    })

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
          <FormItem {...formItemLayout} label='店铺ID'>
          {
            getFieldDecorator('shopNumber', {
              initialValue: this.state.formData['shopNumber']
            })(
              <Input disabled={true} />
            )
          }
          </FormItem>
          <FormItem {...formItemLayout} label='店铺名称'>
          {
            getFieldDecorator('shopName', {
              rules: [{ required: true, message: '请输入店铺名称' }],
              initialValue: this.state.formData['shopName']
            })(
              <Input placeholder='店铺名称' />
            )
          }
          </FormItem>
          <FormItem {...formItemLayout} label='店铺账号'>
          {
            getFieldDecorator('shopAccountName', {
              rules: [{ required: true, message: '请输入店铺账号' }],
              initialValue: this.state.formData['shopAccountName']
            })(
              <Input placeholder='店铺账号' />
            )
          }
          </FormItem>
          <FormItem {...formItemLayout} label='店铺密码'>
            <Button type='primary' onClick={this.handlePwdChange.bind(this)}>修改密码</Button>
          </FormItem>
          <FormItem {...formItemLayout} label='店铺联系方式'>
          {
            getFieldDecorator('contactInformation', {
              rules: [{ required: true, message: '请输入店铺联系方式' }],
              initialValue: this.state.formData['contactInformation']
            })(
              <Input placeholder='店铺联系方式' />
            )
          }
          </FormItem>
          <FormItem {...formItemLayout} label='联系人姓名'>
          {
            getFieldDecorator('contactName', {
              rules: [{ required: true, message: '请输入联系人姓名' }],
              initialValue: this.state.formData['contactName']
            })(
              <Input placeholder='联系人姓名' />
            )
          }
          </FormItem>
          <FormItem {...formItemLayout} label='联系人手机号码'>
          {
            getFieldDecorator('contactNumber', {
              rules: [
                { required: true, message: '请输入联系人手机号码' },
                // { pattern: /^(1[358479]\d{9})$/, message: '请输入正确格式的手机号码' }
              ],
              initialValue: this.state.formData['contactNumber']
            })(
              <Input style={{ width: '100%' }} placeholder='联系人手机号码' />
            )
          }
          </FormItem>
          <FormItem {...formItemLayout} label='联系人邮箱'>
            {getFieldDecorator('contactMailbox', {
              rules: [{ type: 'email', message: '请输入正确格式的邮箱' }],
              initialValue: this.state.formData['contactMailbox']
            })(
              <Input placeholder='联系人邮箱' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='店铺面积'>
            <Row gutter={10}>
              <Col span={14}>
                {
                  getFieldDecorator('storeArea', {
                    initialValue: this.state.formData['storeArea']
                  })(
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
                initialValue: this.state.formData['mode']
              })(
                <Select getPopupContainer={() => document.getElementById('modeArea')} placeholder='--请选择经营方式--'>
                  {
                    ShopMode.map((options, i) => {
                      return (<Option key={i} style={{ padding: '0 8px' }} value={options.value.toString()}>{options.name}</Option>)
                    })
                  }
                </Select>
              )
            }
            </div>
          </FormItem>
          <FormItem {...formItemLayout} style={{ height: '60px' }} label='位置信息'>
            <Row gutter={5}>
              <Col span={14} className={style['mgb10']}>
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
                      required: true, message: '请填写详细地址',
                    }],
                    initialValue: cascInput
                  })(
                    <div>
                      <Cascader
                        ref='cascaderPos'
                        options={city}
                        getPopupContainer={() => document.getElementById('storeAddressArea')}
                        onChange={this.onPositionChange.bind(this)}
                        placeholder='请选择地区'
                      />
                      <Input defaultValue={cascInput} ref='cascaderInput' placeholder='详细地址' />
                    </div>
                  )
                }
                </div>
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label='经度'>
          {
            getFieldDecorator('longitude', {
              initialValue: this.state.formData['longitude']
            })(
              <Input placeholder='经度' />
            )
          }
          </FormItem>
          <FormItem {...formItemLayout} label='纬度'>
          {
            getFieldDecorator('latitude', {
              initialValue: this.state.formData['latitude']
            })(
              <Input placeholder='纬度' />
            )
          }
          </FormItem>
          <FormItem {...formItemLayout} label='所属运营方'>
            <div style={{ position: 'relative', height: 28 }} id='parentOperatorArea'>
            {
              getFieldDecorator('parentOperatorId', {
                rules: [{ required: true, message: '请选择所属运营方' }],
                initialValue: this.state.operatorName
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
                rules: [{ required: true, message: '请选择所属子运营方' }],
                initialValue: this.state.sonOperatorName
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
                rules: [{ required: true, message: '请选择所属商户' }],
                initialValue: this.state.merchantName
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
                initialValue: _t._stringToAry(_t.state.formData['businessScopId'])
              })(
                <CheckboxGroup options={this.state.scopeOptions} />
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label='标记'>
          {
            getFieldDecorator('shopStatus', {
              initialValue: this.state.formData['shopStatus']
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
              initialValue: this.state.formData['selfSupport'],
              rules: [{ required: true, message: '请选择是否自营' }]
            })(
              <Select placeholder='--请选择--'>
                <Option style={{ padding: '0 8px' }} key={0} value='0'>是</Option>
                <Option style={{ padding: '0 8px' }} key={1} value='1'>否</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label='所属产业'>
          {
            getFieldDecorator('industryNo', {
              initialValue: this.state.formData['industryNo'],
            })(
              <Select placeholder='--请选择所属产业--'>
                {estateOptions}
              </Select>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label='所属小镇'>
          {
            getFieldDecorator('townNo', {
              initialValue: this.state.formData['townNo'],
            })(
              <Select placeholder='--请选择所属小镇--'>
                {townOptions}
              </Select>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label='是否关联供应链'>
          {
            getFieldDecorator('relatedSupplyChain', {
              initialValue: this.state.formData['relatedSupplyChain'],
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

const ShopEdit = ({ match }) => {
  return (
    <WrapperEditInfoForm urlId={match.location.state['id']} />
  )
}

export default ShopEdit
