module.exports  = {
    publicPath: process.env.NODE_ENV  ===  'production'  ?  './'  :  '/',
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "实骨小日报";
                return args;
            })
      }
}