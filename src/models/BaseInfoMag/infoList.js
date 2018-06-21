/*
* @Author: chengbaosheng
* @Date:   2017-08-16 16:36:43
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-19 18:44:58
*/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Row, Col, Table, Dropdown, Icon, Menu, Modal, Select } from 'antd'
import api from 'Src/contants/api'
import fetch from 'Util/fetch'
import style from './style.css'

const Search = Input.Search
const confirm = Modal.confirm
const Option = Select.Option

class InfoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      columns: this.props.columns,
      loading: false,
      pagination: {},
      params: {},
      selectSearch: '0',
      isSelectOpt: false,
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
      shopStatus: '3'
    }

    this.menu = (record) => (
      <Menu>
        <Menu.Item>
          <Link to={{
            pathname: this.props.acitonUrl['editUrl'],
            state: { id: record.id, step: record.step }
          }} className={style['action-link']}>修改</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={{
            pathname: this.props.acitonUrl['detailUrl'],
            state: { id: record.id }
          }} className={style['action-link']}>详情</Link>
        </Menu.Item>
        <Menu.Item style={{ display: this.listType === 'shoper' ? 'none' : 'block' }}>
          <a className={style['action-link']} onClick={this.hadleOnDel.bind(this, record.id)}>删除</a>
        </Menu.Item>
      </Menu>
    )

    if (typeof this.props.listType === 'undefined') {
      this.listType = ''
    } else {
      this.listType = this.props.listType
    }
  }

  // 列表数据加载分页 start
  handleTableChange = (pagination, filters) => {
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

  listFetch = (params = {}, callback) => {
    this.setState({ loading: true })
    let defaultPost = {}
    if (typeof this.props.postData !== 'undefined') {
      defaultPost = {
        pageSize: 10,
        step: this.props.postData['step'],
        shopStatus: this.state.shopStatus,
        currentPage: 1
      }
    } else {
      defaultPost = {
        pageSize: 10,
        shopStatus: this.state.shopStatus,
        currentPage: 1
      }
    }
    fetch(this.props.acitonUrl['dataSourceUrl'], {
      ...defaultPost,
      ...params,
    }).then((res) => {
      if (res.code === 0) {
        const data = res.data
        const pagination = { ...this.state.pagination }
        if (typeof params.currentPage === 'undefined') {
          pagination.current = 1
        }
        pagination.total = data.page.totalRowsAmount
        if (this.listType === 'seller') {
          this.setState({
            loading: false,
            dataSource: data.merchantInfos,
            pagination,
          })
        } else if (this.listType === 'shoper') {
          this.setState({
            loading: false,
            dataSource: data.merchantShops,
            pagination,
          })
        } else {
          this.setState({
            loading: false,
            dataSource: data.operatorInfos,
            pagination,
          })
        }

        if (callback) {
          callback()
        }
      } else {
        Modal.error({ title: '提示', 'content': res.errmsg })
      }
    })
  }
  // 列表数据加载分页 end

  componentWillMount() {
    let newColumns = this.state.columns
    this.setState({ columns: [...newColumns, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Dropdown overlay={this.menu(record)} placement='bottomCenter'>
          <Icon style={{ fontSize: 18 }} type='bars' />
        </Dropdown>
      )
    }]
    })
    this.listFetch()
  }

  componentDidMount() {
    if (this.listType === '') {
      return
    }
    fetch(api.queryShopAccount, {}).then(res => {
      const operators = res.data
      switch (this.listType) {
        case 'shoper':
          this.setState({
            operators,
            operatorName: operators[0].operatorName,
            sonOperators: operators[0]['sonOperators'],
            sonOperatorName: operators[0]['sonOperators'][0].operatorName,
            merchants: operators[0]['sonOperators'][0]['merchants'],
            merchantName: operators[0]['sonOperators'][0]['merchants'][0].merchantName,
            merchantNumber: operators[0]['sonOperators'][0]['merchants'][0].merchantNumber,
          }, () => {
            this.listFetch()
          })
          break
        case 'seller':
          this.setState({
            operators,
            operatorName: operators[0].operatorName,
            sonOperators: operators[0]['sonOperators'],
            sonOperatorName: operators[0]['sonOperators'][0].operatorName,
            merchants: operators[0]['sonOperators'][0]['merchants'],
            merchantName: operators[0]['sonOperators'][0]['merchants'][0].merchantName,
          }, () => {
            this.listFetch()
          })
          break
      }
    })
  }

  // 运营方下拉选择
  hanleOperatorChange = (value) => {
    this.setState({ isSelectOpt: true })
    const operator = this.state.operators.filter((operator) => {
      return operator.operatorNumber === value
    })[0]
    const sonOperators = operator.sonOperators
    switch (this.listType) {
      case 'shoper':
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
        break
      case 'seller':
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
            merchantId: sonOperators[0].merchants[0].id
          }, () => {
            this.listFetch({
              operatorId: sonOperators[0].id
            })
          })
        }
        break
    }
  }

  // 子运营方下拉选择
  handleSonOperatorChange = (value) => {
    this.setState({ isSelectOpt: true })
    const sonOperator = this.state.sonOperators.filter((sonOperator) => {
      return sonOperator.operatorNumber === value
    })[0]
    switch (this.listType) {
      case 'shoper':
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
        break
      case 'seller':
        if (typeof sonOperator.merchants === 'undefined') {
          this.setState({
            sonOperatorName: sonOperator.operatorName,
            sonOperatorId: sonOperator.id,
          }, () => {
            this.listFetch({
              operatorId: sonOperator.id
            })
          })
        } else {
          this.setState({
            sonOperatorName: sonOperator.operatorName,
            sonOperatorId: sonOperator.id,
            merchants: sonOperator.merchants,
            merchantName: sonOperator.merchants[0].merchantName,
            merchantId: sonOperator.merchants[0].id
          }, () => {
            this.listFetch({
              operatorId: sonOperator.id
            })
          })
        }
        break
    }
  }

  // 商户下拉选择
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

  // 标识下拉选择
  handleSelectStatu = (value) => {
    let merchantInfoId = this.state.merchantId
    this.setState({ shopStatus: value }, () => {
      this.listFetch({
        merchantInfoId: merchantInfoId,
        shopStatus: value
      })
    })
  }

  // 删除操作
  hadleOnDel(Id, e) {
    const _t = this
    confirm({
      title: '提示',
      content: '您确定要删除这条数据？',
      onOk() {
        _t._deleteInfo(Id)
      },
    })
  }

  // 搜索
  hadleOnSearch(value) {
    if (value.length === 0) {
      Modal.error({ title: '提示', content: '搜索内容不能为空' })
      return
    }
    let addJson = {}
    if (typeof this.props.postData !== 'undefined') {
      addJson = this.props.postData
    }
    let searchJson = {}
    if (this.listType === 'seller') { // 商户
      if (parseInt(this.state.selectSearch)) {
        searchJson = { merchantId: value.replace(/\s/g, '') }
      } else {
        searchJson = { merchantName: value.replace(/\s/g, '') }
      }
    } else if (this.listType === 'shoper') { // 店铺
      if (parseInt(this.state.selectSearch)) {
        searchJson = { shopNumber: value.replace(/\s/g, '') }
      } else {
        searchJson = { shopName: value.replace(/\s/g, '') }
      }
    } else { // 运营方和子运营方
      if (parseInt(this.state.selectSearch)) {
        searchJson = { operatorNumber: value.replace(/\s/g, '') }
      } else {
        searchJson = { operatorName: value.replace(/\s/g, '') }
      }
    }
    this.setState({ params: { ...searchJson, ...addJson }, pagination: { current: 1 }})
    this.listFetch({
      currentPage: 1, ...searchJson, ...addJson
    })
  }
  handleSelectSearch(value) {
    this.setState({ selectSearch: value })
  }

  _deleteInfo(Id) {
    // let newInfoAry = []
    let newSource = this.state.dataSource
    let newSourceAry = []
    fetch(this.props.acitonUrl['delUrl'], {
      id: Id
    }).then((res) => {
      if (res.code === 0) {
        const modalDel = Modal.success({ title: '提示', content: '删除成功' })
        setTimeout(() => {
          modalDel.destroy()
          for (let i = 0; i < newSource.length; i++) {
            if (newSource[i].id !== Id) {
              newSourceAry.push(newSource[i])
            }
          }
          this.setState({ dataSource: newSourceAry })
        }, 1000)
      } else {
        Modal.error({ title: '提示', content: res.errmsg })
      }
    })
  }

  render() {
    let operatorOptions = null
    let sonOperatorOptions = null
    let merchantOptions = null
    let sellerCol, shoperCol, renderCol
    let searchSpan = 24
    if (this.listType !== '') {
      searchSpan = 12
      operatorOptions = this.state.operators.map((operator) => {
        return (
          <Option key={operator.operatorNumber}>{operator.operatorName}</Option>
        )
      })
      sonOperatorOptions = this.state.sonOperators.map((sonOperator) => {
        return (
          <Option key={sonOperator.operatorNumber}>{sonOperator.operatorName}</Option>
        )
      })
      sellerCol = (
        <div>
          <Col span={5} style={{ marginTop: 5 }}>
            <span>运营方：</span>
            <Select value={ this.state.isSelectOpt ? this.state.operatorName : '--请选择运营方--' } style={{ width: 160 }} onChange={this.hanleOperatorChange}>
              {operatorOptions}
            </Select>
          </Col>
          <Col span={5} style={{ marginTop: 5 }}>
            <span>子运营方：</span>
            <Select value={ this.state.isSelectOpt ? this.state.sonOperatorName : '--请选择子运营方--' } style={{ width: 160 }} onChange={this.handleSonOperatorChange}>
              {sonOperatorOptions}
            </Select>
          </Col>
        </div>
      )
      if (this.listType === 'shoper') {
        searchSpan = 6
        merchantOptions = this.state.merchants.map((merchant) => {
          return (
            <Option key={merchant.merchantNumber}>{merchant.merchantName}</Option>
          )
        })
        shoperCol = (
          <div>
            <Col span={5} style={{ marginTop: 5 }}>
              <span>商户：</span>
              <Select value={ this.state.isSelectOpt ? this.state.merchantName : '--请选择商户--' } style={{ width: 160 }} onChange={this.handleShopChange}>
                {merchantOptions}
              </Select>
            </Col>
            <Col span={3} style={{ marginTop: 5 }}>
              <span>标识：</span>
              <Select onChange={this.handleSelectStatu.bind(this)} defaultValue={'3'} style={{ display: 'inline-block', width: '90px', marginRight: '4px' }}>
                <Option value='3'>全部</Option>
                <Option value='1'>有效</Option>
                <Option value='0'>无效</Option>
                <Option value='2'>无</Option>
              </Select>
            </Col>
          </div>
        )
      }
      renderCol = (<div>{sellerCol}{shoperCol}</div>)
    }
    return (
      <div>
        <Row>
          <Col span={24}><Button type='primary'><Link to={this.props.acitonUrl['addUrl']}>新增</Link></Button></Col>
        </Row>
        <Row className={style['search-box']} align='middle'>
          {renderCol}
          <Col span={searchSpan}>
            <Select onChange={this.handleSelectSearch.bind(this)} defaultValue={'0'} style={{ display: 'inline-block', width: '90px', marginRight: '4px' }}>
              <Option value='0'>按名称查询</Option>
              <Option value='1'>按ID查询</Option>
            </Select>
            <Search
              placeholder={'请输入' + (this.props.searchDesc ? this.props.searchDesc : '') + (parseInt(this.state.selectSearch) ? 'ID' : '名称')}
              style={{ width: 180, marginTop: 5 }}
              onSearch={this.hadleOnSearch.bind(this)}
            />
          </Col>
        </Row>
        <Row className={style['pdt10']}>
          <Col span={24}>
            <Table
            columns={this.state.columns}
            pagination={this.state.pagination}
            loading={this.state.loading}
            dataSource={this.state.dataSource}
            onChange={this.handleTableChange}
            rowKey={record => record.id}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default InfoList
