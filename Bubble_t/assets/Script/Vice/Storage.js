var Storage = cc.Class({
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
    init(nodeData) {},
    /**
     * 读取
     * @param {*} name 
     */
    GetData(name) {
        var userData = cc.sys.localStorage.getItem(name);

        if(userData){
            userData = JSON.parse(userData);
        }else{
            userData = null;
        }
        return userData;
    },
    /**
     * 写入
     * @param {*} name 
     * @param {*} data 
     */
    SetData(name, data) {

        if (!data) {
            var data = [];
            /**
             * 这里用来写存储数据逻辑
             */
            for (const iterator of cc.yy.Map_Bg.children) {
                if (iterator.children.length > 0) {
                    data.push([iterator.name, iterator.children[0].tags]);
                }
            }
        }

        let databes = {
            LevelData: data, //游戏布局数据
            fraction: cc.yy.GameCanvas.getComponent('OnGame').integral.string, //游戏分数
            whereaboutsNub: cc.yy.whereaboutsNub, //游戏下降基数
        };
        cc.sys.localStorage.setItem(name, JSON.stringify(databes));
    },

    delete(name) {
        cc.sys.localStorage.removeItem(name);
    },

});
/**
 * 晃动类
 */
var Storage = new Storage();
module.exports = Storage;