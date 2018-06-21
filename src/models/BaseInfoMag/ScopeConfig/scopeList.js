/*
* @Author: baosheng
* @Date:   2017-10-24 16:19:42
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-15 16:51:20
*/
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Table, Menu, Icon, Dropdown, Row, Col, Button, Modal, Form, Input } from 'antd'
import style from '../style.css'
import api from 'Src/contants/api'

const confirm = Modal.confirm
const FormItem = Form.Item
class ScopeList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tableList: { page: {}},
      dataSource: [],
      visible: false,
      isClose: true
    }
  }

  handleOnAdd() {
    this.setState({
      visible: true,
      isClose: false
    })
  }

  hadleOnDel(id, e) {
    const _t = this
    confirm({
      title: '提示',
      content: '您确定要删除这条数据？',
      onOk() {
        _t._deleteInfo(id)
      },
    })
  }

  handleOk = (e) => {
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        await api.scopeConfig.addBusinessScope({ ...values })
        this.setState({
          visible: false,
          isClose: true
        })
        this.loadList()
      }
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
      isClose: true
    })
  }

  async _deleteInfo(id) {
    await api.scopeConfig.delBusinessScope({ label: id })
    this.loadList()
  }

  menu = (record) => (
      <Menu>
        <Menu.Item>
          <a className={style['action-link']} onClick={this.hadleOnDel.bind(this, record.value)}>删除</a>
        </Menu.Item>
      </Menu>
  )

  async loadList(params = {}) {
    let dataSource
    const tableList = await api.scopeConfig.getBusinessScopePage({ currentPage: 1, pageSize: 10, ...params }) || {}
    dataSource = tableList['businessScopeResponses'] || []
    this.setState({ dataSource, tableList })
  }

  handlePaginationChange(currentPage) {
    this.loadList({ currentPage })
  }

  componentDidMount() {
    this.loadList()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { tableList, dataSource } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const columns = [{
      title: '序号',
      dataIndex: 'value',
      key: 'value',
    }, {
      title: '经营范围',
      dataIndex: 'label',
      key: 'label',
    }, {
      title: '操作',
      key: 'action',
      width: 50,
      render: (text, record) => (
        <Dropdown overlay={this.menu(record)} placement='bottomCenter'>
          <Icon style={{ fontSize: 18 }} type='bars' />
        </Dropdown>
      )
    }]
    return (
      <Row>
        <Col span={24}><Button type='primary' onClick={this.handleOnAdd.bind(this)}>新增</Button></Col>
        <Col span={24} style={{ marginTop: 20 }}>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={record => record.value}
            pagination={{
              showQuickJumper: true,
              total: tableList.page.totalRowsAmount || 0,
              onChange: this.handlePaginationChange.bind(this),
              pageSize: 10,
              current: tableList.page.currentPage || 1
            }}
          />
        </Col>
        {
          this.state.isClose ? null : <Modal
            title='新增经营范围'
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={400}
          >
            <Form>
              <FormItem
                {...formItemLayout}
                label='经营范围'
              >
                {getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '请输入经营范围' },
                    { pattern: /^.{0,20}$/, message: '格式错误，长度不能超过20位字符' }
                  ],
                })(
                  <Input placeholder='请输入经营范围' />
                )}
              </FormItem>
            </Form>
          </Modal>
        }
      </Row>
    )
  }
}
const ScopeListBox = Form.create()(ScopeList)

export default ScopeListBox
