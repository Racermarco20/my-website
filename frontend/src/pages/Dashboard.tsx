import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const ENDPOINT = import.meta.env.VITE_ANALYTICS_URL as string | undefined
const TOKEN_KEY = 'marco-dashboard-token'
const ACCENT = 'var(--color-brand)'

type Row = Record<string, string | number | null>
type Stats = {
    days: number
    totals: { views: number; visitors: number }
    daily:      { day: string; views: number; visitors: number }[]
    topPages:   { path: string; views: number; visitors: number }[]
    referrers:  { referrer: string; views: number }[]
    countries:  { country: string; views: number }[]
    browsers:   { browser: string; views: number }[]
    devices:    { device: string; views: number }[]
}

const RANGES = [
    { label: '7 Tage',  value: 7 },
    { label: '30 Tage', value: 30 },
    { label: '90 Tage', value: 90 },
    { label: '1 Jahr',  value: 365 },
]

function useToken() {
    const [token, setToken] = useState<string>(() => localStorage.getItem(TOKEN_KEY) ?? '')
    const save = (t: string) => {
        localStorage.setItem(TOKEN_KEY, t)
        setToken(t)
    }
    const clear = () => {
        localStorage.removeItem(TOKEN_KEY)
        setToken('')
    }
    return { token, save, clear }
}

function LineChart({ data }: { data: { day: string; views: number; visitors: number }[] }) {
    const W = 800, H = 220, P = 32
    if (!data.length) {
        return <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Noch keine Daten.</div>
    }
    const maxY = Math.max(1, ...data.map(d => d.views))
    const stepX = (W - 2 * P) / Math.max(1, data.length - 1)
    const yOf = (v: number) => H - P - (v / maxY) * (H - 2 * P)
    const xOf = (i: number) => P + i * stepX

    const path = (key: 'views' | 'visitors') =>
        data.map((d, i) => `${i ? 'L' : 'M'}${xOf(i).toFixed(1)},${yOf(d[key]).toFixed(1)}`).join(' ')

    const gridY = [0, 0.25, 0.5, 0.75, 1].map(t => H - P - t * (H - 2 * P))

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {gridY.map((y, i) => (
                <line key={i} x1={P} x2={W - P} y1={y} y2={y} stroke="var(--color-border)" strokeDasharray="2 4" />
            ))}
            <path d={path('views')}    fill="none" stroke={ACCENT}              strokeWidth={2} />
            <path d={path('visitors')} fill="none" stroke="var(--color-text)" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7} />
            {data.map((d, i) => (
                <g key={i}>
                    <circle cx={xOf(i)} cy={yOf(d.views)} r={2.5} fill={ACCENT} />
                    {(i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 8) === 0) && (
                        <text x={xOf(i)} y={H - 8} fontSize={10} textAnchor="middle" fill="var(--color-text-muted)">
                            {d.day.slice(5)}
                        </text>
                    )}
                </g>
            ))}
            <text x={P} y={14} fontSize={10} fill="var(--color-text-muted)">max {maxY}</text>
        </svg>
    )
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
    const pct = Math.max(2, (value / Math.max(1, max)) * 100)
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
                <span className="truncate pr-2" style={{ color: 'var(--color-text)' }}>{label}</span>
                <span className="font-mono shrink-0" style={{ color: 'var(--color-text-muted)' }}>{value}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ACCENT, opacity: 0.7 }} />
            </div>
        </div>
    )
}

function Panel({ title, rows, labelKey }: { title: string; rows: Row[]; labelKey: string }) {
    const max = Math.max(1, ...rows.map(r => Number(r.views) || 0))
    return (
        <div
            className="flex flex-col gap-3 p-5 rounded-xl border"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
            <h3 className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>{title}</h3>
            <div className="flex flex-col gap-2">
                {rows.length === 0 && (
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>—</span>
                )}
                {rows.slice(0, 10).map((r, i) => (
                    <Bar key={i} label={String(r[labelKey] ?? '—')} value={Number(r.views) || 0} max={max} />
                ))}
            </div>
        </div>
    )
}

function Kpi({ label, value }: { label: string; value: number | string }) {
    return (
        <div
            className="flex flex-col gap-1 p-5 rounded-xl border relative overflow-hidden"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
            <span className="absolute top-0 left-0 right-0" style={{ height: '2px', backgroundColor: ACCENT, opacity: 0.5 }} />
            <span className="text-3xl font-bold" style={{ color: ACCENT }}>{value}</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
        </div>
    )
}

