// @ts-ignore
import { parse, j2xParser, X2jOptionsOptional } from 'fast-xml-parser'

export function parseXML<T>(xmlStr: string, options?: X2jOptionsOptional): T {
  return parse(xmlStr, Object.assign({ trimValues: true }, options)).xml
}

export function buildXML(data: object): string {
  const parser = new j2xParser({
    cdataTagName: '__cdata',
    cdataPositionChar: '\\c'
  })

  return parser.parse({ xml: data })
}

export function pseudoRandomString(): string {
  return Math.random()
    .toString(16)
    .substr(2)
}
