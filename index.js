'use strict';

const fs = require('fs');
const path = require('path');
const tinify = require('tinify');
const loaderUtils = require('loader-utils');


module.exports = function(content) {
    const callback = this.async();

    this.cacheable && this.cacheable();

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
    let resPath = this.resourcePath;
    console.log(this.resourcePath, content.length);

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
            console.log(err)
            if (err) return callback(null, content);
            console.log(resPath, resultData.length)
            callback(null, resultData);
        });
    }

    requestCompress();

}

module.exports.pitch = function(remainingRequest) {
    let isPng = /\.png$/.test(this.resourcePath);
    if (!isPng) {
        return fs.readFileSync(this.resourcePath);
    }
}