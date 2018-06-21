/*
* @Author: chengbaosheng
* @Date:   2017-08-30 14:41:05
* @Last Modified by:   chengbaosheng
* @Last Modified time: 2017-09-06 13:40:07
*/
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { Route } from 'react-router-dom'
import * as urls from 'Src/contants/url'
import AccStateList from './accStateList'

export default class AccState extends Component {
  render() {
    return (
      <Row>
        <Col span={24}>
          <Route path={urls.ACCSTATE} component={AccStateList} />
        </Col>
      </Row>
    )
  }
}
