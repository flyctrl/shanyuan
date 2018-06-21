/**
 * @Author: sunshiqiang
 * @Date: 2017-08-31 11:13:57
 */

import React, { Component } from 'react'
import api from 'Src/contants/api'
import { baseUrl } from 'Util/index'
import { Row, Col, Button, Modal, Form, Input, Table, Select, InputNumber } from 'antd'
import styles from './detail.css'

const FormItem = Form.Item
const Option = Select.Option

class Detail2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataStore: {},
      dataDelivery: [],
      options: [],
      selected: {},
      loading: false,
      visible: false,
      batch: this.props.match.location.search.split('=')[1],
    }
  }

  componentWillMount() {
    this._loadDataStore()
    this._loadDataDelivery()
  }

  async _loadDataStore() {
    const { batch } = this.state
    const dataStore = await api.prepaidCard.store.detial({ batch }) || {}
    this.setState({ dataStore })
  }

  async _loadDataDelivery() {
    const { batch } = this.state
    const dataDelivery = await api.prepaidCard.store.detial2.history({ batch }) || {}
    this.setState({ dataDelivery })
  }

  async _loadDataAddress(value) {
    const dataAddress = await api.prepaidCard.store.detial2.address(value) || {}
    let options = []
    options = dataAddress.operatorInfos && dataAddress.operatorInfos.map((item) => {
      return <Option key={item.operatorName}>{item.operatorName}</Option>
    })
    this.setState({ options })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { batch } = this.state
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        (async (values) => {
          const data = await api.prepaidCard.store.detial2.send(values)
          this.setState({ loading: false, visible: false })
          if (data) {
            this._loadDataStore()
            this._loadDataDelivery()
          }
        })({ ...values, batch })
      }
    })
  }
  showModal = () => {
    this.setState({
      visible: true,
    })
    const { resetFields } = this.props.form
    resetFields()
    this._loadDataAddress('')
  }

  _prefixInteger(num, n) {
    if (num.toString().length >= n) {
      return
    } else {
      return (Array(n).join(0) + num).slice(-n)
    }
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }
  handleAddressChange = (value) => {
    this.setState({ address02: '' })
    this._loadDataAddress(value)
  }
  handleAddressBlur = () => {
    const { setFieldsValue } = this.props.form
    const { address02 } = this.state
    setFieldsValue({ address02 })
  }
  handleAddressSelect = (address02) => {
    this.setState({ address02 })
  }
  handleNumChange = (value) => {
    const { dataStore } = this.state
    const { setFieldsValue } = this.props.form
    if (Number(value) < 1) {
      setFieldsValue({ numTo: '' })
    } else {
      const num = Number(dataStore.num)
      const grantMinCard = dataStore.grantMinCard
      const minNum = Number(grantMinCard.substr(5, 6))
      value = num < Number(value) ? num : Number(value)
      let maxNum = minNum + value - 1
      maxNum = this._prefixInteger(maxNum, 6)
      const numTo = grantMinCard.substr(0, 5) + maxNum + grantMinCard.substr(-1, 1)
      setFieldsValue({ numTo })
    }
  }
  _checkNum = (rule, value, callback) => {
    const { dataStore } = this.state
    if (value === '') {
      callback(`请填写信息`)
      return
    }
    if (dataStore.stockNum >= value) {
      callback()
    } else {
      callback(`库存为${dataStore.stockNum}`)
    }
  }

  _checkNum2 = (rule, value, callback) => {
    console.log(typeof value)
    if (/^\d+$/.test(value)) {
      callback()
    } else {
      callback(`请填写数字`)
      return
    }
  }

  render() {
    const { dataStore, dataDelivery, batch, options } = this.state
    const { getFieldDecorator, getFieldValue } = this.props.form
    const config = {
      rules: [{ required: true, message: '请填写信息' }],
    }
    const columns = [{
      title: '投放批次号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '号段',
      dataIndex: 'grantMinCard',
      key: 'grantMinCard',
      render: (text, record) => <span>{record.fromnum}～{record.tonum}</span>,
    }, {
      title: '投放时间',
      dataIndex: 'gmtCreated',
      key: 'gmtCreated',
    }, {
      title: '投放对象',
      dataIndex: 'address02',
      key: 'address02',
    }, {
      title: '卡片数量',
      dataIndex: 'count',
      key: 'count',
    }, {
      title: '总金额',
      dataIndex: 'totle',
      key: 'totle',
      render: (text, record) => <span>{record.count * record.amount}</span>,
    }]
    return (<div>
      <Modal
        visible={this.state.visible}
        title={<p style={{ textAlign: 'center' }}>充值卡投放</p>}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key='back' size='large' onClick={this.handleCancel}>取消</Button>,
          <Button key='submit' type='primary' size='large' loading={this.state.loading} onClick={this.handleSubmit}>
            投放
          </Button>,
        ]}
      >
        <Form layout='inline' className={styles.form} onSubmit={this.handleSubmit}>
          <FormItem label='投放数量'>
            {getFieldDecorator('num', {
              rules: [{
                required: true,
                validator: this._checkNum,
              }],
              initialValue: '',
            })(
              <InputNumber
                style={{ width: 150, marginRight: '0' }}
                min={1}
                onChange={this.handleNumChange}
              />
            )}
          </FormItem>
          <span className={styles.tip}>总金额 {getFieldValue('num') * dataStore.amount}元</span>
          <FormItem label='选择号段'>
            {getFieldDecorator('numFrom', {
              ...config,
              initialValue: dataStore.grantMinCard,
            })(
              <Input
                disabled
                style={{ width: 150 }}
                type={'number'}
              />
            )}
          </FormItem>
          <span className={styles.tip}>～</span>
          <FormItem>
            {getFieldDecorator('numTo', {
              ...config,
              initialValue: '',
            })(
              <Input
                disabled
                style={{ width: 150 }}
                type={'number'}
              />
            )}
          </FormItem>
          <FormItem label='投放对象'>
            {getFieldDecorator('address02', {
              ...config,
              initialValue: '',
            })(
              <Select
                mode={'combobox'}
                style={{ width: 300 }}
                filterOption={false}
                onSearch={this.handleAddressChange}
                defaultActiveFirstOption={true}
                onSelect={this.handleAddressSelect}
                onBlur={this.handleAddressBlur}
                allowClear={true}
              >
                {options}
              </Select>
            )}
          </FormItem>
          <FormItem label='接收人'>
            {getFieldDecorator('linkMan', {
              ...config,
              initialValue: '',
            })(
              <Input
                style={{ width: 250 }}
                type={'text'}
              />
            )}
          </FormItem>
          <FormItem label='接收人的联系方式'>
            {getFieldDecorator('linkPhone', {
              rules: [{
                required: true,
                validator: this._checkNum2,
              }],
              initialValue: '',
            })(
              <Input
                style={{ width: 200 }}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
      <Row className={styles['data-store-layout']}>
        <Col span={24} className={styles.title}>卡库存信息:</Col>
        <Col span={12}>
          <div className={styles.left}>
            <p><span>卡片面额</span><span>{dataStore.amount}元</span></p>
            <p><span>生成数量</span><span>{dataStore.num}张</span></p>
            <p><span>配置时间</span><span>{dataStore.gmtCreated}</span></p>
            <p><span>制卡时间</span><span>{dataStore.gmtModified}</span></p>
            <p><span>库存数量</span><span>{dataStore.stockNum}张</span></p>
            <p><span>入库时间</span><span>{dataStore.gmtCreated}</span></p>
            <p><span>卡片描述</span><span>{dataStore.msg}</span></p>
            <p><span>号段</span><span>{dataStore.mincard}～{dataStore.maxcard}</span></p>
          </div>
        </Col>
        <Col span={12} className={styles.right}>
          <div className={styles.img}>
            <img src={dataStore.img} alt='图片'/>
          </div>
        </Col>
        <div className={styles.btns}>
          <span className={styles.code}>批次号：{dataStore.batch}</span>
          <Button className={styles.btn} type='primary'><a
            href={`${baseUrl}${api.prepaidCard.export}${batch}`} download>批量导出</a></Button>
          {dataStore.status === 4 ? <Button className={styles.btn}
                                            disabled>已完整投放</Button>
            : <Button type='primary'
                      className={styles.btn}
                      onClick={this.showModal}>投放</Button>}
        </div>
      </Row>
      <Row className={styles['data-delivery-layout']}>
        <Col span={24} className={styles.title}>卡投放信息:</Col>
        <Col span={24}><Table
          columns={columns}
          rowKey='id'
          dataSource={dataDelivery}
          pagination={false}/>
        </Col>
      </Row>
    </div>)
  }
}

export default Form.create()(Detail2)
