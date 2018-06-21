/*
* @Author: baosheng
* @Date:   2017-10-25 10:22:58
* @Last Modified by:   baosheng
* @Last Modified time: 2017-10-25 10:49:06
*/
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Row, Col } from 'antd'
import * as urls from 'Src/contants/url'
import MainAccountList from './mainAccountList'
import MainAccountDetail from './mainAccountDetail'

export default class MainAccountMag extends Component {
  render() {
    return (
      <Row>
        <Col span={24}>
          <Route path={urls.MAINACCOUNTMAG} component={MainAccountList} />
          <Route path={urls.MAINACCOUNTDETAIL + '/:id'} component={MainAccountDetail} />
        </Col>
      </Row>
    )
  }
}
