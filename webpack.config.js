import path from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

export default {
    entry: './src/main.tsx',
    output: {
        path: path.resolve(__dirname, 'dist-webpack'),
        filename: 'assets/js/[name].[contenthash].js',
        clean: true,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        new webpack.DefinePlugin({
            'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
            'process.env.APP_THEME': JSON.stringify(process.env.APP_THEME),
        }),
    ],
    devServer: {
        port: 5174,
        open: true,
        historyApiFallback: true,
    },
}