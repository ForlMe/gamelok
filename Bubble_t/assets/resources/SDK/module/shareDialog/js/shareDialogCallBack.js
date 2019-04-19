

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start() {

    },

    shareCallBack(){
        SdkManager.share({name:GameName,source:3,success:function(type){
                this.node.destroy();
        }.bind(this)});
    },
    closeCallBack(){
        this.node.destroy();
    },
    receiveCare(){
        canGetLocalCard = false;
        Userdefault.setBoolForKey(getLocalCareId,true)
        var card = Userdefault.getIntForKey(localCardKey,0);
        if(card + netCardNum < 5) {
            Userdefault.setDataForKey(localCardKey,card + 1);
        }
        this.node.destroy();
    },
    closeCallBack_2(){
        canGetLocalCard = false;
        Userdefault.setBoolForKey(getLocalCareId,true)
        this.node.destroy();
    },

    // update (dt) {},
});
