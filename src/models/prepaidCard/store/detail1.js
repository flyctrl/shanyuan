/**
 * @Author: sunshiqiang
 * @Date: 2017-08-31 11:14:01
 */
import React, { Component } from 'react'
import * as urls from 'Src/contants/url'
import { baseUrl } from 'Util/index'
import { Link } from 'react-router-dom'
import api from 'Src/contants/api'
import { Row, Col, Button, Modal } from 'antd'
import styles from './detail.css'

class Detail1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataStore: {},
      batch: this.props.match.location.search.split('=')[1],
    }
  }

  componentWillMount() {
    this._loadData()
  }

  async _loadData() {
    const { batch } = this.state
    const dataStore = await api.prepaidCard.store.detial({ batch }) || {}
    this.setState({ dataStore })
  }

  handleMake = (e) => {
    const { batch } = this.state
    const _this = this
    Modal.confirm({
      title: '提示',
      content: '是否确认制卡？',
      okText: '是',
      cancelText: '否',
      onOk() {
        (async (batch) => {
          await api.prepaidCard.store.detial1.make({ batch })
          _this._loadData()
        })(batch)
      }
    })
  }
  handleInStore = (e) => {
    const { batch } = this.state
    const { history } = this.props.match
    Modal.confirm({
      title: '提示',
      content: '是否确认入库？',
      okText: '是',
      cancelText: '否',
      onOk() {
        (async (batch) => {
          const data = await api.prepaidCard.store.detial1.inStore({ batch })
          if (data) {
            history.push(urls.PREPAIDCARD_STORE_DETIAL2 + `?batch=${batch}`)
          }
        })(batch)
      }
    })
  }

  render() {
    const { dataStore, batch } = this.state
    return (<div>
      <Row className={styles['data-store-layout']}>
        <Col span={12}>
          <div className={styles.left}>
            <p><span>卡片面额</span><span>{dataStore.amount}元</span></p>
            <p><span>生成数量</span><span>{dataStore.num}张</span></p>
            <p><span>配置时间</span><span>{dataStore.gmtCreated}</span></p>
            <p><span>制卡时间</span><span>{dataStore.gmtModified}</span></p>
            <p><span>卡片描述</span><span>{dataStore.msg}</span></p>
            <p><span>号段</span><span>{dataStore.grantMinCard}～{dataStore.grantMaxCard}</span></p>
          </div>
        </Col>
        <Col span={12} className={styles.right}>
          <div className={styles.img}>
            <img src={dataStore.img} alt='图片'/>
          </div>
        </Col>
        <div className={styles.btns}>
          <span className={styles.code}>批次号：{batch}</span>
          {dataStore.status === 0 ? (<div style={{ display: 'inline-block' }}>
              <Button type='primary' className={styles.btn} onClick={this.handleMake}>制卡</Button>
              < Button type='primary' className={styles.btn}><Link to={{
                pathname: urls.PREPAIDCARD_STORE_EDIT,
                search: `?batch=${batch}`,
              }}>修改</Link></Button></div>)
            : null}
          {dataStore.status === 1 ? (<div style={{ display: 'inline-block' }}>
            <Button type='primary' className={styles.btn}>
              <a href={`${baseUrl}${api.prepaidCard.exportQr}${batch}`} download>批量导出</a></Button>
            <Button type='primary' className={styles.btn} onClick={this.handleInStore}>入库</Button>
          </div>) : null}
        </div>
      </Row>
    </div>)
  }
}

export default Detail1
