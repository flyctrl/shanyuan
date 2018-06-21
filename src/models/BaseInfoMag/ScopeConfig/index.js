/*
* @Author: baosheng
* @Date:   2017-10-24 15:40:01
* @Last Modified by:   baosheng
* @Last Modified time: 2017-10-24 16:22:39
*/
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Row, Col } from 'antd'
import * as urls from 'Src/contants/url'
import ScopeList from './scopeList'

export default class ScopeConfig extends Component {
  render() {
    return (
      <Row>
        <Col span={24}>
          <Route path={urls.SCOPECONFIG} component={ScopeList} />
        </Col>
      </Row>
    )
  }
}
