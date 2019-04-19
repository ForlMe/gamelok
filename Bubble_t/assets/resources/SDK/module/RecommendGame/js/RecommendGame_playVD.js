
cc.Class({
    extends: cc.Component,

    properties: {
        contentNode: cc.Node,
        icon: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    setData(callBack = null){
        this._callBack = callBack;
    },
    start () {
        var data = [];
        var k = 0;
        for(var i = 0;i < wxData.moreGameData.length;i++) {
            if(wxData.moreGameData[i].iconX) {
                data[k] = wxData.moreGameData[i];
                k++;
            }else{
            }
        }
        if(data.length <= 0) {
            this.removeSelf(0);
            return;
        }
        var childNum = parseInt(Math.random() * data.length);

        this.icon2 = cc.instantiate(this.icon);
        this.contentNode.addChild(this.icon2);
        this.icon2.getChildByName('icon').getComponent('moreGame').setData(data[childNum].iconX,data[childNum].image,data[childNum].jumpType,data[childNum].jumpData,8,1);//
    },
    callBackClose(){
        this.removeSelf(0);
    },
    callBackTiYan(){
        this.time = parseInt(getTime()/1000);
        if (!cc.director.getScheduler().isScheduled(this.updataTime, this)){
            this.schedule(this.updataTime,1);
        }
        this.icon2.getChildByName('icon').getComponent('moreGame').callBack();
    },

    updataTime(){
        var time2 = parseInt(getTime()/1000);
        if(time2 - this.time >= 30) {
            //成功
            this.removeSelf(1);
        }
    },

    removeSelf(type){
        if(this._callBack){
            this._callBack(type);
        }
        this.node.destroy();
    },
});
