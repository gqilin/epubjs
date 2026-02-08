const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const PROD = (process.env.NODE_ENV === "production");
const LEGACY = (process.env.LEGACY);
const MINIMIZE = (process.env.MINIMIZE === "true");
const hostname = "localhost";
const port = 8080;

let filename = "[name]";
let sourceMapFilename = "[name]";

if (LEGACY) {
	filename += ".legacy";
}

if (MINIMIZE) {
	filename += ".min.js";
	sourceMapFilename += ".min.js.map";
} else {
	filename += ".js";
	sourceMapFilename += ".js.map";
}

module.exports = {
	mode: PROD ? "production" : "development",
	entry: {
		"epub": "./src/epub.js",
	},
	devtool: MINIMIZE ? false : 'source-map',
	output: {
		path: path.resolve("./dist"),
		filename: filename,
		sourceMapFilename: sourceMapFilename,
		library: {
			name: "ePub",
			type: "umd",
			export: "default"
		},
		publicPath: "/dist/",
		globalObject: 'this',
		clean: true
	},
	optimization: {
		minimize: MINIMIZE,
		minimizer: MINIMIZE ? [
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: true
					}
				}
			})
		] : []
	},
	externals: {
		"jszip/dist/jszip": "JSZip",
		"xmldom": "xmldom"
	},
	plugins: [],
	resolve: {
		alias: {
			path: "path-webpack"
		},
		fallback: {
			"path": require.resolve("path-webpack"),
			"fs": false,
			"buffer": false,
			"stream": false,
			"crypto": false,
			"url": false
		}
	},
	devServer: {
		host: hostname,
		port: port,
		hot: true,
		open: false,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
			"Access-Control-Allow-Headers": "Content-Type"
		},
		static: {
			directory: path.join(__dirname),
		},
		client: {
			logging: "warn"
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [["@babel/preset-env", {
							targets: LEGACY ? "defaults" : "last 2 Chrome versions, last 2 Safari versions, last 2 ChromeAndroid versions, last 2 iOS versions, last 2 Firefox versions, last 2 Edge versions",
							corejs: 3,
							useBuiltIns: "usage",
							bugfixes: true,
							modules: false
						}]]
					}
				}
			}
		]
	},
	performance: {
		hints: false
	},
	stats: {
		children: false
	}
};