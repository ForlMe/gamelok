

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.upSpriteTexture();
    },

    start () {
        
    },
    upSpriteTexture(){
        if(!lieyou.Language_ch)
        {
            var self = this;
            cc.loader.loadRes("en/en", cc.SpriteAtlas, function (err, atlas) {
                var url = self.node.getComponent(cc.Sprite).spriteFrame._name;//路径
                var frame = atlas.getSpriteFrame(url);
                self.node.getComponent(cc.Sprite).spriteFrame = frame;
            });
        }
    },

    // update (dt) {},
});
