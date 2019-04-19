
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

   

    start () {
        
    },
    setData(callBack){
        this._callBack = callBack;
    },

    callBack(){
        if(this._callBack){
            this._callBack();
        }
        this.node.getComponent('moreGame').callBack();
    },

    // update (dt) {},
});
