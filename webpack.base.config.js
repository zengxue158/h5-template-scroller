const path = require('path')
const resolve = path.resolve

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const dev = process.env.NODE_ENV !== 'production'

module.exports = {
  context: resolve(__dirname, './'),
  entry: [
    path.join(__dirname, './src/js/index.js')
  ],
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
        dev ? 'style-loader' : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../../'
          }
        },
        'css-loader',
        'postcss-loader',
        'less-loader',
        ]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules|\.min\.js|bower_components/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: false,
            attrs: [':src']
          }
        }]
      },
      {
        test: /\.(png|jpe?g)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'static/images/[name].[hash:7].[ext]',
              limit: 1024,
              fallback: 'file-loader'
            }
          },
          {
            loader: 'tinify-loader',
            options: {
              apikey: 'iA4WgA6dpM0nbSKsByJDA0MuLyodD2_j',
              cache: path.resolve(__dirname, 'node_modules/tinify-loader')
            }
          }
        ]
      },
      {
        test: /\.(gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'static/images/[name].[hash:7].[ext]',
            limit: 1024,
            fallback: 'file-loader'
          }
        }]
      },
      {
        test: /\.(mp3|mp4)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name:'static/[name].[ext]',
          limit:10
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: './static/fonts/[name].[ext]'
        }
      }
    ]
  },
  externals: [
    /zepto|\$/
  ],
  resolve: {
    extensions: ['.js', '.json'],
    // 配置项目文件别名
    alias: {
      '@': resolve('src'),
      'utils': resolve('src/js/utils'),
      'js-bridge': '@mf2e/js-bridge',
      'newsapp-share': '@newsapp-activity/newsapp-share'
    }
  }
}