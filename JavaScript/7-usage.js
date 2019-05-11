'use strict';

const fs = require('fs');

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

const futureFile = name => new Future((resolve, reject) => {
  fs.readFile(name, 'utf8', (err, data) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(data);
  });
});

const future = futureFile('7-usage.js');
const size = future.map(x => x.length);
const lines = future.map(x => x.split('\n').length);

size.fork(x => console.log('File size:', x));
lines.fork(x => console.log('Line count:', x));
