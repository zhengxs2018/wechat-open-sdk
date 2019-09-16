import { URL } from 'url'

import { pseudoRandomString } from '../lib/utils'
import { WX_BASE_URL } from '../lib/constants'

/**
 * 代替公众号发起网页授权
 *
 * @param componentAppId            第三方平台
 * @param bizAppid                  业务公众号
 * @param redirectUri               授权回调地址
 * @param [scope=snsapi_userinfo]   授权作用域
 * @param [state=null]              任意参数值
 *
 * @returns 公众号授权地址
 */
export function getOAuthURL(
  componentAppId: string,
  bizAppid: string,
  redirectUri: string,
  scope?: 'snsapi_base' | 'snsapi_userinfo',
  state?: string
): string {
  // cSpell: disable-next-line
  const url = new URL('connect/oauth2/authorize', WX_BASE_URL)

  const params = url.searchParams

  params.set('appid', bizAppid)
  params.set('redirect_uri', redirectUri)
  params.set('response_type', 'code')
  params.set('scope', scope || 'snsapi_userinfo')
  params.set('state', state || pseudoRandomString())
  params.set('component_appid', componentAppId)

  return url.toString()
}
