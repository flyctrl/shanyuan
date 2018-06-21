import React, { Component } from 'react'
import { Layout, Icon, Spin } from 'antd'
import {
  Link,
  Route
} from 'react-router-dom'
import YXBreadcrunb from 'Components/Breadcrumb'
import AppMenu from '../components/Menus'
import style from './style.css'

const { Content, Sider } = Layout

export let showSpin = null

class MainLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    }
    showSpin = this.setSpin
  }

  // 设置是否可收起
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  // 拓展时用
  selectMenu() {
    let pathName = decodeURI(location.pathname)
    let menuName = this.getMenuName(pathName)
    switch (menuName) {
      case 'App':
        return <AppMenu match={this.props.match} selectedMenu={this.props.selectedMenu} mode={this.state.collapsed}/>
      default :
        return <AppMenu match={this.props.match} selectedMenu={this.props.selectedMenu} mode={this.state.collapsed}/>
    }
  }

  // 设置全局加载
  setSpin = (showSpin) => {
    this.setState({ showSpin })
  }

  getMenuName(pathName) {
    if (!pathName || pathName === '/') return ''
    let reg = new RegExp(/\/(\b\w*\b)/)
    let matchName = pathName.match(reg)[1]
    let name = matchName.split('')
    name = name[0].toUpperCase() + name.slice(1).join('')
    return name
  }

  render() {
    const { routes } = this.props
    const { showSpin } = this.state
    return (
      <Layout className={style.layout}>
        <Sider className={style.sidebar}
               trigger={null}
               collapsible
               collapsed={this.state.collapsed}>
          <div className={style.logo}>
            <Link className={style['to-home']} to='/'>
              <img src={require('../assets/logo.png')} alt='logo'/>
              <span>支付后台管理系统</span>
            </Link>
          </div>
          <div className={style.menu}>
            {this.selectMenu()}
          </div>
        </Sider>
        <Layout className={this.state.collapsed ? style['main-content-collapsed'] : style['main-content']}>
          <div className={style['header']}>
            <div className={style['header-button']} onClick={this.toggle}>
              <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}/>
            </div>
            <div className={style['right-warpper']}>
              <Icon type='user'/>
            </div>
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            {
              routes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    render={({ match, location, history }) => {
                      return <div>
                        <YXBreadcrunb location={location} match={match} routes={routes}/>
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                          <route.component match={{ match, location, history }}/>
                        </Content>
                      </div>
                    }}
                  />
                )
              })
            }
          </div>
        </Layout>
        {
          showSpin && showSpin.bool ? (
            <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '2000' }}>
              <Spin tip={showSpin.content}
                    style={{ position: 'absolute', top: '50%', width: '100%' }}
                    size='large'/>
            </div>) : null
        }
      </Layout>
    )
  }
}

export default MainLayout

