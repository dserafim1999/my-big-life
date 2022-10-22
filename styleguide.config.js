const path = require('path');

module.exports = {
    title: 'MyBigLife',
    sections: [
      {
        name: 'Introduction',
        content: 'docs/introduction.md'
      },
      {
        name: 'State',
        content: 'docs/state.md',
      },
      {
        name: 'Modules',
        content: 'docs/modules.md',
      },
      {
        name: 'Components',
        components: 'src/components/[A-Z]*/[A-Z]*.js'
      }
    ],
    webpackConfig: {
      module: {
        rules: [
          {
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      }
    }
  }