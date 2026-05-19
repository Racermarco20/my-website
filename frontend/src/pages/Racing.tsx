import { useState } from 'react'
import { Link } from 'react-router-dom'
import racingHelm from '../assets/racing-helm.jpg'
import racing1 from '../assets/racing-1.jpg'
import racing2 from '../assets/racing-2.jpg'
import racing3 from '../assets/racing-3.jpg'
import racing4 from '../assets/racing-4.jpg'
import racing5 from '../assets/racing-5.jpg'
import racingGenk1 from '../assets/racing-genk-1.jpg'
import racingGenk2 from '../assets/racing-genk-2.jpg'
import racingGridLineup from '../assets/racing-grid-lineup.jpg'
import racingPortrait from '../assets/racing-portrait.jpg'
import racingLead from '../assets/racing-lead.jpg'
import racingPodiumP1 from '../assets/racing-podium-p1.jpg'
import racingAutumn from '../assets/racing-autumn.jpg'
import racingHodonin from '../assets/racing-hodonin.jpg'
import racingGenkRain from '../assets/racing-genk-rain.jpg'
import racingOutdoorEvent from '../assets/racing-outdoor-event.jpg'

const ACCENT = 'var(--color-brand)'

type Race = { label?: string; pos: string; pts?: number }
type Event = {
    year: string
    date: string
    name: string
    organizer: string
    result?: string
    note?: string
    races?: Race[]
}

const STATS = [
    { label: 'Rennen (SWS 2024)', value: '33' },
    { label: 'Podien (SWS 2024)', value: '21' },
    { label: 'Siege (SWS 2024)', value: '5' },
    { label: 'Ø Platzierung', value: 'P4' },
]

