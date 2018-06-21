/*
* @Author: chengbaosheng
* @Date:   2017-08-31 17:46:26
* @Last Modified by:   baosheng
* @Last Modified time: 2017-11-27 17:18:15
*/
import React, { Component } from 'react'
import { Form, Select, InputNumber, Input, Button, Modal, message, Icon } from 'antd'
import api from 'Src/contants/api'
import xfetch from 'Util/fetch'
import style from '../style.css'
import { baseUrl } from 'Util/index'

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm
const acctypeAry = [{ name: '外部账号', value: 1 }, { name: '内部账号', value: 2 }, { name: '星球币账号', value: 3 }]
const acctypeAry2 = [{ name: '内部账号', value: 2 }, { name: '星球币账号', value: 3 }]
const acctypeAry3 = [{ name: '外部账号', value: 1 }]
class RechargeEle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disabled: false,
      visibleResult: false,
      failResult: '',
      disClass: {},
      file: null,
      fileName: '',
      disUpload: {}
    }
  }

  // 取消操作
  handleCancel() {
    this.setState({ file: null, fileName: '', disUpload: {}})
    this.props.handleCancel()
  }

  _fnSingleRecharge(params = {}) {
    xfetch(api.rechageApply, params).then((res) => {
      if (res.code === 0) {
        const sucArt = Modal.success({
          title: '提示',
          content: '提交成功'
        })
        setTimeout(() => {
          sucArt.destroy()
        }, 800)
        this.handleCancel()
      } else {
        message.error(res.errmsg)
      }
    })
  }
  _fnBatchRecharge(params = {}) {
    const formData = new window.FormData()
    formData.append('file', this.state.file)
    formData.append('accountType', params.accountType)
    formData.append('memo', params.memo)
    fetch(baseUrl + api.fileRechageApply, {
      method: 'post',
      mode: 'cors',
      credentials: 'include',
      body: formData
    }).then((json) => {
      return json.json()
    }).then((res) => {
      if (res.code === 0) {
        const sucArt = Modal.success({
          title: '提示',
          content: '充值成功'
        })
        setTimeout(() => {
          sucArt.destroy()
        }, 800)
        this.handleCancel()
      } else if (res.code === -1) {
        this.setState({
          visibleResult: true,
          failResult: baseUrl + api.rechargeErrorInfo + '?fileName=' + res.data,
        })
      } else {
        message.error(res.errmsg)
      }
    })
  }
  rechargeFialCancel() {
    this.setState({ visibleResult: false, file: null })
    this.handleCancel()
  }
  // 提交操作
  handleSubmit(e) {
    e.preventDefault()
    const _t = this
    const recType = this.props.type
    if (recType === 'batch') {
      if (this.state.file === null) {
        message.error('请上传excel文件')
        return
      }
      const strName = this.state.file['name']
      if (strName.lastIndexOf('.xls') === -1 && strName.lastIndexOf('.xlsx') === -1 && strName.lastIndexOf('.xlsm') === -1 && strName.lastIndexOf('.xltx') === -1 && strName.lastIndexOf('.xltm') === -1 && strName.lastIndexOf('.xlsb') === -1 && strName.lastIndexOf('.xlam') === -1) {
        message.error('文件格式错误')
        return
      }
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        confirm({
          title: '提示',
          content: '是否确认提交工单',
          onOk() {
            if (recType === 'batch') {
              _t._fnBatchRecharge({ ...values, ...{ file: _t.state.file }})
            } else if (recType === 'single') {
              _t._fnSingleRecharge({ ...values, ...{ file: _t.state.file }})
            }
          }
        })
      }
    })
  }

  handleUploadFile(event) {
    // console.log(event.target.value)
    if (event.target.files.length !== 0) {
      this.setState({ file: event.target.files[0], fileName: event.target.files[0].name, disUpload: { background: '#EEE' }})
    }
  }
  handleDelFile() {
    this.setState({ file: null, fileName: '', disUpload: {}})
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    }
    let formBtnLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12, offset: 7 },
    }

    // 判断充值类型显示dom
    let balanceDom, downloadBtn, uploadEle, userNumDom, actypeDom
    if (this.props.type === 'single') {
      balanceDom = (<div>
        <FormItem {...formItemLayout} label='输入充值金额'>
          {getFieldDecorator('balance', {
            rules: [
              { required: true, message: '请输入充值金额' },
              { pattern: /^[1-9]\d*(\.\d+)?$/, message: '金额大于0的数' }
            ]
          })(
            <InputNumber />
          )}
        </FormItem>
        <FormItem {...formItemLayout} style={{ display: 'none' }}>
          {getFieldDecorator('mobileNo', {
            rules: [{ required: true, message: '手机号不能为空' }],
            initialValue: this.props.postSource['mobileNo']
          })(
            <Input type='text' />
          )}
        </FormItem>
        </div>)
      userNumDom = (<FormItem {...formItemLayout} style={{ display: 'none' }}>
          {getFieldDecorator('userNo', {
            rules: [{ required: true, message: 'ID不能为空' }],
            initialValue: this.props.postSource['userNumber']
          })(
            <Input type='text' />
          )}
        </FormItem>)
    } else if (this.props.type === 'batch') {
      formBtnLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 20, offset: 4 },
      }
      balanceDom = (<div></div>)
      downloadBtn = (<Button type='primary' className={style['mgl20']}><a href={ baseUrl + api.tempDown}>模板下载</a></Button>)
      uploadEle = (<FormItem {...formItemLayout} label='上传excel文件'>
          <div>
            <a className={style['a-upload']} style={this.state.disUpload}>
              上传文件
              <input value='' disabled={!!this.state.file} onChange={this.handleUploadFile.bind(this)} accept='application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' type='file' />
            </a>
            <p style={{ display: this.state.file ? 'block' : 'none' }}>{this.state.fileName} <a href='javascript:void(0)' onClick={this.handleDelFile.bind(this)}><Icon type='close' style={{ color: 'red' }} /></a></p>
          </div>
        </FormItem>)
    } else {
      return (<div>参数错误</div>)
    }

    if (this.props.type === 'batch') {
      actypeDom = acctypeAry2.map((options, i) => {
        return (
          <Option key={i} value={options.value.toString()}>{options.name}</Option>
        )
      })
    } else {
      if (this.props.postSource['clientType'] === 2) { // 外部账号
        actypeDom = acctypeAry3.map((options, i) => {
          return (
            <Option key={i} value={options.value.toString()}>{options.name}</Option>
          )
        })
      } else {
        actypeDom = acctypeAry.map((options, i) => {
          return (
            <Option key={i} value={options.value.toString()}>{options.name}</Option>
          )
        })
      }
    }
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        {userNumDom}
        <FormItem {...formItemLayout} label='选择充值账户'>
          {getFieldDecorator('accountType', {
            rules: [{ required: true, message: '请选择充值账户' }]
          })(
            <Select style={{ width: 200 }} placeholder='--请选择充值账户--' >
              {actypeDom}
            </Select>
          )}
        </FormItem>
        {balanceDom}
        <FormItem {...formItemLayout} label='备注'>
          {getFieldDecorator('memo', {
            rules: [{ required: true, message: '请输入备注' }],
          })(
            <Input type='text' />
          )}
        </FormItem>
        {uploadEle}
        <FormItem {...formBtnLayout}>
          <Button onClick={this.handleCancel.bind(this)}>取消</Button>
          {downloadBtn}
          <Button type='primary' htmlType='submit' className={style['mgl20']}>提交工单</Button>
        </FormItem>
        <Modal visible={this.state.visibleResult} onCancel={this.rechargeFialCancel.bind(this)} width={300} title={null} footer={null} >
          <center>充值失败</center>
          <center className={style['mgt20']}><Button type='primary'><a href={this.state.failResult}>导出充值失败结果</a></Button></center>
        </Modal>
      </Form>
    )
  }
}

const RechargeForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields)
  },
  mapPropsToFields(props) {
    let baseJson = {
      accountType: {
        ...props.accountType,
        defaultValue: props.accountType.value
      },
      memo: {
        ...props.memo,
        value: props.memo.value
      }
    }
    if (props.type === 'single') { // 单个账号
      return {
        ...baseJson,
        balance: {
          ...props.balance,
          value: props.balance.value
        }
      }
    } else if (props.type === 'batch') { // 批量账号
      return baseJson
    }
  },
})(RechargeEle)

export default RechargeForm
