module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-url'),
    require("postcss-preset-env"),
    require('postcss-flexbugs-fixes'),
    require('postcss-nested'),
    require("autoprefixer"),
    require("cssnano")
  ]
};
