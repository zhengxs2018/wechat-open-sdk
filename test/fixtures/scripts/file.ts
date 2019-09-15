import { readFileSync } from 'fs'
import { resolve } from 'path'

const BASE_DATA_DIR = resolve(__dirname, '../data')

export function readFile(filename: string): string {
  return readFileSync(resolve(BASE_DATA_DIR, filename), 'utf-8')
}

export function readJSON(filename: string): string {
  return JSON.parse(readFile(filename))
}
