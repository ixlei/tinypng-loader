const config = require('./webpack.config');
const webpack = require('webpack');
const compiler = webpack(config);
compiler.run((err, stats) => {
    console.log(err, stats.compilation.errors)
})