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

Future.of(6)
  .map(x => {
    console.log('future1 started');
    return x;
  })
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
