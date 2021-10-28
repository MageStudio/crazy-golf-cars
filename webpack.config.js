const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = process.env.NODE_ENV || 'prod';

module.exports = {
    mode: 'development',
    cache:   false,
    devtool: false,
    entry: {
        'app': [
            './src/index.js',
            './src/style.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'app.js',
    },
    module:  {
        rules: [{
            test: /\.js$/,
            use: [
                { loader: 'babel-loader' }
            ],
            exclude: [/node_modules/, /static/]
        },
        {
            test: /\.scss$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader',
                    options: { url: false }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        sassOptions: {
                            includePaths: [ path.resolve(__dirname, "node_modules") ],
                        },
                    }
                }
            ],
            include: [__dirname + '/src']
        }]
    },
    resolve: {
        modules: [
            'static',
            'src',
            'node_modules'
        ]
    },
    performance: {
        hints: false,
        maxAssetSize: 1000000,
        maxEntrypointSize: 800000,
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'style.css' }),
        new webpack.LoaderOptionsPlugin({
            options: {
                sassLoader: {
                    includePaths: [path.resolve(__dirname, './node_modules')]
                }
            }
        }),
        new CopyPlugin({
            patterns: [
                { from: './index.html', to: 'index.html', force: true },
                { from: 'assets', to: 'assets', noErrorOnMissing: true, force: true },
                { from: 'css', to: 'css', noErrorOnMissing: true, force: true },
                { from: 'img', to: 'img', noErrorOnMissing: true, force: true },
                { from: 'js', to: 'js', noErrorOnMissing: true, force: true }
            ]
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(env)
            }
        }),
    ],
};