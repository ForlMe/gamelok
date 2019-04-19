
cc.Class({
    extends: cc.Component,

    properties: {
       myNode: cc.Node,
       contentNode: cc.Node,
       icon: cc.Prefab,
       packNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
//600
        this.packNode.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.5 + Math.random() * 0.5),
            cc.rotateBy(0.03,-15),cc.rotateBy(0.03,0),cc.rotateBy(0.03,15),cc.rotateBy(0.03,0),
            cc.rotateBy(0.03,-10),cc.rotateBy(0.03,0),cc.rotateBy(0.03,10),cc.rotateBy(0.03,0),
            cc.rotateBy(0.03,-5),cc.rotateBy(0.03,0),cc.rotateBy(0.03,5),cc.rotateBy(0.03,0)))
        );
        this.close = false;
        var size = cc.winSize.width;
        
        this.endX = -size/2;
        this.begX = -size/2-600;
        this.myNode.x = this.begX;

        this.myNode.runAction(cc.moveTo(0.3,this.endX,0));

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
            this.node.destroy();
            return;
        }
        data = this.shuffle(data);
        var childNum = data.length;

        for(var i = 0;i < childNum;i++) {
            var icon2 = cc.instantiate(this.icon);
            this.contentNode.addChild(icon2);
            icon2.getChildByName('icon').getComponent('moreGame').setData(data[i].iconX,data[i].image,data[i].jumpType,data[i].jumpData,9,i+1);//
        }
        
    },

    callBackClose(){
        if(this.close){
            return;
        }
        this.close = true;
        var self = this;
        this.myNode.runAction(cc.sequence(cc.moveTo(0.3,this.begX,0),cc.callFunc(function(){
            self.node.destroy();
        })));
        
    },
    shuffle: function(array) {
		var input = array;
		for (var i = input.length-1; i >=0; i--) {
            var randomIndex = Math.floor(Math.random()*(i+1)); 
            var itemAtIndex = input[randomIndex]; 
            input[randomIndex] = input[i]; 
            input[i] = itemAtIndex;
		}
		return input;
	},
    // update (dt) {},
});
