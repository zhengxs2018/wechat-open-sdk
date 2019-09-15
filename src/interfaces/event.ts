// 公众号时间参数
export interface IEventArgs {
  nonce: string // 随机字符串
  timestamp: string // 时间戳，单位：秒
  signature: string // 请求签名
  encrypt_type: string // 加密方式，默认：aes
  msg_signature: string // 消息签名
}

// 推送时间参数
export interface IPushEventArgs extends IEventArgs {
  openid: string
}

// 微信公众号加密消息格式
export interface IPostMessageXML {
  // 加密消息内容
  Encrypt: string
}

// 微信授权加密消息格式
export interface IAuthMessageXML extends IPostMessageXML {
  AppId: string
}

// 微信推送加密消息格式
export interface IPushMessageXML extends IPostMessageXML {
  ToUserName: string
}
