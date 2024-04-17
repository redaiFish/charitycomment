const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 8100;

创建数据库连接
const connection = mysql.createConnection({
  host: '43.138.249.104',     // 数据库主机名
  port: '3306',
  user: 'root',     // 数据库用户名
  password: 'XNDJ8888!', // 数据库密码
  database: 'charity_comment'  // 数据库名称
});

连接到数据库
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  console.log('Connected to database.');
});

// 设置用于提供静态文件的中间件
app.use(express.static(path.join(__dirname, 'public')));



// 解析 POST 请求的表单数据
app.use(bodyParser.urlencoded({ extended: true }));

// // 设置视图引擎为原始HTML
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '..', 'views'));

// 处理 GET /index 请求
app.get('/index', (req, res) => {
  const { actv, id, br, oi, orderid } = req.query;
  // 渲染HTML页面，并将参数传递给模板
  res.render('index', { title: '「公益点评」', storeId: br, wechatOpenId: oi, commentId: id, activity: actv, orderId: orderid });
});

// 处理根路径请求
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});



// 处理 POST 请求
app.post('/savecomment', (req, res) => {
  const formData = req.body;
  // 在这里执行你的逻辑，比如将表单数据存入数据库或者其他处理
  console.log('Received form data:', formData);

  // 将表单数据存入数据库
  const sql = "INSERT INTO comment (food, service, cleanliness, storeId, commentId, orderId, activity, wechatOpenId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [formData.food, formData.service, formData.cleanliness, formData.storeId, formData.commentId, formData.orderId, formData.activity, formData.wechatOpenId];

  connection.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error('Error inserting data: ', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Data inserted successfully.');
    // 数据成功插入数据库后发送响应给客户端
    res.redirect('/thankyou'); // 重定向到 /thankyou 路由
  });
});

// 处理 GET /thankyou 请求
app.get('/thankyou', (req, res) => {
  // 发送感谢消息的HTML页面
  res.send('<h1>感谢您的评价！您帮助我们成长，我们为您献出一份爱心。</h1>'); // 这里添加了感谢消息的HTML代码
});

// 设置监听端口
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
