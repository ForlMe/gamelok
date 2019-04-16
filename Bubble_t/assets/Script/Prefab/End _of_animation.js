
cc.Class({
    extends: cc.Component,
    properties: {
    },
    init(){
        this.node._parent.destroy();
    },
    desNode(){
        this.node.destroy();
    },
    end(){
        this.node.active = false;
    }
});
