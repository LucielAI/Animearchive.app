import { validateAnimePayload } from '../utils/validateSchema'
import aot from './aot.json'
import jjk from './jjk.json'
import hxh from './hxh.json'
import vinlandsaga from './vinlandsaga.json'

aot.id = 'aot'
jjk.id = 'jjk'
hxh.id = 'hxh'

vinlandsaga.id = 'vinlandsaga'

export const ANIME_LIST = [
  aot,
  jjk,
  hxh,
  vinlandsaga
]

// Validate all loaded payloads
ANIME_LIST.forEach(validateAnimePayload)
