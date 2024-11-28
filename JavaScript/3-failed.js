'use strict';

const future = (executor) => ({
  chain(fn) {
    return future((resolve, reject) =>
      this.fork(
        (value) => fn(value).fork(resolve),
        (error) => reject(error),
      ),
    );
  },

  map(fn) {
    return this.chain((value) => future.of(fn(value)));
  },

  fork(successed, failed) {
    executor(successed, failed);
    return this;
  },
});

future.of = (value) => future((resolve) => resolve(value));

// Usage

future((resolve, reject) => reject(new Error('Rejected')))
  .map((x) => {
    console.log('future1 started');
    return x;
  })
  .map((x) => ++x)
  .map((x) => x ** 3)
  .fork(
    (value) => {
      console.log('future result', value);
    },
    (error) => {
      console.log('future failed', error.message);
    },
  );
