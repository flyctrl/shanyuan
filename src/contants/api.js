import fetch from 'Util/fetch'
import { message } from 'antd'
import { showSpin } from 'Src/models/layout'

// 获取数据类接口
export const Fetch = (url, params) => {
  // showSpin({ bool: true, content: '正在加载数据....' })
  return fetch(url, params).then((res) => {
    if (res.code === 0) {
      // showSpin()
      return res.data
    } else {
      // showSpin()
      message.error(res.errmsg, 2)
    }
  }, (err) => {
    // showSpin()
    message.error(err.errmsg, 2)
  })
}

// 保存类接口
export const FetchSave = (url, params) => {
  showSpin({ bool: true, content: '正在加载数据....' })
  return fetch(url, params).then((res) => {
    if (res.code === 0) {
      showSpin()
      message.success(res.errmsg, 2)
      return res.data
    } else {
      showSpin()
      message.error(res.errmsg, 2)
    }
  }, (err) => {
    showSpin()
    message.error(err.errmsg, 2)
  })
}
export default {
  getAllBusinessScope: '/pay-plat-management/merchant/getAllBusinessScope.json',
  getAllIndustryInfo: '/pay-plat-management/industry/getAllIndustryInfo.json',
  getAllTown: '/pay-plat-management/town/getAll.json',
  // 用户订单列表
  getUserOrderList: '/pay-plat-management/route/queryPaymentSerials.json',
  // 导出订单列表
  exportOrderList: '/pay-plat-management/route/exportPaymentSerials.json',
  // 用户订单详情
  getUserOrderDetail: '/pay-plat-management/route/queryDetailPaymentSerial.json',
  // 用户账户列表
  getUserAccountList: '/pay-plat-management/account/accountInfoList.json',
  // 用户账户详情
  getUserAccountDetail: '/pay-plat-management/account/accountInfo.json',
  // 用户交易记录列表
  getUserTransactionList: '/pay-plat-management/account/accountTradeList.json',
  // 导出用户交易列表
  exportTransactionList: '/pay-plat-management/account/accountTradeList/down.json',
  // 用户交易记录详情
  getUserTransactionDetail: '/pay-plat-management/account/accountTradeInfo.json',
  // 获取店铺列表
  getShopList: '/pay-plat-management/merchant/queryPageMerchantShops.json',
  // 修改店铺列表
  editShopList: '/pay-plat-management/merchant/modifyMerchantShop.json',
  // 获取店铺详情
  getShopDetail: '/pay-plat-management/merchant/queryMerchantShopByKey.json',
  // 获取商户账户交易列表
  getShopAccountTradeList: '/pay-plat-management/account/shopAccountTradeList.json',
  // 获取商户账户列表详情
  getShopAccountList: '/pay-plat-management/merchant/queryMerchantShops.json',
  // 商户账户筛选接口
  queryShopAccount: '/pay-plat-management/merchant/queryMerchants.json',
  // 导出账户交易
  exportshopAccountTradeList: '/pay-plat-management/account/shopAccountTradeList/down.json',
  // 添加店铺列表
  addShopList: '/pay-plat-management/merchant/addMerchantShop.json',
  // 修改密码
  changePassword: '/pay-plat-management/merchant/modifyMerchantShopPassword.json',
  // 获取商户列表
  getSellList: '/pay-plat-management/merchant/queryPageMerchants.json',
  // 获取商户详情
  getSellerDetail: '/pay-plat-management/merchant/queryMerchantInfoByKey.json',
  // 修改商户列表
  editSellerList: '/pay-plat-management/merchant/modifyMerchantInfo.json',
  // 添加商户列表
  addSellerList: '/pay-plat-management/merchant/addMerchantInfo.json',
  // 删除商户列表
  deleteSellerList: '/pay-plat-management/merchant/deleteMerchantInfoByKey.json',
  // 获取运营方列表
  getOptorList: '/pay-plat-management/merchant/queryPageOperators.json',
  // 获取运营方详情
  getOptorDetail: '/pay-plat-management/merchant/queryOperatorInfoByKey.json',
  // 修改运营方信息
  editOptorList: '/pay-plat-management/merchant/modifyOperatorInfo.json',
  // 增加运营方信息
  addOptorList: '/pay-plat-management/merchant/addOperatorInfo.json',
  // 删除运营方列表
  deleteOptorList: '/pay-plat-management/merchant/deleteOperatorInfoByKey.json',
  // 用户充值列表
  userRechargeList: '/pay-plat-management/user/userList.json',
  // 单个账号充值
  userRechage: '/pay-plat-management/user/userRechage.json', // 废弃
  rechageApply: '/pay-plat-management/user/rechageApply.json',
  // 批量账号充值
  bathUserRechage: '/pay-plat-management/user/bathUserRechage.json', // 废弃
  fileRechageApply: '/pay-plat-management/user/fileRechageApply.json',
  // 模板下载
  tempDown: '/pay-plat-management/account/rechargeTemp/down.json',
  // 用户账户状态管理列表
  userAccountInfo: '/pay-plat-management/user/userAccountInfo.json',
  // 用户卡片失效事件
  cardInvalid: '/pay-plat-management/user/cardInvalid.json',
  // 申请用户账户退卡/体现
  cardRefund: '/pay-plat-management/user/cardRefund.json', // 废弃
  withdrawApply: '/pay-plat-management/user/withdrawApply.json',
  // 取消退款
  cardUnRefund: '/pay-plat-management/user/cardUnRefund.json',
  // 清空用户账号
  accountZero: '/pay-plat-management/user/accountZero.json',
  rechargeErrorInfo: '/pay-plat-management/user/rechargeErrorInfo/down.json',
  // 主账户列表
  queryPageBusinessPlatformList: '/pay-plat-management/platform/queryPageBusinessPlatformList.json',
  // 主体账户详情
  platformAccountTradeList: '/pay-plat-management/platform/platformAccountTradeList.json',
  // 星球币变动查询
  accountXQBTradeList: '/pay-plat-management/account/accountXQBTradeList.json',
  // 星球币兑换记录
  accountXQBExchangeList: '/pay-plat-management/account/accountXQBExchangeList.json',
  // 修改商户密码
  modifyMerchantPassword: '/pay-plat-management/merchant/modifyMerchantPassword.json',
  // 充值卡管理
  prepaidCard: {
    // 库存管理
    store: {
      list(params) {
        return Fetch('/pay-plat-management/recharge/settings.json', params)
      },
      add: {
        batch() {
          return Fetch('/pay-plat-management/recharge/nextbatch.json', {})
        },
        save(params) {
          return FetchSave('/pay-plat-management/recharge/create.json', params)
        },
      },
      edit: {
        save(params) {
          return FetchSave('/pay-plat-management/recharge/update.json', params)
        },
      },
      del(params) {
        return FetchSave('/pay-plat-management/recharge/del.json', params)
      },
      detial(params) {
        return Fetch('/pay-plat-management/recharge/batchinfo.json', params)
      },
      detial1: {
        make(params) {
          return FetchSave('/pay-plat-management/recharge/setNoneImportStatus.json', params)
        },
        inStore(params) {
          return FetchSave('/pay-plat-management/recharge/importList.json', params)
        },
      },
      detial2: {
        send(params) {
          return FetchSave('/pay-plat-management/recharge/grant.json', params)
        },
        address(value) {
          return Fetch('/pay-plat-management/merchant/queryPageOperators.json', {
            operatorName: value,
            currentPage: '1',
            pageSize: '10',
            step: '2'
          })
        },
        history(params) {
          return Fetch('/pay-plat-management/recharge/grantHistory.json', params)
        },
      },
    },
    // 使用管理
    use: {
      list(params) {
        return Fetch('/pay-plat-management/recharge/grantPageQuery.json', params)
      },
      detail: {
        send(params) {
          return Fetch('/pay-plat-management/recharge/useBatchDetail.json', params)
        },
        use(params) {
          return Fetch('/pay-plat-management/recharge/batchPageCardList.json', params)
        }
      },
    },
    // 导出
    export: '/pay-plat-management/recharge/exportList.htm?batch=',
    // 未入库导出
    exportQr: '/pay-plat-management/recharge/exportQrList.htm?batch='
  },
  // 消费卡管理
  expenseCard: {
    // 库存管理
    store: {
      list(params) {
        return Fetch('/pay-plat-management/consumer/settings.json', params)
      },
      add: {
        batch() {
          return Fetch('/pay-plat-management/consumer/nextbatch.json', {})
        },
        save(params) {
          return FetchSave('/pay-plat-management/consumer/create.json', params)
        },
      },
      edit: {
        save(params) {
          return FetchSave('/pay-plat-management/consumer/update.json', params)
        },
      },
      del(params) {
        return FetchSave('/pay-plat-management/consumer/del.json', params)
      },
      detial(params) {
        return Fetch('/pay-plat-management/consumer/batchinfo.json', params)
      },
      detial1: {
        make(params) {
          return FetchSave('/pay-plat-management/consumer/setNoneImportStatus.json', params)
        },
        inStore(params) {
          return FetchSave('/pay-plat-management/consumer/importList.json', params)
        },
      },
      detial2: {
        send(params) {
          return FetchSave('/pay-plat-management/consumer/grant.json', params)
        },
        address(value) {
          return Fetch('/pay-plat-management/merchant/queryPageOperators.json', {
            operatorName: value,
            currentPage: '1',
            pageSize: '10',
            step: '2'
          })
        },
        history(params) {
          return Fetch('/pay-plat-management/consumer/grantHistory.json', params)
        },
      },
    },
    // 使用管理
    use: {
      list(params) {
        return Fetch('/pay-plat-management/consumer/grantPageQuery.json', params)
      },
      detail: {
        send(params) {
          return Fetch('/pay-plat-management/consumer/useBatchDetail.json', params)
        },
        use(params) {
          return Fetch('/pay-plat-management/consumer/batchPageCardList.json', params)
        }
      },
    },
    // 导出
    export: '/pay-plat-management/consumer/exportList.htm?batch=',
    // 未入库导出
    exportQr: '/pay-plat-management/consumer/exportQrList.htm?batch='
  },
  // 临时卡管理
  interimCard: {
    // 库存管理
    store: {
      list(params) {
        return Fetch('/pay-plat-management/temporary/settings.json', params)
      },
      add: {
        batch() {
          return Fetch('/pay-plat-management/temporary/nextbatch.json', {})
        },
        save(params) {
          return FetchSave('/pay-plat-management/temporary/create.json', params)
        },
      },
      edit: {
        save(params) {
          return FetchSave('/pay-plat-management/temporary/update.json', params)
        },
      },
      del(params) {
        return FetchSave('/pay-plat-management/temporary/del.json', params)
      },
      detial(params) {
        return Fetch('/pay-plat-management/temporary/batchinfo.json', params)
      },
      detial1: {
        make(params) {
          return FetchSave('/pay-plat-management/temporary/setNoneImportStatus.json', params)
        },
        inStore(params) {
          return FetchSave('/pay-plat-management/temporary/importList.json', params)
        },
      },
      detial2: {
        send(params) {
          return FetchSave('/pay-plat-management/temporary/grant.json', params)
        },
        address(value) {
          return Fetch('/pay-plat-management/merchant/queryPageOperators.json', {
            operatorName: value,
            currentPage: '1',
            pageSize: '10',
            step: '2'
          })
        },
        history(params) {
          return Fetch('/pay-plat-management/temporary/grantHistory.json', params)
        },
      },
    },
    // 使用管理
    use: {
      list(params) {
        return Fetch('/pay-plat-management/temporary/grantPageQuery.json', params)
      },
      detail: {
        send(params) {
          return Fetch('/pay-plat-management/temporary/useBatchDetail.json', params)
        },
        use(params) {
          return Fetch('/pay-plat-management/temporary/batchPageCardList.json', params)
        }
      },
    },
    // 导出
    export: '/pay-plat-management/temporary/exportList.htm?batch=',
    // 未入库导出
    exportQr: '/pay-plat-management/temporary/exportQrList.htm?batch='
  },
  // 运营管理
  operateMag: {
    // 工单管理
    workOrderMag: {
      // 工单管理分页列表
      list(params) {
        return Fetch('/pay-plat-management/user/queryPageWorkOrders.json', params)
      },
      // 工单详情（提现）
      Withdrawals: {
        // 工单明细查询
        baseInfo(params) {
          return Fetch('/pay-plat-management/user/queryWorkOrderByKey.json', params)
        },
        // 工单关联订单分页查询
        list(params) {
          return Fetch('/pay-plat-management/user/queryPageChangeOrders.json', params)
        },
        // 工单审核
        audit(params) {
          return FetchSave('/pay-plat-management/user/withdrawAudit.json', params)
        },
        // 用户账户状态管理列表
        userAccountInfo(params) {
          return Fetch('/pay-plat-management/user/userAccountInfo.json', params)
        },
      },
      // 工单详情（充值）
      Recharge: {
        // 工单明细查询
        detial(params) {
          return Fetch('/pay-plat-management/user/queryWorkOrderByKey.json', params)
        },
        // 工单关联订单分页查询
        list(params) {
          return Fetch('/pay-plat-management/user/queryPageChangeOrders.json', params)
        },
        // 工单审核
        audit(params) {
          return FetchSave('/pay-plat-management/user/rechageAudit.json', params)
        },
        // 批量导出
        export: '/pay-plat-management/user/exportRechageResult.json?applyId='
      }
    },
    // 绿色代付授权
    greenPayment: {
      // 分页列表
      list(params) {
        return Fetch('/pay-plat-management/account/queryPageBindRelationship.json', params)
      },
      // 新增
      add(params) {
        return FetchSave('/pay-plat-management/account/addBindRelationship.json', params)
      },
      // 删除
      del(params) {
        return FetchSave('/pay-plat-management/account/deleteBindRelationship.json', params)
      }
    }
  },
  // 红包管理
  redEnvelope: {
    redEnvelopes: {
      list(params) { // 红包发放记录列表
        return Fetch('/pay-plat-management/redpacket/queryPageRedpacket.json', params)
      },
      detail(params) { // 红包详情
        return Fetch('/pay-plat-management/redpacket/queryDetailSentRedpacket.json', params)
      },
      receive(params) { // 领取详情
        return Fetch('/pay-plat-management/redpacket/queryOperatePageRedpacket.json', params)
      },
    },
    issuanceOfQuotas: { // 红包发放限额配置
      data(params) { // 获取数据
        return Fetch('/pay-plat-management/redpacket/queryLimit.json', params)
      },
      update(params) { // 提交数据
        return Fetch('/pay-plat-management/redpacket/updateLimit.json', params)
      },
    }
  },
  // 账户管理
  user: {
    accountAdjust: {
      adjustUserAccount(params) { // 用户账户调账
        return FetchSave('/pay-plat-management/account/adjustUserAccount.json', params)
      },
      adjustShopAccount(params) { // 店铺账户调账
        return FetchSave('/pay-plat-management/account/adjustShopAccount.json', params)
      },
      adjustOperatorAccount(params) { // 主体账户调整
        return FetchSave('/pay-plat-management/account/adjustOperatorAccount.json', params)
      },
    }
  },
  platLogin: {
    ssoLogin: {
      getMenu(params) {
        return Fetch('/pay-plat-management/sso/getMenu.json', params)
      }
    }
  },
  // 经营范围配置
  scopeConfig: { // 分页获取经营范围
    getBusinessScopePage(params) {
      return Fetch('/pay-plat-management/merchant/getBusinessScopePage.json', params)
    },
    addBusinessScope(params) { // 增加经营范围
      return FetchSave('/pay-plat-management/merchant/addBusinessScope.json', params)
    },
    delBusinessScope(params) { // 删除经营范围
      return FetchSave('/pay-plat-management/merchant/delBusinessScope.json', params)
    }
  },
  estateConfig: { // 产业配置
    queryPageIndustryInfos(params) { // 分页获取产业
      return Fetch('/pay-plat-management/industry/queryPageIndustryInfos.json', params)
    },
    modifyIndustryInfo(params) { // 编辑产业
      return FetchSave('/pay-plat-management/industry/modifyIndustryInfo.json', params)
    },
    addIndustryInfo(params) { // 新增产业
      return FetchSave('/pay-plat-management/industry/addIndustryInfo.json', params)
    },
    getAllIndustryInfo(params = {}) { // 获取全部产业
      return Fetch('/pay-plat-management/industry/getAllIndustryInfo.json', params)
    }
  },
  // 图片上传Token
  getUploadToken() {
    return Fetch('/pay-plat-management/recharge/getUploadToken.json', {})
  },
}
