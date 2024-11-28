'use strict';

const fs = require('node:fs');

class Future {
  constructor(executor) {
    this.executor = executor;
  }

  static of(value) {
    return new Future((resolve) => resolve(value));
  }

  chain(fn) {
    return new Future((resolve, reject) =>
      this.fork(
        (value) => fn(value).fork(resolve, reject),
        (error) => reject(error),
      ),
    );
  }

  map(fn) {
    return this.chain((value) => Future.of(fn(value)));
  }

  fork(successed, failed) {
    this.executor(successed, failed);
  }
}

const futurify =
  (fn) =>
  (...args) =>
    new Future((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

// Usage

const readFile = (name, callback) => fs.readFile(name, 'utf8', callback);
const futureFile = futurify(readFile);

futureFile('8-futurify.js')
  .map((x) => x.length)
  .fork((x) => console.log('File size:', x));
