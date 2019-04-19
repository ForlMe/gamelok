var DestroyNode = cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
    },
    /**
     * 消除入口
     * @param {*} data 
     */
    init(data, trye) {
        if (data.length > 2 || trye) {
            this.forList(data, 0);
        } else {
            if (cc.yy.whereaboutsNub > 1) {
                cc.yy.whereaboutsNub--;
                cc.yy.GameCanvas._components[1].test.string = cc.yy.whereaboutsNub;
                
                this.scheduleOnce(function () {
                    cc.yy.storage.SetData('GameData_w');
                    cc.yy.CanvasGameType = true;
                }, 0.2);
            } else {
                cc.yy.whereaboutsNub--;
                cc.yy.GameCanvas._components[1].test.string = cc.yy.whereaboutsNub;
                    this.scheduleOnce(function () {
                        cc.yy.whereaboutsNub = 6;
                        cc.yy.GameCanvas._components[1].test.string = cc.yy.whereaboutsNub;
                        cc.yy.GameCanvas.getComponent('OnGame').onSliding();
                    }, 0.5);
            }
            /**
             * 检测游戏是否结束
             */
            if(this.GameOver(10)){
                console.log('检测到了！！有病毒');
                return;
            }
        }
        this.quantity = data.length;
    },
    /**
     * 递归消除方法
     * @param {*} data 
     * @param {*} num 
     */
    forList(data, num) {
        if (num < data.length) {
            let self = this;
            this.scheduleOnce(function () {
                let MapNode = cc.yy.Map_Bg.getChildByName(data[num]).children[0];
                if (MapNode != undefined) {
                    // cc.yy.MapNodePool.put(MapNode);
                    cc.yy.Bgm.playSFX('delect.mp3');
                    MapNode.destroy(); //integ
                    cc.yy.GameCanvas.getComponent('OnGame').integ(10);
                    self.forList(data, num + 1);
                    if (cc.yy.Trace_point_mode_type != 4) {
                        if (num + 1 === data.length) {
                            //消除结束时调用悬挂查询
                            cc.yy.select.suspension();
                        }
                    } else {
                        //消除结束时调用悬挂查询
                        if (num + 1 === data.length - 1) {
                            //消除结束时调用悬挂查询
                            cc.yy.select.suspension();
                            cc.yy.Trace_point_mode_type = 0;
                        }
                    }
                }
            }, cc.yy.EliminateTimeIntervals);
        }
    },
    /**
     * 悬停递归入口
     * @param {*} data 
     */
    InitSuspension(data) {
        let quannub = (data.length * 1) + (this.quantity * 1);
        if (quannub >= 5 && quannub < 7) {
            cc.yy.Bgm.playSFX('go.mp3');
            cc.yy.bgMask.getComponent('bgMask').init(1);
        } else if (quannub >= 7 && quannub < 9) {
            cc.yy.Bgm.playSFX('gr.mp3');
            cc.yy.bgMask.getComponent('bgMask').init(2);
        } else if (quannub >= 9) {
            cc.yy.Bgm.playSFX('ex.mp3');
            cc.yy.bgMask.getComponent('bgMask').init(3);
        }
        if (data.length > 0) {
            this.forSuspension(data, 0);
        } else {
            /**
             * 这里用来写存储数据逻辑
             */
            this.scheduleOnce(function () {
                cc.yy.storage.SetData('GameData_w');
                cc.yy.CanvasGameType = true;
            }, 0.2);
        }
    },
    /**
     * 悬停递归消除
     */
    forSuspension(data, num) {

        if (data[num] == undefined) {
            return;
        }
        if (num < data.length) {
            let mapNodeXY = data[num].split('.');
            let vy = mapNodeXY[0] * 1;
            let self = this;
            this.scheduleOnce(function () {
                let MapNode = cc.yy.Map_Bg.getChildByName(data[num]).children[0];
                if (MapNode != undefined) {
                    if (vy != 0) {
                        MapNode.setParent(cc.yy.Bg.getChildByName(data[num]));
                        MapNode.name = 'die';
                        let phy = MapNode.getComponent(cc.PhysicsCollider);
                        let random_nub = Math.floor((Math.random() * 40) + 1);
                        let random_t = Math.floor((Math.random() * 2));
                        console.log(random_t);
                        if(random_t >0){
                            random_nub = -random_nub;
                        }
                        phy.node.runType = 0;
                        phy.node.runAction(cc.sequence(
                            cc.moveBy(0.1, random_nub, 40),
                            cc.callFunc(function () {
                                phy.node.group = 'Group';
                                phy.apply();
                                phy.body.type = 2;
                                /**
                                 * 增加游戏活动的分数
                                 */
                                cc.yy.GameCanvas.getComponent('OnGame').integ(20);
                            })));
                        this.scheduleOnce(function () {
                            MapNode.destroy();
                        }, 2);
                    }
                    self.forSuspension(data, num + 1);
                    if (num + 1 === data.length) {
                        this.scheduleOnce(function () {
                            cc.yy.storage.SetData('GameData_w');
                            console.log('掉落结束');
                            cc.yy.CanvasGameType = true;
                        }, 0.2);
                    }
                }
            });
        }
    },
    GameOver(trye) {

            for (const iterator of cc.yy.Map_Bg.children) {
                if (iterator.io_y >= trye) {
                    if (iterator.children.length > 0) {
                        cc.yy.CanvasGameType = false;
                        cc.find('Canvas/gameover').active = true;
                        cc.yy.storage.SetData('GameData_w');
                        return true;
                    }
                }
            }
            return false;
    },
});
var DestroyNode = new DestroyNode();
module.exports = DestroyNode;