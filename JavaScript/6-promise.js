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

  promise() {
    return new Promise((resolve, reject) => {
      this.fork(
        value => resolve(value),
        error => reject(error),
      );
    });
  }
}

// Usage

(async () => {
  const value = await Future.of(6)
    .map(x => {
      console.log('future1 started');
      return x;
    })
    .map(x => ++x)
    .map(x => x ** 3)
    .promise();

  console.log('result', value);
})();
