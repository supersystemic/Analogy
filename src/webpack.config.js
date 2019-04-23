const path = require('path')

module.exports = {
    mode: 'development',
    watch: true,
    devtool: 'inline-source-map',
    entry: './src/js/main.js',
    output: {
        filename: 'main.min.js',
        path: path.resolve(__dirname, 'js')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    devServer: {
        disableHostCheck: true,
        contentBase: './src'
    },
}
