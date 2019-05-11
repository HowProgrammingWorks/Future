'use strict';

class Future {
  constructor(executor) {
    this.executor = executor;
  }

  static of(value) {
    return new Future(resolve => resolve(value));
  }

  chain(fn) {
    return new Future((resolve, reject) => this.fork(
      value => fn(value).fork(resolve, reject),
      error => reject(error),
    ));
  }

  map(fn) {
    return this.chain(value => Future.of(fn(value)));
  }

  fork(successed, failed) {
    this.executor(successed, failed);
  }
}

// Usage

const f1 = Future.of(6);
const f2 = f1.map(x => ++x);
const f3 = f2.map(x => x ** 3);
const f4 = f1.map(x => x * 2);

f1.fork(x => console.log('f1 fork1', x));
f1.fork(x => console.log('f1 fork2', x));
f2.fork(x => console.log('f2 fork1', x));
f2.fork(x => console.log('f2 fork2', x));
f3.fork(x => console.log('f3 fork1', x));
f3.fork(x => console.log('f3 fork2', x));
f4.fork(x => console.log('f4 fork1', x));
f4.fork(x => console.log('f4 fork2', x));

console.log('\nChange initial value of chain:');
{
  const source = r => r(source.value);
  source.value = 2;

  const f1 = new Future(source)
    .map(x => ++x)
    .map(x => x ** 3)
    .map(x => x * 2);

  f1.fork(x => console.log('fork1', x));
  source.value = 3;
  f1.fork(x => console.log('fork2', x));
  source.value = 4;
  f1.fork(x => console.log('fork3', x));
  source.value = 5;
  f1.fork(x => console.log('fork4', x));
}
