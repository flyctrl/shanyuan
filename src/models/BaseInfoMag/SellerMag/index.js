/*
* @Author: chengbaosheng
* @Date:   2017-08-15 16:29:31
* @Last Modified by:   chengbaosheng
* @Last Modified time: 2017-09-06 13:38:14
*/
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Row, Col } from 'antd'
import * as urls from 'Src/contants/url'
import SellerList from './sellerList'
import SellerDetail from './sellerDetail'
import SellerEdit from './sellerEdit'
import SellerAdd from './sellerAdd'

export default class SellerMag extends Component {
  render() {
    return (
      <Row>
        <Col span={24}>
          <Route path={urls.SELLERMAG} component={SellerList} />
          <Route path={urls.SELLERDETAIL + '/:id'} component={SellerDetail} />
          <Route path={urls.SELLEREDIT + '/:id'} component={SellerEdit} />
          <Route path={urls.SELLERADD} component={SellerAdd} />
        </Col>
      </Row>
    )
  }
}
