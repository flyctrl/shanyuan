/*
* @Author: chengbaosheng
* @Date:   2017-08-15 16:13:25
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-20 01:33:06
*/
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Row, Col } from 'antd'
import * as urls from 'Src/contants/url'
import OperatorList from './operatorList'
import OperatorDetail from './operatorDetail'
import OperatorEdit from './operatorEdit'
import OperatorAdd from './operatorAdd'

export default class OperatorMag extends Component {
  render() {
    return (
      <Row>
        <Col span={24}>
          <Route path={urls.OPERATORMAG} component={OperatorList} />
          <Route path={urls.OPERATORDETAIL + '/:id'} component={OperatorDetail} />
          <Route path={urls.OPERATOREDIT + '/:id'} component={OperatorEdit} />
          <Route path={urls.OPERATORADD} component={OperatorAdd}></Route>
        </Col>
      </Row>
    )
  }
}
