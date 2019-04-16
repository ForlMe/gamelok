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



        switch (nodeData[1]) {

            /**位置布局
             * 0--1--2
             * 3-- --4
             * 5--6--7    
             */
            case 0:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, -5, 5),
                    cc.moveBy(0.2, 5, -5),
                    cc.moveBy(0.2, -3, 3),
                    cc.moveBy(0.2, 3, -3),
                    cc.moveBy(0.2, -1, 1),
                    cc.moveBy(0.2, 1, -1),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 1:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, 5, 5),
                    cc.moveBy(0.2, -5, -5),
                    cc.moveBy(0.2, 3, 3),
                    cc.moveBy(0.2, -3, -3),
                    cc.moveBy(0.2, 1, 1),
                    cc.moveBy(0.2, -1, -1),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 2:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, -5, 0),
                    cc.moveBy(0.2, 5, 0),
                    cc.moveBy(0.2, -3, 0),
                    cc.moveBy(0.2, 3, 0),
                    cc.moveBy(0.2, -1, 0),
                    cc.moveBy(0.2, 1, 0),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 3:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, 5, 0),
                    cc.moveBy(0.2, -5, 0),
                    cc.moveBy(0.2, 3, 0),
                    cc.moveBy(0.2, -3, 0),
                    cc.moveBy(0.2, 1, 0),
                    cc.moveBy(0.2, -1, 0),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 4:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, -5, -5),
                    cc.moveBy(0.2, 5, 5),
                    cc.moveBy(0.2, -3, -3),
                    cc.moveBy(0.2, 3, 3),
                    cc.moveBy(0.2, -1, -1),
                    cc.moveBy(0.2, 1, 1),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 5:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, 5, -5),
                    cc.moveBy(0.2, -5, 5),
                    cc.moveBy(0.2, 3, -3),
                    cc.moveBy(0.2, -3, 3),
                    cc.moveBy(0.2, 1, -1),
                    cc.moveBy(0.2, -1, 1),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 6:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, 0, 5),
                    cc.moveBy(0.2, 0, -5),
                    cc.moveBy(0.2, 0, 3),
                    cc.moveBy(0.2, 0, -3),
                    cc.moveBy(0.2, 0, 1),
                    cc.moveBy(0.2, 0, -1),
                    cc.callFunc(function () {
                        if (nodeData[0].runType != 0) {
                            nodeData[0].x = 0;
                            nodeData[0].y = 0;
                        }
                    })));
                break;
            case 7:
                nodeData[0].runAction(cc.sequence(
                    cc.moveBy(0.2, -5, 5),
                    cc.moveBy(0.2, 5, -5),
                    cc.moveBy(0.2, -3, 3),
                    cc.moveBy(0.2, 3, -3),
                    cc.moveBy(0.2, -1, 1),
                    cc.moveBy(0.2, 1, -1),
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