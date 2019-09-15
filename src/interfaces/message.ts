// 授权消息基础数据
export interface IBaseMessage {
  AppId: string
  InfoType: string
  CreateTime: number
}

// 接收验证票据
export interface IVerifyTicketMessage extends IBaseMessage {
  InfoType: 'component_verify_ticket'
  ComponentVerifyTicket: string
}

// 公众号授权
export interface IAuthorizedMessage extends IBaseMessage {
  InfoType: 'authorized'
  AuthorizerAppid: string
  AuthorizationCode: string
  AuthorizationCodeExpiredTime: string
  PreAuthCode: string
}

// 公众号更新授权信息
export interface IUpdateAuthorizedMessage extends IBaseMessage {
  InfoType: 'updateauthorized'
  AuthorizerAppid: string
  AuthorizationCode: string
  AuthorizationCodeExpiredTime: string
  PreAuthCode: string
}

// 公众号取消授权
export interface IUnauthorizedMessage extends IBaseMessage {
  InfoType: 'unauthorized'
  AuthorizerAppid: string
}

// 公众号推送消息
export interface IPushMessage {
  ToUserName: string
  FromUserName: string
  MsgType: string
  MsgId: string
  CreateTime: number
}

// 文本消息
export interface ITextMessage extends IPushMessage {
  MsgType: 'text'
  Content: any
}

// 语言消息
export interface IVoiceMessage extends IPushMessage {
  MsgType: 'voice'
  MediaId: string
  Format: string // amr
  Recognition: string
}

// 图片消息
export interface IImageMessage extends IPushMessage {
  MsgType: 'image'
  PicUrl: string
  MediaId: string
}

// 视频消息
export interface IVideoMessage extends IPushMessage {
  MsgType: 'video'
  MediaId: string
  ThumbMediaId: string
}

// 链接消息
export interface ILinkMessage extends IPushMessage {
  MsgType: 'link'
  Title: string
  Description: string
  Url: string
}

// 地址位置消息
export interface ILocationMessage extends IPushMessage {
  MsgType: 'location'
  Location_X: number
  Location_Y: number
  Scale: number
  Label: string
}
