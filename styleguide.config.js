module.exports = {
    title: 'MyBigLife',
    // sections: [
    //   {
    //     name: 'Introduction',
    //     content: 'docs/introduction.md'
    //   },
    //   {
    //     name: 'Documentation',
    //     sections: [
    //       {
    //         name: 'Installation',
    //         content: 'docs/installation.md',
    //         description: 'The description for the installation section'
    //       },
    //       {
    //         name: 'Configuration',
    //         content: 'docs/configuration.md'
    //       }
    //     ]
    //   }
    // ],
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