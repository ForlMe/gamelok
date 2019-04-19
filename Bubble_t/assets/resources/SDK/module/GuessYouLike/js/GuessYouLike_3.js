

cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        var data = [];

        var k = 0;
        for(var i = 0;i < wxData.moreGameData.length;i++) {
            if(wxData.moreGameData[i].icon) {
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
        
        var iconPos = [cc.v2(-160,0),cc.v2(0,0),cc.v2(160,0)];
        for(var i = 0;i < childNum && i < 3;i++) {
            var icon = cc.instantiate(this.icon);
            this.node.addChild(icon);
            icon.setPosition(iconPos[i%4]);
            icon.getChildByName('icon').getComponent('moreGame').setData(data[i].icon,data[i].image,data[i].jumpType,data[i].jumpData,3,i+1);//
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
