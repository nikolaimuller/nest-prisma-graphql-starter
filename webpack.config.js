const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin')

module.exports = (env) => {
  const isDev = !env.build

  const config = {
    context: __dirname,
    entry: ['./src/main.ts'],
    target: 'node',
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
        modulesDir: path.resolve(__dirname, './node_modules'),
      }),
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
        modulesDir: path.resolve(__dirname, '../../node_modules'),
      }),
    ],
    module: {
      rules: [
        {
          test: /.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: isDev,
          },
        },
      ],
    },
    mode: isDev ? 'development' : 'production',
    optimization: {
      minimize: false,
    },
    watch: isDev,
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'server.js',
    },
  }

  if (isDev) {
    config.entry.push('webpack/hot/poll?100')
    config.plugins.push(new ForkTsCheckerWebpackPlugin())
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    config.plugins.push(new RunScriptWebpackPlugin({ name: 'server.js' }))
  }

  return config
}
