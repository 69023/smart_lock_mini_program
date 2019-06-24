import {
  tools
} from "../../utils/util.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_logs()
  },

  /**
   * 获取开锁记录
   */
  get_logs: function () {
    const that = this
    tools.post({
      url: tools.getUrl('/w_open_lock_logs/'),
      success: res => {
        if (res.data.code == 200) {
          tools.console_log(res)
          that.setData({
            logs: res.data.data.result
          })
        } else {
          if (res.data.message.indexOf('token') == 0) {
            wx.reLaunch({
              url: '/pages/login/login',
            })
            return
          }
        }
      }
    })
  }
})