const path = require("path")
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
function resolve(dir) {
  return path.join(__dirname, "..", dir);
}
module.exports = {
  entry: "./src/main.js", // 单入口
  // entry: { // 多入口，其中，app是自定义的属性
  //   app: './src/index.js'
  // },
  output: {
    // 输出
    filename: "tool.js", // 打包的文件名单入口
    // filename: '[name].[chunkhash].js', // 其中多入口时name是entry的属性，例如上面的app,chunkhash是为了diff
    path: path.resolve(__dirname, "../dist"), // 打包到哪里，“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录
    library: 'tool',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
            // options: {
            //   modules: true, // 指定启用css modules
            //   localIdentName: "[name]__[local]--[hash:base64:5]" // 指定css的类名格式
            // }
          },
          {
            loader: "postcss-loader"
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(csv|tsv)$/,
        use: ["csv-loader"]
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/, // 排除node_modules/bower_components目录下的文件，include则是包含
        use: {
          loader: "babel-loader"
          // options: {
          //   presets: ['@babel/preset-env']
          // }
        }
      },
      {
        test: /\.(vue)$/,
        use: ["vue-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html'
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: [".js", ".vue", ".json", ".css"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src"),
      "~": resolve("example")
    }
  },
};
