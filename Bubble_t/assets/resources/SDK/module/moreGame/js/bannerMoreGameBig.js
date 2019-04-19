
cc.Class({
    extends: cc.Component,

    properties: {
        bigNode: cc.Node,
        smallNode: cc.Node,
    },

   

    start () {
        this.node.on('touchstart', function (event) {
            this.callBack();
        }, this);

        if (this.node._touchListener) {
            this.node._touchListener.setSwallowTouches(false);
        }
    },

    callBack(){
        console.log("big callback");
        this.bigNode.active = false;
        this.smallNode.active = true;
    },

    // update (dt) {},
});
