import { createHash } from 'crypto'

/**
 * sha1 加密
 *
 * @param {String} text 原始字符串
 */
export function sha1(text: string): string {
  const hash = createHash('sha1')
  hash.update(text)
  return hash.digest('hex')
}

export const PKCS7 = {
  decode(source: Buffer): Buffer {
    const pad = source[source.length - 1]

    return source.slice(0, source.length - (pad < 1 || pad > 32 ? 0 : pad))
  },
  encode(source: Buffer): Buffer {
    const size = 32 - (source.length % 32)
    return Buffer.concat([source, Buffer.alloc(size, size)])
  }
}
