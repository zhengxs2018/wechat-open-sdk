import { URL } from 'url'

// @ts-ignore
import { strictEqual } from 'power-assert'

import { genAuthURL } from '../../src/api/component'

describe('test/api/component.spec.ts', () => {
  it('test connect.genAuthURL', () => {
    const redirectUri = 'https://127.0.0.1'

    const url = new URL(
      genAuthURL('component_appid', 'pre_auth_code', redirectUri)
    )
    const actual = decodeURIComponent(url.searchParams.get('redirect_uri'))

    strictEqual(actual, redirectUri, '公众号授权地址生成失败')
  })
})
