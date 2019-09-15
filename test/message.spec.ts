// @ts-ignore
import { deepStrictEqual } from 'power-assert'

import { Message, IAuthMessageXML, parseXML } from '../src'

import { readFile, readJSON } from './fixtures/scripts/file'
import {
  TEST_COMPONENT_APPID,
  TEST_AES_KEY
} from './fixtures/scripts/constants'

describe('test/message.ts', () => {
  it('test Message.decrypt', () => {
    const msg = new Message({ aesKey: TEST_AES_KEY })

    const event = parseXML<IAuthMessageXML>(
      readFile('component-verify-ticket.xml')
    )
    const result = msg.decrypt(event.Encrypt)

    deepStrictEqual(
      parseXML(result.text),
      readJSON('component-verify-ticket.json'),
      '公众号消息解密失败'
    )
  })

  it('test Message.encrypt', () => {
    const text = 'hello,world'
    const msg = new Message({ aesKey: TEST_AES_KEY })

    deepStrictEqual(
      msg.decrypt(msg.encrypt(TEST_COMPONENT_APPID, text)),
      { id: TEST_COMPONENT_APPID, text: text },
      '加密的内容和解密的内容不匹配'
    )
  })
})
