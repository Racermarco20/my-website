import { Link } from 'react-router-dom'

const PROJECTS = [
    {
        name: 'my-website',
        description: 'Diese Website — React, TypeScript, Tailwind. Monorepo mit Spring Boot Backend.',
        tags: ['React', 'TypeScript', 'Spring Boot', 'Tailwind'],
        url: 'https://github.com/Racermarco20/my-website',
    },
    {
        name: 'Minecraft ATM Plugin',
        description: 'Fügt einen voll funktionalen Geldautomaten in Minecraft ein — mit PIN-Schutz, Bankkonto und eigenem Interface wenn ein Armorstand in Reichweite ist.',
        tags: ['Java', 'Minecraft', 'Spigot'],
        url: 'https://github.com/Racermarco20/Minecraft-1.21.4-ATM_Plugin',
    },
    {
        name: 'Minecraft EC-Terminal',
        description: 'EC-Kartenterminal als Minecraft-Plugin — Pendant zum ATM-Plugin für bargeldlose Zahlung im Spiel.',
        tags: ['Java', 'Minecraft', 'Spigot'],
        url: 'https://github.com/Racermarco20/Minecraft-1.21.4-EC-Terminal',
    },
    {
        name: 'Philips Hue Control',
        description: 'Web-Interface zum Steuern von Philips Hue Lampen — FastAPI Backend, Tailwind UI.',
        tags: ['Python', 'FastAPI', 'Tailwind', 'HTML'],
        url: 'https://github.com/Racermarco20/PhillipsHueControll',
    },
    {
        name: 'Teams Call Extension',
        description: 'Taskbar-Tool für Windows — markierte Telefonnummer per Hotkey oder Rechtsklick direkt in Microsoft Teams wählen.',
        tags: ['C#', 'Windows', 'Microsoft Teams'],
        url: 'https://github.com/Racermarco20/TeamsCallAppExtension',
    },
]

const STACK = [
    'Java', 'Spring Boot', 'TypeScript', 'React', 'Python',
    'MySQL', 'Docker', 'Git', 'Linux',
]

export default function Coding() {
    return (
        <main className="min-h-screen px-8 md:px-16 lg:px-24 py-16">
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-16">

                <Link
                    to="/"
                    className="text-sm w-fit transition-colors duration-200"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)')}
                >
                    ← Zurück
                </Link>

                {/* Header */}
                <div className="flex flex-col gap-3">
                    <span
                        className="text-sm tracking-widest uppercase"
                        style={{ color: '#4ade80' }}
                    >
                        Was ich baue
                    </span>
                    <h1
                        className="text-5xl lg:text-6xl font-bold"
                        style={{ color: 'var(--color-text)' }}
                    >
                        Coding
                    </h1>
                    <p className="text-lg max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
                        Projekte aus dem Alltag, aus Interesse, oder weil mich was genervt hat.
                    </p>
                </div>

                {/* Projects */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
                        Projekte
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {PROJECTS.map(p => (
                            <a
                                key={p.name}
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col justify-between gap-4 p-5 rounded-xl border relative overflow-hidden transition-all duration-200"
                                style={{
                                    borderColor: 'var(--color-border)',
                                    backgroundColor: 'var(--color-surface)',
                                    textDecoration: 'none',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#4ade80'
                                    ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 22px -6px #4ade8044'
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)'
                                    ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'
                                }}
                            >
                                <span
                                    className="absolute top-0 left-0 bottom-0"
                                    style={{ width: '3px', backgroundColor: '#4ade80', opacity: 0.25 }}
                                />
                                <div className="flex flex-col gap-2 pl-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                                            {p.name}
                                        </span>
                                        <span style={{ color: 'var(--color-border)', fontSize: '0.8rem' }}>↗</span>
                                    </div>
                                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                        {p.description}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-1">
                                    {p.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="text-xs px-2 py-0.5 rounded-md"
                                            style={{
                                                backgroundColor: 'var(--color-surface-2)',
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Stack */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
                        Stack
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {STACK.map(s => (
                            <span
                                key={s}
                                className="text-sm px-3 py-1.5 rounded-lg border"
                                style={{
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-muted)',
                                    backgroundColor: 'var(--color-surface)',
                                }}
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    )
}
