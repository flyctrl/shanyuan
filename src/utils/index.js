// 开发环境
// let baseUrl = '/shanyuan'
// let baseUrl = 'http://10.0.21.165:8088'
let baseUrl = 'http://itest.payadmin.jcgroup.com.cn/shanyuan'
let picUrl = 'http://payflie.oss-cn-shanghai.aliyuncs.com/'
let picDir = 'test/shanyuan/'
let lgoinUrl = 'http://test.admin.sso.jcease.com/login'

if (process.env.NODE_ENV === 'production') {
  // 线上环境
  baseUrl = 'http://payadmin.jcgroup.com.cn/shanyuan'
  picUrl = 'http://payfile.jcgroup.com.cn/'
  picDir = 'pro/shanyuan/'
  lgoinUrl = 'http://ssoadmin.jcgroup.com.cn/login'
  if (TEST) {
    // 测试环境
    baseUrl = 'http://itest.payadmin.jcgroup.com.cn/shanyuan'
    picUrl = 'http://payflie.oss-cn-shanghai.aliyuncs.com/'
    picDir = 'test/shanyuan/'
    lgoinUrl = 'http://test.admin.sso.jcease.com/login'
  }
  if (PRE) {
    // 预发环境
    baseUrl = 'http://pre.payadmin.jcgroup.com.cn/shanyuan'
    picUrl = 'http://payflie.oss-cn-shanghai.aliyuncs.com/'
    picDir = 'pre/shanyuan/'
    lgoinUrl = 'http://pre.ssoadmin.jcgroup.com.cn/login'
  }
}
import OSS from 'ali-oss/dist/aliyun-oss-sdk.min.js'
let client = new OSS({
  region: 'oss-cn-shanghai',
  // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: 'LTAIRIRqIlEPwWwJ',
  accessKeySecret: 'tcnuEpahHTDQvbvGcRJwbCt7qxakcX',
  bucket: 'payflie'
})

export { baseUrl, picUrl, picDir, lgoinUrl, client }
