const express = require('express');
const path = require('path');
const app = express();

// 设置用于提供静态文件的中间件
app.use(express.static(path.join(__dirname, 'public')));

// 处理 GET /index 请求
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// 启动服务器
const PORT = process.env.PORT || 8100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
