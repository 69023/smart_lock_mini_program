//lock.js
//获取应用实例
const app = getApp();
import {
  tools
} from "../../utils/util.js"

Page({
  data: {
    imageHeight: 281,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onShow: function() {},

  onLoad: function(options) {
    var that = this;
    this.init_ui_config()
  },

  /**
   * 初始化界面
   */
  init_ui_config: function() {
    const that = this
    wx.getSystemInfo({
      success: function(e) {
        that.setData({
          imageHeight: .88 * e.screenWidth,
          imageHeight1: .195 * e.screenWidth,
          differHeight: .685 * e.screenWidth
        });
      }
    });
  },

  /**
   * 用户中心
   */
  user_center_event: function() {
    wx.navigateTo({
      url: '/pages/user/user',
    })
  },

  /**
   * 选择门锁
   */
  scan_b_event: function() {
    wx.navigateTo({
      url: '/pages/scan/scan',
    })
  }
})