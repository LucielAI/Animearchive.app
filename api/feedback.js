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

async function insertFeedback({ supabaseUrl, supabaseKey, payload }) {
  const baseHeaders = {
    'Content-Type': 'application/json',
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    Prefer: 'return=minimal'
  }

  const primary = await fetch(`${supabaseUrl}/rest/v1/archive_feedback`, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify(payload)
  })

  if (primary.ok) return primary

  const fallbackPayload = {
    page_slug: payload.page_slug,
    vote_type: payload.vote_type,
    created_at: payload.created_at
  }

  return fetch(`${supabaseUrl}/rest/v1/archive_feedback`, {
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
  const { slug, vote, note, context } = body

  if (!slug || typeof slug !== 'string' || slug.length > 50) {
    return res.status(400).json({ error: 'Invalid slug', requestId })
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: 'Malformed slug', requestId })
  }

  if (!['helpful', 'unhelpful', 'needs_data'].includes(vote)) {
    return res.status(400).json({ error: 'Invalid vote', requestId })
  }

  const sanitizedNote = typeof note === 'string' ? note.trim().slice(0, 280) : null
  const sanitizedContext = typeof context === 'string' ? context.trim().slice(0, 80) : null

  if ((sanitizedNote && /<|>|script/i.test(sanitizedNote)) || (sanitizedContext && /<|>|script/i.test(sanitizedContext))) {
    return res.status(400).json({ error: 'Invalid characters', requestId })
  }

  const supabase = resolveSupabaseConfig()
  if (!supabase.url || !supabase.key) {
    console.error('[api/feedback] missing Supabase env vars', {
      requestId,
      missingUrl: supabase.missing.url,
      missingKey: supabase.missing.key,
      acceptedUrlVars: ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'],
      acceptedKeyVars: ['SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
    })
    return res.status(503).json({ error: 'Feedback system offline', code: 'config_missing', requestId })
  }

  try {
    const response = await insertFeedback({
      supabaseUrl: supabase.url.value,
      supabaseKey: supabase.key.value,
      payload: {
        page_slug: slug,
        vote_type: vote,
        note: sanitizedNote,
        context: sanitizedContext,
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

      console.error('[api/feedback] storage failed', {
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
    console.error('[api/feedback] unexpected failure', {
      requestId,
      name: error?.name,
      message: error?.message
    })
    return res.status(503).json({ error: 'Storage failed', code: 'network_failure', requestId })
  }
}
