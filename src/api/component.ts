import { URL } from 'url'

import client from '../lib/client'
import { WX_BASE_URL } from '../lib/constants'

import {
  IComponentAccessToken,
  IPreAuthCode,
  IAuthorizerInfo
} from '../interfaces/component'

export function genAuthURL(
  componentAppId: string,
  preAuthCode: string,
  redirectUri: string,
  bizAppId?: string,
  isMobile = false,
  authType = 3
): string {
  // cSpell: disable-next-line
  const path = isMobile ? 'safe/bindcomponent' : 'cgi-bin/componentloginpage'
  const url = new URL(path, WX_BASE_URL)

  const params = url.searchParams

  params.set('component_appid', componentAppId)
  params.set('pre_auth_code', preAuthCode)
  params.set('redirect_uri', redirectUri)
  params.set('auth_type', authType.toString())

  if (typeof bizAppId === 'string') {
    params.set('biz_appid', bizAppId)
  }

  return url.toString()
}

export async function getAccessToken(
  componentAppId: string,
  componentAppSecret: string,
  verifyTicket: string
): Promise<IComponentAccessToken> {
  const res = await client.post('cgi-bin/component/api_component_token', {
    // eslint-disable-next-line @typescript-eslint/camelcase
    component_appid: componentAppId,
    // eslint-disable-next-line @typescript-eslint/camelcase
    component_appsecret: componentAppSecret,
    // eslint-disable-next-line @typescript-eslint/camelcase
    component_verify_ticket: verifyTicket
  })

  return (res as unknown) as IComponentAccessToken
}

export async function getPreAuthCode(
  componentAppId: string,
  accessToken: string
): Promise<IPreAuthCode> {
  const res = await client.post(
    // cSpell: disable-next-line
    'cgi-bin/component/api_create_preauthcode',
    {
      // eslint-disable-next-line @typescript-eslint/camelcase
      component_appid: componentAppId
    },
    {
      params: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        component_access_token: accessToken
      }
    }
  )

  return (res as unknown) as IPreAuthCode
}

export async function getAuthorizerInfo(
  componentAppId: string,
  bizAppId: string,
  accessToken: string
): Promise<IAuthorizerInfo> {
  const res = await client.post(
    'cgi-bin/component/api_get_authorizer_info',
    {
      // eslint-disable-next-line @typescript-eslint/camelcase
      component_appid: componentAppId,
      // eslint-disable-next-line @typescript-eslint/camelcase
      authorizer_appid: bizAppId
    },
    {
      params: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        component_access_token: accessToken
      }
    }
  )

  return (res as unknown) as IAuthorizerInfo
}

export async function getAuthorizerInfoByCode(
  componentAppId: string,
  authCode: string,
  accessToken: string
): Promise<IAuthorizerInfo> {
  const res = await client.post(
    'cgi-bin/component/api_query_auth',
    {
      // eslint-disable-next-line @typescript-eslint/camelcase
      component_appid: componentAppId,
      // eslint-disable-next-line @typescript-eslint/camelcase
      authorization_code: authCode
    },
    {
      params: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        component_access_token: accessToken
      }
    }
  )
  // @ts-ignore
  return res.authorization_info as IAuthorizerInfo
}
