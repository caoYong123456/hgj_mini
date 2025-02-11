const app = getApp();
const api = require("../../../const/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeStr: '',
    refreash:false,
    showCode:'none',
    visitQrCode:'',
    expDate:'',
    visitName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowW = app.globalData.windowW;
    this.setData({
      windowW:windowW,
      visitQrCode:options.visitQrCode,
      visitName:options.visitName,
      expDate:options.expDate
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
    let pages = getCurrentPages(); 
    let prePage = pages[pages.length - 2]; 
    if(this.data.refreash){
        prePage.onLoad();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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

  },
  
})