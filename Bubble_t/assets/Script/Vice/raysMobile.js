var raysMobile = cc.Class({
    extends: cc.Component,
    properties: {

    },

    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
        this.onRays = cc.yy.Rays;
    },
    init() {
        this.onRays = cc.yy.Rays.children;

        // for (let index = 0; index < this.onRays.length; index++) {
        //     const element = this.onRays[index];
        //         if(this.onRays[index+1] != undefined){
        //             console.log(element.position);
        //             let elev2 = element.position.add(element.vector);
        //             element.runAction(
        //                 cc.sequence(cc.moveTo(0.2,elev2),
        //                     cc.callFunc(function () {
                        
        //                     })));

             
        //         }
                
        // }   





    },


    // update (dt) {},
});
/**
 * 描线移动类
 */
var raysMobile = new raysMobile();
module.exports = raysMobile;