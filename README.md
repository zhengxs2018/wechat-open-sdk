# 微信开放平台 SDK

[![typescript](https://badgen.net/badge/lang/typescript)](https://www.typescriptlang.org)
![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=square)
[![Version](https://img.shields.io/npm/v/@zhengxs/wechat-open-sdk.svg)][package]
[![travis-ci](https://travis-ci.org/zhengxsFE/wechat-open-sdk.svg?branch=master)](https://travis-ci.org/zhengxsFE/wechat-open-sdk)
[![Coverage Status](https://coveralls.io/repos/github/zhengxsFE/wechat-open-sdk/badge.svg?branch=master)](https://coveralls.io/github/zhengxsFE/wechat-open-sdk?branch=master)
[![Downloads](https://img.shields.io/npm/dm/@zhengxs/wechat-open-sdk.svg)][package]
[![License](https://img.shields.io/npm/l/@zhengxs/wechat-open-sdk.svg)][package]

使用 typescript 编写，方便 nodejs 对接微信开放平台的接口

## 安装

```bash
$ npm install @zhengxs/wechat-open-sdk --save
```

## 使用

**第三方平台接口**

```javascript
import wechat from '@zhengxs/wechat-open-sdk'

// 获取第三方平台的 access_token
wechat.component.getAccessToken('component_appid', 'component_appsecret', 'component_verify_ticket')

// 获取预授权码
wechat.component.getPreAuthCode('component_appid', 'access_token')

// 获取公众号授权地址
wechat.component.genAuthURL('component_appid', 'pre_auth_code', 'redirect_uri')
```

**代公众号接管接口**

```javascript
import wechat from '@zhengxs/wechat-open-sdk'

// 获取用户网页授权地址
wechat.connect.getOAuthURL('component_appid', 'biz_appid', 'redirect_uri')
```

**授权消息解析**

```javascript
import { AuthMessageParser, IVerifyTicketMessage } from '@zhengxs/wechat-open-sdk'

// 授权消息解析
const parser = new AuthMessageParser({
  aesKey: '消息加解密的 key'
})

// 解析 xml 数据
const result = parser.parseXML<IVerifyTicketMessage>('xml 文本')

console.log(result.InfoType)
// out: component_verify_ticket
```

**推送消息解析**

```javascript
import { PushMessageParser, IVoiceMessage } from '@zhengxs/wechat-open-sdk'

const parser = new PushMessageParser({
  aesKey: '消息加解密的 key'
})

// 解析 xml 数据
const { appId, message } = parser.parseXML<IVoiceMessage>('xml 文本')

// message 为已经解析后的值
console.log(appId, message)
```

**生成回复消息**

```javascript
import { ReplyMessageBuilder } from '@zhengxs/wechat-open-sdk'

const msg = new ReplyMessageBuilder({
  appId: '第三方平台 appId',
  token: '签名 token',
  aesKey: '消息加解密的 key'
})

// 生成文本回复消息内容
const xmlData = msg.text(FromUserName, ToUserName, content)
```

## 本地开发

你需要安装 [node.js][node.js] 的版本为 `nodejs >= 8.0`。

克隆此仓库后运行:

```shell
# 推荐使用 yarn 或 cnpm 来管理依赖
$ npm install

# 监听文件变化
$ npm run watch

# 生成 API 文档.
$ npm run doc
```

在 `package.json` 文件的 `scripts` 部分还有一些其他脚本可用.

## 版本发布

```bash
# 更新版本号，内置代码检查
$ npm version <new_version|major|minor|patch>
```

可使用 `npm version --help` 查看帮助信息

## 升级日志

[ChangeLog](./CHANGELOG.md).

[node.js]: https://nodejs.org/
[TypeScript]: https://www.typescriptlang.org/
[package]:https://www.npmjs.com/package/@zhengxs/wechat-open-sdk
