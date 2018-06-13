<h1 align="center">tinypng-webpack-loader</h1>

<h2 align="center">Install</h2>

```bash
npm install --save-dev tinypng-webpack-loader
```

<h2 align="center">Usage</h2>

Compress images size is a good way to improve page load speed,as the png format images, we can use [Tinypng](https://tinypng.com/) reduce the images size.  
`tinypng-webpack-loader` is a webpack loader help to reduce your png images size.
config as follows:

**webpack.config.js**
```javascript
  {
    test: /\.(jpeg|png)$/,
    use: [
        // ...
        {
            loader: 'tinypng-webpack-loader',
            options: {
                proxy: /**http:your.proxy.com:port*/,
                cachePath: /**cache path*/,
                keys: [/**your tinypng key*/]
            }
        }
    ]
}
```

<h2 align="center">Options</h2>

Allowed values are as follows

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`proxy`](#)**|`{String}`|``|the request to tinypng proxy|
|**[`cachePath`](#)**|`{String}`|``|cache the tinypng reduce result|
|**[`keys`](#)**|`{Array<String>}`||available keys list|
