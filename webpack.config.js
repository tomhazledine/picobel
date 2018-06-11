const path = require('path');
const libraryName = 'picobel';

module.exports = {
    entry: './src/Picobel.js',
    output: {
        path: path.resolve(__dirname, 'esm'),
        filename: 'picobel.js',
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
            }
        ]
    }
};
