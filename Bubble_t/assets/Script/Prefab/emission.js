cc.Class({
    extends: cc.Component,

    properties: {
        pboot: false,
        sprite: cc.Sprite,
        snakesAtlas: cc.SpriteAtlas,

    },
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
    },
    reuse(res) {
        if (res != 0) {
            this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('j_' + res);
            this.node.tap = res;
        };
    },
    /**
     * 碰撞触发
     * @param {*} contact 
     * @param {*} selfCollider 
     * @param {*} otherCollider 
     */
    onBeginContact(contact, selfCollider, otherCollider) {

        this.pboot = false;
        // if (otherCollider.node.name == "bottom_a") {
        //     selfCollider.body.gravityScale = 5;
        //     var bottom_a = cc.find("Canvas/bottom/bottom_a");
        //     bottom_a.active = false;
        //     this.scheduleOnce(function () {
        //         this.node.destroy();
        //     }, 2);
        //     return;
        // }
        if (otherCollider.node.name == 'side_r' || otherCollider.node.name == 'side_l') return;
        if (otherCollider.node.name == 'Static') {
            /**
             * 子弹击打左下角
             */
            if (contact.getWorldManifold().normal.x > 0 && contact.getWorldManifold().normal.y > 0) {
                var eventData = cc.yy.select.emissionFalling(3, otherCollider.node);
            }
            /**
             * 子弹击打左上角
             */
            if (contact.getWorldManifold().normal.x > 0 && contact.getWorldManifold().normal.y < 0) {
                var eventData = cc.yy.select.emissionFalling(1, otherCollider.node);
            }
            /**
             *子弹击打右下角
             */
            if (contact.getWorldManifold().normal.x < 0 && contact.getWorldManifold().normal.y > 0) {
                var eventData = cc.yy.select.emissionFalling(4, otherCollider.node);
            }
            /**
             *子弹击打右上角
             */
            if (contact.getWorldManifold().normal.x < 0 && contact.getWorldManifold().normal.y < 0) {
                var eventData = cc.yy.select.emissionFalling(2, otherCollider.node);
            }
            if (eventData[0] != null && eventData[1] != null) {
                var newData_io_x = eventData[0];
                var newData_io_y = eventData[1];
                this.pboot = true;
            }
        } else {
            //这里需要写判断，不然可能会生成两个元素');
            if(cc.yy.TopNodeNoTow){
                let mapNodeXY = otherCollider.node.name.split('.');
                var newData_io_x = mapNodeXY[1] * 1;
                var newData_io_y = mapNodeXY[0] * 1;
                this.pboot = true;
                cc.yy.TopNodeNoTow = false;
            }
        }
        if (!this.pboot) {
            return;
        }
        var newMapNode = cc.yy.Map_Bg.getChildByName(newData_io_y + '.' + newData_io_x);
        if (!newMapNode) {
            console.log('没有找到节点');
            return;
        }
        if (newMapNode.children.length > 0) {
            return;
        }
        if (newMapNode != null) {
            cc.yy.Bgm.playSFX('collision.mp3');
            let NodeTap = selfCollider.node.tap;
            cc.yy.Emission.put(selfCollider.node);
            if (cc.yy.MapNodePool.size() > 5) {
                let tNode = cc.yy.MapNodePool.get(NodeTap);
                tNode.io_x = newData_io_x;
                tNode.io_y = newData_io_y;

                tNode.runAction(
                    cc.sequence(cc.moveBy(0.2, 0, 8),
                        cc.moveBy(0.2, 0, -8),
                        cc.moveBy(0.2, 0, 4),
                        cc.moveBy(0.2, 0, -4),
                        cc.moveBy(0.2, 0, 2),
                        cc.moveBy(0.2, 0, -2),

                        cc.callFunc(function () {
                            tNode.x = 0;
                            tNode.y = 0;
                        })));
                this.Shake(newData_io_y, newData_io_x);

                newMapNode.addChild(tNode);
                cc.yy.select.init(newMapNode);
            } else {
                console.log('没有球啦');
            }
            console.log('剩余地图节点数量', cc.yy.MapNodePool.size());
            //跳转至查询消除类
        }
    },
    //晃动效果
    Shake(vy, vx) {
        console.log('碰撞点X:', vx, 'Y:', vy);
        let data = cc.yy.select.region(vy + '.' + vx, 1);
        for (const iterator of data) {
            cc.yy.shake.init(iterator);
            // console.log(iterator[0], '------', iterator[1]);
        }
    },
    unuse() {
        this.node.children[0].active = false;
    },
});