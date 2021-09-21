const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function (env, argv) {
	const isProduction =  argv.mode === 'production';
	return {
		entry: {
			'photo-grid-box-vanilla': path.join(__dirname, "src", "index.js")
		},
		output: {
			path: path.join(__dirname, "dist"),
			filename: 'photo-grid-box-vanilla.min.js',
			libraryTarget: 'umd'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					exclude: /node_modules/
				},
				{
					test: /\.(sc|c)ss$/,
					use: [
						isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
						'css-loader',
						'postcss-loader',
						'sass-loader'
					]
				},
			]
		},
		plugins: [
			// extract css file
			new MiniCssExtractPlugin({
				filename: 'css/[name].min.css'
			}),
		],
		mode: isProduction ? 'production' : 'development',
		devtool: isProduction ? false : 'source-map'
	}
}

