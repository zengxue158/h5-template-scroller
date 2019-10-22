import '../css/index.less' // 引入css
import './common.js' // 公共js
import { shareWithConfig } from 'utils/share.js'
import './hilo-standalone.js'
import Scroller from './Scroller.js'
import { isArray } from 'utils/utils.js'
import { getImgList } from './imglist.js'  //所有动画参数写在这里

var isWeixin = navigator.userAgent.match(/micromessenger/i);

let app = {
  canvas: $('#stage'),
  stage: null,
  winWidth: 0,
  winHeight: 0,
  imgList: [],
  stageContent: {},
  loadQueue: {},
  musics:[ // 滑动到固定位置播放音频、停止音频
    // {id: "", start: ,end:},
  ],
  init() {
    let self = this
    this.loadQueue = this.getLoadQueue(this.start.bind(this))
    // 背景音乐
    this.autoplay('bgm')
  },
  bind() {
    let self = this
    // 背景音乐兼容性处理
    // $('body').one('touchend', () => {
    //   $('#bgm')[0].play()
    //   if(!isWeixin){ //为了兼容其他客户端边滑边动播放音乐的问题。
    //     for(var i=0;i<app.musics.length;i++){
    //       $("#"+app.musics[i].id)[0].play()
    //     }
    //   }
    // })
    // 阻止页面上下弹动
    // document.querySelector(".loading").addEventListener("touchmove",function(e){e.stopPropagation();e.preventDefault()},false);
    
  },
  autoplay(id) {
    let audioAutoPlay = () => {
      const audio = $('#' + id)[0]
      audio.play().catch((e) => {
        console.log(e)
      })
      document.addEventListener(
        'WeixinJSBridgeReady',
        () => {
          audio.play()
        },
        false
      )
    }
    audioAutoPlay()
  },
  initMusic(){
    let self = this;
    if(app.musics.length>0){
      for (var i = 0; i < app.musics.length; i++) {
        (function(i){
          var audio = $("#" + app.musics[i].id)[0];
          var play = function() {
            document.removeEventListener("WeixinJSBridgeReady", play);
            document.removeEventListener("YixinJSBridgeReady", play);
            audio.play();
          };
          $(audio).one("play", function(){
            this.pause();
          })
          document.addEventListener("WeixinJSBridgeReady", play, false);
          document.addEventListener('YixinJSBridgeReady', play, false);
        })(i);
      }
    }
  },
  getLoadQueue(completeCb) {
    let percent = $('#loading_num')
    this.imgList = getImgList()
    let imgList = this.imgList.filter((item) => item.preload !== false && item.src)

    let queue = new Hilo.LoadQueue()
    queue.add(imgList)

    queue.on('load', (e) => {
      percent.text(`${(e.target._loaded / e.target._source.length * 100).toFixed()}%`)
    })

    queue.on('complete', () => {
      completeCb()
      queue.off('complete').off('load');
      
    })

    return queue.start()
  },
  start() {
    // loading结束后
    this.initStage()
    this.addViews()
    this.initScroller()

  },
  initStage() {
    ;(this.winWidth = $('body').width()), (this.winHeight = $('body').height() > 1448 ? 1448 : $('body').height())
    this.canvas.attr({ width: this.winWidth, height: this.winHeight })
    this.stage = new Hilo.Stage({
      canvas: this.canvas[0],
      width: this.winWidth,
      height: this.winHeight
    })
    let ticker = new Hilo.Ticker(60)
    ticker.addTick(Hilo.Tween)
    ticker.addTick(this.stage)
    ticker.start()
    window.stage = stage
    this.stage.enableDOMEvent(Hilo.event.POINTER_START, true)
    this.stage.enableDOMEvent(Hilo.event.POINTER_MOVE, true)
    this.stage.enableDOMEvent(Hilo.event.POINTER_END, true)
  },
  renderStage(resources) {
    let self = this
    if (!isArray(resources)) {
      resources = [ resources ]
    }
    resources.forEach((item) => {
      renderResource(item)
    })
    function renderResource(resource) {
      resource.propes = resource.propes || {}
      // parent 非atlas放在stage下，其他置于对应parent
      let parent =
				!resource.parent || resource.parent == 'stage' ? self.stage : self.stageContent[resource.parent]
      // 遮罩
      if (resource.mask) {
        resource.propes.mask = self.stageContent[resource.mask]
      }
      // y值居中计算时使用center
      if (resource.propes && resource.propes.center) {
        resource.propes.y = self.winHeight / 2 + resource.propes.center
      }
      // y值底部对齐使用bottom
      if (resource.propes && resource.propes.bottom) {
        resource.propes.y = self.winHeight - resource.propes.bottom
      }
      // scaleX == scaleY时可使用scale
      if (resource.propes && resource.propes.scale) {
        resource.propes.scaleX = resource.propes.scaleY = resource.propes.scale
      }
      // 获取图片
      if (resource.src) {
        let imageId = resource.imageId || resource.id
        if (resource.mode == 'Sprite') {
          resource.atlas.image = self.loadQueue.get(imageId).content
        } else {
          resource.propes.image = self.loadQueue.get(imageId).content
        }
      }
      // new Hilo.TextureAtlas
      if (resource.mode == 'Sprite' && resource.atlas) {
        if (!resource.atlas.sprites && resource.atlas.frames && resource.atlas.frames.numFrames) {
          let lastFrame = resource.atlas.frames.numFrames - 1
          resource.atlas.sprites = { sprite: { from: 0, to: lastFrame } }
          resource.frames = 'sprite'
        }
        self.stageContent[resource.id + '_atlas'] = new Hilo.TextureAtlas(resource.atlas)
      }
      // frames
      if (resource.frames) {
        if (resource.frames.indexOf('.') > 0) {
          let [ framesId, framesName ] = resource.frames.split('.')
          resource.propes.frames = self.stageContent[framesId].getSprite(framesName)
        } else {
          resource.propes.frames = self.stageContent[resource.id + '_atlas'].getSprite(resource.frames)
        }
      }
      // new Hilo.View
      let item = (self.stageContent[resource.id] = new Hilo[resource.mode](resource.propes))
      item.addTo && item.addTo(parent)
      // 类似css的transform-origin百分比，'50% 50%'，坐标值会自动重新计算
      if (resource.propes && resource.propes.origin) {
        let [ originX, originY ] = resource.propes.origin.split(' ')
        let percentX = parseFloat(originX) / 100
        let percentY = parseFloat(originY) / 100
        item.pivotX = percentX * item.width
        item.pivotY = percentY * item.height
        item.x += item.pivotX
        item.y += item.pivotY
      }
      // 绘制矢量图
      if (resource.mode == 'Graphics') {
        resource.draw.call(item)
      }
      // 自动播放动效
      if (resource.animations && !resource.play) {
        resource.animations.forEach((animation) => {
          let tween = new Hilo.Tween.to(item, animation[0], animation[1])
          window.tween = window.tween || tween
        })
      }
      // 点击事件 排除滑动后触发
      if (resource.touchend) {
        item.on('touchstart', (e) => {
          self.touchX = e.touches[0].pageX
          self.touchY = e.touches[0].pageY
        })
        item.on('touchend', (e) => {
          if (
            Math.abs(e.changedTouches[0].pageX - self.touchX) < 10 &&
						Math.abs(e.changedTouches[0].pageY - self.touchY) < 10
          ) {
            resource.touchend.call(self)
          }
        })
      }
    }
    window.stageContent = this.stageContent
  },
  addViews() {
    this.renderStage(this.imgList)
  },
  render(l, t, z) {
    let self = this
    // console.log(t)
    this.imgList.forEach((resource) => {
      let delay = resource.delay || 0,
        item = this.stageContent[resource.id]

      if (resource.play && resource.play.start && resource.mode == 'Sprite') {
        let times = resource.play,
          during = times.end - times.start,
          length = item.getNumFrames(),
          step = during / length / (resource.playCount ? resource.playCount : 1),
          time_start = times.start - 400,
          time_end = times.end + 400
        if (t > time_start + delay && t < times.start + delay) {
          item.goto(0, true)
        } else if (t < time_end + delay && t > times.end + delay) {
          item.goto(length - 1, true)
        } else if (t >= resource.play.start + delay && t <= resource.play.end + delay) {
          let frameIndex = parseInt((t - resource.play.start - delay) / step)
          frameIndex = frameIndex >= length ? frameIndex - length : frameIndex
          item.goto(frameIndex, true)
        }
      } else if (resource.play && resource.mode == 'Sprite') {
        // sprite 固定位置动画
        if (t > resource.play + delay && item.paused) {
          item.play()
        } else if (t < resource.play + delay - 400 && item.currentFrame != 0) {
          item.goto(0, true)
        }
      } else if (resource.play && resource.animations) {
        // animation 固定位置动画
        resource.tweens = resource.tweens || []
        if (t > resource.play + delay) {
          resource.animations.forEach((animation, index) => {
            if (!resource.tweens[index]) {
              animation[1].paused = true
              resource.tweens[index] = new Hilo.Tween.to(item, animation[0], animation[1])
              resource.tweens[index].start()
            }
          })
        } else if (t < resource.play + delay - 400) {
          resource.animations.forEach((animation, index) => {
            if (resource.tweens[index]) {
              for (let prop in resource.tweens[index]._fromProps) {
                item[prop] = resource.tweens[index]._fromProps[prop]
              }
              Hilo.Tween.remove(resource.tweens[index])
              resource.tweens[index] = null
            }
          })
        }
      }
      // transition 边划变动动画
      let transitions = resource.transitions
      if (!transitions) return
      transitions.forEach((transition) => {
        let values = transition.value,
          times = transition.time,
          time_start = times[0] - 400,
          time_end = times[times.length - 1] + 400
        if (t >= time_start + delay && t <= times[0] + delay) {
          item[transition.propes] = values[0]
        } else if (t < time_end + delay && t > times[times.length - 1] + delay) {
          item[transition.propes] = values[values.length - 1]
        } else {
          values.forEach((value, index) => {
            if (t < times[index + 1] + delay && t > times[index] + delay) {
              let ease = transition.ease || Hilo.Ease.Linear.EaseNone
              let k = (t - times[index] - delay) / (times[index + 1] - times[index])
              item[transition.propes] = values[index] + ease(k) * (values[index + 1] - values[index])
            }
          })
        }
      })
    })
    // 滑动到固定位置播放音乐 需用到的 
    // for (var l = 0; l < app.musics.length; l++) {
    //   var music = app.musics[l];
    //   if(music.start && t < music.start){
    //     music.played = "";
    //     // el.attr("data-played", "")
    //     $("#"+music.id)[0].pause(); 
    //   }else if(music.end && t >= music.end){
    //     $("#"+music.id)[0].pause();
    //     music.played = "";
    //     // el.attr("data-played", "")
    //   }else if(music.start && t >= music.start && !music.played){
    //     $("#"+music.id)[0].play(); 
    //     music.played = true;
    //   }
    // }
  },
  shareShow() {
    shareWithConfig();
  },
  againFun(){
    function updateUrl(url,key){
      var key= (key || 't') +'=';  //默认是"t"
      var reg=new RegExp(key+'\\d+');  //正则：t=1472286066028
      var timestamp=+new Date();
      if(url.indexOf(key)>-1){ //有时间戳，直接更新
        return url.replace(reg,key+timestamp);
      }else{  //没有时间戳，加上时间戳
        if(url.indexOf('\?')>-1){
          var urlArr=url.split('\?');
          if(urlArr[1]){
            return urlArr[0]+'?'+key+timestamp+'&'+urlArr[1];
          }else{
            return urlArr[0]+'?'+key+timestamp;
          }
        }else{
          if(url.indexOf('#')>-1){
            return url.split('#')[0]+'?'+key+timestamp+location.hash;
          }else{
            return url+'?'+key+timestamp;
          }
        }
      }
    }
    window.location.href=updateUrl(window.location.href); //不传参，默认是“t”
  },
  initScroller() {
    this.canvas.on('touchstart', this.drawStart).on('touchmove', this.drawMove).on('touchend', this.drawEnd)
    this.scroller = new Scroller(this.render.bind(this), {
      // bouncing: false,
      animationDuration: 1000,
      speedMultiplier:2.5  //乘以或减少滚动速度
    })
    this.scroller.setDimensions(this.winWidth, this.winHeight, this.winWidth, 228120 + this.winHeight)
    window.scroller = this.scroller
  },
  drawStart(event) {
    event.stopPropagation(), event.preventDefault()
    app.isTouched = true
    app.scroller.doTouchStart(event.touches, event.timeStamp)
  },
  drawMove(event) {
    if (!app.isTouched) return

    event.stopPropagation(), event.preventDefault()
    app.isTouched = true
    app.scroller.doTouchMove(event.touches, event.timeStamp, event.scale)
  },
  drawEnd(event) {
    app.scroller.doTouchEnd(event.timeStamp)
    app.isTouched = false
  },
  /*
    @param width 图片宽度
    @param height 图片高度
    @param column sprite 横向个数
    @param number 总数
   */
  getFrames(width, height, column, number) {
    let arr = [],
      x = 0,
      y = 0
    for (let i = 0; i < number; i++) {
      let frame = [ x * width, y * height, width, height ]
      arr.push(frame)
      if (x + 1 < column) {
        x = x + 1
      } else {
        x = 0
        y = y + 1
      }
    }
    return arr
  }
}
$.fn.ready(() => {
  // 播放背景音乐、滑动到固定位置播放音乐
  // app.autoplay('bgm');
  // app.initMusic();
})

setTimeout(() => {
  app.init();
  app.bind();
}, 700)