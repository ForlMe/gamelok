cc.Class({
    extends: cc.Component,
    properties: {
        boots: false,
        show_a: cc.Node,
        show_b: cc.Node,
    },
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
        this.node.on(cc.Node.EventType.CHILD_REMOVED, this.addNode, this);

    },
    start() {
        this.scheduleOnce(function () {
            this.nodeTypes('a');
            this.nodeTypes('b');
        });
    },
    //更换子弹
    addNode(res) {
        var self = this;
        if (this.boots) {
            this.boots = false;
            return;
        }
        let show_b = this.show_b.getChildByName('emission');


        if (show_b != null) {

            var bezier = [cc.v2(0, 0), cc.v2(-150, 160), cc.v2(-195, 0)];
            this.scheduleOnce(function () {
                show_b.runAction(
                    cc.sequence(cc.bezierBy(0.4, bezier),
                        cc.callFunc(function () {
                            show_b.setParent(self.node);
                            show_b.x = 0;
                            show_b.y = 0;
                        })));
            });
        }


        this.scheduleOnce(function (){

            self.nodeTypes('b');

        },0.4);
        


    },
    //点击触发事件
    onButton() {
        var self = this;
        this.boots = true;
        let show_b = this.show_b.getChildByName("emission");

        if (show_b.getNumberOfRunningActions() > 0) {
            return;
        }
        if (show_b != null) {
            let show_a = this.show_a.getChildByName('emission');
            var bezier = [cc.v2(0, 0), cc.v2(-150, 160), cc.v2(-195, 0)];
            this.scheduleOnce(function () {
                show_b.runAction(
                    cc.sequence(cc.bezierBy(0.5, bezier),
                        cc.callFunc(function () {

                            show_b.setParent(self.show_a);
                            show_b.x = 0;
                            show_b.y = 0;
                        })));
            });
            this.scheduleOnce(function () {
                show_a.runAction(
                    cc.sequence(cc.moveBy(0.1, cc.v2(0, -10)),
                        cc.callFunc(function () {
                            show_a.setParent(self.show_b);
                            show_a.x = 0;
                            show_a.y = 0;
                        })));
            }, 0.3);
        }
    },
    //生成子弹方法
    nodeTypes(name) {
        switch (name) {
            case 'a':
                if (cc.yy.Emission.size() > 0) {
                    let random = Math.floor(Math.random() * 5 + 1);
                    var item = cc.yy.Emission.get(random);
                    item.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                    item.x = 0;
                    item.y = 0;

                    this.show_a.addChild(item);
                } else {
                    console.log('预制节点用没了');
                }
                break;
            case 'b':
                if (cc.yy.Emission.size() > 0) {
                    let random = Math.floor(Math.random() * 5 + 1);
                    var item = cc.yy.Emission.get(random);
                    item.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                    item.x = 0;
                    item.y = 0;

                    this.show_b.addChild(item);
                } else {
                    console.log('预制节点用没了');
                }
                break;
        }
    },
});