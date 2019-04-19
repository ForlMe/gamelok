//瞄准线 控制类
cc.Class({
    extends: cc.Component,
    properties: () => ({
        __vx: 0,
        __vy: 0,
        emission: cc.Prefab,
        arraw: cc.Node,
        arraw_t: cc.Node,
        lineLength_count: 0,
        origin: null,
        increment: null,
        raysCount: 0,
    }),
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
        this.origin = cc.v2(0, 0); //射线原点坐标
    },
    /**
     * 当手指在屏幕上目标节点区域内触摸开始时
     * @param {} event 
     */
    CallBack(event) {
        if (cc.yy.CanvasGameType) {
            this.moveNub = 0;
            this.RaysJudge(event);

        }
    },
    /**
     * 当手指在屏幕上目标节点区域内触摸移动时
     * @param {} event 
     */
    Move(event) {
        if (cc.yy.CanvasGameType) {

            this.RaysJudge(event);
        }

    },
    /**
     * 发射前判断位置是否正确
     * @param {*} event 
     */
    RaysJudge(event) {
        let touchPos = this.node.convertToNodeSpaceAR(event.touch.getLocation());
        let line = touchPos.sub(this.origin);
        this.increment = line.normalize().mul(cc.yy.Line_spacing); //根据每条线段的长度获得一个增量向量
        if ((this.increment.x < 18 && this.increment.y < 8) || (this.increment.x > -18 && this.increment.y < 8)) {
            this.destroyGraphics();
            cc.yy.preview.preDie();
            cc.yy.Trace_point_mode_Data = [];
            cc.yy.RaysType = false;
        } else {
            cc.yy.RaysType = true;
            this.integrated_emission(event);
            //描线移动
            cc.yy.raysmobile.init();


        }
    },
    /**
     * 射线检测&&瞄准
     * @param {} event 
     */
    integrated_emission(event) {



        // var delta = event.touch.getDelta();

        // if(Math.abs(delta.x) > 0.6 || Math.abs(delta.y) > 0.6){
        //     console.log(Math.abs(delta.x),Math.abs(delta.y))
        // }else{
        //     console.log(Math.abs(delta.x),Math.abs(delta.y))
        //     return;
        // }

        
        this.raysCount = 0;
        cc.yy.raysDataNode = [];
        cc.yy.ballReuseNub = 0;
        this.moveNub++;
        this.probeStatus = false;
        this.node.convertToNodeSpaceAR(cc.v2(cc.find('Canvas/bottom/arraw').x, cc.find('Canvas/bottom/arraw').y));
        let length = cc.yy.Line_spacing;
        let touchPos = this.node.convertToNodeSpaceAR(event.touch.getLocation());
        let line = touchPos.sub(this.origin);
        let lineLength = cc.yy.Line_length; //获得这个向量的长度
        this.increment = line.normalize().mul(length); //根据每条线段的长度获得一个增量向量
        let pos = this.origin.clone(); //临时变量

        //只要线段长度还大于每条线段的长度
        this.lineLength_count = Math.floor(lineLength / length);
        //计算出需要的圆点描线长度
        for (let i = 0; i < this.lineLength_count; i++) {
            pos.addSelf(this.increment);
        }
        this.rayCast_a(this.origin, pos);
        var dis = this.origin.sub(touchPos);
        var angle = Math.atan2(dis.y, dis.x) / Math.PI * 180;
        this.arraw.rotation = -angle;
        this.arraw_t.rotation = this.arraw.rotation;
        cc.yy.Launch_Degress = this.arraw.rotation;
        this.degreesToVectors(this.arraw.rotation);
    },
    /**
     * 描线样式A
     * @param {*} p1 
     * @param {*} p2 
     * @param {*} event 
     */
    rayCast_a: function (p1, p2) {
        let pos_a = p1.clone();
        var manager = cc.director.getPhysicsManager();
        var result_vz = cc.v2(0, 0);
        if (cc.yy.Trace_point_mode_type == 3) {
            var result = manager.rayCast(this.node.convertToWorldSpaceAR(p1), this.node.convertToWorldSpaceAR(p2), cc.RayCastType.AllClosest);
        } else {
            var result = manager.rayCast(this.node.convertToWorldSpaceAR(p1), this.node.convertToWorldSpaceAR(p2));
        }
        //检测到碰撞体时进行折射
        result.forEach(results => {
                result_vz = this.node.convertToNodeSpaceAR(results.point);
                if (cc.yy.Trace_point_mode_type != 3) {
                    if (result[0].collider.node.name == "side_r" || result[0].collider.node.name == "side_l") {
                        let insdaNew = cc.v2(-this.increment.x, this.increment.y);
                        // cc.yy.raysDataNode.push([result_vz,insdaNew]);
                        this.Cross_line(result_vz.x, result_vz.y, insdaNew);
                    }
                }
        });
        //画出描线
        for (let i = 0; i < this.lineLength_count; i++) {
            pos_a.addSelf(this.increment);

            if (result[0]) {
             
                    if (result_vz.y < pos_a.y) {
                        //0，普通模式
                        //1，超级瞄准线模式
                        if (cc.yy.Trace_point_mode_type != 3) {
                            if (result[0].collider.node.name == "side_r" || result[0].collider.node.name == "side_l") {
                                let p5 = cc.v2(-result_vz.x, result_vz.y);
                                let p3 = result_vz;
                                p2 = p5.sub(p1).add(p3);
                                this.rayCast_Vice(result_vz, p2);
                            }
                            //这里通过全局变量定位当前需要什么样的射线预览
                            if (cc.yy.Trace_point_mode_type != 0 && cc.yy.Trace_point_mode_type != 1) {
                                this.probeTypeFun(result[0], cc.yy.Trace_point_mode_type);
                            }
                        }
                        //3，单线探测物体穿透模式
                        if (cc.yy.Trace_point_mode_type == 3) {
                            let conData = [];
                            for (const iterator of result) {
                                if (iterator.collider.node._parent.name != 'side_t' && iterator.collider.node._parent.name != 'side') {
                                    conData.push([iterator.collider.node._parent.io_y, iterator.collider.node._parent.io_x]);
                                }
                            }
                            cc.yy.preview.init(conData);
                            cc.yy.Trace_point_mode_Data = conData;
                        }
                        return;
                    }
            }
            /**
             * 使用节点画虚线
             */
            if (result_vz.y > pos_a.y + 8) {
                // cc.yy.raysDataNode.push([pos_a,this.increment]);
                this.Cross_line(pos_a.x, pos_a.y, this.increment);

            }
        }
    },
    /**
     * 二次描线递归方法
     * @param {起点向量} p1 
     * @param {终点向量} p2 
     * @param {是否是第三次折射} bot 
     */
    rayCast_Vice(p1, p2, bot) {
        if (!bot) {
            p2.y -= 10;
            let gy = p2.sub(p1);
            this.insda = gy.normalize().mul(cc.yy.Line_spacing);
        } else {
            p1.y += 7;
            this.insda = this.increment;
        }
        for (let index = 0; index < 50; index++) {
            p2.addSelf(this.insda);
        }
        var manager = cc.director.getPhysicsManager();
        var result = manager.rayCast(this.node.convertToWorldSpaceAR(p1), this.node.convertToWorldSpaceAR(p2));
        var p1_vxy = cc.v2(0, 0);
        result.forEach(results => {
            p1_vxy = this.node.convertToNodeSpaceAR(results.point);
            //注释取消描线延长点
            if (!bot) {
                if (result[0].collider.node.name == "side_r" || result[0].collider.node.name == "side_l") {
                    if (cc.yy.Trace_point_mode_type != 0) {
                        // cc.yy.raysDataNode.push([p1_vxy,this.increment]);
                        this.Cross_line(p1_vxy.x, p1_vxy.y, this.increment);

                    }
                }
            }
        });
        //画出描线
        let traceLeng = 3;
        if (cc.yy.Trace_point_mode_type != 0 && cc.yy.Trace_point_mode_type != 3) traceLeng = 50;
        for (let i = 0; i < traceLeng; i++) {
            p1.addSelf(this.insda);
            if (result[0]) {
                if (p1_vxy.y <= p1.y) {
                    if (cc.yy.Trace_point_mode_type != 0 && cc.yy.Trace_point_mode_type != 3) {
                        if (!bot) {
                            if (result[0].collider.node.name == "side_r" || result[0].collider.node.name == "side_l") {
                                let p5 = cc.v2(p1_vxy.x, p1_vxy.y);
                                let p3 = p1_vxy;
                                p2 = p5.sub(p1).add(p3);
                                this.rayCast_Vice(p1_vxy, p2, true);
                            }
                        }
                        if (result[0].collider.node.name != "side_r" && result[0].collider.node.name != "side_l") {
                            //这里通过全局变量定位当前需要什么样的射线预览
                            this.probeTypeFun(result[0], cc.yy.Trace_point_mode_type);
                        }
                    }
                    break;
                }
            }
            if (p1_vxy.y > p1.y + 8) {
                // cc.yy.raysDataNode.push([p1,this.insda]);
                this.Cross_line(p1.x, p1.y, this.insda);

            }
        }
    },
    /**
     * 预览检测器探测器
     * @param {*} result 
     * @param {*} type 
     */
    probeTypeFun(result, type) {
        if (type == 1) {
            return;
        }
        let node = result.collider.node;
        //2，单线探测物体模式
        if (node._parent.name != 'side_t' && node._parent.name != 'side') {
            //这里处理扫描到的元素节点
            if (result.normal.x > 0) {
                //右下
                var eventData = cc.yy.select.emissionFalling(4, node._parent);
            } else {
                //左下
                var eventData = cc.yy.select.emissionFalling(3, node._parent);
            }
            /**
             * 子弹击打左下角
             */
            if (result.normal.x < 0 && result.normal.y < 0.5) {
                var eventData = cc.yy.select.emissionFalling(3, node._parent);
            }
            /**
             * 子弹击打左上角
             */
            if (result.normal.x < 0 && result.normal.y > 0.5) {
                var eventData = cc.yy.select.emissionFalling(1, node._parent);
            }
            /**
             *子弹击打右下角
             */
            if (result.normal.x > 0 && result.normal.y < 0.5) {
                var eventData = cc.yy.select.emissionFalling(4, node._parent);
            }
            /**
             *子弹击打右上角
             */
            if (result.normal.x > 0 && result.normal.y > 0.5) {
                var eventData = cc.yy.select.emissionFalling(2, node._parent);
            }
            cc.yy.preview.probe(eventData[0], eventData[1], cc.yy.Trace_point_mode_type);
            this.probeStatus = true;
        } else if (node.name != 'side_l' && node.name != 'side_r') {
            //这里处理扫描到的头顶节点
            let mapNodeXY = node.name.split('.');
            var newData_io_x = mapNodeXY[1] * 1;
            var newData_io_y = mapNodeXY[0] * 1;
            cc.yy.preview.probe(newData_io_x, newData_io_y, cc.yy.Trace_point_mode_type);
            this.probeStatus = true;
        }
        if (!this.probeStatus && cc.yy.Trace_point_mode_type != 3) {
            cc.yy.preview.preDie();
        }
    },
    /**
     * 关闭描线
     */
    destroyGraphics() {

        for (const iterator of this.node.children) {
            cc.yy.Ball.put(iterator);
            if (this.node.children.length != 0) {
                this.destroyGraphics();
            }
        }
    },
    /**
     * 描线创建
     * @param {*} vx 
     * @param {*} vy 
     * @param {*} colour 
     */
    Cross_line(vx, vy, vector) {
        //描线颜色
        for (const iterator of this.node.children) {
            if (iterator.tap != this.moveNub) {
                cc.yy.Ball.put(iterator);
            }
        }
        if (cc.yy.Trace_point_mode_type < 2) {
            var colourNode = cc.find('Canvas/bottom/show_a/emission');
            if (!colourNode) {
                return;
            }

            var colour = colourNode.tap;
        } else {
            switch (cc.yy.Trace_point_mode_type) {
                case 2:
                    var colour = 'd_2';
                    break;
                case 3:
                    var colour = 'd_4';

                    break;
                case 4:
                    var colour = 'd_3';
                    break;
                case 5:
                    var colour = 'd_1';
                    break;
            }
        }
        if (vector == null) {
            var vector = false;
        }
        var item = cc.yy.Ball.get(vx, vy, vector, colour);
        item.tap = this.moveNub;
        // item.vector = vector;
        this.node.addChild(item);
    },
    /**
     * 已知角度求向量
     * @param {} degree 
     */
    degreesToVectors: function (degree) {
        let radian = cc.misc.degreesToRadians(degree); // 将角度转换为弧度
        let comVec = cc.v2(1, 0); // 对比向量
        let dirVec = comVec.rotate(-radian); // 将对比向量旋转给定的弧度返回一个新的向量
        cc.yy.Launch_angle = dirVec;
    },
    /**
     * 已知向量求角度
     * @param {} dirVec 
     */
    vectorsToDegress: function (dirVec) {
        let comVec = cc.v2(0, 1); // 水平向右的对比向量
        let radian = dirVec.signAngle(vec); // 求方向向量与对比向量间的弧度
        let degree = cc.misc.radiansToDegrees(radian); // 将弧度转换为角度
        return degree;
    },
    update() {



    }
})