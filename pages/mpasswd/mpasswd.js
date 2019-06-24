import {
  tools
} from "../../utils/util.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPasswd: '',
    newPasswd1: '',
    newPasswd2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  userOldPassword: function (e) {
    this.setData({
      oldPasswd: e.detail.value
    })
  },

  userNewPassword1: function (e) {
    this.setData({
      newPasswd1: e.detail.value
    })
  },

  userNewPassword2: function (e) {
    this.setData({
      newPasswd2: e.detail.value
    })
  },

  modifyPassword: function () {
    var self = this;

    var oldP = self.data.oldPasswd;
    var newsP1 = self.data.newPasswd1;
    var newsP2 = self.data.newPasswd2;

    if (newsP1.length >= 6 & newsP1.length <= 16) {
      if (newsP1 == newsP2) {
        tools.post({
          url: tools.getUrl('/w_modify_password/'),
          data: {
            old_password: oldP,
            new_password: newsP1
          },
          success: res => {
            if (res.data.code == 200) {
              wx.showModal({
                title: '提示',
                content: res.data.message,
                success: function (res) {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '/pages/lock/lock',
                    })
                  }
                }
              });
            } else {
              if (res.data.message.indexOf('token') == 0) {
                wx.reLaunch({
                  url: '/pages/login/login',
                })
                return
              }
              wx.showModal({
                title: '提示',
                content: res.data.message,
              });
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '两次密码不一致.',
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '密码格式不正确 , 6-16位 .',
      })
    }
  }
})