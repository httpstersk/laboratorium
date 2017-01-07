var path = require('path');

module.exports = {
    entry: path.join(__dirname, 'app', 'index.js'),
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'app.js'
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: '/node_modules/'
        }]
    },
    resolve: {
        root: [
            path.resolve('./app')
        ]
    },
    devServer: {
        historyApiFallback: {
            index: 'index.html'
        }
    }
};