const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/scripts/test.jsx', // Ваш файл JavaScript, который хотите разбить
    output: {
        filename: 'bundle.js', // Название выходного файла
        path: path.resolve(__dirname, 'dist') // Директория для выходных файлов
    },
    mode: 'production',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: './src/manifest.json', to: '' }, // указываете путь к вашему manifest.json
                {from: './src/icons/megamarket_32.png', to: ''},
                {from: './src/style.css', to: ''}
            ]
        })
        
    ],
    module: {
        rules: [
          {
            test: /\.jsx$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
          }
        ]
      }
};
