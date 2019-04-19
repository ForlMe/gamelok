
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    setData(img,data){
        this._jumpData = data;
        var self = this;
        SdkManager.getOnlineSpriteFrame(img,function(res){
            self.node.getComponent(cc.Sprite).spriteFrame = res;
        });
    },
    callBack(){
        
    },

    // update (dt) {},
});
