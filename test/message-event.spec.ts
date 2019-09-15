// @ts-ignore
import { deepStrictEqual } from 'power-assert'

import { AuthMessageParser, PushMessageParser } from '../src/message'
import { IVerifyTicketMessage, IVoiceMessage } from '../src/interfaces/message'

import { readFile, readJSON } from './fixtures/scripts/file'
import { TEST_AES_KEY } from './fixtures/scripts/constants'

describe('test/message-event.spec.ts', () => {
  it('test component-verify-ticket', () => {
    const parser = new AuthMessageParser({
      aesKey: TEST_AES_KEY
    })

    const result = parser.parseXML<IVerifyTicketMessage>(
      readFile('component-verify-ticket.xml')
    )

    deepStrictEqual(
      result,
      readJSON('component-verify-ticket.json'),
      '授权消息解析失败'
    )
  })

  it('test push message', () => {
    const parser = new PushMessageParser({
      // cSpell: disable-next-line
      aesKey: TEST_AES_KEY
    })
    const result = parser.parseXML<IVoiceMessage>(
      readFile('push-voice-message.xml')
    )

    deepStrictEqual(
      result,
      readJSON('push-voice-message.json'),
      '推送消息解析失败'
    )
  })
})
