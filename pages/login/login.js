import {
  tools
} from "../../utils/util.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 用户授权登录
   */
  user_auth_event: function (e) {
    const user_info = e.detail.userInfo
    if (user_info) {
      tools.console_log('点击授权', e.detail)
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          tools.get({
            url: tools.getUrl('/w_token/'),
            data: {
              code: res.code
            },
            success: res => {
              const token = res.data.data.token
              tools.console_log('save->token->', token)
              wx.setStorageSync('token', token)

              tools.post({
                url: tools.getUrl('/w_login/'),
                data: {
                  user_info: JSON.stringify(user_info)
                },
                success: res => {
                  if (res.data.code == 200) {
                    tools.console_log('w_login->', res)
                    wx.redirectTo({
                      url: '/pages/lock/lock',
                    })
                  } else {
                    if (res.data.message.indexOf('token') == 0) {
                      wx.reLaunch({
                        url: '/pages/login/login',
                      })
                      return
                    }
                    tools.console_log(res)
                    tools.console_log('授权->注册失败')
                    wx.removeStorageSync('token')
                  }
                }
              })
            }
          })
        }
      })
    } else {
      tools.console_log('用户拒绝授权')
    }
  }
})