export interface IMessageOptions {
  aesKey: string
  security?: boolean
  [key: string]: any
}

export interface IReplyOptions extends IMessageOptions {
  appId: string
  token: string
}
