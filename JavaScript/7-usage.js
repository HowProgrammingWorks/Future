'use strict';

const fs = require('node:fs');

class Future {
  #executor;

  constructor(executor) {
    this.#executor = executor;
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
    this.#executor(successed, failed);
  }
}

// Usage

const futureFile = (name) =>
  new Future((resolve, reject) => {
    fs.readFile(name, 'utf8', (err, data) => {
      console.log('read');
      if (err) reject(err);
      else resolve(data);
    });
  });

const future = futureFile('7-usage.js');
const size = future.map((x) => x.length);
const lines = future.map((x) => x.split('\n').length);

size.fork((x) => console.log('File size:', x));
lines.fork((x) => console.log('Line count:', x));
