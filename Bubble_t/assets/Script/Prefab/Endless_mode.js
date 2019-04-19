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
        // 获取存储的状态
        var LevelData = [];
        var gameData = cc.yy.storage.GetData('GameData_w');
        /**
         * 创建top头部碰撞壁
         */
        this.scheduleOnce(function () {
            for (const top of cc.yy.Map_Bg.children) {
                let mapNodeXY = top.name.split('.');
                top.io_x = mapNodeXY[1] * 1;
                top.io_y = mapNodeXY[0] * 1;
                if (mapNodeXY[0] == 0) {
                    let sideNode = this.side_t.getChildByName(top.name);
                    sideNode.addComponent(cc.PhysicsBoxCollider);
                    let sideNodecollider = sideNode.getComponent(cc.PhysicsBoxCollider);
                    sideNodecollider.size.height = 2;
                    sideNodecollider.size.width = 58;
                    sideNodecollider.apply();
                    let sideNodeRigidBody = sideNode.getComponent(cc.RigidBody);
                    sideNodeRigidBody.type = 0
                    sideNodeRigidBody.allowSleep = false;
                }
            }
        });
        /**
         * 判断是否有存档
         */
        if (gameData == null) {
            var endMapData = cc.yy.Map_Bg.children;
            this.scheduleOnce(function () {
                //通过遍历生成无尽模式地图
                for (let i of endMapData) {
                    if (i.io_y < cc.yy.Endless) { // || (i.io_x == 5 && i.io_y == 9)
                        let random = Math.floor(Math.random() * 5 + 1);
                        if (random != 0) {
                            let item = cc.yy.MapNodePool.get(random);
                            item.io_x = i.io_x;
                            item.io_y = i.io_y;
                            i.addChild(item);
                            var nodeName = i.name;
                            LevelData.push([nodeName, random]);
                        }
                    }
                }
                cc.yy.storage.SetData('GameData_w', LevelData);
                console.log('重新生成');
            });
        } else {
            cc.yy.GameCanvas.getComponent('OnGame').integ(gameData.fraction * 1);
            cc.yy.whereaboutsNub = gameData.whereaboutsNub;
            cc.yy.GameCanvas._components[1].test.string = cc.yy.whereaboutsNub;
            this.scheduleOnce(function () {
                for (let i of gameData.LevelData) {
                    let nodeData = cc.yy.Map_Bg.getChildByName(i[0]);
                    let random = i[1];
                    if (random != 0) {
                        let item = cc.yy.MapNodePool.get(random);
                        item.io_x = nodeData.io_x;
                        item.io_y = nodeData.io_y;
                        nodeData.addChild(item);
                    }
                }
                console.log('继承上次玩法');
            });
        }
        this.scheduleOnce(function () {
            cc.yy.destroyNode.GameOver(10);
        }, 0.2);

    },
});