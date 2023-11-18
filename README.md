# admin-express

Express + MongoDB + Mongoose 搭建的博客后台管理系统

## 环境要求

- node >= 14.x
- mongodb >= 5.x

## 运行

### 安装依赖

```sh
# 开发环境下 node 应用自重启工具
npm install nodemon -g
```

```sh
npm install
```

### 启动

```sh
npm run dev
```

## 数据库配置

```js
module.exports = {
  DB_SERVER: 'localhost',
  DB_NAME: 'admin-express',
  DB_USER: 'bohe',
  DB_SECRET: '123456'
}
```

## 服务端功能

- [x] JWT 接口鉴权
- [x] 用户管理
- [x] 角色管理
- [x] 菜单管理
- [x] 博客文章管理
- [x] 博客标签管理
- [x] 博客目录管理
- [x] 文件上传

## 中间键使用

**全局中间键**

- [cors](https://www.npmjs.com/package/cors) 跨域资源共享
- [multer](https://www.npmjs.com/package/multer) 文件上传
- `express.json()` 解析客户端发送的 `json` 格式的请求体数据，将其转换为 `JavaScript` 对象，并将其赋值给 `req.body`
- `express.static()` 静态资源访问
- `auth（自定义）` 鉴权，配合 [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) 实现
- `express.Router()` 路由

## 异步流程控制

[async](https://www.npmjs.com/package/async)

## 分页插件

[mongoose-paginate](https://www.npmjs.com/package/mongoose-paginate)
