/*
* @Author: chengbaosheng
* @Date:   2017-08-15 16:30:09
* @Last Modified by:   chengbaosheng
* @Last Modified time: 2017-09-06 13:38:50
*/
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Row, Col } from 'antd'
import * as urls from 'Src/contants/url'
import ShopList from './shopList'
import ShopDetail from './shopDetail'
import ShopAdd from './shopAdd'
import ShopEdit from './shopEdit'

export default class ShopMag extends Component {
  render() {
    return (
      <Row>
        <Col span={24}>
          <Route path={urls.SHOPMAG} component={ShopList} />
          <Route path={urls.SHOPDETAIL + '/:id'} component={ShopDetail} />
          <Route path={urls.SHOPADD} component={ShopAdd} />
          <Route path={urls.SHOPEDIT + '/:id'} component={ShopEdit} />
        </Col>
      </Row>
    )
  }
}
