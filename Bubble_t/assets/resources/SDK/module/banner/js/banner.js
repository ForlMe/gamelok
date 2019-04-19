

cc.Class({
    extends: cc.Component,

    properties: {
        imgNode: cc.Node,
        myNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    setData(img,url,type,data){
        this._jumpData = data;
        var self = this;
        SdkManager.getOnlineSpriteFrame(img,function(res){
            self.myNode.active = true;
            self.imgNode.getComponent(cc.Sprite).spriteFrame = res;
            self.imgNode.getComponent('moreGame').setData(img,url,type,data,2,1);
        });

        
    },
    callBackJump(){
    },
    callBackClose(){
        this.node.destroy();
    },

    // update (dt) {},
});
