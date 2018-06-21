import React from 'react'
// import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'
import * as urls from '../contants/url'
import XLayout from '../models/layout'
import Home from '../models/Home'
// import Login from '../models/Login'

import {
  OperatorMag,
  SubOptorMag,
  SellerMag,
  ShopMag,
  OperatorDetail,
  OperatorEdit,
  OperatorAdd,
  SubOptorDetail,
  SubOptorAdd,
  SubOptorEdit,
  BaseAccountList,
  SellerDetail,
  SellerEdit,
  SellerAdd,
  ShopDetail,
  ShopAdd,
  ShopEdit,
  BaseAccountDetail,
  ScopeConfig,
  EstateConfig
} from '../models/BaseInfoMag'
import RedEnvelopes from '../models/redEnvelope/RedEnvelopes'
import RedEnvelopesDetail from '../models/redEnvelope/RedEnvelopes/detail'
import RedEnvelopeIssuanceofquotas from '../models/redEnvelope/IssuanceOfQuotas'
import AccountAdjust from '../models/User/AccountAdjust'
import StarCoinOrder from '../models/User/StarCoinOrder'
import ChangeLog from '../models/User/ChangeLog'
import UserOrderList from '../models/User/Order'
import UserOrderDetail from '../models/User/Order/Detail'
import AccountList from '../models/User/Account'
import AccountDetail from '../models/User/Account/Detail'
import TransactionList from '../models/User/Account/Transaction'
import StarcoinList from '../models/User/Account/StarCoin'
import TransactionDetail from '../models/User/Account/Transaction/Detail'
import OperatorMagWorkOrderMag from '../models/OperateMag/WorkOrderMag'
import OperatorMagWorkOrderMagWithdrawals from '../models/OperateMag/WorkOrderMag/Withdrawals'
import OperatorMagWorkOrderMagRecharge from '../models/OperateMag/WorkOrderMag/Recharge'
import OperatorMagGreenPayment from '../models/OperateMag/GreenPayment'

import PrepaidCardStore from '../models/prepaidCard/store'
import PrepaidCardStoreAdd from '../models/prepaidCard/store/add'
import PrepaidCardStoreEdit from '../models/prepaidCard/store/edit'
import PrepaidCardStoreDetail1 from '../models/prepaidCard/store/detail1'
import PrepaidCardStoreDetail2 from '../models/prepaidCard/store/detail2'
import PrepaidCardUse from '../models/prepaidCard/use'
import PrepaidCardUseDetail from '../models/prepaidCard/use/detail'

import ExpenseCardStore from '../models/expenseCard/store'
import ExpenseCardStoreAdd from '../models/expenseCard/store/add'
import ExpenseCardStoreEdit from '../models/expenseCard/store/edit'
import ExpenseCardStoreDetail1 from '../models/expenseCard/store/detail1'
import ExpenseCardStoreDetail2 from '../models/expenseCard/store/detail2'
import ExpenseCardUse from '../models/expenseCard/use'
import ExpenseCardUseDetail from '../models/expenseCard/use/detail'

import InterimCardStore from '../models/interimCard/store'
import InterimCardStoreAdd from '../models/interimCard/store/add'
import InterimCardStoreEdit from '../models/interimCard/store/edit'
import InterimCardStoreDetail1 from '../models/interimCard/store/detail1'
import InterimCardStoreDetail2 from '../models/interimCard/store/detail2'
import InterimCardUse from '../models/interimCard/use'
import InterimCardUseDetail from '../models/interimCard/use/detail'

import MainAccountMag from '../models/User/MainAccountMag'
import MainAccountDetail from '../models/User/MainAccountMag/mainAccountDetail'

import {
  AccRecharge,
  AccState
} from '../models/OperateMag'

