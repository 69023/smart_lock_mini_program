import {
  tools
} from "../../utils/util.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_per: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.get_user_per()
  },

  /**
   * 获取用户权限
   */
  get_user_per: function() {
    const that = this
    tools.post({
      url: tools.getUrl('/w_user_per/'),
      success: res => {
        if (res.data.code == 200) {
          that.setData({
            user_per: res.data.data.per
          })
        } else {
          if (res.data.message.indexOf('token') == 0) {
            wx.reLaunch({
              url: '/pages/login/login',
            })
            return
          }
          tools.console_log('err', res)
        }
      }
    })
  },

  /**
   * 远程开锁界面
   */
  remote_control_event: function() {
    wx.navigateTo({
      url: '/pages/control/control',
    })
  },

  /**
   * 修改管理登录密码
   */
  modify_password_event: function() {
    wx.navigateTo({
      url: '/pages/mpasswd/mpasswd',
    })
  }
})