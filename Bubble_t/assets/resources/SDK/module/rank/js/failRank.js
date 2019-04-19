
//排行榜位置 0，120
cc.Class({
    extends: cc.Component,

    properties: {
        rankingCanvas:cc.Node,
    },

    onDestroy: function() {
      
    },

    start () {
     
    },

    setData: function(rankingKey,showAndHideNode) {
    
        this._rankingKey = rankingKey;
        
        this._showAndHideNode = showAndHideNode;
       
        
        this.rankingCanvas.getComponent('rankingActiveShow').onClick(rankingKey);
    },
    setWXData : function(key,vaule){
        wx.setUserCloudStorage({
            KVDataList:[{"key":key,"value":vaule}],
            success:function(){console.log("success")},
            fail:function(){console.log("fail")},
            complete:function(){console.log("complete")}
        });
    },
    
    rankingCallBack: function(){


        this._showAndHideNode.active = false;

        SdkManager.showAllRankingLayer({
            rankKey:this._rankingKey,
            node:this._showAndHideNode.parent,
            closeFun:function(){ 
                this._showAndHideNode.active = true;
                this.rankingCanvas.getComponent('rankingActiveShow').onClick(this._rankingKey);
            }.bind(this)
        });

        
    },

    // update (dt) {},
});
