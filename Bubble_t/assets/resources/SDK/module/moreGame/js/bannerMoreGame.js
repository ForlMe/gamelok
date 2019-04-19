
cc.Class({
    extends: cc.Component,

    properties: {
        bigNode: cc.Node,
        smallNode: cc.Node,
        icon: cc.Prefab,
    },

   

    start () {
        this.bigNode.scale = lieyou._SceneScale;
        this.smallNode.scale = lieyou._SceneScale;
        var fNode = cc.find('Canvas');
        var fNodeSize = fNode.scale;
        this.node.scale = 1 / fNodeSize;


        this.addIcon();
    },
    addIcon(){
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
        var iconPos = [cc.v2(-270,90),cc.v2(-90,90),cc.v2(90,90),cc.v2(270,90)];
        for(var i = 0;i < childNum && i < 4;i++) {
            var icon = cc.instantiate(this.icon);
            this.bigNode.addChild(icon);
            icon.setPosition(iconPos[i%4]);
            icon.getChildByName('icon').getComponent('bannerMoreGameSmall').setData(this.callBack.bind(this));
            icon.getChildByName('icon').getComponent('moreGame').setData(data[i].iconX,data[i].image,data[i].jumpType,data[i].jumpData,6,i+1);//
        }

        var iconPos2 = [cc.v2(-315,45),cc.v2(-225,45),cc.v2(-135,45),cc.v2(-45,45),
            cc.v2(45,45),cc.v2(135,45),cc.v2(225,45),cc.v2(315,45)];
        for(var i = 0;i < childNum && i < 8;i++) {
            var icon = cc.instantiate(this.icon);
            icon.scale = 0.5;
            this.smallNode.addChild(icon,1);
            icon.setPosition(iconPos2[i%8]);
            icon.getChildByName('icon').getComponent('bannerMoreGameSmall').setData(this.callBack.bind(this));
            icon.getChildByName('icon').getComponent('moreGame').setData(data[i].iconX,data[i].image,data[i].jumpType,data[i].jumpData,7,i+1);//
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
    
    callBack(){
        this.bigNode.active = true;
        this.smallNode.active = false;
    },
    // update (dt) {},
});
