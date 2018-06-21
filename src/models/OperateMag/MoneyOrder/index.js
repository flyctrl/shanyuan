/*
* @Author: chengbaosheng
* @Date:   2017-08-30 14:43:44
* @Last Modified by:   chengbaosheng
* @Last Modified time: 2017-09-06 13:40:17
*/
import React, { Component } from 'react'
import { DatePicker, Button } from 'antd'

const { RangePicker } = DatePicker
export default class MoneyOrder extends Component {
  handleDateRange(date, dateString) {
    console.log(date, dateString)
  }
  render() {
    return (
      <div>
        <RangePicker onChange={this.handleDateRange.bind(this)} />
        <Button style={{ marginLeft: '20px' }} type='primary'>导出</Button>
      </div>
    )
  }
}
