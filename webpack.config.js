/**
 * Created by LonelyGriffin on 05.12.2016.
 */
var BowerWebpackPlugin = require("bower-webpack-plugin");
var webpack = require("webpack");

module.exports = {
    context: __dirname + '/frontend',
    entry: {
        main: './index'
    },
    output: {
        path: __dirname + '/public',
        publicPath: '/',
        filename:   'js/[name].js',
        library: "[name]"
    },
    watch: true,
    devtool: "cheap-module-source-map",
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel?presets[]=es2015"
            },
            {
                test: /\.jade$/,
                loader: "jade"
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new BowerWebpackPlugin({
            modulesDirectories: ['./'],
            manifestFiles: ['bower.json', '.bower.json'],
            searchResolveModulesDirectories: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common"
        })
    ],
    resolve: {
        modulesDirectories: ["node_modules", "frontend", "declaration"]
    }
};