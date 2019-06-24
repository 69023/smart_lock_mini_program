// const rootUrl = 'http://127.0.0.1:5000/api'
const rootUrl = 'https://lock.huangtongx.cn/api'
const logFlag = true

const tools = {

  /**
   * 路由地址拼接
   */
  getUrl: function(route) {
    return rootUrl + route
  },

  /**
   * 自定义log出入函数
   */
  console_log: function(arg1, arg2) {
    if (logFlag) {
      console.log(arg1, arg2)
    }
  },

  /**
   * 自定义请求
   */
  request_: function(params) {
    const token = wx.getStorageSync('token')
    params.header = {
      'token': token
    }
    if (params.method == 'POST') {
      params.header['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    params.fail = (res => {
      /**
       * 统一捕获
       */
      wx.reLaunch({
        url: '/pages/login/login',
      })
    })
    wx.request(params)
  },

  /**
   * get请求
   */
  get: function(params) {
    params.method = 'GET'
    this.request_(params)
  },

  /**
   * post请求
   */
  post: function(params) {
    params.method = 'POST'
    this.request_(params)
  }
}

export {
  tools
}