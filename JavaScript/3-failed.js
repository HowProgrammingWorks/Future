'use strict';

const future = value => {
  let mapper = null;
  return {
    map(fn) {
      mapper = fn;
      return future(this);
    },
    fork(successed, failed) {
      const finish = res => {
        if (res instanceof Error) {
          if (failed) failed(res);
          return;
        }
        const result = mapper ? mapper(res) : res;
        if (result instanceof Error) {
          if (failed) failed(result);
          return;
        }
        successed(result);
      };
      if (value.fork) {
        value.fork(finish, failed);
        return;
      }
      finish(value, failed);
    }
  };
};

// Usage

future(5)
  .map(x => {
    console.log('future1 started');
    return x;
  })
  //.map(x => x % 2 === 0 ? x : new Error('odd value'))
  .map(x => ++x)
  .map(x => x ** 3)
  .fork(
    value => {
      console.log('future result', value);
    },
    error => {
      console.log('future failed', error.message);
    }
  );
