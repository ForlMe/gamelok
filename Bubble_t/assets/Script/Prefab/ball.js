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
    reuse(vx, vy, vector, colour) {
        var node = this.node;
        var self = this;
        switch (colour) {
            case 1:
                //绿球
                this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('slice_1a8e092f4.86354_23');
                break;
            case 2:
                //绿球
                this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('slice_1a8e092f4.86354_22');
                break;
            case 3:
                //绿球
                this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('slice_1a8e092f4.86354_20');
                break;
            case 4:
                //绿球
                this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('slice_1a8e092f4.86354_26');
                break;
            case 5:
                //绿球
                this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('slice_1a8e092f4.86354_24');
                break;
            case 'd_3':
                //绿球
                this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('slice_1a8e092f4.86354_24');
                cc.yy.ballReuseNub++;
                if(cc.yy.ballReuseNub===1){
                    this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('slice_1a8e092f4.86354_23');
                }else if(cc.yy.ballReuseNub===2){
                    this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('slice_1a8e092f4.86354_22');
                }else if(cc.yy.ballReuseNub===3){
                    this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('slice_1a8e092f4.86354_20');
                }else if(cc.yy.ballReuseNub===4){
                    this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('slice_1a8e092f4.86354_26');
                }else if(cc.yy.ballReuseNub===5){
                    this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('slice_1a8e092f4.86354_24');
                    cc.yy.ballReuseNub = 0;
                }
                break;
            default:
                this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('slice_1a8e092f4.86354_21')
                break;
        }
        node.x = vx;
        node.y = vy;

        if (vector) {
            if (node != null) {
                var elev2 = node.position.add(vector);
            }
                // node.runAction(
                //     cc.sequence(cc.moveTo(0.8, elev2),
                //         cc.callFunc(function () {
                //             if (node) {
                //                 node.x = vx;
                //                 node.y = vy;
                //                 self.test(vx, vy, vector);
                //             }
                //         })));
        }

    },
    test(vx, vy, vector) {


        var node = this.node;
        var self = this;
        let elev2 = node.position.add(vector);
        node.runAction(
            cc.sequence(cc.moveTo(0.8, elev2),
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
        // this.node.x = 0;
        // this.node.y = 0;
        this.node.stopAllActions();
    },
});