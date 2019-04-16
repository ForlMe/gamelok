cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
        snakesAtlas: cc.SpriteAtlas,
    },



    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
    },
    /**
     * 节点初始化
     * @param {*} res 
     */
    reuse(vx, vy, vector) {
        var node = this.node;
        var self = this;
        node.x = vx;
        node.y = vy;


        if (node != null) {
            var elev2 = node.position.add(vector);
        }

        node.runAction(
            cc.sequence(cc.moveTo(0.5, elev2),
                cc.callFunc(function () {
                    if (node) {
                        node.x = vx;
                        node.y = vy;
                        self.test(vx, vy, vector);
                    }
                })));
    },
    test(vx, vy, vector) {


        var node = this.node;
        var self = this;
        let elev2 = node.position.add(vector);
        node.runAction(
            cc.sequence(cc.moveTo(0.5, elev2),
                cc.callFunc(function () {
                    if (node) {
                        node.x = vx;
                        node.y = vy;
                        self.test(vx, vy, vector);
                    }
                })));
    },
    //节点收回调用
    unuse() {
        
        this.node.x = 0;
        this.node.y = 0;
        this.node.stopAllActions();
    },
});