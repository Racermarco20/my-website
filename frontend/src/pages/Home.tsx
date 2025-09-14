import { Link } from 'react-router-dom'
export default function Home() {
    return (
        <main>
            <h1>Home</h1>
            <nav>
                <Link to="/about">About</Link> | <Link to="/login">Login</Link>
            </nav>
        </main>
    )
}
