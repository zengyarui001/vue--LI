module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        port: 8080, // 端口号
        host: '0.0.0.0',
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        proxy: {
            '/api':{
                target:'http://jsonplaceholder.typicode.com',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            },
            '/ms':{
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            }
        }
    }
}