
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad() {
        SdkManager.setRankingData(100);
    },

    start() {
        SdkManager.updateSubView({
            node: this.node.children[0],
            score: 0
        })
    },
    onButtonEvent(event){
        this.node.destroy();

    },

    // update (dt) {},
});