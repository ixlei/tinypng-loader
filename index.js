'use strict';

const tinify = require('tinify');
const loaderUtils = require('loader-utils');
const fs = require('fs');

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

    content = fs.readFileSync(this.resourcePath);
    console.log(content.length)

    function requestCompress() {
        tinify.fromBuffer(content).toBuffer(function(err, resultData) {
            if (err && err.status >= 400 && err.status < 500) {
                if (selectedKeys.length == keys.length) {
                    return callback(null, content);
                }
                do {
                    let key = keys[parseInt(Math.random() * keys.length)];
                } while (selectedKeys.indexOf(key) == -1)
                selectedKeys.push(key);
                tinify.key = key;
                requestCompress();
            }
            if (err) return callback(null, content);
            console.log(resultData.length)
            callback(null, resultData);
        });
    }

    requestCompress();

}