export default function Dashboard() {
    const { token, save, clear } = useToken()
    const [days, setDays] = useState(30)
    const [stats, setStats] = useState<Stats | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState('')

    useEffect(() => {
        if (!token || !ENDPOINT) return
        let cancelled = false
        setLoading(true)
        setError(null)
        fetch(`${ENDPOINT}/s?days=${days}`, { headers: { Authorization: `Bearer ${token}` }, credentials: 'omit' })
            .then(async r => {
                if (r.status === 401) throw new Error('Falscher Token')
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                return r.json() as Promise<Stats>
            })
            .then(d => { if (!cancelled) setStats(d) })
            .catch(e => { if (!cancelled) { setError(e.message); if (e.message === 'Falscher Token') clear() } })
            .finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, days])

    const dailyAvg = useMemo(() => {
        if (!stats?.daily.length) return 0
        return Math.round(stats.totals.views / stats.daily.length)
    }, [stats])

    if (!ENDPOINT) {
        return (
            <main className="min-h-screen flex items-center justify-center px-8">
                <div className="max-w-md text-center flex flex-col gap-3">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Analytics nicht konfiguriert</h1>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Setze <code>VITE_ANALYTICS_URL</code> in einer <code>.env</code> bevor du baust.
                    </p>
                </div>
            </main>
        )
    }

    if (!token) {
        return (
            <main className="min-h-screen flex items-center justify-center px-8">
                <form
                    onSubmit={e => { e.preventDefault(); if (input.trim()) save(input.trim()) }}
                    className="w-full max-w-sm flex flex-col gap-4 p-6 rounded-xl border"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                >
                    <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Dashboard-Login</h1>
                    <input
                        type="password"
                        placeholder="Token"
                        autoFocus
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="px-3 py-2 rounded-lg border text-sm bg-transparent outline-none"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: ACCENT, color: 'var(--color-text)' }}
                    >
                        Einloggen
                    </button>
                    <Link to="/" className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>← Zurück</Link>
                </form>
            </main>
        )
    }

    return (
        <main className="min-h-screen px-8 md:px-16 lg:px-24 py-16">
            <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm tracking-widest uppercase" style={{ color: ACCENT }}>Analytics</span>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {RANGES.map(r => (
                            <button
                                key={r.value}
                                onClick={() => setDays(r.value)}
                                className="px-3 py-1.5 rounded-lg text-xs border transition-colors"
                                style={{
                                    borderColor: days === r.value ? ACCENT : 'var(--color-border)',
                                    color: days === r.value ? 'var(--color-text)' : 'var(--color-text-muted)',
                                    backgroundColor: days === r.value ? 'var(--color-surface)' : 'transparent',
                                    cursor: 'pointer',
                                }}
                            >
                                {r.label}
                            </button>
                        ))}
                        <button
                            onClick={clear}
                            className="px-3 py-1.5 rounded-lg text-xs border ml-2"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {error && (
                    <div className="p-4 rounded-xl border text-sm" style={{ borderColor: ACCENT, color: ACCENT }}>
                        Fehler: {error}
                    </div>
                )}

                {loading && !stats && (
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Lade…</p>
                )}

                {stats && (
                    <>
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Kpi label="Visitors"          value={stats.totals.visitors} />
                            <Kpi label="Pageviews"         value={stats.totals.views} />
                            <Kpi label="Ø Views/Tag"       value={dailyAvg} />
                            <Kpi label="Aktive Tage"       value={stats.daily.length} />
                        </section>

                        <section
                            className="p-5 rounded-xl border flex flex-col gap-3"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
                                    Traffic über Zeit
                                </h3>
                                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                    <span className="flex items-center gap-1.5">
                                        <span style={{ width: 12, height: 2, backgroundColor: ACCENT }} /> Views
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span style={{ width: 12, height: 2, backgroundColor: 'var(--color-text)' }} /> Visitors
                                    </span>
                                </div>
                            </div>
                            <LineChart data={stats.daily} />
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Panel title="Top-Seiten"  rows={stats.topPages}  labelKey="path" />
                            <Panel title="Referrer"    rows={stats.referrers} labelKey="referrer" />
                            <Panel title="Länder"      rows={stats.countries} labelKey="country" />
                            <Panel title="Browser"     rows={stats.browsers}  labelKey="browser" />
                            <Panel title="Geräte"      rows={stats.devices}   labelKey="device" />
                        </section>

                        <Link to="/" className="text-xs" style={{ color: 'var(--color-text-muted)' }}>← Zurück zur Seite</Link>
                    </>
                )}
            </div>
        </main>
    )
}
