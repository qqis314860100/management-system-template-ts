const path = require(`path`)
const CracoLessPlugin = require('craco-less')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const mode = process.env.mode

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': 'rgb(0, 82, 204)',
              '@font-size-base': '16px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    plugins:
      mode === 'analyze'
        ? [].concat([new BundleAnalyzerPlugin({ analyzerMode: 'server' })])
        : [],
  },
}
