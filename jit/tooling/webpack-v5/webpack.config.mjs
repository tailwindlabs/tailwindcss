import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default {
  mode: 'development',

  entry: {
    index: './src/index.css',
  },

  module: {
    rules: [
      {
        test: /.css$/,
        use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }, { loader: 'postcss-loader' }],
      },
    ],
  },

  plugins: [new MiniCssExtractPlugin()],
}
