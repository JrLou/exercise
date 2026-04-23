import {io} from 'socket.io-client';    //version 3.x  only

const EventEmitter = window.require('events');

/**
 * SocketToLocalHelp 可以监听的事件
 * socketConnect：连接成功
 * socketDisconnect：断开连接(主动)
 * missingConnect：失去连接(异常)
 */

class SocketToLocalHelp extends EventEmitter{
    heart = 1000;//发送心跳
    listenHeart = 5000;//监听设备心跳

    constructor() {
        super();

        this.socket = null;//连接句柄
    }

    connect(){
        if (this.socket && this.socket.connected) {
            this.socket.disconnect();
            return;
        }

        this.getSocketIO();
    }

    disconnect(){
        this.socket && this.socket.disconnect();
    }

    //SOCKET连接
    getSocketIO(){
        //连接本地不需要传ip
        this.socket = io({forceNew: false});

        //监听socket事件
        this.socket.on("connect",()=>{
            //启动心跳
            this.startWebHeart();
            this.emit("socketConnect");
        })

        this.socket.on('disconnect', () => {
            log('断开连接...');
            if (this.listenH) {
                clearTimeout(this.listenH);
                this.listenH = null;
            }
            this.emit("socketDisconnect");
        });

        this.socket.on('android_heart', (num) => {
            this.listenHeartAction();
        });
    }

    //发送心跳
    startWebHeart() {
        this.sendHeart = setInterval(() => {
            if (this.socket && this.socket.connected) {
                this.socket.emit('web_heart', 1);
            } else {
                clearTimeout(this.sendHeart);
            }
        }, this.heart)
    }

    //监听安卓心跳
    listenHeartAction() {
        if (this.listenH) {
            clearTimeout(this.listenH);
            this.listenH = null;
        }
        this.listenH = setTimeout(() => {
            log("socket失去连接");
            this.emit("missingConnect","socket失去连接");
        }, this.listenHeart)
    }

}

export default SocketToLocalHelp;