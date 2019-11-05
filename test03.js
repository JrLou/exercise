class IncreasingCounter {
    get value() {
        console.log('Getting the current value!');
        return this._count;
    }
    increment() {
        this._count++;
    }
}

let a = new IncreasingCounter();

export {a as b}
