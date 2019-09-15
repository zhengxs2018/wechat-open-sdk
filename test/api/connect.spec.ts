import { URL } from 'url'

// @ts-ignore
import { strictEqual } from 'power-assert'

import { getOAuthURL } from '../../src/api/connect'

describe('test/api/connect.spec.ts', () => {
  it('test connect.getOAuthURL', () => {
    const redirectUri = 'https://127.0.0.1'

    const url = new URL(
      getOAuthURL('component_appid', 'authorizer_appid', redirectUri)
    )
    const actual = decodeURIComponent(url.searchParams.get('redirect_uri'))

    strictEqual(actual, redirectUri, '公众号授权地址生成失败')
  })
})
