

cc.Class({
    extends: cc.Component,

    properties: {
        packNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.packNode.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.5 + Math.random() * 0.5),
            cc.rotateBy(0.03,-15),cc.rotateBy(0.03,0),cc.rotateBy(0.03,15),cc.rotateBy(0.03,0),
            cc.rotateBy(0.03,-10),cc.rotateBy(0.03,0),cc.rotateBy(0.03,10),cc.rotateBy(0.03,0),
            cc.rotateBy(0.03,-5),cc.rotateBy(0.03,0),cc.rotateBy(0.03,5),cc.rotateBy(0.03,0)))
        );
    },

    callBack(){
        var self = this;
        cc.loader.loadRes('SDK/module/RecommendGame/Recommend_dialog',function(err,res){
			var node = cc.instantiate(res); 
            var fNode = cc.find('Canvas');
            var fNodeSize = fNode.scale;
            fNode.addChild(node,999);  
            node.scale = 1 / fNodeSize; 
        })
    },

    // update (dt) {},
});
