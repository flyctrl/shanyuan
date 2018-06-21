/*
* @Author: chengbs
* @Date:   2018-06-11 14:42:01
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-12 17:32:22
*/
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Table, Row, Menu, Icon, Dropdown, Col, Button, Modal, Form, Input } from 'antd'
import style from '../style.css'
import api from 'Src/contants/api'

const FormItem = Form.Item
class EstateList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tableList: { page: {}},
      dataSource: [],
      visible: false,
      isClose: true,
      isAdd: true,
      industryId: '',
      industryName: ''
    }
  }

  handleOnAdd() {
    this.setState({
      visible: true,
      isClose: false,
      isAdd: true,
      industryName: ''
    })
  }

  handleOk = (e) => {
    const { isAdd, industryId } = this.state
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (isAdd) {
          await api.estateConfig.addIndustryInfo({ ...values })
          this.setState({
            visible: false,
            isClose: true
          })
        } else {
          await api.estateConfig.modifyIndustryInfo({ ...values, ...{ industryNo: industryId }})
          this.setState({
            visible: false,
            isClose: true
          })
        }
        this.loadList()
      }
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
      isClose: true,
      industryName: ''
    })
  }

  hadleOnEdit(record, e) {
    this.setState({
      visible: true,
      isClose: false,
      isAdd: false,
      industryId: record.value,
      industryName: record.label
    })
  }

  menu = (record) => (
      <Menu>
        <Menu.Item>
          <a className={style['action-link']} onClick={this.hadleOnEdit.bind(this, record)}>修改</a>
        </Menu.Item>
      </Menu>
  )

  async loadList(params = {}) {
    let dataSource
    const tableList = await api.estateConfig.queryPageIndustryInfos({ currentPage: 1, pageSize: 10, ...params }) || {}
    dataSource = tableList['industryInfoResponses'] || []
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
      title: '产业编号',
      dataIndex: 'value',
      key: 'value',
    }, {
      title: '产业名称',
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
            title={this.state.isAdd ? '新增产业' : '编辑产业'}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={400}
          >
            <Form>
              <FormItem
                {...formItemLayout}
                label='产业名称'
              >
                {getFieldDecorator('industryName', {
                  rules: [
                    { required: true, message: '请输入产业名称' },
                    { pattern: /^.{0,20}$/, message: '格式错误，长度不能超过20位字符' }
                  ],
                  initialValue: this.state.industryName
                })(
                  <Input placeholder='请输入产业名称' />
                )}
              </FormItem>
            </Form>
          </Modal>
        }
      </Row>
    )
  }
}
const EstateListBox = Form.create()(EstateList)

export default EstateListBox
