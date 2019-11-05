const p1 = new Promise((resolve, reject) => {
    console.log("p1");
    setTimeout(() => {
        console.log("p1异步执行");
        resolve({time: 3000});
    }, 3000)
});

const p2 = new Promise((resolve, reject) => {
    console.log("p2");
    setTimeout(() => {
        console.log("p2异步执行");
        reject(new Error("p2出错"))
    }, 2000)
});

const p3 = new Promise((resolve, reject) => {
    console.log("p3");
    setTimeout(() => {
        console.log("p3异步执行");
        resolve({time: 1000});
    }, 1000)
});

const p = Promise.all([p1, p2, p3]);

p.then((value)=>{
    console.log("resolve总处理：");
    console.log(value)
}).catch((e) => {
    console.log("有一个程序抛出了异常");
    console.log(e);
});
