// const tiny = require('../');
var img = require('./img/img.png');
const fs = require('fs');
const path = require('path');

console.log('hello worild')


const tinify = require('tinify');
tinify.key = 'qARMmY5YJUcjiOzGl86TJuD2Vv2vmBcH';
tinify.fromFile('img/img.png').toFile('p0.png');
var content = fs.readFileSync('./img/img.png');
tinify.fromBuffer(content).toBuffer(function(err, resultData) {
    console.log(err)
    if (err) return callback(err);
    fs.writeFileSync(path.join(__dirname, 'ppp.png'), resultData);
    //callback(resultData.toString('utf8'));
});