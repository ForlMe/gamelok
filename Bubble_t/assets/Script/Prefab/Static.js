cc.Class({
    extends: cc.Component,

    properties: {
        beng: cc.Prefab,
        popos:cc.Prefab,
        sprite: cc.Sprite,
        snakesAtlas: cc.SpriteAtlas,
    },
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
        // this.node.on(cc.Node.EventType.POSITION_CHANGED, this.shake, this); 
    },
    reuse(res) {
        if (res != 0) {
            this.node.x = 0;
            this.node.y = 0;
            this.node.active = true;
            this.node.tags = res;
            this.sprite.spriteFrame = this.snakesAtlas.getSpriteFrame('j_' + res);

        };
    },
    onPostSolve(contact, selfCollider, otherCollider) {
        // console.log(contact.getWorldManifold().normal, '获取世界坐标系下的碰撞信息。');
        // console.log(contact.getImpulse().normalImpulses[0], '获取碰撞冲量。');
    },
    shake() {
        console.log();
    },
    unuse() {
        this.node.x = 0;
        this.node.y = 0;
        this.node.active = false;
    },
    onDestroy() {
        if (this.node.group != "default" && this.node.group != "Group") {
            if(cc.yy.Trace_point_mode_type == 0 || cc.yy.Trace_point_mode_type == 1|| cc.yy.Trace_point_mode_type == 4){
                let item = cc.instantiate(this.beng);
                let bg = cc.yy.Bg;
                bg.getChildByName(this.node.io_y + '.' + this.node.io_x).addChild(item);
            }
            // }else{
            //     let item = cc.instantiate(this.popos);
            //     let bg = cc.yy.Bg;
            //     bg.getChildByName(this.node.io_y + '.' + this.node.io_x).addChild(item);
            // }
        }
    },
});