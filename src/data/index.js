import { validateAnimePayload } from '../utils/validateSchema'
import aot from './aot.json'
import jjk from './jjk.json'
import hxh from './hxh.json'

export const ANIME_LIST = [
  aot,
  jjk,
  hxh
]

// Validate all loaded payloads
ANIME_LIST.forEach(validateAnimePayload)
