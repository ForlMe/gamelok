
cc.Class({
    extends: cc.Component,

    properties: {
        mydistype:"rankAll",
    },
    onLoad: function() {
        
    },

    onClick (key) {
        // this._isShow = false;
        // this.tex = new cc.Texture2D();

        // this._isShow = !this._isShow;
        wx.postMessage({
            disType:this.mydistype,//Horizontal   Vertical
            gameMode:window.RankingKey,
            showStr: this._isShow ? "true" : "false"
        });
        //  this.schedule(this.upDisPlay,1/60);
    },

    // onDisable(){
    //     wx.postMessage({
    //         disType: this.mydistype,//Horizontal   Vertical
    //         close: true,
    //     });
    // },

});
