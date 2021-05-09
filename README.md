# vue-shop

- [项目预览](./preview.md)

## 前端项目设置

1. 安装项目依赖

   ```shell
   npm install
   ```

2. 开发：编译和热加载

   ```sh
   npm run serve
   ```
3. 生产：编译

   ```sh
   # Lints and fixes files
   npm run lint
   npm run build
   ```

4. Customize configuration：See [Configuration Reference](https://cli.vuejs.org/config/).



## 后端API

- 代码放在 api-server下，将代码移出后运行即可
- scheme 放在db目录下,[接口文档](./api-server/api接口文档.md)

### 运行

1. 进入api-server 目录
2. 安装依赖 
3. 启动 `node app.js`



### mysql8.0报错

- 控制台错误如下：

  ```sh
  code: 'ER_NOT_SUPPORTED_AUTH_MODE',
  errno: 1251,
  sqlMessage: 'Client does not support authentication protocol requested by server; consider upgrading MySQL client',
  sqlState: '08004',
  fatal: true
  ```

  

- 原因是node.js还不支持mysql8+版本的强密码方式

- 提供我解决的方式，建立新的用户test，修改密码的规则后使用

  ```sql
  drop user 'test'@'%';
  # 修改mysql密码规则
  create user 'test'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
  # 授权
  GRANT ALL ON mydb.* TO 'test' @'%';
  FLUSH PRIVILEGES;
  # 检查
  use mysql
  select user,host,plugin from user
  ```

  

## 部署项目

- 你可以选择你喜欢的方式部署这个项目，这里使用node来部署项目

### Node方式部署

1. 移出`http-serve`目录
2. 前端项目下执行 `npm run build`命令后，将生成的dist文件放到`http-server`目录下
3. 执行 `node app.js` ，会启动服务托管dist的文件
