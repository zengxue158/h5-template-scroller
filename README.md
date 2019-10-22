# H5模板

![version](https://img.shields.io/github/package-json/v/zengxue158/h5-template-scroller.svg)
![commit](https://img.shields.io/github/last-commit/zengxue158/h5-template-scroller.svg)
![new feature](https://img.shields.io/badge/author-zeng_xue-orange)

<!-- ![code-size](https://img.shields.io/github/languages/code-size/NyPhile/h5_template.svg) -->
<!-- ![lang](https://img.shields.io/github/languages/top/NyPhile/h5_template.svg) -->

### 安装

```bash
$ npx ne-build init -t zengxue158/h5-template-scroller
# node版本大于5.2
# 参数可在命令行输入，也可以输入命令后按交互提示输入

# 参数⬇️
-n or --name
# 项目名称，必须
# 用于替换模板项目中package.json的{name}

-c or --channel
# 频道名称，必须
# 用于替换模板项目内上传路径中的频道路径

-d or --desc
# 项目描述，可选
# 用于替换模板项目中package.json的{description}

--username
# 上传工具账号，必须，即邮箱前缀

--password
# 上传工具密码，必须，即邮箱密码
```

### 命令

```bash
# 安装依赖
$ npm i

# 开启本地服务
$ npm run dev

# 打包（上传前需先打包）
$ npm run build

# 线上环境测试
# 发布到 https://wp.m.163.com/163/test/{channel}/{name}/index.html
$ gulp test

# 发布
$ gulp publish
# 发布到 https://wp.m.163.com/163/page/{channel}/{name}/index.html

# 清空本地缓存文件，使所有文件重新上传
# （默认每次上传只上传增量文件）
$ gulp clear
```

### 目录结构

```
h5_template
 ├ src/
 │  ├ assets/               # 图片等资源文件夹
 │  ├ css/
 │  │  ├ common.less        # 公用reset css
 │  │  └ index.less         # 样式文件
 │  ├ js/
 │  │  ├ utils/             # 工具js文件夹
 │  │  │  ├ helper.js       # eruda、统计js
 │  │  │  ├ share.js        # 分享
 │  │  │  ├ track.js        # 统计方法
 │  │  │  ├ utils.js        # 工具函数
 │  │  │  └ viewport.js     # 屏幕适配
 │  │  ├ Animate.js         # 动画库
 │  │  ├ common.js          # 通用js
 │  │  ├ hilo-standalone.js # 游戏引擎
 │  │  ├ imglist.js         # 交互动画参数
 │  │  ├ Scroller.js        # 滚动插件
 │  │  └ index.js           # js文件
 ├ static/                  # 静态资源文件夹，会直接上传至 https://static.ws.126.net/163/f2e/{channel}/{name}/static/ 下
 ├ .eslintrc.js             # eslint配置文件
 ├ .ftppass                 # 上传账号密码文件
 ├ .gitignore
 ├ babel.config.js          # babel配置文件
 ├ gulpfile.js              # gulp配置文件
 ├ package.json
 ├ postcss.config.js        # postcss配置文件
 ├ README.md
 ├ webpack.base.config.js   # webpack通用设置
 ├ webpack.dev.config.js    # webpack开发设置
 └ webpack.prod.config.js   # webpack发布设置
```

### 简介

* 项目使用webpack打包，webpack-dev-server开启本地服务
* html默认使用.html，可按照[html-webpack-plugin文档](https://github.com/jantimon/html-webpack-plugin)根据需求自行配置模板文件。
* css默认使用[less](http://lesscss.org/)以及[postcss](https://postcss.org/)
* js使用[babel7.5](https://babeljs.io/)进行编译，按照package.json中的browserslist自动增加polyfill
* eslint使用默认标准，[规则](https://eslint.org/docs/rules/)
* 统计ID位于`package.json`的`projectId`字段
* 已内置`@mf2e/js-bridge`，用于H5调用客户端方法，[项目](http://npm.hz.netease.com/package/@mf2e/js-bridge)，[文档](https://wp.m.163.com/163/html/newsclient/api/index.html#/)
* 已内置`@newsapp-activity/newsapp-share`，`src/js/utils/share.js`对其进行封装
* 已内置`Zepto`，版本`v1.2.0`，包含模块`zepto`、`event`、`ajax`、`form`、`ie`、`detect`、`fx`、`fx_methods`、`assets`、`data`、`deferred`、`callbacks`、`selector`、`touch`、`gesture`、`stack`、`ios3`，[文档](https://zeptojs.com/)。（由于Zepto非模块化js，不能直接打包引入，因此在index.html中引入js，webpack.externals进行排除）
* npm run dev开启本地服务后，可以使用localhost:8080或{ip}:8080或dev.f2e.163.com:8080（需配置hosts）调试，可使用`eruda`（[文档](https://eruda.liriliri.io/)）进行移动端调试
* 打包时静态资源默认添加hash，上传后进行缓存，无修改不再重复上传

### 说明

1. 所有图片动画在 `src/js/imglist.js` 内
2. 动画格式⬇️。精灵动画与transitions动画可叠加，animations与transitions动画可叠加；精灵动画与animations由于play参数公用，不能叠加，只执行精灵动画

```js
    // 基本属性
    {
      id: 'btn_more',   // 元素id，必须，不能重复，用于存储Hilo.View对象以及loadQueue中的id
      mode: 'Bitmap',   // Hilo.View 类型，必须
      parent: 'p5',     // 父级元素
      src: btn_more,    // 图片链接，import进来
      delay: delay.p5,  // 整体模块delay的时间
      mask: 'cover_mask'// mask遮罩
      propes: {x: 70, y: 4370, origin: '50% 50%'}, // Hilo.View的属性。其中增加origin，类似transform-origin，使用百分比控制中心点，pivotX、x自动计算，例如：loading_gear_big
      draw () {},       // mode=Graphics时必须，用于画Graphics
      touchend () {},    // 点击事件，this指向app，用touchstart与touchend间的位移距离排除误触
      transitions: [{propes: 'y', time: [0, 0 + 200], value: [0 + 150, 0]}], // 位移动画，ease默认线性
    }
    // mask遮罩，先建一个Graphics，其他元素的mask属性指向这个mask的id，即可只展示该mask区域内的部分，例如：cover_mask、cover_bg
    // 几种动画写法
    // 1.平移动画，一开始就播放，例如：loading_gear_big
    {
      animations: [
        [{rotation: 30}, {time: 5000, delay: 500, ease: Hilo.Ease.Quad.EaseOut}]
      ]
    }
    // 2.平移动画，滚动到某处播放，无例子
    {
      play: 1000, // scroller.scrollTop值
      animations: [
        [{rotation: 30}, {time: 5000, delay: 500, ease: Hilo.Ease.Quad.EaseOut}]
      ]
    }
    // 3.平移动画，与滚动位置绑定，例如：p1_qout
    {
      transitions: [
        {propes: 'y', time: [0, 5000], value: [winHeight, winHeight - 5000], ease: Hilo.Ease.Linear.easeNoneFn}
      ]
    }
    // 4.Sprite精灵动画，一开始就播放，例如：cover_btn
    {
      mode: 'Sprite',
      atlas: {
        width: 1804,        // sprite图片宽度
        height: 4104,       // sprite图片高度
        frames: {
          frameWidth: 451,  // 帧宽度
          frameHeight: 684, // 帧高度
          numFrames: 24     // 帧总数
        },
        sprites: {          // 若播放帧数是全部帧(如一共10帧，from 0 to 9)，可去掉此对象，例如：p1_smoke
          sprite: {         // Hilo.TextureAtlas 序列id
            from: 0,        // 起始帧序号
            to: 23          // 终止帧序号
          }
        }
      },
      frames: 'sprite'      // Hilo.Sprite 取对应的 Hilo.TextureAtlas 的序列id；若播放帧数是全部帧，可去掉此对象
    }
    // 5.Sprite精灵动画，到某处播放，例如：p1_text1_in
    // 在4.基础上增加
    {
      play: 1000  // 播放时间
    }
    // 6.Sprite精灵动画，与距离绑定，例如：p1_bg_out
    // 在4.基础上增加
    {
      play: {start: 4200, end: 4200 + 200} // 播放起止位置，自动计算起始~终止间播放帧
    }

  ```
