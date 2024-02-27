//subpages/qn/queryOngoingQnInfoDtos/queryOngoingQnInfoDtos.js
var app = getApp();
const apiConstant = require('../../../const/api.js');

Page({
  data:{
		custId:"",
    huSeqId:"",
    
		pageNum:1,
    pageSize:8,
    loading: false,//是否正在加载
    more: false, //是否还有数据
    ongoingQnInfoDtos:[],
    // count:'',
    houseSeqId:"",
	},
	
  //生命周期函数--监听页面加载
  onLoad: function (options) {
	  app.loading();
    this.showLoading(true);
    var loginInfo = app.storage.getLoginInfo();
    this.custId = loginInfo.custId;
    this.huSeqId = loginInfo.huSeqId;
    this.houseSeqId = loginInfo.houseSeqId;
    console.log('loginInfo.custId='+this.custId+'，loginInfo.huSeqId='+this.huSeqId+'，loginInfo.houseSeqId='+this.houseSeqId);
    
    this.setData({
      custId:this.custId,
      huSeqId:this.huSeqId,
      ongoingQnInfoDtos:[],
      pageNum:1,
      houseSeqId:this.houseSeqId,
		});
		
		this.queryOngoingQnInfos();
  },
	
	queryOngoingQnInfos:function(e){
    console.log('开始查询进行中的问卷记录，URL='+apiConstant.queryOngoingQnInfos);
    if (this.data.custId == "" || this.data.huSeqId == "") {
        wx.showToast({
          title: "网络异常，获取关键信息失败",
          icon: "none"
        })
        return;
		}
    let filterCondition = {'custId':this.data.custId, 'huSeqId':this.data.huSeqId, 
                            'pageNum':this.data.pageNum, 'pageSize':this.data.pageSize};
    console.log(filterCondition);
    let that = this;
    app.req.postRequest(apiConstant.queryOngoingQnInfos,filterCondition).then(resp => {
      console.log(resp);
      that.showLoading(false);
      let resp_data = resp.data;
      if(resp_data.respCode != "000"){
        wx.showToast({
          icon:'none',
          title: resp_data.errDesc
        });
      } else {
        that.setData({
          ongoingQnInfoDtos: that.data.ongoingQnInfoDtos.concat(resp_data.ongoingQnInfoDtos),
          // count: resp_data.count,
          more: (that.data.ongoingQnInfoDtos.length + resp_data.ongoingQnInfoDtos.length  < resp_data.count) ? true :false,
          loading:false,
        });
      }
    });
    // wx.request({
    //   url : apiConstant.queryOngoingQnInfos,
    //   data : filterCondition,
    //   method : "POST",
    //   // header : {'content-type' : 'application/x-www-form-urlencoded'},
    //   header : {'content-type' : 'application/json'},
    //   dataType : "json",
    //   success : function(resp){
    //     console.log(resp);
    //     let resp_data = resp.data;
    //     if(resp_data.respCode != "000"){
    //       wx.showToast({
    //         icon:'none',
    //         title: resp_data.errDesc
    //       });
    //     } else {
    //       that.setData({
    //     	  ongoingQnInfoDtos: that.data.ongoingQnInfoDtos.concat(resp_data.ongoingQnInfoDtos),
    //         // count: resp_data.count,
    //         more: (that.data.ongoingQnInfoDtos.length + resp_data.ongoingQnInfoDtos.length  < resp_data.count) ? true :false,
    //         loading:false,
    //       });
    //     }
    //   },
    //   fail:function(resp){
    //     console.log(resp);
    //     var cur_title;
    //     if (resp.errMsg != null || resp.errMsg != "") {
    //     	cur_title = resp.errMsg;
    //     } else {
    //       cur_title = resp.data.errDesc;
    //     }
    //     //错误提示信息
    //     wx.showToast({
    //       title: cur_title,
    //       icon: "none"
    //     })
    //   },
    //   complete:function(){
		//     that.showLoading(false);
    //   }
    // });
	},

  onTapQueryOngoingQnInfo:function(e){
	  console.log(e);
    var qnDate = e.currentTarget.dataset.qndate;
    var qnSeqId = e.currentTarget.dataset.qnseqid;
    console.log("onTapQueryOngoingQnInfo-qnDate:" + qnDate + "，qnSeqId=" + qnSeqId);
    // this.queryQnHouseSubmits(qnDate, qnSeqId);
    wx.navigateTo({
      url: '/subpages/qn/queryQnQueList/queryQnQueList?qnDate='+qnDate+'&qnSeqId='+qnSeqId,
    });
  },
/**  //暂不用该方法，所以注释掉。
  queryQnHouseSubmits:function(qnDate, qnSeqId){
    console.log('开始查询是否有其他人已提交问卷（问卷唯一类型为按房唯一时，若已有人提交，则不可进入问卷答题页面），URL='
                  +apiConstant.queryQnHouseSubmits);
    if (this.data.custId == "" || this.data.houseSeqId == "") {
        wx.showToast({
          title: "网络异常，获取关键信息失败",
          icon: "none"
        });
        return false;
		}
    let filterCondition = {'custId':this.data.custId, 'houseSeqId':this.data.houseSeqId, 
                            'qnBeginDate':qnDate, 'qnEndDate':qnDate, 'qnSeqId':qnSeqId, 'pageNum':'1', 'pageSize':'10'};
    console.log(filterCondition);
    let that = this;
    wx.request({
      url : apiConstant.queryQnHouseSubmits,
      data : filterCondition,
      method : "POST",
      // header : {'content-type' : 'application/x-www-form-urlencoded'},
      header : {'content-type' : 'application/json'},
      dataType : "json",
      success : function(resp){
        console.log(resp);
        let resp_data = resp.data;
        if(resp_data.respCode != "000"){
          wx.showToast({
            icon:'none',
            title: resp_data.errDesc
          });
          return false;
        } else {
          // 如果有人已提交，弹出是否查看详情提示信息。
          if (resp_data.totalRecord != 0) {
            wx.showModal({
              content: '该问卷一个住房中只能一人提交，点击确认查看已提交人的问卷答题详情？',
              showCancel: true,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  let huSeqId_submitted = resp_data.qnHouseSubmitDtos[0].huSeqId;
                  // console.log('huSeqId_submitted = ' + huSeqId_submitted)
                  that.navigateToQueryQnQueAns(qnDate, qnSeqId, huSeqId_submitted);
                  return false;
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  return false;
                }
              }
            });
          } else {
            wx.navigateTo({
              url: '/subpages/qn/queryQnQueList/queryQnQueList?qnDate='+qnDate+'&qnSeqId='+qnSeqId,
            })
            return true;
          }
        }
      },
      fail:function(resp){
        console.log(resp);
        var cur_title;
        if (resp.errMsg != null || resp.errMsg != "") {
        	cur_title = resp.errMsg;
        } else {
          cur_title = resp.data.errDesc;
        }
        //错误提示信息
        wx.showToast({
          title: cur_title,
          icon: "none"
        });
        return false;
      },
      complete:function(){
		    
      }
    });
  },
  
  navigateToQueryQnQueAns:function(qnDate, qnSeqId, huSeqId){
    console.log("onTapWatchDetail2-qnDate:" + qnDate + "，qnSeqId=" + qnSeqId + "，isQueryAns=Y" + "，huSeqId=" + huSeqId);
    wx.navigateTo({
      url: '/subpages/qn/queryQnQueAns/queryQnQueAns?isQueryAns=Y&qnDate='+qnDate+'&qnSeqId='+qnSeqId+'&huSeqId='+huSeqId,
    });
  },
*/  
  onLoadMore:function(){
    this.data.pageNum = this.data.pageNum +1;
    this.data.loading = true;
    this.queryOngoingQnInfos()
  },
  
  onUnload: function (options) {
    let pages = getCurrentPages(); 
    let prePage = pages[pages.length - 2]; 
    console.log(prePage);
    prePage.onLoad();
  },
  
})