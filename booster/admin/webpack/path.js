const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
module.exports = {
  appPath: '/',
  appBuildPath: resolveApp('./build'),
  appHtml: resolveApp("public/index.html"),
  appFavicon: resolveApp("public/logo.png"),
  appPublic: resolveApp("public"),
  appIndexJs: resolveApp("src/index.jsx"),
  appSrc: resolveApp("src")
};
