const PackTypeData = {
    Java:[
        {
            title:'javac',
            value:'javac',
        },
        {
            title:'maven',
            value:'maven',
        },
    ],
    NodeJs:[
        {
            title:'npm webpack',
            value:'npm webpack',
        },
    ],
    Golang:[
        {
            title:'go build',
            value:'go build',
        },
    ],
    Python:[
        {
            title:'None',
            value:'None',
        },
    ],
};

const StartTypeData = {
    Java:[
        {
            title:'jar',
            value:'jar',
        },
        {
            title:'war',
            value:'war',
        },
    ],
    NodeJs:[
        {
            title:'node npm',
            value:'node npm',
        },
        {
            title:'pm2',
            value:'pm2',
        },
    ],
    Golang:[
        {
            title:'go',
            value:'go',
        },
    ],
    Python:[
        {
            title:'python',
            value:'python',
        },
    ],
};

const BaseInfoConfig = {};

const StepList = [
    {title: "填写应用基础信息", errTitle: '应用基础信息错误',},
    {title: "填写打包参数", errTitle: '打包参数错误'},
    {title: "填写应用详细参数", errTitle: '应用详细参数错误'},
    {title: "完成", errTitle: '失败'},
];

module.exports = {PackTypeData,StartTypeData,StepList};