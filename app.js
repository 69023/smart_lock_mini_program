//app.js

import {
  tools
} from "/utils/util.js"

App({
  onLaunch: function() {
    tools.post({
      url: tools.getUrl('/w_check_token/'),
      success: res => {
        const status_code = res.data.code
        if (status_code != 200) {
          tools.console_log('用户未授权，或者token过期')
          wx.removeStorageSync('token')
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null
  }
})