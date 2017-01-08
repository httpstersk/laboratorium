"use strict";

var webpack = require("webpack");
var path = require("path");

module.exports = {
    context: path.join(__dirname, "src"),

    entry: {
        index: "./index.js"
    },

    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },

    module: {
        loaders: [{
                test: /\.js$/,
                loaders: ["babel-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]",
            },
        ],
    },

    node: {
        fs: "empty"
    },
};