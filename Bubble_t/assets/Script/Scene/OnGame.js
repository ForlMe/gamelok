cc.Class({
    extends: cc.Component,

    properties: {

        emission: {
            default: null,
            type: cc.Prefab,
            displayName: '发射点'
        },
        endless_mode: {
            default: null,
            type: cc.Prefab,
            displayName: '无尽模式',
        },
        Static: {
            default: null,
            type: cc.Prefab,
            displayName: '预制地图节点元素',
        },

        special: {
            default: null,
            type: cc.Prefab,
            displayName: '道具发射预制'
        },
        specialNode: {
            default: null,
            type: cc.Node,
            displayName: '道具发射炮台'
        },
        rays: {
            default: null,
            type: cc.Node,
            displayName: '描线'
        },
        integral: {
            default: null,
            type: cc.Label,
            displayName: '积分'
        },
        bgMask: {
            default: null,
            type: cc.Node,
            displayName: '遮罩动画节点'
        },
        ball: {

            default: null,
            type: cc.Prefab,
            displayName: '描线节点'

        },




        test: cc.Label,
        __current_emission: null,

    },
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
        this.test.string = cc.yy.whereaboutsNub;
        //开启背景音乐
        //cc.yy.Bgm.playBGM('bgs.mp3');
        cc.yy.GameCanvas = this.node;
        //计算出需要多少个预制节点并加载至对象池中
        //开启刚体
        cc.director.getPhysicsManager().enabled = true;
        //定位发射器方向
        cc.yy.Bg = cc.find('Canvas/main/boot/bg');
        cc.yy.Rays = this.rays;
        cc.yy.Map_Bg = cc.find('Canvas/main/boot/Endless_mode');
        cc.yy.bgMask = this.bgMask;




        // 监听当手指在屏幕上目标节点区域内触摸开始时
        this.node.on(cc.Node.EventType.TOUCH_START, this.onItemStartCallBack, this);
        // 监听当手指在屏幕上目标节点区域内触摸移动时
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // 监听当手指在目标节点区域内离开屏幕时
        this.node.on(cc.Node.EventType.TOUCH_END, this.onItemEndCallBack, this);
        // 监听当手指在目标节点区域外离开屏幕时
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onItemEndCallBack, this);
    },
    start() {
        cc.yy.MapNodePool = new cc.NodePool('Static');
        cc.yy.Emission = new cc.NodePool('emission');
        cc.yy.Ball = new cc.NodePool('ball');
        for (let i = 0; i < 136; i++) {
            let item = cc.instantiate(this.Static); // 创建节点
            cc.yy.MapNodePool.put(item); // 通过 put 接口放入对象池
        }
        for (let o = 0; o < 5; o++) {
            let item = cc.instantiate(this.emission); // 创建节点
            cc.yy.Emission.put(item); // 通过 put 接口放入对象池
        }
        for (let p = 0; p < 300; p++) {
            let item = cc.instantiate(this.ball); // 创建节点
            cc.yy.Ball.put(item); // 通过 put 接口放入对象池
        }


        this.scheduleOnce(function () {

            // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
            //     cc.PhysicsManager.DrawBits.e_pairBit |
            //     cc.PhysicsManager.DrawBits.e_centerOfMassBit |
            //     cc.PhysicsManager.DrawBits.e_jointBit |
            //     cc.PhysicsManager.DrawBits.e_shapeBit;

        });
    },
    /**
     * 监听手指点击时
     * @param {*} event 
     */
    onItemStartCallBack(event) {
        cc.yy.Rays.getComponent('rays').CallBack(event);
    },
    /**
     * 监听手指移动时
     * @param {*} event 
     */
    onTouchMove(event) {
        cc.yy.Rays.getComponent('rays').Move(event);
    },
    /**
     * 监听当手指在目标节点区域内离开屏幕时
     * @param {} event 
     */
    onItemEndCallBack(event) {
        //当前发射点
        if (!cc.yy.RaysType) {
            return;
        }
        cc.yy.TopNodeNoTow = true;
        cc.yy.CanvasGameType = false;
        if (cc.yy.Trace_point_mode_type < 2) {
            cc.yy.Bgm.playSFX('emission.mp3');
            cc.yy.RaysType = false;
            cc.yy.preview.preDie();
            let show_a = cc.find('Canvas/bottom/show_a/emission');
            show_a.children[0].active = true;
            var emission = show_a.getComponent(cc.RigidBody);
            var Launch_angle = cc.yy.Launch_angle;
            //发射点发射
            emission.linearVelocity = cc.v2(-Launch_angle.x * cc.yy.Launch_speed, -Launch_angle.y * cc.yy.Launch_speed);
            emission.applyForceToCenter(cc.v2(0, 0));
            //清除射线预览效果
            cc.yy.Rays.getComponent('rays').destroyGraphics();
        } else {
            cc.yy.RaysType = false;
            cc.yy.preview.preDie();
            if (cc.yy.Trace_point_mode_type != 3) {
                let special = this.specialNode.children[0];
                special.children[0].active = true;
                var rigidBody = special.getComponent(cc.RigidBody);
                var Launch_angle = cc.yy.Launch_angle;
                //发射点发射
                rigidBody.linearVelocity = cc.v2(-Launch_angle.x * cc.yy.Launch_speed, -Launch_angle.y * cc.yy.Launch_speed);
                rigidBody.applyForceToCenter(cc.v2(0, 0));
                cc.yy.Rays.getComponent('rays').destroyGraphics();
            } else {
                /**
                 * 发射激光
                 */
                cc.yy.Rays.getComponent('rays').destroyGraphics();
                let special = this.specialNode.children[0];
                special.getChildByName('laser').rotation = cc.yy.Launch_Degress - 90;
                special.children[1].active = true;
                this.scheduleOnce(function () {
                    for (const iterator of cc.yy.Trace_point_mode_Data) {
                        let dataNode = cc.yy.Map_Bg.getChildByName(iterator[0] + '.' + iterator[1]);
                        dataNode.children[0].destroy();
                    }
                    // cc.yy.select.suspension(true);
                }, 0.5);
            }
        }
        if (cc.yy.MapNodePool.size() < 30) {

            for (let i = 0; i < 136; i++) {
                let item = cc.instantiate(this.Static); // 创建节点
                cc.yy.MapNodePool.put(item); // 通过 put 接口放入对象池
            }

        }
    },
    /**
     * 下滑新增
     */
    onSliding() {
        var selectDataNode = [];
        let bgNode = cc.yy.Map_Bg.children;
        let endMapData = cc.find('Canvas/main/boot/preparation').children;
        bgNode.reverse();
        endMapData.reverse();
        let onshow = [];
        for (let i of endMapData) {
            let mapNodeXY = i.name.split('.');
            i.io_x = mapNodeXY[1] * 1;
            i.io_y = mapNodeXY[0] * 1;
            let random = Math.floor(Math.random() * 5 + 1);
            if (random != 0) {
                let item = cc.yy.MapNodePool.get(random);
                item.io_x = i.io_x;
                item.io_y = i.io_y;
                i.addChild(item);
            }
        }
        for (const iterator of bgNode) {
            onshow.push(iterator);
        }
        for (const iterator of endMapData) {
            onshow.push(iterator);
        }
        for (const iterator of onshow) {
            if (iterator.children[0] != undefined) {
                let chiNode = iterator.children[0];
                chiNode.runAction(cc.sequence(cc.moveBy(0.5, 0, -110), cc.callFunc(function () {
                    chiNode.io_y += 2;
                    chiNode.setParent(cc.yy.Map_Bg.getChildByName(chiNode.io_y + '.' + chiNode.io_x));
                    chiNode.x = 0;
                    chiNode.y = 0;
                    chiNode.getChildByName('Static').y = 0
                    console.log('完成！');
                })));
            }
        }
        bgNode.reverse();
        endMapData.reverse();
    },
    /**
     * 点击事件触发
     */
    onButtons(event) {
        console.log(event.target.name);
        switch (event.target.name) {
            case 'd_1':
                //闪电  
                cc.yy.Trace_point_mode_type = 5;
                if (this.specialNode.children.length == 0) {
                    var item = cc.instantiate(this.special); // 创建节点
                    item.getComponent('special').init(5);
                    this.specialNode.addChild(item); // 创建节点
                } else {
                    for (const iterator of this.specialNode.children) {
                        cc.yy.Trace_point_mode_type = 0;
                        iterator.destroy();
                    }
                }
                break;
            case 'd_2':
                //炸弹
                cc.yy.Trace_point_mode_type = 2;
                if (this.specialNode.children.length == 0) {
                    var item = cc.instantiate(this.special); // 创建节点
                    item.getComponent('special').init(2);
                    this.specialNode.addChild(item); // 创建节点
                } else {
                    for (const iterator of this.specialNode.children) {
                        cc.yy.Trace_point_mode_type = 0;
                        iterator.destroy();
                    }
                }

                break;
            case 'd_3':
                //彩虹道具
                cc.yy.Trace_point_mode_type = 4;
                if (this.specialNode.children.length == 0) {
                    var item = cc.instantiate(this.special); // 创建节点
                    item.getComponent('special').init(4);
                    this.specialNode.addChild(item); // 创建节点
                } else {
                    for (const iterator of this.specialNode.children) {
                        cc.yy.Trace_point_mode_type = 0;
                        iterator.destroy();
                    }
                }
                break;
            case 'd_4':
                //激光道具
                cc.yy.Trace_point_mode_type = 3;
                if (this.specialNode.children.length == 0) {
                    var item = cc.instantiate(this.special); // 创建节点
                    item.getComponent('special').init(3);
                    this.specialNode.addChild(item); // 创建节点
                } else {
                    for (const iterator of this.specialNode.children) {
                        cc.yy.Trace_point_mode_type = 0;
                        iterator.destroy();
                    }
                }
                break;
        }




    },
    /**
     * 更新积分
     * @param {*} int 
     */
    integ(int) {
        this.integral.string = (this.integral.string * 1) + int;
    },


});