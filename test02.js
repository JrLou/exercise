const a = async () => {
    console.log("a1");
    let a1 = await 123;
    console.log(a1);

    console.log("a2");
    let a2 = await new Promise((resolve)=>{
        resolve("a2完成")
    }).then((v) => {
        console.log("await-A");
        return v + "-aA"
    }).then((v) => {
        console.log("await-B");
        return v + "-aB"
    });
    console.log("最终得到p1的结果：");
    console.log(a2);
    return a1 + a2;
};
let c = a();
c.then((v)=>{
    console.log(v);
    return v;
}).then((v)=>{
    console.log(v);
    return v;
});