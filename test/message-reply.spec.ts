// @ts-ignore
import { deepStrictEqual, strictEqual } from 'power-assert'

import {
  ReplyMessageBuilder,
  ITextMessage,
  IPushMessageXML,
  parseXML
} from '../src'

import {
  TEST_COMPONENT_APPID,
  TEST_TOKEN,
  TEST_AES_KEY
} from './fixtures/scripts/constants'

describe('test/reply-message.spec.ts', () => {
  it('test text message', () => {
    const msg = new ReplyMessageBuilder({
      appId: TEST_COMPONENT_APPID,
      token: TEST_TOKEN,
      aesKey: TEST_AES_KEY
    })
    const content = 'This is text message'
    const xmlData = msg.text('公众号', '用户', content)
    const res = parseXML<IPushMessageXML>(xmlData)

    deepStrictEqual(
      Object.keys(res).sort(),
      ['Encrypt', 'Nonce', 'MsgSignature', 'TimeStamp'].sort(),
      '数据字段与期望的不一致'
    )

    const message = parseXML<ITextMessage>(msg.decrypt(res.Encrypt).text)

    strictEqual(message.Content, content, '消息内容加密错误')
  })

  it('test unsafe text message', () => {
    const msg = new ReplyMessageBuilder({
      appId: TEST_COMPONENT_APPID,
      token: TEST_TOKEN,
      aesKey: TEST_AES_KEY,
      security: false
    })
    const content = 'This is unsafe message'
    const xmlData = msg.text('公众号', '用户', content)

    const res = parseXML<ITextMessage>(xmlData)

    deepStrictEqual(
      Object.keys(res).sort(),
      ['MsgType', 'Content', 'ToUserName', 'FromUserName', 'CreateTime'].sort(),
      '数据字段与期望的不一致'
    )
    deepStrictEqual(res.Content, content, '消息内容与期望结果不一致')
  })
})
