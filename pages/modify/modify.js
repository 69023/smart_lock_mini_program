// pages/modify/modify.js
import {
  tools
} from "../../utils/util.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_exist: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.basic_user_info()
  },

  /**
   * 用户基本信息获取
   */
  basic_user_info: function () {
    const that = this
    tools.post({
      url: tools.getUrl('/w_basic_user_info/'),
      success: res => {
        if (res.data.code == 200) {
          tools.console_log(res)
          const name = res.data.data.name
          if (name == null) {
            that.setData({
              is_exist: false
            })
          }
          that.setData({
            userName: res.data.data.name,
            userClass: res.data.data.class,
            userID: res.data.data.studentID
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
   * 修改信息
   */
  modify_user_info_event: function () {
    const that = this
    tools.post({
      url: tools.getUrl('/w_modify_user_info/'),
      data: {
        user_name: that.data.userName,
        user_class: that.data.userClass,
        user_id: that.data.userID
      },
      success: res => {
        tools.console_log('modify_user_info_event->', res)
        if (res.data.code == 200) {
          wx.reLaunch({
            url: '/pages/lock/lock',
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
   * 获取输入的名字
   */
  userName: function (event) {
    var that = this;
    that.setData({
      userName: event.detail.value
    })
  },

  /**
   * 获取输入的班级
   */
  userClass: function (event) {
    var that = this;
    that.setData({
      userClass: event.detail.value
    })
  },

  /**
   * 获取输入的学号
   */
  userID: function (event) {
    var that = this;
    that.setData({
      userID: event.detail.value
    })
  }
})