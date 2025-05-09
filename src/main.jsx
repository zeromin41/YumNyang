import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RecipeDetailPage from './pages/RecipeDetailPage.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RecipeDetailPage />
    </StrictMode>
)
