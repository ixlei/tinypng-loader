'use strict';

const tinify = require('tinify');
const loaderUtils = require('loader-utils');

module.exports = function(content) {
    this.cacheable && this.cacheable();
    const callback = this.async();

    const selectedKeys = [];

    const options = loaderUtils.getOptions(this);

    const { keys, proxy } = options;

    if (!keys || !Array.isArray(keys) || keys.length == 0) {
        callback(new Error('tinypng need key'));
        return;
    }

    if (proxy) {
        tinify.proxy = proxy;
    }
    if (typeof keys == 'string') {
        tinify.key = keys;
        selectedKeys.push(keys);
    } else {
        let key = keys[parseInt(Math.random() * keys.length)];
        selectedKeys.push(key);
        tinify.key = key;
    }

    content = Buffer.from(content, 'utf8');
    tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
        if (err) return callback(err);
        callback(resultData.toString('utf8'));
    });
}