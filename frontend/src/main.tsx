import './index.css'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About'
import Coding from './pages/Coding'
import Racing from './pages/Racing'
import NotFound from './pages/NotFound'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/coding" element={<Coding />} />
            <Route path="/racing" element={<Racing />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
)
