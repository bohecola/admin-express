const express = require('express');
const router = require('./routers');
const checkLogin = require('./middlewares/check-login');

const app = express();

app.use(express.json());

app.use('/api', (req, res, next) => {
  // 登录请求直接通过
  if (req.path === '/login') {
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