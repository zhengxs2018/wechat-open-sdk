export interface IComponentAccessToken {
  component_access_token: string
  expires_in: number
}

export interface IPreAuthCode {
  pre_auth_code: string
  expires_in: number
}

// See: https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/api/api_get_authorizer_info.html
export interface IAuthorizerInfo {
  nick_name: string
  user_name: string
  head_img: string
  principal_name: string
  alias: string | null
  // cSpell: disable-next-line
  qrcode_url: string
  service_type_info: object
  verify_type_info: object
  business_info: string
}
