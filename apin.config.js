module.exports = {
	server: require("./config/server.js"),
	webpack: function () {
        var path = require("path");
        var CleanWebpackPlugin = require('clean-webpack-plugin');
        const ExtractTextPlugin = require("extract-text-webpack-plugin");
        var extractApin = new ExtractTextPlugin({filename:"apin.css",allChunks:true});
        var extractSrc = new ExtractTextPlugin({filename:"src.css",allChunks:true});
        var defaultPlugin = require('./lib/config/webpack/plugins');

//修改ANTD主题
        var json = {};
        var fs = require("fs");
        var file = fs.readFileSync(__dirname+"/src/theme.less").toString();
        var fileS = file.split(";");
        for(var i=0;i<fileS.length;i++){
            if(fileS[i].trim().indexOf("@")==0){
                var arr = fileS[i].split(":");
                json[arr[0].trim()] = arr[1].trim();
            }
        }

        var themeV = JSON.stringify(json);
        var babelrc = {
            "presets": [
                "react",
                "es2015"
            ],
            "plugins": [
                [
                    "import",
                    {
                        libraryName: "antd",
                        style: true
                    }
                ]
                // `style: true` 会加载 less 文件
            ],
            "env":{
                "development": {
                    "presets": [
                        "react-hmre"
                    ]
                }
            }
        };
        var configModuleDebug= {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader?"+JSON.stringify(babelrc).trim()+"!eslint-loader"
                    // include: path.join(__dirname, "src")
                },
                {
                    test: /\.css/,
                    loader: "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]!"
                },
                {
                    test: /^(?!.*?(\\|\/)src(\\|\/)).*less$/,
                    loader: "style-loader!css-loader!less-loader?{\"sourceMap\":true,\"modifyVars\":"+themeV+"}"
                },
                {
                    test: /(.*?(\\|\/)src(\\|\/)).*less$/,
                    loader: "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]!less-loader"
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    loader: "url-loader?limit=5120&name=images/[hash:8].[name].[ext]"
                }

            ]
        };
        var configModule = {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader?"+JSON.stringify(babelrc).trim()
                    // include: path.join(__dirname, "src")
                },
                {
                    test: /\.css/,
                    loader: "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]!"
                },
                {
                    test: /^(?!.*?(\\|\/)src(\\|\/)).*less$/,
                    loader: extractApin.extract("css-loader!less-loader?{\"sourceMap\":true,\"modifyVars\":"+themeV+"}")
                },
                {
                    test: /(.*?(\\|\/)src(\\|\/)).*less$/,
                    loader: extractSrc.extract("css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]!less-loader")
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    loader: "url-loader?limit=5120&name=images/[hash:8].[name].[ext]"
                }

            ]
        };
        return {
            dev: {
                useAnalyzer:false,
                config: {
                    devtool: "cheap-module-eval-source-map",
                    output: {
                        path: path.resolve(__dirname,"./public/project"),
                        filename: "spa.js",
                        publicPath: "/project"
                    },
                    module: configModuleDebug
                }


            },
            release: {
                useAnalyzer:true,
                config: {
                    output: {
                        path: path.resolve(__dirname,"./public/project"),
                        filename: "spa.js",
                        sourceMapFilename: "[file].map",
                        //加这个！
                        chunkFilename: "[name].[chunkhash:5].chunk.js",
                        publicPath: "/project/"
                    },
                    module: configModule,
                    plugins: [
                        extractApin,
                        extractSrc,
                        new (require('css-split-webpack-plugin').default)({ size: 4000, imports: true }),
                        //删除上次打包目录
                        new CleanWebpackPlugin(['project'],
                            {
                                root:path.join(__dirname, '/public'),//一个根的绝对路径.
                                verbose: true,
                                dry: false,
                                exclude: []////排除不删除的目录，主要用于避免删除公用的文件
                            }),
                        defaultPlugin.noEmitError(),
                        defaultPlugin.definePlugin({
                            'process.env': {
                                'NODE_ENV': JSON.stringify('production')
                            }
                        }),
                        defaultPlugin.es3ifyPlugin(), // MUST put before uglify or it not work
                        // defaultPlugin.uglify({
                        // 	ie8: true,
                        // 	output: {
                        // 		comments: false,  // remove all comments
                        // 	},
                        // 	compress: {
                        // 		warnings: false
                        // 	}
                        // }),
                        defaultPlugin.uglify({
                            uglifyOptions: {
                                ie8: true,
                                output: {
                                    comments: false,  // remove all comments
                                },
                                compress: true,
                                warnings: false
                            }
                        }),
                        defaultPlugin.compressPlugin({ //gzip 压缩
                            asset: '[path].gz[query]',
                            algorithm: 'gzip',
                            test: new RegExp(
                                '\\.(js|css)$'    //压缩 js 与 css
                            ),
                            threshold: 10240,
                            minRatio: 0.8
                        })
                    ]
                }

            },
            useBundle: false
        };
    }
};