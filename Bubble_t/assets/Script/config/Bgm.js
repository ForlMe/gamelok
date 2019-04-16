module.exports = {
    _init() {
        var self = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            self.pauseAll();
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {
            self.resumeAll();
        });
    },

    playBGM(url) {
        // var bgm_type = cc.sys.localStorage.getItem("BGM_type");
        // if(bgm_type != 'N'){
            cc.audioEngine.stopAll();
            var audioUrl = cc.url.raw("resources/audio/" + url);
            console.log(audioUrl);
            cc.audioEngine.play(audioUrl, true, 1.0);
        // }
    },
    playSFX(url) {
        // var bgm_type = cc.sys.localStorage.getItem("BGM_type");
        
        // if(bgm_type != 'N'){
            var audioUrl = cc.url.raw("resources/audio/" + url);
            
            cc.audioEngine.play(audioUrl, false, 1.0);
        //}
    },

    pauseAll() {
        cc.audioEngine.pauseAll();
    },
    stopAll(){
        cc.audioEngine.stopAll();
    },
    resumeAll() {
        cc.audioEngine.resumeAll();
    },
    playUncache(){
        cc.audioEngine.uncacheAll();

    },
};