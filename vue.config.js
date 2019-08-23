module.exports = {
  devServer: {
    port: 8000
  },

  publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
}