const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
    breadcrumbName: '首页'
  },
  // {
  //   path: '/login',
  //   exact: true,
  //   component: Login,
  // },
  {
    path: urls.HOME,
    exact: true,
    component: Home,
    breadcrumbName: '首页'
  },
  {
    path: urls.OPERATORMAG,
    exact: true,
    component: OperatorMag,
    breadcrumbName: '运营方管理',
    parentPath: urls.HOME
  },
  {
    path: urls.OPERATEMAG_WORKORDERMAG,
    exact: true,
    component: OperatorMagWorkOrderMag,
    breadcrumbName: '工单管理',
    parentPath: urls.HOME
  },
  {
    path: urls.GREEN_PAYMENT,
    exact: true,
    component: OperatorMagGreenPayment,
    breadcrumbName: '绿色代付授权',
    parentPath: urls.HOME
  },
  {
    path: urls.OPERATEMAG_WORKORDERMAG_WITHDRAWALS,
    exact: true,
    component: OperatorMagWorkOrderMagWithdrawals,
    breadcrumbName: '工单详情',
    parentPath: urls.OPERATEMAG_WORKORDERMAG
  },
  {
    path: urls.OPERATEMAG_WORKORDERMAG_RECHARGE,
    exact: true,
    component: OperatorMagWorkOrderMagRecharge,
    breadcrumbName: '工单详情',
    parentPath: urls.OPERATEMAG_WORKORDERMAG
  },
  {
    path: urls.OPERATORDETAIL,
    exact: true,
    component: OperatorDetail,
    breadcrumbName: '运营方详情',
    parentPath: urls.OPERATORMAG
  },
  {
    path: urls.OPERATOREDIT,
    exact: true,
    component: OperatorEdit,
    breadcrumbName: '运营方修改',
    parentPath: urls.OPERATORMAG
  },
  {
    path: urls.OPERATORADD,
    exact: true,
    component: OperatorAdd,
    breadcrumbName: '运营方添加',
    parentPath: urls.OPERATORMAG
  },
  {
    path: urls.SUBOPTORMAG,
    exact: true,
    component: SubOptorMag,
    breadcrumbName: '子运营方管理',
    parentPath: urls.HOME
  },
  {
    path: urls.SUBOPTORDETAIL,
    exact: true,
    component: SubOptorDetail,
    breadcrumbName: '子运营方详情',
    parentPath: urls.SUBOPTORMAG
  },
  {
    path: urls.SUBOPTORADD,
    exact: true,
    component: SubOptorAdd,
    breadcrumbName: '子运营方增加',
    parentPath: urls.SUBOPTORMAG
  },
  {
    path: urls.SUBOPTOREDIT,
    exact: true,
    component: SubOptorEdit,
    breadcrumbName: '子运营方修改',
    parentPath: urls.SUBOPTORMAG
  },
  {
    path: urls.SELLERMAG,
    exact: true,
    component: SellerMag,
    breadcrumbName: '商户管理',
    parentPath: urls.HOME
  },
  {
    path: urls.SELLERDETAIL,
    exact: true,
    component: SellerDetail,
    breadcrumbName: '商户详情',
    parentPath: urls.SELLERMAG
  },
  {
    path: urls.SELLEREDIT,
    exact: true,
    component: SellerEdit,
    breadcrumbName: '商户修改',
    parentPath: urls.SELLERMAG
  },
  {
    path: urls.SELLERADD,
    exact: true,
    component: SellerAdd,
    breadcrumbName: '商户添加',
    parentPath: urls.SELLERMAG
  },
  {
    path: urls.SHOPMAG,
    exact: true,
    component: ShopMag,
    breadcrumbName: '店铺管理',
    parentPath: urls.HOME
  },
  {
    path: urls.SHOPDETAIL,
    exact: true,
    component: ShopDetail,
    breadcrumbName: '店铺详情',
    parentPath: urls.SHOPMAG
  },
  {
    path: urls.SHOPADD,
    exact: true,
    component: ShopAdd,
    breadcrumbName: '店铺添加',
    parentPath: urls.SHOPMAG
  },
  {
    path: urls.SHOPEDIT,
    exact: true,
    component: ShopEdit,
    breadcrumbName: '店铺修改',
    parentPath: urls.SHOPMAG
  },
  {
    path: urls.BASE_ACCOUNT_LIST,
    exact: true,
    component: BaseAccountList,
    breadcrumbName: '店铺账户列表',
    parentPath: urls.HOME
  },
  {
    path: urls.MAINACCOUNTMAG,
    exact: true,
    component: MainAccountMag,
    breadcrumbName: '主体账户列表',
    parentPath: urls.HOME
  },
  {
    path: urls.MAINACCOUNTDETAIL,
    exact: true,
    component: MainAccountDetail,
    breadcrumbName: '主体账户详情',
    parentPath: urls.HOME
  },
  {
    path: urls.SCOPECONFIG,
    exact: true,
    component: ScopeConfig,
    breadcrumbName: '经营范围配置',
    parentPath: urls.HOME
  },
  {
    path: urls.ESTATECONFIG,
    exact: true,
    component: EstateConfig,
    breadcrumbName: '产业配置',
    parentPath: urls.HOME
  },
  {
    path: `${urls.BASE_ACCOUNT_DETAIL}/:shopNumber/:shopName`,
    exact: true,
    component: BaseAccountDetail,
    breadcrumbName: '账户详情',
    parentPath: urls.BASE_ACCOUNT_LIST
  },
  {
    path: urls.USER_CHANGE_LOG,
    exact: true,
    component: ChangeLog,
    breadcrumbName: 'Change Log',
    parentPath: urls.HOME
  },
  {
    path: `${urls.USER_ORDER_LIST}`,
    exact: true,
    component: UserOrderList,
    breadcrumbName: '支付订单管理',
    parentPath: urls.HOME
  },
  {
    path: `${urls.USER_ORDER_DETAIL}/:orderId`,
    exact: true,
    component: UserOrderDetail,
    breadcrumbName: '订单详情',
    parentPath: urls.USER_ORDER_LIST
  },
  {
    path: urls.USER_ACCOUNT_LIST,
    exact: true,
    component: AccountList,
    breadcrumbName: '账户管理',
    parentPath: urls.HOME
  },
  {
    path: `${urls.USER_ACCOUNT_DETAIL}/:accountId`,
    exact: true,
    component: AccountDetail,
    breadcrumbName: '账户详情',
    parentPath: urls.USER_ACCOUNT_LIST
  },
  {
    path: `${urls.USER_TRANSACTION_LIST}/:accountId`,
    exact: true,
    component: TransactionList,
    breadcrumbName: '交易记录',
    parentPath: urls.USER_ACCOUNT_LIST
  },
  {
    path: `${urls.USER_STARCOIN_LIST}/:accountId`,
    exact: true,
    component: StarcoinList,
    breadcrumbName: '星球币记录',
    parentPath: urls.USER_ACCOUNT_LIST
  },
  {
    path: `${urls.USER_TRANSACTION_DETAIL}/:transactionId/:payOrderId`,
    exact: true,
    component: TransactionDetail,
    breadcrumbName: '交易详情',
    parentPath: `${urls.USER_TRANSACTION_LIST}/:accountId`
  },
  {
    path: urls.USER_ACCOUNTADJUST,
    exact: true,
    component: AccountAdjust,
    breadcrumbName: '账户调整管理',
    parentPath: urls.HOME
  },
  {
    path: urls.USER_STARCOINORDER,
    exact: true,
    component: StarCoinOrder,
    breadcrumbName: '星球币兑换记录',
    parentPath: urls.HOME
  },
  {
    path: urls.REDENVELOPE_REDENVELOPES,
    exact: true,
    component: RedEnvelopes,
    breadcrumbName: '红包发放记录',
    parentPath: urls.HOME
  },
  {
    path: urls.REDENVELOPE_REDENVELOPES_DETAIL,
    exact: true,
    component: RedEnvelopesDetail,
    breadcrumbName: '红包详情',
    parentPath: urls.REDENVELOPE_REDENVELOPES
  },
  {
    path: urls.REDENVELOPE_ISSUANCEOFQUOTAS,
    exact: true,
    component: RedEnvelopeIssuanceofquotas,
    breadcrumbName: '红包发放限额配置',
    parentPath: urls.HOME
  },
  {
    path: urls.ACCRECHARGE,
    exact: true,
    component: AccRecharge,
    breadcrumbName: '账户充值',
    parentPath: urls.HOME
  },
  {
    path: urls.ACCSTATE,
    exact: true,
    component: AccState,
    breadcrumbName: '账户状态管理',
    parentPath: urls.HOME
  },
  {
    path: urls.PREPAIDCARD_STORE,
    exact: true,
    component: PrepaidCardStore,
    breadcrumbName: '充值卡库存管理',
    parentPath: urls.HOME
  },
  {
    path: urls.PREPAIDCARD_STORE_ADD,
    exact: true,
    component: PrepaidCardStoreAdd,
    breadcrumbName: '新建',
    parentPath: urls.PREPAIDCARD_STORE
  },
  {
    path: urls.PREPAIDCARD_STORE_EDIT,
    exact: true,
    component: PrepaidCardStoreEdit,
    breadcrumbName: '修改',
    parentPath: urls.PREPAIDCARD_STORE
  },
  {
    path: urls.PREPAIDCARD_STORE_DETIAL1,
    exact: true,
    component: PrepaidCardStoreDetail1,
    breadcrumbName: '详情',
    parentPath: urls.PREPAIDCARD_STORE
  },
  {
    path: urls.PREPAIDCARD_STORE_DETIAL2,
    exact: true,
    component: PrepaidCardStoreDetail2,
    breadcrumbName: '详情',
    parentPath: urls.PREPAIDCARD_STORE
  },
  {
    path: urls.PREPAIDCARD_USE,
    exact: true,
    component: PrepaidCardUse,
    breadcrumbName: '充值卡使用管理',
    parentPath: urls.HOME
  },
  {
    path: urls.PREPAIDCARD_USE_DETAIL,
    exact: true,
    component: PrepaidCardUseDetail,
    breadcrumbName: '详情',
    parentPath: urls.PREPAIDCARD_USE
  },
  {
    path: urls.EXPENSECARD_STORE,
    exact: true,
    component: ExpenseCardStore,
    breadcrumbName: '消费卡库存管理',
    parentPath: urls.HOME
  },
  {
    path: urls.EXPENSECARD_STORE_ADD,
    exact: true,
    component: ExpenseCardStoreAdd,
    breadcrumbName: '新建',
    parentPath: urls.EXPENSECARD_STORE
  },
  {
    path: urls.EXPENSECARD_STORE_EDIT,
    exact: true,
    component: ExpenseCardStoreEdit,
    breadcrumbName: '修改',
    parentPath: urls.EXPENSECARD_STORE
  },
  {
    path: urls.EXPENSECARD_STORE_DETIAL1,
    exact: true,
    component: ExpenseCardStoreDetail1,
    breadcrumbName: '详情',
    parentPath: urls.EXPENSECARD_STORE
  },
  {
    path: urls.EXPENSECARD_STORE_DETIAL2,
    exact: true,
    component: ExpenseCardStoreDetail2,
    breadcrumbName: '详情',
    parentPath: urls.EXPENSECARD_STORE
  },
  {
    path: urls.EXPENSECARD_USE,
    exact: true,
    component: ExpenseCardUse,
    breadcrumbName: '消费卡使用管理',
    parentPath: urls.HOME
  },
  {
    path: urls.EXPENSECARD_USE_DETAIL,
    exact: true,
    component: ExpenseCardUseDetail,
    breadcrumbName: '详情',
    parentPath: urls.EXPENSECARD_USE
  },
  {
    path: urls.INTERIMCARD_STORE,
    exact: true,
    component: InterimCardStore,
    breadcrumbName: '临时卡库存管理',
    parentPath: urls.HOME
  },
  {
    path: urls.INTERIMCARD_STORE_ADD,
    exact: true,
    component: InterimCardStoreAdd,
    breadcrumbName: '新建',
    parentPath: urls.INTERIMCARD_STORE
  },
  {
    path: urls.INTERIMCARD_STORE_EDIT,
    exact: true,
    component: InterimCardStoreEdit,
    breadcrumbName: '修改',
    parentPath: urls.INTERIMCARD_STORE
  },
  {
    path: urls.INTERIMCARD_STORE_DETIAL1,
    exact: true,
    component: InterimCardStoreDetail1,
    breadcrumbName: '详情',
    parentPath: urls.INTERIMCARD_STORE
  },
  {
    path: urls.INTERIMCARD_STORE_DETIAL2,
    exact: true,
    component: InterimCardStoreDetail2,
    breadcrumbName: '详情',
    parentPath: urls.INTERIMCARD_STORE
  },
  {
    path: urls.INTERIMCARD_USE,
    exact: true,
    component: InterimCardUse,
    breadcrumbName: '临时卡使用管理',
    parentPath: urls.HOME
  },
  {
    path: urls.INTERIMCARD_USE_DETAIL,
    exact: true,
    component: InterimCardUseDetail,
    breadcrumbName: '详情',
    parentPath: urls.INTERIMCARD_USE
  }
]

const RouteConfig = () => (
  <Router>
    <Switch>
      {
        // <Route path='/login' exact component={Login}/>
      }
      <XLayout routes={routes}/>
    </Switch>
  </Router>
)

export default RouteConfig
