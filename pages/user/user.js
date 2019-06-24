import {
  tools
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_user_info()
  },

  /**
   * 拉取用户信息
   */
  get_user_info: function () {
    const that = this;
    tools.post({
      url: tools.getUrl('/w_user_info/'),
      success: res => {
        tools.console_log('w_user_info->', res)
        if (res.data.code == 200) {
          that.setData({
            user_info: res.data.data
          })
        } else {
          tools.console_log('token过期，请授权')
          if (res.data.message.indexOf('token') == 0) {
            wx.reLaunch({
              url: '/pages/login/login',
            })
            return
          }
        }
      }
    })
  },

  /**
   * 修改基本信息
   */
  modify_info_event: function () {
    wx.navigateTo({
      url: '/pages/modify/modify',
    })
  },

  /**
   * 开锁记录
   */
  logs_event: function () {
    wx.navigateTo({
      url: '/pages/logs/logs',
    })
  },

  /**
   * 更多内容
   */
  open_more_event: function () {
    wx.navigateTo({
      url: '/pages/more/more',
    })
  }
})