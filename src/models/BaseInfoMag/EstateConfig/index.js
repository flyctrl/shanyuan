/*
* @Author: chengbs
* @Date:   2018-06-11 14:40:53
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-11 14:44:43
*/
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Row, Col } from 'antd'
import * as urls from 'Src/contants/url'
import EstateList from './estateList'

export default class EstateConfig extends Component {
  render() {
    return (
      <Row>
        <Col span={24}>
          <Route path={urls.ESTATECONFIG} component={EstateList} />
        </Col>
      </Row>
    )
  }
}
