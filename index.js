'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mkdirp = require('mkdirp');
const tinify = require('tinify');
const loaderUtils = require('loader-utils');

module.exports = function(content) {
    const callback = this.async();
    const options = loaderUtils.getOptions(this);
    let hashName, filePath;
    content = fs.readFileSync(this.resourcePath);

    if (options.cachePath) {
        hashName = crypto.createHash('md5').update(content).digest("hex");
        filePath = path.join(options.cachePath, `${hashName}.png`);
        if (fs.existsSync(filePath)) {
            console.log('cache hit');
            return fs.readFileSync(filePath);
        }
    }

    this.cacheable && this.cacheable();
    const selectedKeys = [];

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
            console.error(err)
            if (err) return callback(null, content);
            console.log(resPath, resultData.length)
            if (options.cachePath) {
                mkdirp(options.cachePath, (err) => {
                    if (err) {
                        return callback(null, resultData);
                    }
                    fs.writeFileSync(filePath, resultData);
                })
            }
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