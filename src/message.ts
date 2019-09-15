import assert from 'assert'
import { createCipheriv, createDecipheriv, pseudoRandomBytes } from 'crypto'

import { IMessageOptions, IReplyOptions } from './interfaces/options'
import { IAuthMessageXML, IPushMessageXML } from './interfaces/event'
import { IPushMessage } from './interfaces/message'

import { PKCS7, sha1 } from './lib/hashlib'
import { parseXML, buildXML, pseudoRandomString } from './lib/utils'

export class Message {
  /** 初始向量 */
  protected iv: Buffer

  /** 密钥 */
  protected key: Buffer

  /** 安全模式下，消息会进行加解密处理 */
  public security: boolean

  constructor(options: IMessageOptions) {
    this.security = options.security !== false

    this.key = Buffer.from(options.aesKey + '=', 'base64')
    this.iv = this.key.slice(0, 16)
  }

  /**
   * 解密并且转码
   *
   * @param text 加密文本
   *
   * @return 解码后的字符串
   */
  private decode(text: string): Buffer {
    const cipher = createDecipheriv('aes-256-cbc', this.key, this.iv)

    cipher.setAutoPadding(false)

    const decoded = PKCS7.decode(
      Buffer.concat([cipher.update(text, 'base64'), cipher.final()])
    )

    return decoded.slice(16)
  }

  /**
   * 消息解密
   *
   * @param text 加密字符串
   *
   * @return 解密后得到的 id 和 消息文本
   */
  decrypt(text: string): { id: string; text: string } {
    // 去除16位随机数
    const content = this.decode(text)
    const length = content.slice(0, 4).readUInt32BE(0)

    return {
      text: content.slice(4, length + 4).toString(),
      id: content.slice(length + 4).toString()
    }
  }

  /**
   * 编码
   *
   * @param text 原始文本
   *
   * @return 解密后得到的 id 和 消息文本
   */
  private encode(data: Buffer): string {
    const cipher = createCipheriv('aes-256-cbc', this.key, this.iv)

    cipher.setAutoPadding(false)

    const encoded = Buffer.concat([
      cipher.update(PKCS7.encode(data)),
      cipher.final()
    ])

    return encoded.toString('base64')
  }

  /**
   * 消息加密
   *
   * @param id 企业号的 CorpId 或 公众号的 AppId
   * @param text 加密字符串
   *
   * @return 加密后的字符串
   */
  encrypt(id: string, text: string): string {
    // 获取16B的随机字符串
    const nonce = pseudoRandomBytes(16)
    const source = Buffer.from(text)
    const bytes = Buffer.alloc(4)

    bytes.writeUInt32BE(source.length, 0)

    return this.encode(Buffer.concat([nonce, bytes, source, Buffer.from(id)]))
  }
}

export class AuthMessageParser extends Message {
  parseXML<T>(text: string): T {
    const data = parseXML<any>(text)
    return this.security ? this.parse(data) : data
  }

  parse<T>(data: IAuthMessageXML): T {
    const result = this.decrypt(data.Encrypt)

    assert(result.id === data.AppId, 'invalid auth message')

    return parseXML<T>(result.text)
  }
}

export class PushMessageParser extends Message {
  parseXML<T extends IPushMessage>(
    text: string
  ): { appId: string; message: T } {
    const data = parseXML<any>(text)
    return this.security ? this.parse(data) : data
  }

  parse<T extends IPushMessage>(
    data: IPushMessageXML
  ): { appId: string; message: T } {
    const result = this.decrypt(data.Encrypt)
    const message = parseXML<T>(result.text)

    assert(message.ToUserName === data.ToUserName, '消息发送者验证失败')

    return {
      appId: result.id,
      message: message
    }
  }
}

export class ReplyMessageBuilder extends Message {
  /**  公众号 Id */
  private appId: string

  /** 生成签名用的 token */
  protected token: string

  /** 消息时间戳 */
  private timestamp = Math.floor(Date.now() / 1000)

  /**  随机字符串 */
  private nonce = pseudoRandomString()

  constructor(options: IReplyOptions) {
    super(options)

    this.appId = options.appId
    this.token = options.token
  }

  /**
   * 发送文本消息
   *
   * @param from      发送者
   * @param to        接收者
   * @param content   消息内容
   */
  text(from: string, to: string, content: string): string {
    return this.generate(from, to, {
      MsgType: 'text',
      Content: { __cdata: content }
    })
  }

  /**
   * 生成 XML 数据
   *
   * @param text 消息内容
   */
  generate(from: string, to: string, data: object): string {
    const message = buildXML(
      Object.assign(data, {
        ToUserName: {
          __cdata: to
        },
        FromUserName: {
          __cdata: from
        },
        CreateTime: this.timestamp
      })
    )
    return this.security ? this.encrypt(message) : message
  }

  /**
   * 对消息内容进行加密
   *
   * @param data 消息内容
   *
   * @return 返回加密后的消息内容
   */
  encrypt(data: string): string {
    // 对消息进行加密
    const text = super.encrypt(this.appId, data)

    // 生成 xml 数据
    return buildXML({
      Encrypt: {
        __cdata: text
      },
      MsgSignature: {
        __cdata: this.signature(text)
      },
      Nonce: {
        __cdata: this.nonce
      },
      TimeStamp: this.timestamp
    })
  }

  /**
   * 生成消息签名
   *
   * @param text 签名内容
   */
  signature(text: string): string {
    const args = [this.nonce, this.timestamp, this.token, text]
    return sha1(args.sort().join(''))
  }
}
