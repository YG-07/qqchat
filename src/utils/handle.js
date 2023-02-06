let videoIds = []

/******************** 消息模板 ************************ */

/** 文本消息 */
const wordMsgDom = function (config) {
  let html = '{dom}'
  if(config.url) {
    html = `<a href="${config.url}">{dom}</a>`
  }
  html = html.replace('{dom}', `<div class="word ${config.class || ''}" style="${config.style || ''}">${config.msg}</div>`)
  return html
}

/** 图片消息 取用懒加载 */
const imgMsgDom = function (config) {
  let html = '{dom}'
  if(config.url) {
    html = `<a href="${config.url}">{dom}</a>`
  }
  html = html.replace('{dom}', `<img data-src="${config.msg}" class="lazyload ${config.class || ''}" style="${config.style || ''}"></img>`)
  return html
}

/** 视频消息 */
const mp4MsgDom = function (config) {
  let id = `${config.type}${config.id}`
  let type = ''
  if(config.type != "m3u8") {
    type = `video/${config.type}`
  } else {
    type = `application/x-mpegURL`
  }
  let html = `
  <video
    id="${id}"
    class="video-js ${config.class || ''}"
    style="${config.style || ''}"
    controls
    preload="auto"
    data-setup='{}'>
    <source src="${config.msg}" type="${type}"></source>
  </video>
  `
  console.log(html);
  videoIds.push(id)
  return html
}

/** 下载资源消息 */
const fileMsgDom = function (config) {
  let html = `
  <a class="download" download href="${config.url}">
    <img data-src="./assets/pageSth/下载.png" class="lazyload"></img>
    <div>${config.msg}</div>
  </a>
  `
  return html
}

// XXX：1. 此处新增消息模板
/** 目录消息 更新时间/说明/二维码图片地址 */
const menuMsgDom = function (config) {
  // 是否不是默认域名，是则当成完整链接，否则拼接
  let tmpSrc = config.nosite ?
    config.src :
    `https://a-8geh111ac863e942-1312158730.tcloudbaseapp.com${config.src}`;
  let html = `
  <div class="menu-msg">
    <div class="notice">
      <span style="color: blue;">${config.up}</span>
      <span>:</span>
      <span style="color: red;">${config.s}</span>
    </div>
    <img src="${tmpSrc}"/>
  </div>
  `
  return html
}

/** 页面手机顶部栏实例 */
const phoneTopInstance = function () {
  let dom = document.createElement('div')
  dom.className = "phone-top"
  dom.innerHTML = `
  <div class="between-item">
    <div class="top-item">
      <img class="item" src="assets/pageSth/信号.png" />
      <div class="item">中国移动&nbsp;&nbsp;5G</div>
    </div>
    <div class="top-item">
      <img class="item" src="assets/pageSth/电量.png" />
    </div>
  </div>
  <div class="time-item">11:45:14</div>
  `
  return dom
}

/** 搜索框按了回车键 */
const keyupEnter = function (e, value) {
  if(e.keyCode == 13) {
    okSearch(e, value)
  }
}
/** 搜索过滤 */
const okSearch = function (e, value) {
  let msgAreaDom = document.getElementsByClassName("msg-area")[0]
  let tmpMsgAreaDom = document.createElement('div')
  let tmpPageData = []
  if(value === '') {
    tmpPageData = [...pageData]
  } else {
    tmpPageData = pageData.filter(item => (item.type == 'float' || item.s.includes(value) || item.up.includes(value)))
  }
  tmpMsgAreaDom.appendChild(createOneMsg({type: 'word', msg: `获取记录数${tmpPageData.length - 1}条`}))
  for(let i = 0; i < tmpPageData.length; ++i) {
    tmpMsgAreaDom.appendChild(createOneMsg(tmpPageData[i]))
  }
  msgAreaDom.innerHTML = tmpMsgAreaDom.innerHTML
}

