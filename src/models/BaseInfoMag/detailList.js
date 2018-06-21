/*
* @Author: chengbaosheng
* @Date:   2017-08-16 11:29:18
* @Last Modified by:   chengbaosheng
* @Last Modified time: 2017-09-12 13:46:08
*/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Button } from 'antd'
import style from './style.css'

class DetailList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {}
    }
  }
  onChange(pagination, filters) {
    this.props.onChange(pagination, filters)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ pagination: { ...nextProps.pagination }})
  }
  render() {
    let tabData
    if (typeof this.props.tabData !== 'undefined') {
      tabData = ((<div>
                <Col key={this.props.tabData['key']} className={style['mgt20']}><span className={style['detail-tit']}>{this.props.tabData['title']}：</span></Col>
                <Col span={16} className={style['mgt20']}>
                  <Table
                    columns={this.props.columns}
                    dataSource={this.props.tabData['value']}
                    pagination={this.state.pagination}
                    onChange={this.onChange.bind(this)}
                    rowKey={record => record.id}
                  />
                </Col>
              </div>))
    } else {
      tabData = (<div></div>)
    }
    return (
      <div>
        <Row className={style['detail-list']}>
          {
            this.props.baseInfo.map((bassAry) => {
              return <Col key={bassAry.key} className={style['mgt20']}><span className={style['detail-tit']}>{bassAry.title}：</span>{bassAry.value}</Col>
            })
          }
          {tabData}
          <Col span={17} offset={7} className={style['mgt20']}><Button type='primary'><Link to={this.props.backUrl}>返回</Link></Button></Col>
        </Row>
      </div>
    )
  }
}

export default DetailList
