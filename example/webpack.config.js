const path = require('path');

const config = {
    entry: './index.js',
    node: {
        fs: 'empty',
        tls: 'empty'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[chunkhash:6].js',
        publicPath: "//s.url.cn/near-index/i/"
    },
    module: {
        rules: [{
            test: /\.(jpeg|png)$/,
            use: [
                'url-loader?limit=10000',
                'img-loader',
                {
                    loader: '../index.js',
                    options: {
                        keys: ['qARMmY5YJUcjiOzGl86TJuD2Vv2vmBcH00']
                    }
                }
            ]
        }]
    },
    resolve: {
        aliasFields: ["browser", "main"]
    }
}

module.exports = config;