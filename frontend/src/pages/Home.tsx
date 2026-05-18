import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BRAND_NAME } from '../brand'
import marcoFace from '../assets/marco-face.png'
import marcoHelm from '../assets/marco-helm.png'

const REVEAL_RADIUS = 140
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
    const [hovering, setHovering] = useState(false)
    const [animRadius, setAnimRadius] = useState(0)
    const [time, setTime] = useState(0)
    const containerSizeRef = useRef({ width: 0, height: 0 })
    const rafRef = useRef<number>(0)
    const morphRafRef = useRef<number>(0)
    const speedRef = useRef(0)
    const lastPosRef = useRef({ x: -999, y: -999 })

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
        const target = hovering ? REVEAL_RADIUS : 0
        const animate = () => {
            setAnimRadius(prev => {
                const diff = target - prev
                if (Math.abs(diff) < 1) return target
                rafRef.current = requestAnimationFrame(animate)
                return prev + diff * 0.18
            })
        }
        rafRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafRef.current!)
    }, [hovering])

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

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = containerRef.current!.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const dx = x - lastPosRef.current.x
        const dy = y - lastPosRef.current.y
        speedRef.current = Math.sqrt(dx * dx + dy * dy)
        lastPosRef.current = { x, y }
        setPos({ x, y })
    }

    const outerRect = 'M -9999,-9999 H 9999 V 9999 H -9999 Z'
    const innerShape = getOrganicPath(pos.x, pos.y, animRadius, time)
    const clipD = innerShape ? `${outerRect} ${innerShape}` : outerRect

    return (
        <main className="min-h-screen flex items-center px-8 md:px-16 lg:px-24">
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
                        <Link
                            to="/about"
                            className="px-6 py-3 rounded-lg font-semibold text-sm transition-colors duration-200"
                            style={{ backgroundColor: 'var(--color-brand)', color: '#fff' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-brand-light)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-brand)')}
                        >
                            Über mich
                        </Link>
                        <a
                            href="https://github.com/Racermarco20"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 rounded-lg font-semibold text-sm border transition-colors duration-200"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-brand)'
                                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-brand)'
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)'
                                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)'
                            }}
                        >
                            GitHub
                        </a>
                    </div>
                </div>

                {/* Right: Image reveal */}
                <div
                    ref={containerRef}
                    className="relative w-full cursor-none select-none md:col-span-3 overflow-hidden"
                    style={{ aspectRatio: '3/4' }}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => { setHovering(false); setPos({ x: -999, y: -999 }) }}
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
