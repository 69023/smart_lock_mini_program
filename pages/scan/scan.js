// pages/scan/scan.js
import {
  tools
} from "../../utils/util.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    show_reason: true,
    picker: [], // 临时数据
    lock_info: null,
    select_uuid: null,
    num: 0,
    numList: [{
      name: '初始化'
    }, {
      name: '选择门室'
    }, {
      name: '近场验证'
    }, {
      name: '开锁完成'
    }],
    frequency: 0,
    platform: '',
    reason_index: '1',
    other_reason: '其他',
    is_other_reason: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    // let timer = setInterval(() => {
    //   let num = that.data.num
    //   that.numSteps(num + 1)
    //   if (num == 3) {
    //     clearInterval(timer)
    //   }
    // }, 800)
    that.get_lock_info()
  },

  /**
   * 测试方法
   */
  numSteps(num) {
    this.setData({
      num: num
    })
  },

  /**
   * 获取物理地址等信息
   */
  get_lock_info: function() {
    const that = this
    tools.post({
      url: tools.getUrl('/w_lock_uuid_list/'),
      success: res => {
        if (res.data.message.indexOf('token') == 0) {
          wx.reLaunch({
            url: '/pages/login/login',
          })
          return
        }
        tools.console_log(res)
        const data = res.data.data
        let picker = []
        for (let i = 0; i < data.length; i++) {
          picker[i] = data[i].remark
        }
        if (picker.length == 0) {
          wx.showModal({
            content: '无门锁信息，请联系管理员',
          })
          return;
        }
        tools.console_log('picker', picker)
        that.setData({
          picker: picker,
          lock_info: data,
          select_uuid: data[0].uuid
        })

        /**
         * 开始近场通讯操作
         */
      }
    })
  },

  /**
   * 门锁选择变化
   */
  picker_change(e) {
    const that = this
    const index = e.detail.value
    tools.console_log('uuid_index', index)
    that.setData({
      index: index,
      num: 1,
      select_uuid: that.data.lock_info[index].uuid
    })

    //初始化 Wi-Fi 模块
    that.init_bluetooth()
  },

  /**
   * 开锁缘由
   */
  radio_change: function(e) {
    const that = this
    const index = e.detail.value
    tools.console_log('radio', index)
    if (index == '3') {
      that.setData({
        reason_index: '3', // 其他
        is_other_reason: false
      })
    }
    if (index == '2') {
      that.setData({
        reason_index: '2', // 上课
        is_other_reason: true
      })
    }
    if (index == '1') {
      that.setData({
        reason_index: '1', // 实验
        is_other_reason: true
      })
    }
  },

  /**
   * 开门其他缘由内容监听
   */
  reason_input_event: function(e) {
    tools.console_log('reason_input', e)
    const reason = e.detail.value
    this.setData({
      other_reason: reason
    })
  },

  /**
   * 按钮触发开锁
   */
  open_lock_event: function(e) {
    const that = this
    const formid = e.detail.formId
    const index = that.data.index
    const lock_info = that.data.lock_info
    const reason_index = that.data.reason_index
    let reason = ''
    tools.console_log('开门之前：', reason_index)
    if (reason_index == '1') {
      reason = '实验'
      tools.console_log(reason)
    }
    if (reason_index == '2') {
      reason = '上课'
      tools.console_log(reason)
    }
    if (reason_index == '3') {
      tools.console_log(reason)
      if (that.data.other_reason == '其他' || that.data.other_reason == '') {
        wx.showModal({
          content: '开锁缘由为必填内容',
        })
        return
      } else {
        reason = that.data.other_reason
      }
    }
    tools.console_log('-----------------')

    tools.console_log('lock_id:' + lock_info[index].id, "reason:" + reason)
    tools.console_log('-----------------')
    tools.post({
      url: tools.getUrl('/w_open_lock/'),
      data: {
        lock_id: lock_info[index].id,
        reason: reason
      },
      success: res => {
        if (res.data.message.indexOf('token') == 0) {
          wx.reLaunch({
            url: '/pages/login/login',
          })
          return
        }
        const message = res.data.message
        // ------------
        tools.console_log('formid->', formid)
        tools.post({
          url: tools.getUrl('/w_send_template_msg/'),
          data: {
            form_id: formid,
            reason: reason,
            remark: lock_info[index].remark,
            status: res.data.message
          },
          success: res => {
            tools.console_log('template', res)
            wx.showModal({
              content: message,
            })
            tools.console_log('开锁操作：', res)
            that.setData({
              num: 3
            })
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/lock/lock',
              })
            }, 2200)
          }
        })
        // ------------
      }
    })
  },

  /**
   * 初始化蓝牙
   */
  init_bluetooth: function() {
    var that = this;
    if (!wx.openBluetoothAdapter) {
      this.showError("当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。");
      return;
    }
    wx.openBluetoothAdapter({
      success: function(res) {},
      complete(res) {
        wx.onBluetoothAdapterStateChange(function(res) {
          if (!res.available) {
            setTimeout(function() {
              that.init_bluetooth();
            }, 2000);
          }
        })
        tools.console_log('666')
        that.get_bluetooth_list()
      }
    })
  },

  /**
   * 获取蓝牙列表
   */

  get_bluetooth_list: function() {
    const that = this
    const lock_info = that.data.lock_info
    const index = that.data.index
    tools.console_log('lock_infi', that.data.lock_info)
    wx.startBluetoothDevicesDiscovery({
      services: [lock_info[index].uuid],
      success: function(res) {
        tools.console_log('startBluetoothDevicesDiscovery', res)
        setTimeout(() => {
          wx.getBluetoothDevices({
            success: function(res) {
              tools.console_log('getBluetoothDevices', res)
              if (res.devices.length > 0) {
                tools.console_log('deviceId', res.devices[0].deviceId)
                that.stopSearch()
                that.createBLEConnection(res.devices[0].deviceId)
              } else {
                wx.showModal({
                  content: '请不要离门室太远',
                })
              }
            }
          })
        }, 2100)
      },
      fail: function(res) {
        tools.console_log("fail")
        wx.showModal({
          content: '请打开手机蓝牙设置',
        })
      }
    })
  },

  /**
   * 与蓝牙设备进行连接
   */
  createBLEConnection: function(deviceId) {
    const that = this
    wx.createBLEConnection({
      deviceId: deviceId,
      success: res => {
        tools.console_log('createBLEConnection', res)
        that.getBLEDeviceServices(deviceId)
      },
      fail: err => {
        tools.console_log('err', err)
      },
      complete: res => {
        tools.console_log('->', res)
      }
    })
  },

  /**
   * 获取特定设备的所有服务
   */
  getBLEDeviceServices: function(deviceId) {
    const that = this
    tools.console_log('getBLEDeviceServices->deviceId', deviceId);
    wx.getBLEDeviceServices({
      deviceId: deviceId,
      success: function(res) {
        tools.console_log('getBLEDeviceServices', res);
        that.getBLEDeviceCharacteristics(deviceId, res.services[1].uuid)
      },
      fail: err => {
        tools.console_log('fail', err);
      }
    })
  },

  /**
   * 获取指定服务的特征值
   */
  getBLEDeviceCharacteristics: function(deviceId, serviceId) {
    const that = this
    wx.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId,
      success: function(res) {
        tools.console_log('getBLEDeviceCharacteristics->success', res)
        that.writeBluetoothData(deviceId, serviceId, res.characteristics[0].uuid)
      },
      fail: err => {
        tools.console_log('getBLEDeviceCharacteristics->fail', err)
      },
      complete: res => {
        // tools.console_log('getBLEDeviceCharacteristics', res)
      }
    })
  },

  /**
   * 给蓝牙发送数据
   */
  writeBluetoothData: function(deviceId, serviceId, uuid) {
    const that = this
    // 向蓝牙设备发送一个0x00的16进制数据
    const buffer = new ArrayBuffer(1)
    const dataView = new DataView(buffer)
    dataView.setUint8(0, 10) // 

    wx.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: uuid,
      value: buffer,
      success: function(res) {
        tools.console_log('writeBLECharacteristicValue success', res)
        if (res.errCode == 0) {
          //近场验证成功，准备开始开锁逻辑
          that.setData({
            num: 2,
            show_reason: false
          })
          that.closeBuletoothAdapter() // 释放资源，关闭蓝牙
        } else {
          tools.console_log('writeBLECharacteristicValue->success->errCode!=0', res)
        }
      },
      fail: err => {
        wx.showModal({
          content: '近场验证失败',
        })
        tools.console_log('writeBLECharacteristicValue->fail', err)
      }
    })
  },

  /**
   * stop停止搜索
   */
  stopSearch: function() {
    var that = this;
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {}
    })
  },

  /**
   * 关闭蓝牙
   */
  closeBuletoothAdapter: function() {
    wx.closeBluetoothAdapter({
      success: res => {
        tools.console_log('closeBluetoothAdapter->success', res)
      },
      fail: err => {
        tools.console_log('closeBluetoothAdapter->fail', err)
      }
    })
  }
})