Component({ 
  /**
   * 组件的属性列表
   */
  properties: {},
   
  /**
   * 组件的初始数据
   */
  data: {
    upload: {
      type: Boolean,
      value: true
    }
  },
   
  /**
   * 组件的方法列表
   */
  methods: {
    //点击即触发获取formId
    catchSubmit: function(e) {
      if (this.data.upload) {
        try {
          Request.post("/api/uploadFormId", {
            formId: e.detail.formId,
            touser: getApp().globalData.userInfo.openid,
            time: new Date()
          });
        } catch (err) {
          //todo
        }
      }
      //触发回调
      this.callback(e);
    },
      
    /**
     * 捕获点击回调
     */
    callback: function(e) {
      try {
        this.triggerEvent("callback", e);
      } catch (err) {
        //todo
      }
    }
  }
})