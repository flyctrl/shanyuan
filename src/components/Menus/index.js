/**
 * Created by yiming on 2017/6/20.
 */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import * as urls from '../../contants/url'
import api from 'Src/contants/api'
import classNames from 'classnames'
import Style from './style.css'

const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

class MamsMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'inline',
      data: [],
      openKeys: JSON.parse(sessionStorage.getItem('openKeys')) || []
    }
  }

  getMenuItemClass(str) {
    const pathName = decodeURI(location.pathname)
    if (str !== urls.HOME) {
      return classNames({
        'ant-menu-item-selected': pathName.indexOf(str) > -1
      })
    }
    return classNames({
      'ant-menu-item-selected': pathName === str
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mode: nextProps.mode ? 'vertical' : 'inline'
    })
  }

  handleOpenChange = (openKeys) => {
    this.setState({ openKeys }, () => {
      sessionStorage.setItem('openKeys', JSON.stringify(openKeys))
    })
  }

  async componentWillMount() {
    const res = await api.platLogin.ssoLogin.getMenu({ timestamp: (new Date()).getTime() }) || []
    if (res) {
      this.setState({
        data: res
      })
    }
    // this.setState({
    //   data: [
    //     { 'key': 'mams_home', 'value': '首页', 'icon': 'home', 'url': 'urls.HOME', 'children': null },
    //     { 'key': 'mams_base_info_mag', 'value': '商户管理', 'icon': 'global', 'url': '', 'children': [
    //       { 'key': 'mams_operator_mag', 'value': '运营方管理', 'icon': 'switcher', 'url': 'urls.OPERATORMAG', 'children': null },
    //       { 'key': 'mams_suboptor_mag', 'value': '子运营方管理', 'icon': 'wallet', 'url': 'urls.SUBOPTORMAG', 'children': null },
    //       { 'key': 'mams_seller_mag', 'value': '商户管理', 'icon': 'shop', 'url': 'urls.SELLERMAG', 'children': null },
    //       { 'key': 'mams_shop_mag', 'value': '店铺管理', 'icon': 'bank', 'url': 'urls.SHOPMAG', 'children': null },
    //       { 'key': 'mams_account_list', 'value': '店铺账户列表', 'icon': 'layout', 'url': 'urls.BASE_ACCOUNT_LIST', 'children': null },
    //       { 'key': 'mams_main_account_list', 'value': '主体账户列表', 'icon': 'solution', 'url': 'urls.MAINACCOUNTMAG', 'children': null },
    //       { 'key': 'mams_scope_config', 'value': '经营范围配置', 'icon': 'fork', 'url': 'urls.SCOPECONFIG', 'children': null },
    //       { 'key': 'mams_estate_config', 'value': '产业配置', 'icon': 'exception', 'url': 'urls.ESTATECONFIG', 'children': null }
    //     ] },
    //     { 'key': 'mams_operate_mag', 'value': '运营管理', 'icon': 'line-chart', 'url': '', 'children': [
    //       { 'key': 'mams_acc_recharge', 'value': '账户充值', 'icon': 'safety', 'url': 'urls.ACCRECHARGE', 'children': null },
    //       { 'key': 'mams_acc_state', 'value': '账户状态管理', 'icon': 'select', 'url': 'urls.ACCSTATE', 'children': null },
    //       { 'key': 'mams_wom_state', 'value': '工单管理', 'icon': 'solution', 'url': 'urls.OPERATEMAG_WORKORDERMAG', 'children': null },
    //       { 'key': 'mams_green_payment', 'value': '绿色代付授权', 'icon': 'solution', 'url': 'urls.GREEN_PAYMENT', 'children': null }
    //     ] },
    //     { 'key': 'user', 'value': '账户管理', 'icon': 'user', 'url': '', 'children': [
    //       { 'key': 'changelog', 'value': 'Change Log', 'icon': 'eye', 'url': 'urls.USER_CHANGE_LOG', 'children': null },
    //       { 'key': 'accoutlist', 'value': '账户管理', 'icon': 'idcard', 'url': 'urls.USER_ACCOUNT_LIST', 'children': null },
    //       { 'key': 'orderlist', 'value': '支付订单管理', 'icon': 'safety', 'url': 'urls.USER_ORDER_LIST', 'children': null },
    //       { 'key': 'accountAdjust', 'value': '账户调整管理', 'icon': 'solution', 'url': 'urls.USER_ACCOUNTADJUST', 'children': null },
    //       { 'key': 'starCoinOrder', 'value': '星球币兑换记录', 'icon': 'pay-circle', 'url': 'urls.USER_STARCOINORDER', 'children': null }
    //     ] },
    //     { 'key': 'redEnvelope', 'value': '红包管理', 'icon': 'red-envelope', 'url': '', 'children': [
    //       { 'key': 'redEnvelopes', 'value': '红包发放记录', 'icon': 'red-envelope', 'url': 'urls.REDENVELOPE_REDENVELOPES', 'children': null },
    //       { 'key': 'issuanceOfQuotas', 'value': '红包发放限额配置', 'icon': 'red-envelope', 'url': 'urls.REDENVELOPE_ISSUANCEOFQUOTAS', 'children': null },
    //     ] },
    //     { 'key': 'prepaidCard', 'value': '充值卡管理', 'icon': 'user', 'url': '', 'children': [
    //       { 'key': 'store', 'value': '卡片库存管理', 'icon': 'eye', 'url': 'urls.PREPAIDCARD_STORE', 'children': null },
    //       { 'key': 'use', 'value': '卡片使用管理', 'icon': 'idcard', 'url': 'urls.PREPAIDCARD_USE', 'children': null }
    //     ] },
    //     { 'key': 'expenseCard', 'value': '消费卡管理', 'icon': 'user', 'url': '', 'children': [
    //       { 'key': 'store', 'value': '卡片库存管理', 'icon': 'eye', 'url': 'urls.EXPENSECARD_STORE', 'children': null },
    //       { 'key': 'use', 'value': '卡片使用管理', 'icon': 'idcard', 'url': 'urls.EXPENSECARD_USE', 'children': null }
    //     ] },
    //     { 'key': 'interimCard', 'value': '临时卡管理', 'icon': 'user', 'url': '', 'children': [
    //       { 'key': 'store', 'value': '临时片库存管理', 'icon': 'eye', 'url': 'urls.INTERIMCARD_STORE', 'children': null },
    //       { 'key': 'use', 'value': '临时卡使用管理', 'icon': 'idcard', 'url': 'urls.INTERIMCARD_USE', 'children': null }
    //     ] }
    //   ]
    // })
  }

  render() {
    let { data } = this.state
    const loop = (data = []) => data.map((item) => {
      if (item.children) {
        return <SubMenu key={item.key} title={<p className={Style.ellip}><Icon type={item.icon}/><span>{item.value}</span></p>}>
          {loop(item.children)}</SubMenu>
      }
      return <MenuItem key={item.key} className={this.getMenuItemClass(urls[item.url.split('.')[1]])}>
        <Link className={Style.ellip} to={urls[item.url.split('.')[1]]}><Icon type={item.icon}/>{item.value}</Link>
      </MenuItem>
    })
    const menusData = loop(data)
    return menusData.length > 0 ? <Menu
      mode={this.state.mode}
      selectedKeys={[this.props.selectedMenu]}
      onSelect={this.props.onSelect}
      style={{ border: 'none' }}
      openKeys={this.state.openKeys}
      onOpenChange={this.handleOpenChange}>
      {menusData}
    </Menu> : null
  }
}

export default MamsMenu
