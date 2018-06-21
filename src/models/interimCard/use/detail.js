/**
 * @Author: sunshiqiang
 * @Date: 2017-10-25 10:34:58
 * @Title: 临时卡使用详情
 */

import React, { Component } from 'react'
import api from 'Src/contants/api'
import { baseUrl } from 'Util/index'
import { Row, Col, Button, Table } from 'antd'
import styles from './detail.css'
import { getQueryString } from 'Contants/tooler'

class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataUse: [],
      dataSend: {},
      batch: getQueryString('batch'),
      numberFrom: getQueryString('numberFrom'),
      numberTo: getQueryString('numberTo'),
      useId: getQueryString('exportId'),
    }
  }

  componentWillMount() {
    this._loadUseData()
    this._loadSendData()
  }

  async _loadUseData(currentPage) {
    const { batch, numberFrom, numberTo } = this.state
    const dataUse = await api.interimCard.use.detail.use({ batch, pageSize: 10, currentPage, numberFrom, numberTo }) || {}
    this.setState({ dataUse })
  }

  async _loadSendData() {
    const { batch, useId } = this.state
    const dataSend = await api.interimCard.use.detail.send({ batch, useId }) || {}
    this.setState({ dataSend })
  }

  handleChange = (currentPage) => {
    this._loadUseData(currentPage)
  }

  render() {
    const { dataSend, dataUse, batch, numberFrom, numberTo, useId } = this.state
    const columns = [{
      title: <span style={{ paddingLeft: '10px' }}>卡号</span>,
      dataIndex: 'cardNumber',
      key: 'cardNumber',
      render: text => <span style={{ paddingLeft: '10px' }}>{text}</span>
    }, {
      title: '激活时间',
      dataIndex: 'activeTime',
      key: 'activeTime',
    }, {
      title: '最后一次修改时间',
      dataIndex: 'sendDateTime',
      key: 'sendDateTime',
    }, {
      title: '投放对象',
      dataIndex: 'address02',
      key: 'address02',
    }, {
      title: '卡片状态',
      dataIndex: 'statusName',
      key: 'statusName',
    }]
    console.log(styles)
    return (<div><Row className={styles['data-delivery-layout']}>
      <Col span={24} className={styles.title}>卡投放信息:</Col>
      <Col span={12}>
        <div className={styles.left}>
          <p><span>投放数量</span><span>{dataSend.sendNum}张</span></p>
          <p><span>使用数量</span><span>{dataSend.usedNum}张</span></p>
          <p><span>配置时间</span><span>{dataSend.gmtCreated}</span></p>
          <p><span>制卡时间</span><span>{dataSend.stockTime}</span></p>
          <p><span>入库时间</span><span>{dataSend.stockTime}</span></p>
          <p><span>投放时间</span><span>{dataSend.sendTime}</span></p>
          <p><span>卡片描述</span><span>{dataSend.msg}</span></p>
          <p><span>号段</span><span>{dataSend.mincard}～{dataSend.maxcard}</span></p>
        </div>
      </Col>
      <Col span={12} className={styles.right}>
        <div className={styles.img}>
          <img src={dataSend.img} alt='图片'/>
        </div>
      </Col>
      <div className={styles.btns}>
        <span className={styles.code}>批次号：{dataSend.batch}</span>
        <Button className={styles.btn} type='primary'><a
          href={`${baseUrl}${api.interimCard.export}${batch}&numberFrom=${numberFrom}&numberTo=${numberTo}&exportId=${useId}`}
          download>批量导出</a></Button>
      </div>
    </Row>
      <Row className={styles['data-use-layout']}>
        <Col span={24} className={styles.title}>卡使用信息:</Col>
        <Col span={24}><Table
          columns={columns}
          rowKey='id'
          dataSource={dataUse.datas}
          pagination={{
            showQuickJumper: true,
            total: dataUse.total,
            onChange: this.handleChange,
            current: dataUse.currPageNo,
            pageSize: 10
          }}/>
        </Col>
      </Row>
    </div>)
  }
}

export default Detail
