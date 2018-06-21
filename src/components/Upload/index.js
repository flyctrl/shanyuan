// import { Upload, Icon, message } from 'antd'
import React, { Component } from 'react'
// import { Modal } from 'antd'
// import xfetch from 'Util/fetch'
import co from 'co'
import { picUrl, picDir, client } from 'Util/index'
import style from './style.css'
import defaultImg from '../../assets/uploadbg.jpg'

console.log(client)

// const imgAllowUpType = 'image/png,image/jpg'
function timestamp() {
  let time = new Date()
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let h = time.getHours()
  let mm = time.getMinutes()
  let s = time.getSeconds()
  return '' + y + '-' + add0(m) + '-' + add0(d) + '-' + add0(h) + '-' + add0(mm) + '-' + add0(s) + '-'
}

function add0(m) {
  return m < 10 ? '0' + m : m
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // imgScale: props.imgScale ? props.imgScale : 1,
      figureWidth: props.figureWidth ? props.figureWidth : '',
      figureHeight: props.figureHeight ? props.figureHeight : '',
      showImgUrl: props.showImgUrl ? this.handleImgUrl(props.showImgUrl) : defaultImg,
      disabled: props.disabled ? props.disabled : false,
    }
    this.addImage = this.addImage.bind(this)
  }

  componentWillReceiveProps(props) {
    this.setState({
      showImgUrl: props.showImgUrl ? this.handleImgUrl(props.showImgUrl) : defaultImg,
      disabled: props.disabled,
      // display: props.showImgUrl ? 'none' : 'block',
    })
  }

  handleImgUrl(imgUrl) {
    if (imgUrl.indexOf('http://') === -1) {
      return picUrl + imgUrl
    } else {
      return imgUrl
    }
  }

  // message() {
  //   Modal.warning({
  //     title: '提示',
  //     content: '仅支持png、jpg格式的图片上传',
  //     okText: '确认',
  //     cancelText: ''
  //   })
  // }
  async addImage(event) {
    // --------------------
    let f = event.target.files[0]
    let val = event.target.value
    let suffix = val.substr(val.lastIndexOf('.'))
    let obj = timestamp()  // 这里是生成文件名
    let randomNum = Math.random().toString().split('.')[1].substr(0, 6) // 命名空间
    let storeAs = picDir + obj + randomNum + suffix  // 命名空间
    console.log(' => ' + storeAs)
    const _this = this
    co(function * () {
      let result = yield client.multipartUpload(storeAs, f)
      console.log(result)
      _this.setState({
        showImgUrl: picUrl + result.name,
      })
      _this.props.uploadDone(picUrl + result.name)
    }).catch(function (err) {
      console.log(err)
    })
    // --------------------
    // const image = event.target.files[0]
    // if (!image) return // if no img upload, just return
    // // if (imgAllowUpType.indexOf(image.type) === -1) {
    // //   this.message()
    // //   return false
    // // }
    // const formData = new window.FormData()
    // formData.append('file', image)
    // event.target.value = null // To trigger onchange event next time, input value should be reset to null
    // xfetch('/pay-plat-management/recharge/getUploadToken.json', {}).then((res) => {
    //   if (res.code === 0) {
    //     formData.append('token', res.data)
    //     fetch('http://up-z0.qiniu.com', {
    //       method: 'post',
    //       mode: 'cors',
    //       body: formData
    //     }).then(json => {
    //       return json.json()
    //     }).then((data) => {
    //       this.props.uploadDone(picUrl + data.key)
    //       this.setState({
    //         showImgUrl: picUrl + data.key,
    //       })
    //     })
    //   }
    // })
  }

  render() {
    const { figureWidth, figureHeight, disabled, showImgUrl } = this.state
    return (
      <div className={style.container}>
        <figure
          className={style.figure}
          style={{
            width: `${figureWidth}px`,
            height: `${figureHeight}px`
          }}
        >
          <div className={style.mack}>
            {showImgUrl === defaultImg ? <p><label htmlFor='up'>导入图片</label></p>
              : <p><a href={showImgUrl}
                      download>导出图片</a><span> | </span><label htmlFor='up'>更换图片</label></p>
            }</div>
          <img
            className={style.avatar}
            src={showImgUrl}
            style={{ height: figureHeight, width: figureWidth }}
          />
          <input
            id='up'
            className={style.control}
            type='file'
            disabled={disabled}
            accept='image/*'
            onChange={this.addImage}/>
        </figure>

      </div>
    )
  }
}

export default App
