cc.Class({
    extends: cc.Component,

    properties: {
        side_t: cc.Node,
    },
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
    },
    start() {
        this.scheduleOnce(function () {
            //通过遍历生成无尽模式地图
            for (let i of endMapData) {
                let mapNodeXY = i.name.split('.');
                i.io_x = mapNodeXY[1] * 1;
                i.io_y = mapNodeXY[0] * 1;
                if (i.io_y == 0) {
                    let sideNode = this.side_t.getChildByName(i.name);
                    sideNode.addComponent(cc.PhysicsBoxCollider);
                    let sideNodecollider = sideNode.getComponent(cc.PhysicsBoxCollider);
                    sideNodecollider.size.height = 2;
                    sideNodecollider.size.width = 58;
                    let sideNodeRigidBody = sideNode.getComponent(cc.RigidBody);
                    sideNodeRigidBody.type = 0
                    sideNodeRigidBody.allowSleep = false;
                    sideNodecollider.apply();
                }
                if (i.io_y < cc.yy.Endless) { // || (i.io_x == 5 && i.io_y == 9)
                    let random = Math.floor(Math.random() * 5 + 1);
                    if (random != 0) {
                        let item = cc.yy.MapNodePool.get(random);
                        item.io_x = i.io_x;
                        item.io_y = i.io_y;
                        i.addChild(item);
                    }
                }
            }
        });
        var endMapData = cc.yy.Map_Bg.children;

    },
});