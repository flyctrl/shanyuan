/**
 * @Author: sunshiqiang
 * @Date: 2017-08-31 11:12:23
 */

import React, { Component } from 'react'
import * as urls from 'Src/contants/url'
import { Link } from 'react-router-dom'
import api from 'Src/contants/api'
import { Select, Form, Input, Button } from 'antd'
import styles from './add.css'
import Uploadpic from 'Components/Upload'

const FormItem = Form.Item
const Option = Select.Option

class Add extends Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: '',
    }
  }

  componentWillMount() {
    (async () => {
      const batch = await api.prepaidCard.store.add.batch()
      this.setState({ batch })
    })()
  }

  uploadDone = (img) => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({ img })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const { history } = this.props.match
    const { batch } = this.state
    this.props.form.validateFields((err, values) => {
      if (!err) {
        (async (batch) => {
          const data = await api.prepaidCard.store.add.save({ ...values, batch })
          if (data) {
            history.push(urls.PREPAIDCARD_STORE)
          }
        })(batch)
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { batch } = this.state
    const config = {
      rules: [{ required: true, message: '请填写信息' }],
    }
    return (<div>
      <Form layout='inline' className={styles.form} onSubmit={this.handleSubmit}>
        <FormItem label='卡片面额'>
          {getFieldDecorator('amount', {
            ...config,
            initialValue: '100'
          })(
            <Select style={{ width: 300 }} onChange={this.handleSelectChange}>
              <Option value='100'>100</Option>
              <Option value='500'>500</Option>
              <Option value='1000'>1000</Option>
              <Option value='2000'>2000</Option>
              <Option value='5000'>5000</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label='生成数量'>
          {getFieldDecorator('num', {
            ...config,
            initialValue: '',
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
            initialValue: '',
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
              }]
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
          <Button htmlType='submit' size='default'><Link to={urls.PREPAIDCARD_STORE}>取消</Link></Button>
          <Button style={{ marginLeft: '20px' }} type='primary' htmlType='submit' size='default'>保存</Button>
        </FormItem>
      </Form>
    </div>)
  }
}

export default Form.create()(Add)
