const express = require('express');
const cors = require('cors');
const multer = require('multer');
// const history = require('connect-history-api-fallback');
const path = require('path');

const router = require('./routers');
const checkLogin = require('./middlewares/check-login');
const upload = multer({ dest: './public/upload' });

const app = express();
// app.use(history());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static('./public/dist'));

app.use(upload.any());
app.use(express.json());
app.use(cors());

app.use('/api', (req, res, next) => {
  const whitePath = req.path === '/login' || req.path.indexOf('weblog') > -1;
  // 登录请求直接通过
  if (whitePath) {
    return next();
  }

  // 非登录请求，令牌验证
  checkLogin()(req, res, next);
});

app.use('/api', router);

// 全局统一错误处理
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message
  })
});

app.listen(3000, () => {
  console.log('running http://localhost:3000/');
});