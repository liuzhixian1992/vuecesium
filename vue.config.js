const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium'
module.exports = {
  // 基本路径  3.6之前的版本时 baseUrl
  publicPath: "./",
  // 输出文件目录
  outputDir: "dist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0",
    port: 5000,
    https: false,
    hotOnly: false,  
    //代理配置 
    proxy: {
        '/api': { // 请求的代称，写在Axios里的BaseUrl
            target: 'http://localhost:8070/', // 真实请求URl
            ws: true,
            changeOrigin: true, // 允许跨域
            pathRewrite: { //替换，通配/api的替换成对应字符
            //     /* 重写路径，当我们在浏览器中看到请求的地址为：http://localhost:8080/api/core/getData/userInfo 时
            //       实际上访问的地址是：http://localhost:8088/spring/core/getData/userInfo,因为重写了 /api
            //      */
                '^/api': '' //当你的接口中没有/api字眼时，采用这种，直接替换成空即可
            //     '^/api': '/api'   //当你的接口中刚好有/api 时，采用这种方式
            }
        }
    }
    

  },
  configureWebpack: {
    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve('src'),
        'cesium': path.resolve(__dirname, cesiumSource)
      }
    },
    plugins: [
      new CopyWebpackPlugin([{ from: "node_modules/cesium/Build/Cesium/Workers", to: 'Workers' }]),
      new CopyWebpackPlugin([{ from: "node_modules/cesium/Build/Cesium/Assets", to: 'Assets' }]),
      new CopyWebpackPlugin([{ from: "node_modules/cesium/Build/Cesium/Widgets", to: 'Widgets' }]),
      new CopyWebpackPlugin([{ from: "node_modules/cesium/Build/Cesium/ThirdParty", to: 'ThirdParty' }]),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./')
      })
    ],
    module: {
      unknownContextCritical: /^.\/.*$/,
      unknownContextCritical: false
    }
  }
};
