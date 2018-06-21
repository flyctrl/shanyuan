/*
* @Author: chengbaosheng
* @Date:   2017-08-15 16:29:00
* @Last Modified by:   chengbaosheng
* @Last Modified time: 2017-09-06 13:39:11
*/
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Row, Col } from 'antd'
import * as urls from 'Src/contants/url'
import SubOptorList from './subOptorList'
import SubOptorDetail from './subOptorDetail'
import SubOptorAdd from './subOptorAdd'
import SubOptorEdit from './subOptorEdit'

export default class SubOptorMag extends Component {
  render() {
    return (
      <Row>
        <Col span={24}>
          <Route path={urls.SUBOPTORMAG} component={SubOptorList} />
          <Route path={urls.SUBOPTORDETAIL + '/:id'} component={SubOptorDetail} />
          <Route path={urls.SUBOPTORADD} component={SubOptorAdd} />
          <Route path={urls.SUBOPTOREDIT + '/:id'} component={SubOptorEdit} />
        </Col>
      </Row>
    )
  }
}
