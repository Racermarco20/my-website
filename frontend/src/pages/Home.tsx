import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BRAND_NAME } from '../brand'
import marcoFace from '../assets/marco-face.png'
import marcoHelm from '../assets/marco-helm.png'

const REVEAL_RADIUS = 140
const IDLE_RADIUS = 70
const IDLE_DELAY_MS = 1500

interface WorldCardProps {
    to: string
    label: string
    sub: string
    hoverColor: string
}

function WorldCard({ to, label, sub, hoverColor }: WorldCardProps) {
    const [hovered, setHovered] = useState(false)
    return (
        <Link
            to={to}
            className="flex flex-col justify-between px-5 py-5 rounded-xl border transition-all duration-200 flex-1 overflow-hidden relative"
            style={{
                borderColor: hovered ? hoverColor : 'var(--color-border)',
                backgroundColor: hovered ? 'var(--color-surface)' : 'transparent',
                color: 'var(--color-text)',
                boxShadow: hovered ? `0 0 22px -6px ${hoverColor}55` : 'none',
                textDecoration: 'none',
                minHeight: '90px',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span
                className="absolute top-0 left-0 bottom-0 transition-all duration-200"
                style={{
                    width: '3px',
                    backgroundColor: hoverColor,
                    opacity: hovered ? 1 : 0.25,
                }}
            />
            <span className="font-semibold text-sm pl-1">{label}</span>
            <div className="flex items-end justify-between pl-1">
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{sub}</span>
                <span
                    className="text-sm transition-all duration-200"
                    style={{
                        color: hovered ? hoverColor : 'var(--color-border)',
                        transform: hovered ? 'translateX(2px)' : 'translateX(0)',
                    }}
                >
                    →
                </span>
            </div>
        </Link>
    )
}
const STEPS = 80

function getOrganicPath(cx: number, cy: number, r: number, t: number): string {
    if (r <= 1) return ''
    const pts = Array.from({ length: STEPS }, (_, i) => {
        const a = (i / STEPS) * Math.PI * 2
        const perturb =
            22 * Math.sin(a * 2 + 0.8  + t * 0.7) +
            14 * Math.sin(a * 3 - 1.3  + t * 1.1) +
            9  * Math.sin(a * 5 + 2.0  - t * 0.5) +
            5  * Math.sin(a * 7 - 0.6  + t * 0.9) +
            3  * Math.sin(a * 11 + 1.1 - t * 1.3)
        const rad = Math.max(1, r + perturb * (r / REVEAL_RADIUS))
        return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`
    })
    return `M ${pts[0]} L ${pts.slice(1).join(' L ')} Z`
}

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [pos, setPos] = useState({ x: -999, y: -999 })
    const [interacting, setInteracting] = useState(false)
    const [animRadius, setAnimRadius] = useState(0)
    const [time, setTime] = useState(0)
    const containerSizeRef = useRef({ width: 0, height: 0 })
    const rafRef = useRef<number>(0)
    const morphRafRef = useRef<number>(0)
    const driftRafRef = useRef<number>(0)
    const speedRef = useRef(0)
    const lastPosRef = useRef({ x: -999, y: -999 })
    const lastInteractRef = useRef(0)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver(() => {
            containerSizeRef.current = { width: el.offsetWidth, height: el.offsetHeight }
        })
        ro.observe(el)
        containerSizeRef.current = { width: el.offsetWidth, height: el.offsetHeight }
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        const target = interacting ? REVEAL_RADIUS : IDLE_RADIUS
        const animate = () => {
            setAnimRadius(prev => {
                const diff = target - prev
                if (Math.abs(diff) < 0.5) return target
                rafRef.current = requestAnimationFrame(animate)
                return prev + diff * 0.12
            })
        }
        rafRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafRef.current!)
    }, [interacting])

    // Morphing — schneller je mehr Cursor-Bewegung
    useEffect(() => {
        let last = performance.now()
        const tick = (now: number) => {
            const dt = (now - last) / 1000
            last = now
            const speed = speedRef.current
            // Basis 0.4, max ~4 bei schneller Bewegung
            const rate = 0.4 + Math.min(speed * 0.015, 3.5)
            speedRef.current = speed * 0.85 // decay
            setTime(t => t + dt * rate)
            morphRafRef.current = requestAnimationFrame(tick)
        }
        morphRafRef.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(morphRafRef.current!)
    }, [])

    // Idle auto-drift — sanfte Lissajous-Bewegung wenn niemand interagiert.
    // Reduziert sich/stoppt sobald gehovered oder getoucht wird.
    useEffect(() => {
        const tick = () => {
            const { width, height } = containerSizeRef.current
            const sinceInteract = performance.now() - lastInteractRef.current
            if (!interacting && sinceInteract > IDLE_DELAY_MS && width && height) {
                const t = performance.now() / 1000
                const cx = width  * 0.5 + Math.cos(t * 0.35) * width  * 0.28
                const cy = height * 0.45 + Math.sin(t * 0.5)  * height * 0.22
                setPos({ x: cx, y: cy })
            }
            driftRafRef.current = requestAnimationFrame(tick)
        }
        driftRafRef.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(driftRafRef.current!)
    }, [interacting])

    function updateFromPoint(clientX: number, clientY: number) {
        const rect = containerRef.current!.getBoundingClientRect()
        const x = clientX - rect.left
        const y = clientY - rect.top
        const dx = x - lastPosRef.current.x
        const dy = y - lastPosRef.current.y
        speedRef.current = Math.sqrt(dx * dx + dy * dy)
        lastPosRef.current = { x, y }
        lastInteractRef.current = performance.now()
        setPos({ x, y })
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        updateFromPoint(e.clientX, e.clientY)
    }

    function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
        const t = e.touches[0]
        if (!t) return
        updateFromPoint(t.clientX, t.clientY)
    }

    const outerRect = 'M -9999,-9999 H 9999 V 9999 H -9999 Z'
    const innerShape = getOrganicPath(pos.x, pos.y, animRadius, time)
    const clipD = innerShape ? `${outerRect} ${innerShape}` : outerRect

    return (
        <main className="min-h-screen flex items-center px-8 md:px-16 lg:px-24 relative pt-28 pb-12 md:pt-0 md:pb-0">
            <Link
                to="/"
                aria-label={BRAND_NAME}
                className="absolute top-6 left-6 md:top-8 md:left-12 z-10 block group"
            >
                <img
                    src="/logo-inverted.svg"
                    alt={BRAND_NAME}
                    className="h-14 md:h-20 lg:h-24 w-auto opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                    style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }}
                    draggable={false}
                />
            </Link>

            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 items-center">

                {/* Left: Text */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
                        Developer & Racer
                    </p>
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
                        {BRAND_NAME}
                    </h1>
                    <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                        Ich baue Dinge. Ich fahre schnell.
                        <br />
                        Manchmal beides gleichzeitig.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <WorldCard
                            to="/coding"
                            label="Coding"
                            sub="Projekte & Stack"
                            hoverColor="#4ade80"
                        />
                        <WorldCard
                            to="/racing"
                            label="Racing"
                            sub="Karriere & Rennen"
                            hoverColor="var(--color-brand)"
                        />
                    </div>
                    <a
                        href="https://github.com/Racermarco20"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs mt-1 transition-colors duration-200"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)')}
                    >
                        github.com/Racermarco20 ↗
                    </a>
                </div>

                {/* Right: Image reveal */}
                <div
                    ref={containerRef}
                    className="relative w-full select-none md:col-span-3 overflow-hidden mx-auto md:cursor-none max-w-[380px] md:max-w-none"
                    style={{ aspectRatio: '3/4', touchAction: 'pan-y' }}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => { setInteracting(true); lastInteractRef.current = performance.now() }}
                    onMouseLeave={() => { setInteracting(false); lastInteractRef.current = performance.now() }}
                    onTouchStart={e => { setInteracting(true); handleTouchMove(e) }}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={() => { setInteracting(false); lastInteractRef.current = performance.now() }}
                    onTouchCancel={() => { setInteracting(false); lastInteractRef.current = performance.now() }}
                >
                    {/* SVG clip-path definition */}
                    <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
                        <defs>
                            <clipPath id="helm-organic-clip" clipPathUnits="userSpaceOnUse">
                                <path d={clipD} clipRule="evenodd" />
                            </clipPath>
                        </defs>
                    </svg>

                    {/* Bottom: Face — immer sichtbar, blauer Monitor-Tint */}
                    <img
                        src={marcoFace}
                        alt="Marco"
                        className="absolute inset-0 w-full h-full object-contain object-top"
                        draggable={false}
                        style={{}}
                    />

                    {/* Code-Snippets — sichtbar wenn Reveal-Radius sie aufdeckt */}
                    {([
                        { text: 'const me = new Developer()', topPct: 18, leftPct: 22 },
                        { text: 'git commit -m "ship it"',    topPct: 22, rightPct: 18 },
                        { text: '<Marco />',                  topPct: 48, leftPct: 14 },
                        { text: 'while(true) { build() }',   topPct: 60, rightPct: 14 },
                        { text: '> npm run dev',              topPct: 73, leftPct: 18 },
                        { text: '{ passion: "racing" }',     topPct: 35, rightPct: 16 },
                    ] as const).map((s, i) => {
                        const { width, height } = containerSizeRef.current
                        const sx = 'leftPct' in s ? (s.leftPct / 100) * width : width - (s.rightPct / 100) * width
                        const sy = (s.topPct / 100) * height
                        const dist = Math.sqrt((sx - pos.x) ** 2 + (sy - pos.y) ** 2)
                        const revealed = animRadius > 10 && dist < animRadius
                        return (
                            <span
                                key={i}
                                className="absolute text-xs font-mono whitespace-nowrap pointer-events-none"
                                style={{
                                    top: `${s.topPct}%`,
                                    left: 'leftPct' in s ? `${s.leftPct}%` : undefined,
                                    right: 'rightPct' in s ? `${s.rightPct}%` : undefined,
                                    color: '#4ade80',
                                    opacity: revealed ? 0.9 : 0,
                                    transform: revealed ? 'translateY(0)' : 'translateY(4px)',
                                    transition: 'opacity 0.25s ease, transform 0.25s ease',
                                    textShadow: '0 0 8px rgba(74,222,128,0.6)',
                                }}
                            >
                                {s.text}
                            </span>
                        )
                    })}

                    {/* Top: Helm — organisches Loch wo Cursor ist */}
                    <img
                        src={marcoHelm}
                        alt="Marco mit Helm"
                        className="absolute inset-0 w-full h-full object-contain object-top"
                        draggable={false}
                        style={{ clipPath: 'url(#helm-organic-clip)' }}
                    />
                </div>

            </div>
        </main>
    )
}
