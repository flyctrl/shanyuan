import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { Route } from 'react-router-dom'
import List from './list'
import Detail from './detail'
import * as urls from 'Src/contants/url'

export default class BaseAccountList extends Component {
  render() {
    return (
      <Row>
        <Col span={24}>
          <Route path={urls.BASE_ACCOUNT_LIST} component={List} />
          <Route path={urls.BASE_ACCOUNT_DETAIL} component={Detail} />
        </Col>
      </Row>
    )
  }
}
