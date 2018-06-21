import React, { Component } from 'react'
import { Table, Dropdown, Menu, Icon, Select, Row, Col, Modal, Input } from 'antd'
import { Link } from 'react-router-dom'
import * as urls from 'Src/contants/url'
import style from './style.css'
const Option = Select.Option
import api from 'Src/contants/api'
import fetch from 'Src/utils/fetch'
import { getScopeOption } from 'Src/contants/tooler'
import { getAllScope } from '../constant'

const Search = Input.Search
export default class BaseAccountList extends Component {
  constructor(props) {
    super()
    this.state = {
      ScopeOptions: [],
      pagination: { current: 1, pageSize: 10 },
      params: {},
      isSelectOpt: false,
      selectSearch: '0',
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
    }
  }
  componentWillMount() {
    let ScopeOptions = getAllScope()
    this.setState({
      ScopeOptions
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
        merchantName: operators[0]['sonOperators'][0]['merchants'][0].merchantName
      }, () => {
        this.listFetch()
      })
    })
  }
  hanleOperatorChange = (value) => {
    this.setState({ isSelectOpt: true })
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
    } else {
      this.setState({
        sonOperators: sonOperators,
        operatorName: operator.operatorName,
        operatorId: operator.id,
        merchants: sonOperators[0].merchants,
        sonOperatorName: sonOperators[0].operatorName,
        sonOperatorId: sonOperators[0].id,
        merchantName: sonOperators[0].merchants[0].merchantName,
        merchantNumber: sonOperators[0].merchants[0].merchantNumber,
        merchantId: sonOperators[0].merchants[0].id
      }, () => {
        this.listFetch({
          merchantInfoId: sonOperators[0].merchants[0].id
        })
      })
    }
  }
  handleSonOperatorChange = (value) => {
    this.setState({ isSelectOpt: true })
    const sonOperator = this.state.sonOperators.filter((sonOperator) => {
      return sonOperator.operatorNumber === value
    })[0]
    if (typeof sonOperator.merchants === 'undefined') {
      this.setState({
        sonOperatorName: sonOperator.operatorName,
        sonOperatorId: sonOperator.id,
      })
    } else {
      this.setState({
        sonOperatorName: sonOperator.operatorName,
        sonOperatorId: sonOperator.id,
        merchants: sonOperator.merchants,
        merchantName: sonOperator.merchants[0].merchantName,
        merchantNumber: sonOperator.merchants[0].merchantNumber,
        merchantId: sonOperator.merchants[0].id
      }, () => {
        this.listFetch({
          merchantInfoId: sonOperator.merchants[0].id
        })
      })
    }
  }
  handleShopChange = (value) => {
    this.setState({ isSelectOpt: true })
    const merchant = this.state.merchants.filter((merchant) => {
      return merchant.merchantNumber === value
    })[0]

    this.setState({
      merchantName: merchant.merchantName,
      merchantNumber: merchant.merchantNumber,
      merchantId: merchant.id
    }, () => {
      this.listFetch({
        merchantInfoId: merchant.id
      })
    })
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    this.listFetch({
      pageSize: pagination.pageSize,
      currentPage: pagination.current,
      ...this.state.params
    })
  }

  listFetch(params = {}, callback) {
    this.setState({ loading: true })
    fetch(api.getShopList, {
      pageSize: this.state.pagination.pageSize,
      ...params,
    }).then((res) => {
      if (res.code === 0) {
        const data = res.data
        const merchantShops = data.merchantShops
        const pagination = { ...this.state.pagination }
        pagination.total = data.page.totalRowsAmount
        merchantShops.forEach((shop, key) => {
          shop.key = key
        })
        this.setState({
          loading: false,
          merchantShops,
          pagination,
        })

        if (callback) {
          callback()
        }
      } else {
        Modal.error({ title: '提示', 'content': res.errmsg })
      }
    })
  }
  // 搜索
  hadleOnSearch(value) {
    if (value.length === 0) {
      Modal.error({ title: '提示', content: '搜索内容不能为空' })
      return
    }
    let searchJson = {}
    if (parseInt(this.state.selectSearch)) {
      searchJson = { shopNumber: value.replace(/\s/g, '') }
    } else {
      searchJson = { shopName: value.replace(/\s/g, '') }
    }
    this.setState({ params: { ...searchJson }, pagination: { current: 1 }})
    this.listFetch({
      currentPage: 1, ...searchJson
    })
  }
  handleSelectSearch(value) {
    this.setState({ selectSearch: value })
  }
  render() {
    const operatorOptions = this.state.operators.map((operator) => {
      return (
        <Option key={operator.operatorNumber}>{operator.operatorName}</Option>
      )
    })
    const sonOperatorOptions = this.state.sonOperators.map((sonOperator) => {
      return (
        <Option key={sonOperator.operatorNumber}>{sonOperator.operatorName}</Option>
      )
    })
    const merchantOptions = this.state.merchants.map((merchant) => {
      return (
        <Option key={merchant.merchantNumber}>{merchant.merchantName}</Option>
      )
    })
    const columns = [{
      title: 'ID',
      dataIndex: 'shopNumber',
      key: 'shopNumber',
    }, {
      title: '店铺名称',
      dataIndex: 'shopName',
      key: 'shopName',
    }, {
      title: '经营范围',
      dataIndex: 'businessScopId',
      key: 'businessScopId',
      render: (text) => {
        return getScopeOption(text, this.state.ScopeOptions)
      }
    }, {
      title: '所属商户',
      dataIndex: 'merchantName',
      key: 'merchantName'
    }, {
      title: '操作',
      dataIndex: 'opt',
      key: 'opt',
      render(text, item) {
        const menu = (
          <Menu>
            <Menu.Item>
              <Link to={`${urls.BASE_ACCOUNT_DETAIL}/${item.shopNumber}/${item.shopName}`} className={style['action-detail']}>详情</Link>
            </Menu.Item>
          </Menu>
        )
        return (
          <Dropdown overlay={menu} placement='bottomCenter'>
            <Icon style={{ fontSize: 18 }} type='bars' />
          </Dropdown>
        )
      }
    }]

    return (
      <div>
        <Row>
          <Col span={6}>
            运营方：
            <Select value={ this.state.isSelectOpt ? this.state.operatorName : '--请选择运营方--' } style={{ width: 180 }} onChange={this.hanleOperatorChange}>
              {operatorOptions}
            </Select>
          </Col>
          <Col span={6}>
            <span>子运营方：</span>
            <Select value={ this.state.isSelectOpt ? this.state.sonOperatorName : '--请选择子运营方--' } style={{ width: 180 }} onChange={this.handleSonOperatorChange}>
              {sonOperatorOptions}
            </Select>
          </Col>
          <Col span={6}>
            <span>商户：</span>
            <Select value={ this.state.isSelectOpt ? this.state.merchantName : '--请选择商户--' } style={{ width: 180 }} onChange={this.handleShopChange}>
              {merchantOptions}
            </Select>
          </Col>
          <Col span={6}>
            <Select onChange={this.handleSelectSearch.bind(this)} defaultValue={'0'} style={{ display: 'inline-block', width: '90px', marginRight: '4px' }}>
              <Option value='0'>按名称查询</Option>
              <Option value='1'>按ID查询</Option>
            </Select>
            <Search
              placeholder={'请输入店铺' + (parseInt(this.state.selectSearch) ? 'ID' : '名称')}
              style={{ width: 180, marginTop: 5 }}
              onSearch={this.hadleOnSearch.bind(this)}
            />
          </Col>
        </Row>
        <Table dataSource={this.state.merchantShops} columns={columns} style={{ marginTop: 20 }} pagination={this.state.pagination} onChange={this.handleTableChange} />
      </div>
    )
  }
}
