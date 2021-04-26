module.exports = {
  chainWebpack: (config) => {
    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        /* 包名 ： 全局变量*/
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      config.plugin('html').tap((args) => {
        /* 追加属性 isProd */
        args[0].isProd = true
        return args
      })
    })
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap((args) => {
        args[0].isProd = false
        return args
      })
    })
  }
}
