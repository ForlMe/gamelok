cc.Class({
    extends: cc.Component,

    properties: {
        recLabel: cc.Label,
    },
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
            e.stopPropagation();
        });
    },
    start() {
        this.reciprocal(5);
    },
    onButtonEvent(event) {
        console.log(event.target.name);
        var self = this;
        
        switch (event.target.name) {
            case 'resurrection':

                SdkManager.share({
                    source: 1,
                    success: function (type) {
                        if (type) {
                            self.node.active = false;
                            cc.yy.CanvasGameType = true;
                            self.Nodedestroy();
                        }
                    }
                });
                break;
            case 'roll':
                cc.yy.storage.delete('GameData_w');
                cc.director.loadScene("OnGame");
                break;
        }



    },
    reciprocal(nub) {
        if (nub >= 0) {
            this.scheduleOnce(function () {
                this.recLabel.string = nub;
                this.reciprocal(nub - 1);
            }, 1);
        } else {
            console.log('计时结束！');
        }
    },
    Nodedestroy(){
        for (const iterator of cc.yy.Map_Bg.children) {
            if (iterator.io_y >7) {
                if (iterator.children.length != 0) {
                    for (const ts of iterator.children) {
                        ts.destroy();
                    }
                }
            }
        }
            // cc.yy.storage.SetData('GameData_w');
    },








});