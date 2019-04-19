cc.Class({
    extends: cc.Component,

    properties: {
        animation: cc.Node,
        rank:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        
        if (!cc.yy) {
            cc.yy = require("Global");
            SdkManager.init();
        }
    },

    start() {

    },
    onButtonEvent(event) {
        var self = this;

        switch (event.currentTarget.name) {
            case "wjms":
                cc.director.preloadScene("OnGame", function () {
                    self.animation.active = true;
                });
                break;
            case "music":
                console.log(event.currentTarget.name);
                break;
            case "ranking":
                
                let item = cc.instantiate(this.rank);
                    this.node.addChild(item);
                break;
        }
        // cc.director.loadScene("OnGame");
    }
});