const webpack = require("webpack");
const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack");
const Dotenv = require('dotenv-webpack');

const paths = require("./path");
const babelLoader = {
  loader: "babel-loader",
  options: {
    cacheDirectory: true,
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false,
        },
      ],
      "@babel/preset-react",
      "next",
      "@babel/flow"
    ],
    plugins: [
      "@babel/plugin-syntax-dynamic-import",
      [
        "module-resolver",
        {
          "alias": {
            "@app": "./src"
          }
        }
      ],
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-transform-flow-strip-types",
      ["styled-jsx/babel", { plugins: ["styled-jsx-plugin-sass"] }],
    ],
    comments: true,
    compact: false
  }
};

module.exports = {
  resolve: {
    extensions: [".js", ".json", ".web.jsx", ".jsx", ".scss"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
      "@app": paths.appSrc
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [babelLoader, "source-map-loader"]
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ],
      },
    ]
  },
  plugins: [
    new ImageminPlugin({
      bail: false, // Ignore errors on corrupted images
      cache: true,
      imageminOptions: {
        // Before using imagemin plugins make sure you have added them in `package.json` (`devDependencies`) and installed them

        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
          [
            "svgo",
            {
              plugins: [
                {
                  removeViewBox: false
                }
              ]
            }
          ]
        ]
      }
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new CopyWebpackPlugin(
      [
        { from: paths.appPublic, to: `${paths.appBuildPath}/` },
      ],
      {
        ignore: [
          {
            dots: true,
            glob: "node_modules/**/*"
          }
        ]
      }
    ),
    new webpack.ProvidePlugin({}),
    new Dotenv()
  ],
  target: 'web',
};
