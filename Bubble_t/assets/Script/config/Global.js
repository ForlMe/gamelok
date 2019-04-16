module.exports = {
    //关卡数据配置
    gifts: require('gifts'),
    //统计消除元素
    select: require('Select'),
    //晃动特效
    shake: require('Shake'),
    //预览圈圈
    preview: require('Preview'),
    //背景音乐
    Bgm: require('Bgm'), //cc.yy.Bgm.playSFX('delect.mp3');
    //消除类
    destroyNode: require('DestroyNode'),
    //描线节点移动类
    raysmobile: require('raysMobile'),

    //当前消除下降基数
    whereaboutsNub: 6,


    //头部发射泡泡时防止同是生成两个元素
    TopNodeNoTow: false,
    //GameCanvas
    GameCanvas: null,
    //存储池
    MapNodePool: null, //地图节点
    Emission: null, //射击节点
    Ball: null, //


    //遮罩动画节点
    bgMask: null,

    //地图布局数据
    Map_Bg: [],
    //元素动画屏布局结构
    Bg: [],
    //当前游戏分数

    //当前泡泡数量
    POPOQUANTITY: 30,
    //防止在此点击时发生的错误
    CanvasGameType: true,
    //瞄准线Node
    Rays: null,
    //瞄准线出界时是否发射泡泡
    RaysType: false,

    //无尽模式布局行数
    Endless: 1,
    //子弹发射角度(向量)
    Launch_angle: [],
    //子弹发射角度(角度)
    Launch_Degress: 0,

    //子弹发射速度(预制速度)
    Launch_speed: 1300,
    //消除时间间隔
    EliminateTimeIntervals: 0.15,
    //描线长度
    Line_length: 1500,
    //描线点间距
    Line_spacing: 35,
    //选择描线点模式
    Trace_point_mode: false,
    //是否开启超级描线模式
    //0，普通模式
    //1，超级瞄准线模式
    //2，单线探测物体模式
    //3，单线探测物体穿透模式
    //4,单线探测同类元素模式
    //5,单线探测一整行模式
    Trace_point_mode_type: 1,
    //超级瞄准线扫描到的数据
    Trace_point_mode_Data: [],
    //临时存储上次描线状态
    Trace_point_mode_num: 0,













    //test
    TEST: [],
    moveSpeed_g: 0.2,
    moveSpeed_c: 0.2,












};