/** 搜索栏实例 */
const searchInstance = function () {
  let dom = document.createElement('div')
  dom.className = "search-area"
  let inputDom =  document.createElement('input')
  let buttonDom = document.createElement('button')
  inputDom.setAttribute('type', 'text')
  inputDom.setAttribute('placeholder', "搜索关键字")
  // 事件
  inputDom.addEventListener('keyup', function(e) {
    keyupEnter(e, inputDom.value)
  }, false)
  buttonDom.addEventListener('click', function(e) {
    okSearch(e, inputDom.value)
  }, false)
  buttonDom.innerHTML = "搜 索"

  dom.appendChild(inputDom)
  dom.appendChild(buttonDom)
  return dom
}

/** 头像图片实例 参数src/class/style */
const headImgInstance = function(opt = {}) {
  let dom = document.createElement('div')
  dom.className = "head-area"
  dom.innerHTML = `<img data-src="${opt.src || 'assets/pageSth/头像1.png'}" class="lazyload" style="" />`
  return dom
}

/** 悬浮窗实例 */
const floatInstance = function(config) {
  let dom = document.createElement('div')
  dom.className = "float-area"
  dom.innerHTML = `<a href="${config.url}">${config.msg}</a>`
  return dom
}

/** 生成一个消息DOM */
const createOneMsg = function (config) {
  let oneMsgDom = document.createElement('div')
  oneMsgDom.className = "one-msg"
  let headAreaDom = headImgInstance()
  let msgDom = document.createElement('div')
  msgDom.className = "msg-box"
  let msgItemDom = document.createElement('div')
  msgItemDom.className = "msg"
  let html = ''
  if(config.type == 'word') {
    html = wordMsgDom(config)
    msgDom.style.display = 'flex'
  }
  else if(config.type == 'img') {
    html = imgMsgDom(config)
  }
  // XXX: 正则匹配的视频格式，详见videojs官网支持的格式
  // videojs官网：https://gitcode.gitcode.host/docs-cn/video.js-docs-cn/index.html
  else if(/mp4|webm|ogv|m3u8/.test(config.type)) {
    html = mp4MsgDom(config)
  }
  else if(config.type == 'file') {
    html = fileMsgDom(config)
    msgDom.style.display = 'flex'
  }
  // XXX: 2.根据type类型配置新增的消息模板
  else if(config.type == 'float') {
    return floatInstance(config)
  }
  else if(!config.type) {
    html = menuMsgDom(config)
    msgDom.style.display = 'flex'
  }

  msgItemDom.innerHTML = html
  msgDom.appendChild(msgItemDom)
  oneMsgDom.appendChild(headAreaDom)
  oneMsgDom.appendChild(msgDom)
  return oneMsgDom
}

/*************************************************** */
/********************* 其他处理函数 ***************** */

/** DOM转字符串 */
const dom2String = function (dom) {
  let p = document.createElement('div')
  p.appendChild(dom)
  let string = p.innerHTML
  p = dom = null
  return string
}

/** 字符串转DOM */
const string2Dom = function (string) {
  let p = document.createElement('div')
  p.innerHTML = string
  return p.childNodes[0]
}

/** 开始渲染Dom */
const startRender = function(data) {
  // 顶部样式
  let phoneTopDom = phoneTopInstance()
  let searchDom = searchInstance()
  // 消息区域 循环生成消息
  let msgAreaDom = document.createElement('div')
  msgAreaDom.className = "msg-area"
  console.log('data', data);
  msgAreaDom.appendChild(createOneMsg({type: 'word', msg: `获取记录数${data.length - 1}条`}))
  for(let i = 0; i < data.length; ++i) {
    msgAreaDom.appendChild(createOneMsg(pageData[i]))
  }
  return [phoneTopDom, searchDom, msgAreaDom]
}

/** 处理数据 路由 */
const dealData = function(search) {
  if(!search) { return null }
  // XXX: 可修改Url参数名page，访问链接形如：https://xxxxx.com/?page=xxxx
  let path = search.replace('?page=', '')
  for(let route in router) {
    if(route == path) {
      return router[route]
    }
  }
  return null
}