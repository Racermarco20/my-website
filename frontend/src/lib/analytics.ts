import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ENDPOINT = import.meta.env.VITE_ANALYTICS_URL as string | undefined
const SESSION_KEY = 'marco-analytics-sid'

function sessionId(): string {
    try {
        let sid = sessionStorage.getItem(SESSION_KEY)
        if (!sid) {
            sid = crypto.randomUUID()
            sessionStorage.setItem(SESSION_KEY, sid)
        }
        return sid
    } catch {
        return 'anon'
    }
}

export function usePageTracking() {
    const { pathname } = useLocation()

    useEffect(() => {
        if (!ENDPOINT) return
        if (typeof window === 'undefined') return
        if (pathname.startsWith('/dashboard')) return

        const payload = JSON.stringify({
            path: pathname,
            referrer: document.referrer || null,
            sessionId: sessionId(),
        })

        const url = `${ENDPOINT}/e`
        try {
            fetch(url, {
                method: 'POST',
                body: payload,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'omit',
                keepalive: true,
                mode: 'cors',
            }).catch(() => { /* swallow */ })
        } catch {
            /* swallow — analytics must never break the page */
        }
    }, [pathname])
}
