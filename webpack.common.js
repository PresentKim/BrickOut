const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/index.ts"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    },
    output: {
        publicPath: "",
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
    target: ["web", "es5"],
    plugins: [
        new HtmlWebpackPlugin({
            title: "TwinHead Games :: BrickOut",
            name: "BrickOut",
            short_name: "BrickOut",
            favicon: "./assets/icon/favicon.ico",
            meta: {
                viewport: "user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height",
                description: "BrickOut Game of TwinHead Games"
            }
        })
    ],
    module: {
        rules: [
            {test: /\.(js|tsx?|)$/i, use: ["babel-loader"]},
            {test: /\.(css)$/i, use: ["style-loader", "css-loader"]},
            {test: /\.(png)$/i, use: ["file-loader", "image-webpack-loader"]}
        ]
    }
}