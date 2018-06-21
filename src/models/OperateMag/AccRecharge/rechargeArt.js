/*
* @Author: chengbaosheng
* @Date:   2017-08-30 17:40:14
* @Last Modified by:   baosheng
* @Last Modified time: 2017-10-23 11:19:24
*/
import React, { Component } from 'react'
import { Modal } from 'antd'
import RechargeForm from './rechargeForm'

// 弹框组件（父组件）props：{ single：单个账号充值；batch：批量充值 }
class RechargeArt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      isClose: true,
      fields: {
        accountType: { value: '' },
        balance: { value: 1 },
        memo: { value: '' }
      }
    }
  }
  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  // componentWillMount() {
  //   if (this.props.type === 'single') { // 单个账户充值
  //   } else if (this.props.type === 'batch') { // 批量充值

  //   } else {
  //     return
  //   }

  // }

  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.artSource['visible'], isClose: nextProps.artSource['isClose'] })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      isClose: true,
      fields: {
        accountType: { value: '' },
        balance: { value: 1 },
        memo: { value: '' }
      }
    })
    // this.props.handleCancel()
  }

  handleCancelResult = () => {
    this.setState({
      visible: false,
      isClose: true,
      fields: {
        accountType: { value: '' },
        balance: { value: 1 },
        memo: { value: '' }
      }
    })
  }

  render() {
    return (
      this.state.isClose ? null : <Modal
        width={400}
        visible={this.state.visible}
        title={this.props.artSource['title']}
        onCancel={this.handleCancel}
        footer={null}
      >
        <RechargeForm
          {...this.state.fields}
          type={this.props.artSource['type']}
          artSource={this.props.artSource}
          postSource={this.props.postSource}
          handleCancel={this.handleCancel}
          onChange={this.handleFormChange}
        />
      </Modal>
    )
  }
}

export default RechargeArt
