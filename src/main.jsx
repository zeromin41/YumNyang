import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainPageTest from './pages/MainPageTest'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MainPageTest />
    </StrictMode>
)
