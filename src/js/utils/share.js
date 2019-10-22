import { getAbsPath, getStaticPath } from 'utils/utils.js'
import { trackEvent } from 'utils/track.js'
import NewsappShare from 'newsapp-share'
import * as jsBridge from 'js-bridge'

window.jsBridge = jsBridge
const defaultConfig = {
  title: '默认分享标题',
  desc: '默认分享描述',
  imgUrl: getStaticPath('share-icon.png'), // or 'https://static.ws.126.net/163/f2e/common/share-icon.png',
  link: getAbsPath(),
  onlyImg: false,
  shareDone: () => {
    // 统计
    trackEvent('sharedone')
  }
}

let customConfig = {}

function updateShareConfig(config = {}) {
  const origin = config.shareDone
  config.shareDone = () => {
    origin && origin.apply(this, arguments)
    defaultConfig.shareDone.apply(this, arguments)
  }

  customConfig = Object.assign({}, defaultConfig, config)
  NewsappShare.config(customConfig)
}

function shareWithConfig(config = {}, tag) {
  const origin = config.shareDone
  config.shareDone = () => {
    origin && origin.apply(this, arguments)
    defaultConfig.shareDone.apply(this, arguments)
    updateShareConfig(customConfig)
  }

  NewsappShare.config(config)
  NewsappShare.show(tag)
  tag &&
    setTimeout(() => {
      updateShareConfig(customConfig)
    }, 300)
}

// 初始化执行一次
updateShareConfig()

export { updateShareConfig, shareWithConfig }
