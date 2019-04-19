var Shake = cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
    },
    /**
     * 入口函数
     * @param {*} node 
     */
    init(nodeData) {
        var p1 = 5;
        var p2 = 3;
        var p3 = 1;
                //添加抖动节点
                cc.yy.ShakeNode.push(nodeData[0]);

        switch (nodeData[1]) {

            /**位置布局
             * 0--1--2
             * 3-- --4
             * 5--6--7    
             */
            case 0:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, -p1, p1),
                    cc.moveBy(0.2, p1, -p1),
                    cc.moveBy(0.2, -p2, p2),
                    cc.moveBy(0.2, p2, -p2),
                    cc.moveBy(0.2, -p3, p3),
                    cc.moveBy(0.2, p3, -p3),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 1:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, p1, p1),
                    cc.moveBy(0.2, -p1, -p1),
                    cc.moveBy(0.2, p2, p2),
                    cc.moveBy(0.2, -p2, -p2),
                    cc.moveBy(0.2, p3, p3),
                    cc.moveBy(0.2, -p3, -p3),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 2:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, -p1, 0),
                    cc.moveBy(0.2, p1, 0),
                    cc.moveBy(0.2, -p2, 0),
                    cc.moveBy(0.2, p2, 0),
                    cc.moveBy(0.2, -p3, 0),
                    cc.moveBy(0.2, p3, 0),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 3:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, p1, 0),
                    cc.moveBy(0.2, -p1, 0),
                    cc.moveBy(0.2, p2, 0),
                    cc.moveBy(0.2, -p2, 0),
                    cc.moveBy(0.2, p3, 0),
                    cc.moveBy(0.2, -p3, 0),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 4:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, -p1, -p1),
                    cc.moveBy(0.2, p1, p1),
                    cc.moveBy(0.2, -p2, -p2),
                    cc.moveBy(0.2, p2, p2),
                    cc.moveBy(0.2, -p3, -p3),
                    cc.moveBy(0.2, p3, p3),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 5:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, p1, -p1),
                    cc.moveBy(0.2, -p1, p1),
                    cc.moveBy(0.2, p2, -p2),
                    cc.moveBy(0.2, -p2, p2),
                    cc.moveBy(0.2, p3, -p3),
                    cc.moveBy(0.2, -p3, p3),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 6:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, 0, p1),
                    cc.moveBy(0.2, 0, -p1),
                    cc.moveBy(0.2, 0, p2),
                    cc.moveBy(0.2, 0, -p2),
                    cc.moveBy(0.2, 0, p3),
                    cc.moveBy(0.2, 0, -p3),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 7:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, -p1, p1),
                    cc.moveBy(0.2, p1, -p1),
                    cc.moveBy(0.2, -p2, p2),
                    cc.moveBy(0.2, p2, -p2),
                    cc.moveBy(0.2, -p3, p3),
                    cc.moveBy(0.2, p3, -p3),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
        }

    },


});
/**
 * 晃动类
 */
var Shake = new Shake();
module.exports = Shake;