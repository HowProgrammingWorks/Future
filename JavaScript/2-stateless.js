'use strict';

const future = (executor) => ({
  chain(fn) {
    return future((resolve) => this.fork((value) => fn(value).fork(resolve)));
  },

  map(fn) {
    return this.chain((value) => future.of(fn(value)));
  },

  fork(successed) {
    executor(successed);
    return this;
  },
});

future.of = (value) => future((resolve) => resolve(value));

// Usage

const future1 = future((r) => r(5))
  .map((x) => {
    console.log('future1 started');
    return x;
  })
  .map((x) => ++x)
  .map((x) => x ** 3)
  .fork((x) => {
    console.log('future1 result', x);
  });

console.dir({ future1 });

const promise1 = Promise.resolve(6)
  .then((x) => {
    console.log('promise1 started');
    return x;
  })
  .then((x) => ++x)
  .then((x) => x ** 3)
  .then((x) => {
    console.log('promise1 result', x);
  });

console.dir({ promise1 });
