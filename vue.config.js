const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  productionSourceMap: false,
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(js|css)$"),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  }
};
