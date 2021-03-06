/**
 * @Author: sunshiqiang
 * @Date: 2017-12-04 14:34:42
 * @Title: 临时卡库存管理修改
 */

import React, { Component } from 'react'
import * as urls from 'Src/contants/url'
import { Link } from 'react-router-dom'
import api from 'Src/contants/api'
import { Form, Input, Button } from 'antd'
import Uploadpic from 'Components/Upload'
import styles from './add.css'

const FormItem = Form.Item

class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataStore: {},
      batch: this.props.match.location.search.split('=')[1],
    }
  }

  componentWillMount() {
    this._loadDataStore()
  }

  async _loadDataStore() {
    const { batch } = this.state
    const dataStore = await api.interimCard.store.detial({ batch }) || {}
    this.setState({ dataStore })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { batch } = this.state
    const { history } = this.props.match
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = api.interimCard.store.edit.save({ ...values, batch })
        if (data) {
          history.push(urls.INTERIMCARD_STORE)
        }
      }
    })
  }
  uploadDone = (img) => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({ img })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { batch, dataStore } = this.state
    const config = {
      rules: [{ required: true, message: '请填写信息' }],
    }
    return (<div>
      <Form layout='inline' className={styles.form} onSubmit={this.handleSubmit}>
        <FormItem label='生成数量'>
          {getFieldDecorator('num', {
            ...config,
            initialValue: dataStore.num,
          })(
            <Input
              style={{ width: 300, marginRight: '0' }}
              placeholder='同一批次最多生成50000张卡'
              type={'number'}
              min={1}
              max={50000}
            />
          )}
        </FormItem>
        <FormItem label='卡片描述' style={{ paddingLeft: '10px' }}>
          {getFieldDecorator('msg', {
            initialValue: dataStore.msg,
          })(
            <Input
              style={{ width: 300 }}
              type='textarea'
              maxLength={50}
              placeholder={'最大输入50个字'}
              rows={4}/>
          )}
        </FormItem>
        <FormItem label='添加图片'>
          <div className='dropbox'>
            {getFieldDecorator('img', {
              rules: [{
                required: true,
                message: '请上传图片',
              }],
              initialValue: dataStore.img,
            })(
              <Uploadpic
                showImgUrl={getFieldValue('img')}
                figureWidth={300}
                figureHeight={200}
                uploadDone={this.uploadDone}
              ></Uploadpic>
            )}
          </div>
        </FormItem>
        <FormItem className={styles.btns}>
          <span className={styles.code}>批次号：{batch}</span>
          <Button htmlType='submit' size='default'><Link to={urls.INTERIMCARD_STORE}>取消</Link></Button>
          <Button style={{ marginLeft: '20px' }} type='primary' htmlType='submit' size='default'>保存</Button>
        </FormItem>
      </Form>
    </div>)
  }
}

export default Form.create()(Edit)
