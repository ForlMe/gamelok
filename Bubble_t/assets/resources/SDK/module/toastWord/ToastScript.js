
cc.Class({
    extends: cc.Component,

    properties: {
       bgNode: cc.Node,
       strLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.runAction(cc.sequence(cc.moveBy(2.0,0,200),cc.removeSelf()));
    },

    setString(str,fontSize) {
        //x+40 y+30
        this.strLabel.getComponent(cc.Label).string = str;
        this.strLabel.fontSize = fontSize;
    }

    // update (dt) {},
});
