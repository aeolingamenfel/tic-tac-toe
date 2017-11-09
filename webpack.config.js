var path = require("path");

module.exports = {
    entry: {
        app: "./src/js/app.js"
    },
    output: {
        path: path.resolve(__dirname, 'js/'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    presets: ['env']
                }
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve('./src/js'),
            path.resolve('./node_modules')
        ]
    }
};
