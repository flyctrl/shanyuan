/*
* @Author: chengbaosheng
* @Date:   2017-08-16 17:34:13
* @Last Modified by:   chengbs
* @Last Modified time: 2018-03-20 14:23:15
*/
import React, { Component } from 'react'
import InfoList from '../infoList'
import * as urls from 'Src/contants/url'
import api from 'Src/contants/api'
import { getAllScope } from '../constant'
import { getScopeOption } from 'Src/contants/tooler'

class SubOptorList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ScopeOptions: []
    }
    this.acitonUrl = {
      editUrl: urls.SUBOPTOREDIT,
      detailUrl: urls.SUBOPTORDETAIL,
      addUrl: urls.SUBOPTORADD,
      delUrl: api.deleteOptorList,
      sucUrl: urls.SUBOPTORMAG,
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
      title: '子运营方名称',
      dataIndex: 'operatorName',
      key: 'operatorName',
    }, {
      title: '经营范围',
      dataIndex: 'businessScopId',
      key: 'businessScopId',
      render: (text) => {
        return getScopeOption(text, this.state.ScopeOptions)
      }
    }, {
      title: '所属运营方',
      dataIndex: 'parentOperatorName',
      key: 'parentOperatorName',
    }]
    return (
      <InfoList columns={columns} postData={{ step: 2 }} acitonUrl={this.acitonUrl} searchDesc='子运营方' />
    )
  }
}

export default SubOptorList
