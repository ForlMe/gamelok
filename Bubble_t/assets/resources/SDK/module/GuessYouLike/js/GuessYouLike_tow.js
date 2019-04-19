

cc.Class({
    extends: cc.Component,

    properties: {
        contentChild: cc.Prefab,
        icon: cc.Prefab,
        pageView: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
        var data = [];
        var k = 0;
        for(var i = 0;i < wxData.moreGameData.length;i++) {
            if(wxData.moreGameData[i].iconX) {
                data[k] = wxData.moreGameData[i];
                k++;
            }
        }
        if(data.length <= 0) {
            this.node.destroy();
            return;
        }
        

        data = this.shuffle(data);

        var childNum = data.length;
        // var contentChildNum = parseInt((childNum - 1) / 8) + 1;
        // var contentChild = [];
        // for(var i = 0;i < contentChildNum;i++) {
        //     contentChild[i] = cc.instantiate(this.contentChild);
        //     this.pageView.addPage(contentChild[i]);
        // }
        var iconPos = [cc.v2(-165,60),cc.v2(-55,60),cc.v2(55,60),cc.v2(165,60),cc.v2(-165,-50),cc.v2(-55,-50),cc.v2(55,-50),cc.v2(165,-50)];
        for(var i = 0;i < childNum && i < 8;i++) {
            var icon = cc.instantiate(this.icon);
            this.pageView.addChild(icon);
            icon.setPosition(iconPos[i%8]);

            // icon.getComponent('iconTouch').setData(data[i].iconX,data[i].jumpData);
            icon.getChildByName('icon').getComponent('moreGame').setData(data[i].iconX,data[i].image,data[i].jumpType,data[i].jumpData,4,i+1);//
        }
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
