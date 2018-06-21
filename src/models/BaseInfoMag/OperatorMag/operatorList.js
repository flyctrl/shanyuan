/*
* @Author: chengbaosheng
* @Date:   2017-08-15 18:21:16
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-22 17:17:17
*/
import React, { Component } from 'react'
import InfoList from '../infoList'
import * as urls from 'Src/contants/url'
import api from 'Src/contants/api'
import { getAllScope } from '../constant'
import { getScopeOption } from 'Src/contants/tooler'

class OperatorList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ScopeOptions: []
    }
    this.acitonUrl = {
      editUrl: urls.OPERATOREDIT,
      detailUrl: urls.OPERATORDETAIL,
      addUrl: urls.OPERATORADD,
      delUrl: api.deleteOptorList,
      sucUrl: urls.OPERATORMAG,
      dataSourceUrl: api.getOptorList
    }
  }

  componentWillMount() {
    let ScopeOptions = getAllScope()
    this.setState({
      ScopeOptions
    })
  }

  render() {
    const columns = [{
      title: 'ID',
      dataIndex: 'operatorNumber',
      key: 'operatorNumber',
    }, {
      title: '运营方名称',
      dataIndex: 'operatorName',
      key: 'operatorName',
    }, {
      title: '经营范围',
      dataIndex: 'businessScopId',
      key: 'businessScopId',
      width: 500,
      render: (text) => {
        return getScopeOption(text, this.state.ScopeOptions)
      }
    }]
    return (
      <InfoList
      columns={columns}
      postData={{ step: 1 }}
      acitonUrl={this.acitonUrl}
      searchDesc='运营方'
      />
    )
  }
}

export default OperatorList
