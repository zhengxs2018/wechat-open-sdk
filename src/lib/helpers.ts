import { sha1 } from './hashlib'

/**
 * 校验签名是否正确
 *
 * @param signature 签名
 * @param args      签名参数
 *
 * @return 返回校验结果
 */
export function checkSignature(signature: string, args: string[]): boolean {
  return signature === sha1(args.sort().join(''))
}
