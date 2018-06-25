// pages/teacher_index/teacher_index.js
const app = getApp();

Page({
  data: {
    userInfo: {},
    course_list: [],
    course_id:'',
    username:'',
    attended_course_ids: '',
    avatar_url:''
  },

  onLoad: function (options) {
    var that = this;

    wx.request({
      url: 'http://jihanyang.cn:8080/get_user',
      method: 'GET',
      data: {
        student_id: wx.getStorageSync('user_id')
      },
      success: function(res) {
        that.setData({
          avatar_url: res.data.profile_photo
        })
      }
    })
    
    that.setData({
      username: wx.getStorageSync('username'),
      attended_course_ids: wx.getStorageSync('attended_id')
    })

    var all_course = that.data.attended_course_ids.split("@");

    for (var i = 0; i < all_course.length; i++) {
      wx.request({
        url: 'http://jihanyang.cn:8080/get_course',
        data: {
          course_id: all_course[i]
        },
        method: 'GET',
        success: function (res) {
          if (res.data == "Cannot find this course") { }
          else {
            var temp = {
              id: res.data.course_id,
              name: res.data.name,
              course_time: res.data.course_time,
              start_time: res.data.start_time,
              end_time: res.data.end_time
            }
            if (res.data.teacher_id == wx.getStorageSync('user_id')) that.data.course_list.push(temp)
            that.setData({
              course_list: that.data.course_list
            })
          }
        },
      })
    }


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  createCourse: function() {
    wx.navigateTo({
      url: '../create_course/create_course',
    })
  },

  check_course: function (e) {
    var temp = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../teacher_course/teacher_course?course_id=' + temp,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    wx.redirectTo({
      url: '../teacher_index/teacher_index',
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})