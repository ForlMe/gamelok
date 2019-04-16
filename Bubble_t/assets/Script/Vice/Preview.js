var Preview = cc.Class({
    extends: cc.Component,
    properties: {
        jk: [],
    },
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
    },
    /**
     * 预览效果
     * @param {为计算过的位置名称数组} node 
     */
    init(nodeName) {
        let bg = cc.yy.Bg;
        if (this.jk.length > 0) {
            for (const iterator of this.jk) {
                let node = bg.getChildByName(iterator[0] + '.' + iterator[1]);
                if (node) {
                    let nodeChildren = node.children[0];
                    if (nodeChildren) {
                        nodeChildren.active = false;
                    }
                }
            }
            this.jk = [];
        }
        for (const iterator of nodeName) {
            this.jk.push(iterator);
            let node = bg.getChildByName(iterator[0] + '.' + iterator[1]);

            if(!node){
                console.log(bg);
            }
            if (node) {
                let nodeChildren = node.children[0];
                if (nodeChildren) {
                    nodeChildren.active = true;
                }
            }
        }
    },
    /**
     * 探测物体模式
     */
    probe(vx, vy, type) {
        let name = vy + '.' + vx;
        let arrData = [];
        switch (type) {
            case 2:
                var data = cc.yy.select.region(name, 1);
                if (data != null) {
                    for (const iterator of data) {
                        arrData.push([iterator[0]._parent.io_y, iterator[0]._parent.io_x]);
                    }
                }
                break;
            case 4:
                var data = cc.yy.select.smart_match(name);
                for (const iterator of data) {
                    if (data != null) {
                        arrData.push([iterator[0]/1, iterator[1]/1]);
                    } 
                }
                break;
            case 5:
                var data = cc.yy.select.straight_Line(name);
                if (data != null) {
                    arrData = data;
                }
                break;
        }
        arrData.push([vy, vx]);
        cc.yy.Trace_point_mode_Data = arrData;
        this.init(arrData);
    },
    /**
     * 关闭预览效果
     */
    preDie() {
        let bg = cc.yy.Bg;
        for (const iterator of this.jk) {
            let node = bg.getChildByName(iterator[0] + '.' + iterator[1]);
            if (node) {
                let nodeChildren = node.children[0];
                if (nodeChildren) {
                    nodeChildren.active = false;
                }
            }
        }
        this.jk = [];
    },



    test() {

    },

});
/**
 * 晃动类
 */
var Preview = new Preview();
module.exports = Preview;