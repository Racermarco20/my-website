export interface Env {
    DB: D1Database
    ALLOWED_ORIGINS: string
    DASHBOARD_TOKEN: string
}

type CFRequest = Request & { cf?: IncomingRequestCfProperties }

function corsHeaders(origin: string | null, allowed: string[]): Record<string, string> {
    const ok = origin && allowed.includes(origin) ? origin : allowed[0] ?? '*'
    return {
        'Access-Control-Allow-Origin': ok,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
    }
}

function json(data: unknown, init: ResponseInit = {}, extraHeaders: Record<string, string> = {}) {
    return new Response(JSON.stringify(data), {
        ...init,
        headers: { 'Content-Type': 'application/json', ...extraHeaders, ...(init.headers ?? {}) },
    })
}

function parseUA(ua: string): { browser: string; os: string; device: string } {
    const s = ua.toLowerCase()
    let browser = 'Other'
    if (s.includes('edg/')) browser = 'Edge'
    else if (s.includes('chrome/') && !s.includes('chromium')) browser = 'Chrome'
    else if (s.includes('firefox/')) browser = 'Firefox'
    else if (s.includes('safari/') && !s.includes('chrome')) browser = 'Safari'

    let os = 'Other'
    if (s.includes('windows')) os = 'Windows'
    else if (s.includes('mac os')) os = 'macOS'
    else if (s.includes('android')) os = 'Android'
    else if (s.includes('iphone') || s.includes('ipad') || s.includes('ios')) os = 'iOS'
    else if (s.includes('linux')) os = 'Linux'

    const device = /mobile|android|iphone/.test(s) ? 'Mobile' : /tablet|ipad/.test(s) ? 'Tablet' : 'Desktop'
    return { browser, os, device }
}

async function handleTrack(req: CFRequest, env: Env, allowed: string[]) {
    const origin = req.headers.get('Origin')
    if (origin && !allowed.includes(origin)) return new Response('forbidden origin', { status: 403 })

    const body = await req.json<{ path?: string; referrer?: string; sessionId?: string }>().catch(() => null)
    if (!body?.path || !body.sessionId) return new Response('bad payload', { status: 400 })

    const ua = req.headers.get('User-Agent') ?? ''
    if (/bot|crawler|spider|preview|headless|monitor/i.test(ua)) {
        return json({ ok: true, skipped: 'bot' }, {}, corsHeaders(origin, allowed))
    }

    const { browser, os, device } = parseUA(ua)
    const cf = req.cf
    const country = (cf?.country as string | undefined) ?? null
    const city = (cf?.city as string | undefined) ?? null

    await env.DB.prepare(
        `INSERT INTO page_views (ts, path, referrer, country, city, ua_browser, ua_os, ua_device, session_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
        .bind(
            Math.floor(Date.now() / 1000),
            body.path.slice(0, 256),
            (body.referrer ?? '').slice(0, 512) || null,
            country,
            city,
            browser,
            os,
            device,
            body.sessionId.slice(0, 64),
        )
        .run()

    return json({ ok: true }, {}, corsHeaders(origin, allowed))
}

async function handleStats(req: Request, env: Env, allowed: string[]) {
    const origin = req.headers.get('Origin')
    const auth = req.headers.get('Authorization')
    if (auth !== `Bearer ${env.DASHBOARD_TOKEN}`) {
        return json({ error: 'unauthorized' }, { status: 401 }, corsHeaders(origin, allowed))
    }

    const url = new URL(req.url)
    const days = Math.min(parseInt(url.searchParams.get('days') ?? '30') || 30, 365)
    const since = Math.floor(Date.now() / 1000) - days * 86400

    const [totals, daily, topPages, referrers, countries, browsers, devices] = await Promise.all([
        env.DB.prepare(
            `SELECT COUNT(*) AS views, COUNT(DISTINCT session_id) AS visitors
             FROM page_views WHERE ts >= ?`
        ).bind(since).first(),
        env.DB.prepare(
            `SELECT date(ts, 'unixepoch') AS day,
                    COUNT(*) AS views,
                    COUNT(DISTINCT session_id) AS visitors
             FROM page_views WHERE ts >= ?
             GROUP BY day ORDER BY day`
        ).bind(since).all(),
        env.DB.prepare(
            `SELECT path, COUNT(*) AS views, COUNT(DISTINCT session_id) AS visitors
             FROM page_views WHERE ts >= ?
             GROUP BY path ORDER BY views DESC LIMIT 20`
        ).bind(since).all(),
        env.DB.prepare(
            `SELECT COALESCE(referrer, '(direct)') AS referrer, COUNT(*) AS views
             FROM page_views WHERE ts >= ?
             GROUP BY referrer ORDER BY views DESC LIMIT 20`
        ).bind(since).all(),
        env.DB.prepare(
            `SELECT COALESCE(country, '??') AS country, COUNT(*) AS views
             FROM page_views WHERE ts >= ?
             GROUP BY country ORDER BY views DESC LIMIT 20`
        ).bind(since).all(),
        env.DB.prepare(
            `SELECT ua_browser AS browser, COUNT(*) AS views
             FROM page_views WHERE ts >= ?
             GROUP BY ua_browser ORDER BY views DESC`
        ).bind(since).all(),
        env.DB.prepare(
            `SELECT ua_device AS device, COUNT(*) AS views
             FROM page_views WHERE ts >= ?
             GROUP BY ua_device ORDER BY views DESC`
        ).bind(since).all(),
    ])

    return json(
        {
            days,
            totals,
            daily: daily.results,
            topPages: topPages.results,
            referrers: referrers.results,
            countries: countries.results,
            browsers: browsers.results,
            devices: devices.results,
        },
        {},
        corsHeaders(origin, allowed),
    )
}

export default {
    async fetch(req: CFRequest, env: Env): Promise<Response> {
        const allowed = env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
        const url = new URL(req.url)

        if (req.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('Origin'), allowed) })
        }
        if (url.pathname === '/e' && req.method === 'POST') return handleTrack(req, env, allowed)
        if (url.pathname === '/s' && req.method === 'GET')  return handleStats(req, env, allowed)
        if (url.pathname === '/' || url.pathname === '/health') return new Response('ok')
        return new Response('not found', { status: 404 })
    },
}
