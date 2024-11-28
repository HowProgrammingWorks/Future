'use strict';

const id = (x) => x;

const future = (value) => {
  let mapper = null;

  const instance = {};

  const map = (fn) => {
    mapper = fn;
    return future(instance);
  };

  const fork = (successed) => {
    const finish = (product) => {
      const transform = mapper ?? id;
      const result = transform(product);
      if (successed) successed(result);
    };
    if (value.fork) return void value.fork(finish);
    finish(value);
  };

  return Object.assign(instance, { map, fork });
};

// Usage

const future1 = future(5)
  .map((x) => {
    console.log('future1 started');
    return x;
  })
  .map((x) => ++x)
  .map((x) => x ** 3)
  .map((x) => {
    console.log('future1 result', x);
  });

console.dir({ future1 });
//future1.fork();

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
