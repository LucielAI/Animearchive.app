import { randomUUID } from 'node:crypto'
import { classifySupabaseFailure, mapFailureToHttpStatus, parseSupabaseError, resolveSupabaseConfig } from './_supabase.js'

function safeBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}

async function insertSuggestion({ supabaseUrl, supabaseKey, payload }) {
  const baseHeaders = {
    'Content-Type': 'application/json',
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    Prefer: 'return=minimal'
  }

  const primary = await fetch(`${supabaseUrl}/rest/v1/archive_suggestions`, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify(payload)
  })

  if (primary.ok) return primary

  const fallbackPayload = {
    anime_name: payload.anime_name,
    created_at: payload.created_at
  }

  return fetch(`${supabaseUrl}/rest/v1/archive_suggestions`, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify(fallbackPayload)
  })
}

export default async function handler(req, res) {
  const requestId = randomUUID()
  res.setHeader('x-request-id', requestId)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', requestId })
  }

  const contentLength = parseInt(req.headers['content-length'] || '0', 10)
  if (contentLength > 4096) {
    return res.status(413).json({ error: 'Too large', requestId })
  }

  const body = safeBody(req)
  const { animeName, source } = body

  if (!animeName || typeof animeName !== 'string' || animeName.length > 100) {
    return res.status(400).json({ error: 'Invalid animeName', requestId })
  }

  const sanitized = animeName.trim().replace(/\s+/g, ' ')
  if (!sanitized || /<|>|script/i.test(sanitized)) {
    return res.status(400).json({ error: 'Invalid characters', requestId })
  }

  const sanitizedSource = typeof source === 'string' ? source.trim().slice(0, 64) : 'direct'

  const supabase = resolveSupabaseConfig()
  if (!supabase.url || !supabase.key) {
    console.error('[api/suggest] missing Supabase env vars', {
      requestId,
      missingUrl: supabase.missing.url,
      missingKey: supabase.missing.key,
      acceptedUrlVars: ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'],
      acceptedKeyVars: ['SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
    })

    return res.status(503).json({ error: 'Suggestion system offline', code: 'config_missing', requestId })
  }

  try {
    const response = await insertSuggestion({
      supabaseUrl: supabase.url.value,
      supabaseKey: supabase.key.value,
      payload: {
        anime_name: sanitized,
        source: sanitizedSource,
        created_at: new Date().toISOString()
      }
    })

    if (!response.ok) {
      const { parsed, raw } = await parseSupabaseError(response)
      const category = classifySupabaseFailure({
        status: response.status,
        parsedError: parsed,
        rawError: raw
      })

      console.error('[api/suggest] storage failed', {
        requestId,
        status: response.status,
        category,
        error: parsed || raw
      })

      return res.status(mapFailureToHttpStatus(category)).json({
        error: 'Storage failed',
        code: category,
        requestId
      })
    }

    return res.status(200).json({ ok: true, requestId })
  } catch (error) {
    console.error('[api/suggest] unexpected failure', {
      requestId,
      name: error?.name,
      message: error?.message
    })
    return res.status(503).json({ error: 'Storage failed', code: 'network_failure', requestId })
  }
}
