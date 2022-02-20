const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const https = require('https');

const router = require('./routers');
const checkLogin = require('./middlewares/check-login');
const upload = multer({ dest: './public/upload' });

const fs = require('fs');

//同步读取密钥和签名证书
const options = {
  key: fs.readFileSync(path.join(__dirname, './keys/canday.site.key')),
  cert: fs.readFileSync(path.join(__dirname, './keys/canday.site_bundle.crt'))
};

const app = express();
const httpsServer = https.createServer(options, app);

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

httpsServer.listen(443, () => {
  console.log('running https://localhost:443/');
});