const EVENTS: Event[] = [
    {
        year: '2015', date: '2015', name: 'ÖMSV Staatsmeisterschaft', organizer: 'ÖMSV', result: 'P1',
        note: 'Gesamtsieger Klasse RACER Buggy · Fahrzeug: Havel RSXV',
        races: [
            { label: 'Hollabrunn (R1)', pos: '-', pts: 26.5 },
            { label: 'Rappolz (R2)',   pos: '-', pts: 27 },
            { label: 'Fuglau (R3)',    pos: '-', pts: 22.5 },
            { label: 'Meiselding (R5)',pos: '-', pts: 27 },
            { label: 'Lohn (R6)',      pos: '-', pts: 27 },
            { label: 'Alberndorf (R7)',pos: '-', pts: 24 },
            { label: 'Herzogsdorf (R8)',pos: '-', pts: 24 },
            { label: 'Hollabrunn (R9)',pos: '-', pts: 22.5 },
        ],
    },
    {
        year: '2016', date: '2016', name: 'ÖMSV Staatsmeisterschaft', organizer: 'ÖMSV', result: 'P1',
        note: 'Gesamtsieger Klasse RACER Buggy · Fahrzeug: Havel RSXV',
        races: [
            { label: 'Hollabrunn (R1)',    pos: '-', pts: 27.5 },
            { label: 'Rappolz (R2)',       pos: '-', pts: 20.5 },
            { label: 'Rappolz (R3)',       pos: '-', pts: 28.5 },
            { label: 'Lohn (R4)',          pos: '-', pts: 25.5 },
            { label: 'Oberrakitsch (R5)',  pos: '-', pts: 27 },
            { label: 'Meiselding (R6)',    pos: '-', pts: 28 },
            { label: 'Arbesbach (R8)',     pos: '-', pts: 25 },
        ],
    },
    {
        year: '2017', date: '2017', name: 'ÖMSV Staatsmeisterschaft', organizer: 'ÖMSV', result: 'P5',
        note: 'Klasse RACER Buggy · Fahrzeug: Havel RSXV',
        races: [
            { label: 'Fuglau (R1)', pos: '-', pts: 28.5 },
        ],
    },
    {
        year: '2018', date: '2018', name: 'ÖMSV Staatsmeisterschaft', organizer: 'ÖMSV', result: 'P1',
        note: 'Gesamtsieger Klasse Racerbuggies 125 ccm · Fahrzeug: Magnum RB125',
        races: [
            { label: 'Hollabrunn (R1)',    pos: '-', pts: 25 },
            { label: 'Oberrakitsch (R3)',  pos: '-', pts: 26 },
            { label: 'Meiselding (R4)',    pos: '-', pts: 27 },
            { label: 'Herzogsdorf (R5)',   pos: '-', pts: 26 },
            { label: 'Hollabrunn (R6)',    pos: '-', pts: 25.5 },
        ],
    },
    {
        year: '2019', date: '2019', name: 'ÖMSV Staatsmeisterschaft', organizer: 'ÖMSV', result: 'P3',
        note: 'Klasse Racerbuggies 125 ccm · Fahrzeug: Magnum RB125',
        races: [
            { label: 'Hollabrunn (R1)',    pos: '-', pts: 23.5 },
            { label: 'Gonars (R2)',        pos: '-', pts: 23.0 },
            { label: 'Oberraktisch (R3)',  pos: '-', pts: 16.0 },
            { label: 'Meiselding (R4)',    pos: '-', pts: 28.0 },
            { label: 'Hollabrunn (R7)',    pos: '-', pts: 28.0 },
        ],
    },
    {
        year: '2023', date: 'Apr. 2023', name: 'Bruck an der Leitha (AT)', organizer: 'ÖTSM', result: 'P4',
        races: [
            { label: 'Race 3', pos: 'P4' },
            { label: 'Race 6', pos: 'P4' },
        ],
    },
    {
        year: '2024', date: '2024', name: 'Dolná Seč — Dlha (SK)', organizer: 'ÖTSM', result: 'P2',
        races: [
            { label: 'Race 1', pos: 'P2' },
            { label: 'Race 6', pos: 'P15' },
        ],
    },
    {
        year: '2026', date: '2026', name: 'Steelring (SK)', organizer: 'ÖTSM', result: 'P6',
        races: [
            { label: 'Race 4', pos: 'P6' },
            { label: 'Race 8 (DNF)', pos: 'P15' },
        ],
    },
    {
        year: '2022', date: '30.05.2022', name: 'AOM Jesolo 24h (IT)', organizer: 'AOM', result: 'P1',
        note: 'Team Crazy Ghost pb Kartcom #12',
        races: [
            { label: '24 Stunden Rennen · 1422 Runden', pos: 'P1' },
        ],
    },
    {
        year: '2022', date: '11.–12.06.2022', name: 'AOM Slovakiaring 1 (SK)', organizer: 'AOM', result: 'P1',
        note: 'Team Crazy Ghost pb Kartcom #12',
        races: [
            { label: 'Sa · 1. Sprint',           pos: 'P1' },
            { label: 'Sa · 2. Sprint',           pos: 'P24' },
            { label: 'Sa · 3. Sprint',           pos: 'P5' },
            { label: 'Sa · 4. Sprint',           pos: 'P15' },
            { label: 'So · 9h Rennen · 449 Rd.', pos: 'P1' },
        ],
    },
    {
        year: '2022', date: '05.–06.08.2022', name: 'AOM Slovakiaring 2 (SK)', organizer: 'AOM', result: 'P3',
        note: 'Team Crazy Ghost pb Kartcom #12',
        races: [
            { label: 'Sa · 1. Sprint',           pos: 'P3' },
            { label: 'Sa · 2. Sprint',           pos: 'P10' },
            { label: 'Sa · 3. Sprint',           pos: 'P7' },
            { label: 'Sa · 4. Sprint',           pos: 'P4' },
            { label: 'So · 9h Rennen · 448 Rd.', pos: 'P5' },
        ],
    },
    {
        year: '2022', date: '03.–04.09.2022', name: 'AOM Bruck a.d. Leitha (AT)', organizer: 'AOM', result: 'P1',
        note: 'Team Crazy Ghost pb Kartcom #12',
        races: [
            { label: 'Sa · 1. Sprint',           pos: 'P4' },
            { label: 'Sa · 2. Sprint',           pos: 'P1' },
            { label: 'Sa · 3. Sprint',           pos: 'P10' },
            { label: 'Sa · 4. Sprint',           pos: 'P7' },
            { label: 'So · 9h Bruck · 417 Rd.',  pos: 'P2' },
        ],
    },
    {
        year: '2022', date: '08.–09.10.2022', name: 'AOM Rechnitz (AT)', organizer: 'AOM', result: 'P1',
        note: 'Team Crazy Ghost pb Kartcom #12',
        races: [
            { label: 'Sa · 1. Sprint',           pos: 'P3' },
            { label: 'Sa · 2. Sprint',           pos: 'P8' },
            { label: 'Sa · 3. Sprint',           pos: 'P1' },
            { label: 'Sa · 4. Sprint',           pos: 'P1' },
            { label: 'So · 9 Std. · 524 Rd.',    pos: 'P4' },
        ],
    },
    {
        year: '2025', date: 'Nov 2024 – Feb 2025',
        name: 'JWR 3-Stunden-Cup Melk (AT) · Saison 24/25',
        organizer: 'JWR', result: 'P3',
        note: 'Klasse 150 PS · Team MSP Performance 3 #46 · BMW 318is E36',
        races: [
            { label: 'R1 (17.11.2024)', pos: 'P3',  pts: 20 },
            { label: 'R2 (01.12.2024)', pos: 'P1',  pts: 25 },
            { label: 'R3 (29.12.2024)', pos: 'P10', pts: 11 },
            { label: 'R4 (12.01.2025)', pos: 'P6',  pts: 15 },
            { label: 'R5 (02.02.2025)', pos: 'P1',  pts: 25 },
            { label: 'R6 (23.02.2025)', pos: 'P11', pts: 10 },
            { label: 'Gesamt 150 PS',   pos: 'P3',  pts: 106 },
        ],
    },
    { year: '2023', date: '04.02.2023', name: 'FIBO KARTING (SK)', organizer: 'SWS', result: 'P2', note: '2 Rennen' },
    { year: '2023', date: '07.02.2023', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P1', note: '2 Rennen' },
    { year: '2023', date: '18.02.2023', name: 'Motokáry Modřice (CZ)', organizer: 'SWS', result: 'P12', note: '1 Rennen' },
    { year: '2023', date: '27.02.2023', name: 'FIBO KARTING (SK)', organizer: 'SWS', result: 'P2', note: '1 Rennen' },
    { year: '2023', date: '11.03.2023', name: 'FIBO KARTING (SK)', organizer: 'SWS', result: 'P1', note: '2 Rennen' },
    { year: '2023', date: '12.03.2023', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P2', note: '2 Rennen' },
    { year: '2023', date: '01.04.2023', name: 'FIBO KARTING (SK)', organizer: 'SWS', result: 'P1', note: '2 Rennen' },
    { year: '2023', date: '02.04.2023', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P1', note: '3 Rennen' },
    { year: '2023', date: '10.04.2023', name: 'Slovak Karting Center (SK)', organizer: 'SWS', result: 'P9', note: '1 Rennen' },
    { year: '2023', date: '17.04.2023', name: 'Motokáry Modřice (CZ)', organizer: 'SWS', result: 'P5', note: '3 Rennen' },
    { year: '2023', date: '30.04.2023', name: 'Motokáry Hodonín (CZ)', organizer: 'SWS', result: 'P5', note: '2 Rennen' },
    { year: '2023', date: '01.05.2023', name: 'Slovak Karting Center (SK)', organizer: 'SWS', result: 'P2', note: '1 Rennen' },
    { year: '2023', date: '09.05.2023', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P1', note: '2 Rennen' },
    { year: '2023', date: '21.05.2023', name: 'Slovak Karting Center (SK)', organizer: 'SWS', result: 'P1', note: '1 Rennen' },
    { year: '2023', date: '28.05.2023', name: 'Motokáry Hodonín (CZ)', organizer: 'SWS', result: 'P6', note: '2 Rennen' },
    { year: '2023', date: '29.05.2023', name: 'Slovak Karting Center (SK)', organizer: 'SWS', result: 'P12', note: '1 Rennen' },
    { year: '2023', date: '03.06.2023', name: 'PS Racing Center (AT)', organizer: 'SWS', result: 'P1', note: '3 Rennen' },
    { year: '2023', date: '08.06.2023', name: 'Speed Kart Center (SK)', organizer: 'SWS', result: 'P4', note: '3 Rennen' },
    { year: '2023', date: '11.06.2023', name: 'Styria Karting (AT)', organizer: 'SWS', result: 'P7', note: '1 Rennen' },
    { year: '2023', date: '24.06.2023', name: 'PS Racing Center (AT)', organizer: 'SWS', result: 'P1', note: '3 Rennen' },
    { year: '2023', date: '25.06.2023', name: 'Motokáry Modřice (CZ)', organizer: 'SWS', result: 'P1', note: '2 Rennen' },
    { year: '2023', date: '17.07.2023', name: 'Slovak Karting Center (SK)', organizer: 'SWS', result: 'P5', note: '1 Rennen' },
    { year: '2023', date: '06.08.2023', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P1', note: '3 Rennen' },
    { year: '2023', date: '12.08.2023', name: 'Motokáry MAX 60 (CZ)', organizer: 'SWS', result: 'P2', note: '1 Rennen' },
    { year: '2023', date: '19.08.2023', name: 'Motokáry MAX 60 (CZ)', organizer: 'SWS', result: 'P1', note: '2 Rennen' },
    { year: '2023', date: '21.08.2023', name: 'Motokáry Modřice (CZ)', organizer: 'SWS', result: 'P1', note: '3 Rennen' },
    { year: '2023', date: '02.09.2023', name: 'Slovak Karting Center (SK)', organizer: 'SWS', result: 'P1', note: '2 Rennen' },
    { year: '2023', date: '09.09.2023', name: 'Motokáry Hodonín (CZ)', organizer: 'SWS', result: 'P1', note: '2 Rennen' },
    { year: '2023', date: '10.09.2023', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P1', note: '2 Rennen' },
    { year: '2023', date: '19.09.2023', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P1', note: '2 Rennen' },
    { year: '2023', date: '21.10.2023', name: 'Motokáry Modřice (CZ)', organizer: 'SWS', result: 'P1', note: '1 Rennen' },
    { year: '2023', date: '28.10.2023', name: 'Motokáry Hodonín (CZ)', organizer: 'SWS', result: 'P1', note: '2 Rennen' },
    { year: '2023', date: '02.11.2023', name: 'Motokáry Modřice (CZ)', organizer: 'SWS', result: 'P2', note: '1 Rennen' },
    { year: '2023', date: '06.11.2023', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P14', note: '2 Rennen' },
    { year: '2023', date: '13.11.2023', name: 'PS Racing Center (AT)', organizer: 'SWS', result: 'P1', note: '2 Rennen' },
    { year: '2023', date: '18.11.2023', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P1', note: '3 Rennen' },
    { year: '2023', date: '28.12.2023', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P1', note: '3 Rennen' },
    {
        year: '2024', date: '03.–06.07.2024', name: 'SWS International Finals — Genk (BEL)', organizer: 'SWS', result: 'P3',
        races: [
            { label: 'Heats',        pos: 'P11' },
            { label: 'Super Heat C', pos: 'P1' },
            { label: 'Final A',      pos: 'P3' },
            { label: 'Gesamt',       pos: 'P3' },
        ],
    },
    {
        year: '2024', date: '20.01.2024', name: 'Motokáry Modřice', organizer: 'SWS', result: 'P1',
        races: [
            { label: 'Rennen 1', pos: 'P1', pts: 963 },
        ],
    },
    {
        year: '2024', date: '21.04.2024', name: 'PS Racing Center (AT)', organizer: 'SWS', result: 'P1',
        races: [
            { label: 'Rennen 1', pos: 'P1', pts: 1008 },
            { label: 'Rennen 2', pos: 'P2', pts: 865 },
            { label: 'Rennen 3', pos: 'P2', pts: 865 },
        ],
    },
    {
        year: '2024', date: '27.04.2024', name: 'Motokáry Hodonín', organizer: 'SWS', result: 'P1',
        races: [
            { label: 'Rennen 1', pos: 'P1', pts: 1022 },
            { label: 'Rennen 2', pos: 'P2', pts: 968 },
        ],
    },
    {
        year: '2024', date: '25.05.2024', name: 'Motokáry Hodonín', organizer: 'SWS', result: 'P1',
        races: [
            { label: 'Rennen 1', pos: 'P1', pts: 1022 },
            { label: 'Rennen 2', pos: 'P7', pts: 892 },
        ],
    },
    {
        year: '2024', date: '08.06.2024', name: 'Motokáry Modřice', organizer: 'SWS', result: 'P1',
        races: [
            { label: 'Rennen 1', pos: 'P1', pts: 993 },
            { label: 'Rennen 2', pos: 'P8', pts: 822 },
        ],
    },
    {
        year: '2024', date: '23.06.2024', name: 'PS Racing Center (AT)', organizer: 'SWS', result: 'P2',
        races: [
            { label: 'Rennen 1', pos: 'P9', pts: 346 },
            { label: 'Rennen 2', pos: 'P2', pts: 830 },
            { label: 'Rennen 3', pos: 'P2', pts: 921 },
        ],
    },
    {
        year: '2024', date: '15.07.2024', name: 'Motokáry Hodonín', organizer: 'SWS', result: 'P2',
        races: [
            { label: 'Rennen 1', pos: 'P8', pts: 703 },
            { label: 'Rennen 2', pos: 'P2', pts: 976 },
        ],
    },
    {
        year: '2024', date: '09.08.2024', name: 'Kartbahn Blindenmarkt (AT)', organizer: 'SWS', result: 'P2',
        races: [
            { label: 'Rennen 1', pos: 'P10', pts: 322 },
            { label: 'Rennen 2', pos: 'P2',  pts: 930 },
            { label: 'Rennen 3', pos: 'P2',  pts: 937 },
        ],
    },
    {
        year: '2024', date: '01.09.2024', name: 'Motokáry Hodonín', organizer: 'SWS', result: 'P2',
        races: [
            { label: 'Rennen 1', pos: 'P2', pts: 960 },
            { label: 'Rennen 2', pos: 'P2', pts: 960 },
        ],
    },
    {
        year: '2024', date: '05.10.2024', name: 'Motokáry Modřice', organizer: 'SWS', result: 'P10',
        races: [
            { label: 'Rennen 1', pos: 'P10', pts: 700 },
            { label: 'Rennen 2', pos: 'P12', pts: 642 },
        ],
    },
    {
        year: '2024', date: '06.10.2024', name: 'Motokáry Hodonín', organizer: 'SWS', result: 'P5',
        races: [
            { label: 'Rennen 1', pos: 'P5', pts: 821 },
            { label: 'Rennen 2', pos: 'P5', pts: 821 },
        ],
    },
    {
        year: '2024', date: '25.11.2024', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P2',
        races: [
            { label: 'Rennen 1', pos: 'P2', pts: 899 },
            { label: 'Rennen 2', pos: 'P5', pts: 566 },
            { label: 'Rennen 3', pos: 'P2', pts: 899 },
        ],
    },
    {
        year: '2024', date: '14.12.2024', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P2',
        races: [
            { label: 'Rennen 1', pos: 'P2', pts: 911 },
            { label: 'Rennen 2', pos: 'P4', pts: 711 },
            { label: 'Rennen 3', pos: 'P7', pts: 411 },
        ],
    },
    {
        year: '2024', date: '21.12.2024', name: 'Kart One Arena (SK)', organizer: 'SWS', result: 'P1',
        races: [
            { label: 'Rennen 1', pos: 'P1', pts: 1015 },
            { label: 'Rennen 2', pos: 'P2', pts: 944 },
            { label: 'Rennen 3', pos: 'P1', pts: 1015 },
        ],
    },
]

const ERFOLGE = [
    { year: '2015', title: 'P1 — ÖMSV Staatsmeister', desc: 'Österreichische Autocross-Staatsmeisterschaft — Gesamtsieg in der Klasse RACER Buggy mit dem Havel RSXV. 179.5 Punkte.' },
    { year: '2016', title: 'P1 — ÖMSV Staatsmeister', desc: 'Österreichische Autocross-Staatsmeisterschaft — Titelverteidigung in der Klasse RACER Buggy. 182 Punkte.' },
    { year: '2018', title: 'P1 — ÖMSV Staatsmeister', desc: 'Österreichische Autocross-Staatsmeisterschaft — Gesamtsieg in der Klasse Racerbuggies 125 ccm mit dem Magnum RB125. 129.5 Punkte.' },
    { year: '2024', title: 'P3 — SWS Weltfinale Genk', desc: 'SWS International Finals 2024, Genk (BEL) — P1 Super Heat C, P3 Final A, P3 Gesamtranking. 96 Fahrer aus aller Welt. Best Lap 1:13.852.' },
    { year: '2025', title: 'P3 — JWR 3h-Cup Klasse 150 PS', desc: 'JWR 3-Stunden-Cup Melk Saison 2024/25 — Klassenpodium mit Team MSP Performance 3 (#46, BMW 318is E36). 106 Punkte aus 6 Rennen mit zwei Klassensiegen (R2 & R5).' },
    { year: '2022', title: 'P1 — AOM Jesolo 24h', desc: 'Kart Division AOM Jesolo 30.05.2022, 24-Stunden-Rennen — Sieg mit Team Crazy Ghost pb Kartcom (#12). 1422 Runden, eine Runde Vorsprung auf P2.' },
    { year: '2023', title: '#1 Nationale Rangliste', desc: 'SWS Sprint CUP 2023 — Platz 1 im nationalen Ranking Tschechien. Qualifikation für das Weltfinale in Genk.' },
    { year: '2023', title: '43 Podien in einer Saison', desc: 'SWS Sprint CUP 2023 — 20 Siege, 15× P2, 8× P3 in 73 Rennen.' },
    { year: '2023', title: '#141 International', desc: 'SWS Sprint CUP 2023 — weltweites Ranking.' },
    { year: '2024', title: '#6 Nationale Rangliste', desc: 'SWS Sprint CUP 2024 — Tschechien.' },
    { year: '2024', title: '21 Podien in einer Saison', desc: 'SWS Sprint CUP 2024 — 5 Siege, 12× P2, 4× P3 in 33 Rennen.' },
]

const GALLERY = [
    { src: racingPodiumP1,     alt: 'Podium P1 — Speed Kart Center 2023' },
    { src: racingGenk1,        alt: 'Podium P3 SWS Finale Genk 2024' },
    { src: racingGenk2,        alt: 'Podium P3 SWS Finale Genk 2024' },
    { src: racingLead,         alt: 'Leading the pack — Outdoor 2023' },
    { src: racingGenkRain,     alt: 'SWS Finale Genk 2024 — Regen' },
    { src: racingGridLineup,   alt: 'Grid-Aufstellung' },
    { src: racingOutdoorEvent, alt: 'Outdoor Event 2024' },
    { src: racingPortrait,     alt: 'Im Kart — M. BRAUN' },
    { src: racingAutumn,       alt: 'Herbst-Race Österreich 2023' },
    { src: racingHodonin,      alt: 'Motokáry Hodonín 2024' },
    { src: racingHelm,         alt: 'Helm' },
    { src: racing1,            alt: 'Im Kart' },
    { src: racing2,            alt: 'Renn-Action' },
    { src: racing3,            alt: 'Nacht-Session' },
    { src: racing4,            alt: 'Golden Hour' },
    { src: racing5,            alt: 'Starterfeld' },
]

const YEARS = ['Alle', ...Array.from(new Set(EVENTS.map(e => e.year))).sort((a, b) => +b - +a)]

const ORGANIZER_COLORS: Record<string, string> = {
    SWS:            '#3b82f6',
    ÖTSM:           '#f59e0b',
    ÖMSV:           '#0d9488',
    JWR:            '#e11d48',
    ÖSJV:           '#8b5cf6',
    Motorsportaktiv:'#10b981',
    AOM:            '#ec4899',
    AIM:            '#f97316',
    privat:         '#6b7280',
}

function organizerColor(org: string) {
    return ORGANIZER_COLORS[org] ?? '#6b7280'
}

function bestResult(e: Event): string | undefined {
    if (!e.races) return e.result
    const positions = e.races
        .map(r => parseInt(r.pos.replace('P', '')))
        .filter(n => !isNaN(n))
    if (!positions.length) return e.result
    return `P${Math.min(...positions)}`
}

export default function Racing() {
    const [activeYear, setActiveYear] = useState('Alle')
    const [lightbox, setLightbox] = useState<string | null>(null)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    const filtered = activeYear === 'Alle'
        ? EVENTS
        : EVENTS.filter(e => e.year === activeYear)

    return (
        <main className="min-h-screen px-8 md:px-16 lg:px-24 py-16 relative">
            <Link
                to="/"
                aria-label="Home"
                className="absolute top-6 left-6 md:top-8 md:left-12 z-10 block group"
            >
                <img
                    src="/logo-inverted.svg"
                    alt="Logo"
                    className="h-14 md:h-20 lg:h-24 w-auto opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                    style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }}
                    draggable={false}
                />
            </Link>
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-24 pt-16 md:pt-20">

                <Link
                    to="/"
                    className="text-sm w-fit transition-colors duration-200"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)')}
                >
                    ← Zurück
                </Link>

                {/* ── Hero ── */}
                <section className="flex flex-col gap-3">
                    <span className="text-sm tracking-widest uppercase" style={{ color: ACCENT }}>
                        Motorsport
                    </span>
                    <h1 className="text-5xl lg:text-6xl font-bold" style={{ color: 'var(--color-text)' }}>
                        Racing
                    </h1>
                    <p className="text-lg max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
                        Ich fahre Rennen — in verschiedenen Serien, bei privaten Veranstaltungen
                        und überall wo es Spaß macht.
                    </p>
                </section>

                {/* ── Stats ── */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STATS.map(s => (
                        <div
                            key={s.label}
                            className="flex flex-col gap-1 p-5 rounded-xl border"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                        >
                            <span className="text-3xl font-bold" style={{ color: ACCENT }}>{s.value}</span>
                            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.label}</span>
                        </div>
                    ))}
                </section>

                {/* ── Erfolge ── */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
                        Erfolge
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ERFOLGE.map((e, i) => (
                            <div
                                key={i}
                                className="flex flex-col gap-2 p-5 rounded-xl border relative overflow-hidden"
                                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                            >
                                <span
                                    className="absolute top-0 left-0 bottom-0"
                                    style={{ width: '3px', backgroundColor: ACCENT, opacity: 0.4 }}
                                />
                                <div className="flex items-center justify-between pl-1">
                                    <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                                        {e.title}
                                    </span>
                                    <span className="text-xs font-mono" style={{ color: ACCENT }}>{e.year}</span>
                                </div>
                                <p className="text-xs leading-relaxed pl-1" style={{ color: 'var(--color-text-muted)' }}>
                                    {e.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Veranstaltungen ── */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
                        Veranstaltungen
                    </h2>

                    {/* Jahr-Filter */}
                    <div className="flex flex-wrap gap-2">
                        {YEARS.map(y => (
                            <button
                                key={y}
                                onClick={() => setActiveYear(y)}
                                className="px-4 py-1.5 rounded-lg text-sm border transition-all duration-200"
                                style={{
                                    borderColor: activeYear === y ? ACCENT : 'var(--color-border)',
                                    backgroundColor: activeYear === y ? 'var(--color-surface)' : 'transparent',
                                    color: activeYear === y ? 'var(--color-text)' : 'var(--color-text-muted)',
                                    cursor: 'pointer',
                                }}
                            >
                                {y}
                            </button>
                        ))}
                    </div>

                    {/* Event Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map((e, i) => {
                            const best = bestResult(e)
                            const clickable = !!e.races
                            return (
                                <div
                                    key={i}
                                    className="flex flex-col gap-3 p-5 rounded-xl border relative overflow-hidden transition-all duration-200"
                                    style={{
                                        borderColor: 'var(--color-border)',
                                        backgroundColor: 'var(--color-surface)',
                                        cursor: clickable ? 'pointer' : 'default',
                                    }}
                                    onClick={clickable ? () => setSelectedEvent(e) : undefined}
                                    onMouseEnter={clickable ? ev => {
                                        (ev.currentTarget as HTMLDivElement).style.borderColor = organizerColor(e.organizer)
                                        ;(ev.currentTarget as HTMLDivElement).style.boxShadow = `0 0 18px -6px ${organizerColor(e.organizer)}55`
                                    } : undefined}
                                    onMouseLeave={clickable ? ev => {
                                        (ev.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)'
                                        ;(ev.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                                    } : undefined}
                                >
                                    <span
                                        className="absolute top-0 left-0 bottom-0"
                                        style={{ width: '3px', backgroundColor: organizerColor(e.organizer) }}
                                    />
                                    <div className="flex items-start justify-between pl-1">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                                                {e.name}
                                            </span>
                                            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                                {e.date}
                                            </span>
                                        </div>
                                        {best && (
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Best</span>
                                                <span
                                                    className="text-sm font-bold"
                                                    style={{ color: best === 'P1' ? ACCENT : 'var(--color-text)' }}
                                                >
                                                    {best}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between pl-1">
                                        <span
                                            className="text-xs px-2 py-0.5 rounded-md"
                                            style={{
                                                backgroundColor: `${organizerColor(e.organizer)}22`,
                                                color: organizerColor(e.organizer),
                                            }}
                                        >
                                            {e.organizer}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {e.note && (
                                                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                                    {e.note}
                                                </span>
                                            )}
                                            {clickable && (
                                                <span className="text-xs" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
                                                    Details →
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* ── Galerie ── */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
                        Galerie
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {GALLERY.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setLightbox(img.src)}
                                className="rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer"
                                style={{ borderColor: 'var(--color-border)', aspectRatio: '4/3' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = ACCENT)}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── Lightbox ── */}
                {lightbox && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
                        onClick={() => setLightbox(null)}
                    >
                        <img
                            src={lightbox}
                            alt=""
                            className="max-w-full max-h-full rounded-xl object-contain"
                            style={{ maxHeight: '90vh' }}
                        />
                    </div>
                )}

                {/* ── Event Modal ── */}
                {selectedEvent && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
                        onClick={() => setSelectedEvent(null)}
                    >
                        <div
                            className="w-full max-w-md rounded-2xl border p-6 flex flex-col gap-5 relative overflow-hidden"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                borderColor: organizerColor(selectedEvent.organizer),
                                boxShadow: `0 0 40px -10px ${organizerColor(selectedEvent.organizer)}66`,
                            }}
                            onClick={ev => ev.stopPropagation()}
                        >
                            <span
                                className="absolute top-0 left-0 bottom-0"
                                style={{ width: '4px', backgroundColor: organizerColor(selectedEvent.organizer) }}
                            />
                            <div className="pl-2 flex flex-col gap-1">
                                <div className="flex items-start justify-between gap-2">
                                    <span className="font-bold text-base leading-snug" style={{ color: 'var(--color-text)' }}>
                                        {selectedEvent.name}
                                    </span>
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="text-lg leading-none shrink-0 transition-colors duration-150"
                                        style={{ color: 'var(--color-text-muted)' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                                    >
                                        ×
                                    </button>
                                </div>
                                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                    {selectedEvent.date}
                                </span>
                            </div>

                            <div className="pl-2 flex flex-col gap-2">
                                {(selectedEvent.races ?? []).map((r, i) => {
                                    const pos = parseInt(r.pos.replace('P', ''))
                                    const isPodium = !isNaN(pos) && pos <= 3
                                    return (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between py-2 px-3 rounded-lg"
                                            style={{ backgroundColor: 'var(--color-surface-2)' }}
                                        >
                                            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                                {r.label ?? `Rennen ${i + 1}`}
                                            </span>
                                            <div className="flex items-center gap-4">
                                                {r.pts !== undefined && (
                                                    <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
                                                        {r.pts} Pkt
                                                    </span>
                                                )}
                                                <span
                                                    className="text-sm font-bold w-8 text-right"
                                                    style={{ color: isPodium ? ACCENT : 'var(--color-text)' }}
                                                >
                                                    {r.pos}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    )
}
