import { useState } from 'react'
import './App.css'
import Nutritional from './components/Nutritional'
import Menu from './components/Menu'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Nutritional />
            <Menu />
        </>
    )
}

export default App
