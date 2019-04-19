var Select = cc.Class({
    extends: cc.Component,
    properties: {
        onsetPoint: [],
    },
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
    },
    init(node) {
        var self = this;
        this.desctroyDataName = [];
        this.desctroyDataName.push(node.name);
        this.filter(node);
        this.test = 0;
    },
    /**
     * 发射物查询位置
     * @param {*} direction 
     * @param {*} node 
     */
    emissionFalling(direction, node) {
        switch (direction) {
            case 1: //左上角
                if (node.io_y % 2 === 0) {
                    var newData_io_x = node.io_x - 1;
                    var newData_io_y = node.io_y;
                } else {
                    var newData_io_x = node.io_x;
                    var newData_io_y = node.io_y + 1;
                }
                break;
            case 2: //右上角
                if (node.io_y % 2 === 0) {
                    var newData_io_x = node.io_x + 1;
                    var newData_io_y = node.io_y;
                } else {
                    var newData_io_x = node.io_x + 1;
                    var newData_io_y = node.io_y + 1;
                }
                break;
            case 3: //左下角
                if (node.io_y % 2 === 0) {
                    var newData_io_x = node.io_x - 1;
                    var newData_io_y = node.io_y + 1;
                    if (node.io_x == 0) {
                        var newData_io_x = node.io_x;
                        var newData_io_y = node.io_y + 1;
                    }
                } else {
                    var newData_io_x = node.io_x;
                    var newData_io_y = node.io_y + 1;
                }
                break;
            case 4: //右下角
                if (node.io_y % 2 === 0) {
                    var newData_io_x = node.io_x;
                    var newData_io_y = node.io_y + 1;
                    if (node.io_x == 10) {
                        var newData_io_x = node.io_x - 1;
                        var newData_io_y = node.io_y + 1;
                    }
                } else {
                    var newData_io_x = node.io_x + 1;
                    var newData_io_y = node.io_y + 1;
                }
                break;
        }
        return [newData_io_x, newData_io_y];
    },
    /**
     * @param {当前元素位置坐标x--y} vxy 
     * @param {元素颜色类型} tags 
     */
    filter(node) {
        let mapNodeXY = node.name.split('.');
        let vx = mapNodeXY[1] * 1;
        let vy = mapNodeXY[0] * 1;
        let tags = node.getChildByName("Static").tags;
        let vxy = [];
        if (vy % 2 === 0) {
            if (vx != 0)
                vxy.push((vy - 1) + '.' + (vx - 1));
            vxy.push((vy - 1) + '.' + (vx));
            if (vx != 0)
                vxy.push((vy) + '.' + (vx - 1));
            if (vx != 10)
                vxy.push((vy) + '.' + (vx + 1));
            if (vx != 0)
                vxy.push((vy + 1) + '.' + (vx - 1));
            vxy.push((vy + 1) + '.' + (vx));
        } else {
            vxy.push((vy - 1) + '.' + (vx));
            vxy.push((vy - 1) + '.' + (vx + 1));
            if (vx != 0)
                vxy.push((vy) + '.' + (vx - 1));
            if (vx != 9)
                vxy.push((vy) + '.' + (vx + 1));
            vxy.push((vy + 1) + '.' + (vx));
            vxy.push((vy + 1) + '.' + (vx + 1));
        }
        let correct = [];
        for (const iterator of vxy) {
            let showNode = cc.yy.Map_Bg.getChildByName(iterator);
            if (showNode != null) {
                if (showNode.children[0] != undefined && showNode.children[0].tags == tags && this.desctroyDataName.indexOf(showNode.name) == -1) {
                    correct.push(showNode.name);
                    this.desctroyDataName.push(showNode.name);
                }
            }
        }
        if (correct.length > 0) {
            for (let i of correct) {
                this.filter(cc.yy.Map_Bg.getChildByName(i));
            }
        } else {
            if (cc.yy.Trace_point_mode_type != 4) {
                console.log('结束查询，开始删除指令');
                cc.yy.destroyNode.init(this.desctroyDataName);
            } else {
                for (const iterator of this.desctroyDataName) {
                    if (this.onsetPoint.indexOf(iterator) == -1) {
                        this.onsetPoint.push(iterator);
                    }
                }
            }
        }
    },
    /**
     * 计算悬挂泡泡
     */
    suspension(boot) {
        this.test++;
        //当前所有泡泡坐标
        var popNode = [];
        var quantity = 0;
        //悬挂连接点坐标
        var popSuspension = [];
        //悬挂递归控制
        var popsum = 0;

        if (this.test === 1 || boot) {
            //开始悬挂计算
            for (const iterator of cc.yy.Map_Bg.children) {
                if (iterator.children.length > 0 && iterator.children[0]._objFlags == 0) {
                    if (iterator.children[0].io_y == 0) {
                        popSuspension.push(iterator.name);
                    }
                    popNode.push(iterator.name);
                }
            }
            // 以秒为单位的时间间隔
            var interval = 0.01;
            // 重复次数
            var repeat = popSuspension.length - 1;


            if (repeat == -1) {
                cc.yy.destroyNode.InitSuspension(popNode);
            }
            this.schedule(function () {
                this.suspensionInquire(popSuspension[popsum], popNode);
                popsum++;
                if (popsum == popSuspension.length) {
                    //跳至悬停下落
                    cc.yy.destroyNode.InitSuspension(popNode);
                }
            }, interval, repeat);
        }
    },
    suspensionInquire(name, popNode) {
        if (name == null) {
            return;
        }
        let mapNodeXY = name.split('.');
        let vx = mapNodeXY[1] * 1;
        let vy = mapNodeXY[0] * 1;
        let vxy = [];
        if (vy % 2 === 0) {
            vxy.push((vy - 1) + '.' + (vx - 1));
            vxy.push((vy - 1) + '.' + (vx));
            vxy.push((vy) + '.' + (vx - 1));
            vxy.push((vy) + '.' + (vx + 1));
            vxy.push((vy + 1) + '.' + (vx - 1));
            vxy.push((vy + 1) + '.' + (vx));
        } else {
            vxy.push((vy - 1) + '.' + (vx));
            vxy.push((vy - 1) + '.' + (vx + 1));
            vxy.push((vy) + '.' + (vx - 1));
            vxy.push((vy) + '.' + (vx + 1));
            vxy.push((vy + 1) + '.' + (vx));
            vxy.push((vy + 1) + '.' + (vx + 1));
        }
        let correct = [];
        for (const iterator of vxy) {
            let indexnub = popNode.indexOf(iterator);
            if (indexnub != -1) {
                correct.push(iterator);
                popNode.splice(indexnub, 1);
            }
        }
        if (correct.length > 0) {
            for (const iterator of correct) {
                this.suspensionInquire(iterator, popNode);
            }
        }
    },
    /**
     * 获取区域元素
     * @param {需要获取环内元素的坐标名称} name 
     * @param {需要获取的元素范围1代表一环} nub 
     */
    region(name, cd) {
        this.NodeData = [];
        this.NodeName = [];
        this.NodeShowName = name.split('.');
        this.regionVice(name, 0, cd);
        return this.NodeData;
    },
    /**
     * 获取区域元素子方法
     * @param {*} name 
     * @param {*} nub 
     * @param {*} cd 
     */
    regionVice(name, nub, cd) {
        if (name == null) {
            return;
        }
        //1代表只循环一次
        if (nub > cd) {
            return;
        }
        let mapNodeXY = name.split('.');
        let vx = mapNodeXY[1] * 1;
        let vy = mapNodeXY[0] * 1;
        let vxy = [];
        if (vy % 2 === 0) {
            vxy.push((vy - 1) + '.' + (vx - 1));
            vxy.push((vy - 1) + '.' + (vx));
            vxy.push((vy) + '.' + (vx - 1));
            vxy.push((vy) + '.' + (vx + 1));
            vxy.push((vy + 1) + '.' + (vx - 1));
            vxy.push((vy + 1) + '.' + (vx));
        } else {
            vxy.push((vy - 1) + '.' + (vx));
            vxy.push((vy - 1) + '.' + (vx + 1));
            vxy.push((vy) + '.' + (vx - 1));
            vxy.push((vy) + '.' + (vx + 1));
            vxy.push((vy + 1) + '.' + (vx));
            vxy.push((vy + 1) + '.' + (vx + 1));
        }
        let correct = [];
        for (let index = 0; index < vxy.length; index++) {
            let keyNub = this.NodeName.indexOf(vxy[index]);
            if (keyNub == -1) {
                let showNode = cc.yy.Map_Bg.getChildByName(vxy[index]);
                if (showNode != null) {
                    if (showNode.children[0] != undefined) {
                        correct.push(showNode.name);
                        this.NodeName.push(showNode.name);
                        //这里的if判断需优化算法
                        let ps_vx = vxy[index].split('.')[1];
                        if (nub >= 1 && ps_vx == this.NodeShowName[1]) {
                            this.NodeData.push([showNode.children[0], 6]);
                        } else {
                            this.NodeData.push([showNode.children[0], index]); //showNode.children[0]///showNode.name
                        }
                    }
                }
            }
        }
        for (const iterator of correct) {
            this.regionVice(iterator, nub + 1, cd);
        }
    },
    /**
     * 计算消一行的数据
     * @param {节点} name 
     */
    straight_Line(name) {
        let mapNodeXY = name.split('.');
        let vy = mapNodeXY[0] * 1;
        var straightData = [];
        var lengthnub = 0;
        if (vy % 2 === 0) {
            lengthnub = 11;
        } else {
            lengthnub = 10;
        }
        for (let index = 0; index < lengthnub; index++) {
            straightData.push([vy, index]);
        }
        return straightData;
    },
    /**
     * 单线探测同类元素模式
     */
    smart_match(name) {
        this.onsetPoint = [];
        var onsetPoint = [];
        let mapNodeXY = name.split('.');
        let vy = mapNodeXY[0] * 1;
        let vx = mapNodeXY[1] * 1;
        let pasNodeData = this.region(name, 0);

        for (const iterator of pasNodeData) {
            this.init(iterator[0]._parent);
        }

        for (let iter of this.onsetPoint) {


            onsetPoint.push(iter.split('.'));

        }
        return onsetPoint;
    },











});
var Select = new Select();
module.exports = Select;