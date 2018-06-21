/*
* @Author: chengbaosheng
* @Date:   2017-08-30 14:42:54
* @Last Modified by:   chengbaosheng
* @Last Modified time: 2017-09-06 13:39:55
*/
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { Route } from 'react-router-dom'
import * as urls from 'Src/contants/url'
import AccRechargeList from './accRechargeList'

export default class AccRecharge extends Component {
  render() {
    return (
      <Row>
        <Col span={24}>
          <Route path={urls.ACCRECHARGE} component={AccRechargeList} />
        </Col>
      </Row>
    )
  }
}

