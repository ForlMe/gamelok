cc.Class({
    extends: cc.Component,

    properties: {
        pboot: false,
        sprite: cc.Sprite,
        snakesAtlas: cc.SpriteAtlas,
        hy:cc.Prefab,
        sd:cc.Prefab,



    },
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
    },
    init(res) {
        if (res != 0) {
            this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('dj_' + res);
        };
    },
    /**
     * 碰撞触发
     * @param {*} contact 
     * @param {*} selfCollider 
     * @param {*} otherCollider 
     */
    onBeginContact(contact, selfCollider, otherCollider) {
        var self = this;
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
            }
        } else {
            let mapNodeXY = otherCollider.node.name.split('.');
            var newData_io_x = mapNodeXY[1] * 1;
            var newData_io_y = mapNodeXY[0] * 1;
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
            selfCollider.body.linearVelocity = cc.v2(0, 0);
            selfCollider.body.node.setParent(newMapNode)
            this.scheduleOnce(function () {
                selfCollider.body.node.x = 0;
                selfCollider.body.node.y = 0;
            switch (cc.yy.Trace_point_mode_type) {
                case 2:
                var item = cc.instantiate(this.hy);
                cc.yy.Bg.getChildByName(newMapNode.name).addChild(item);
                    break;
                case 4:

                    break;
                case 5:
                var item = cc.instantiate(this.sd);
                cc.yy.Bg.getChildByName(newMapNode.name).addChild(item);
                    break;
            }
                self.scheduleOnce(function(){
                    this.node.destroy();
                },0.3);
            });
        }
    },
    onDestroy(){
        if(cc.yy.CanvasGameType){
            return;
        }
        if(cc.yy.Trace_point_mode_type != 4){
            for (const iterator of cc.yy.Trace_point_mode_Data) {
                let dataNode = cc.yy.Map_Bg.getChildByName(iterator[0] + '.' + iterator[1]);
                if (dataNode.children[0] != undefined) {
                    dataNode.children[0].destroy();
                }
            }
            cc.yy.Trace_point_mode_type = 0;
            cc.yy.select.suspension(true);

        }else{
            var desctroyDataName = [];
            for (const iterator of cc.yy.Trace_point_mode_Data) {
                desctroyDataName.push(iterator[0]+'.'+iterator[1]);
            }
            cc.yy.destroyNode.init(desctroyDataName,true);
            
        } 
    },
});