const express = require("express");
const compression = require("compression");
const app = express();

// 启用Gzip压缩,写在静态资源托管之前
app.use(compression());
app.use(express.static("./dist"));

app.listen(80, () => {
  console.log("shop project server start.....");
});
