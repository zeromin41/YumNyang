import { useSearchParams } from 'react-router-dom'
import './App.css'
import Tab from './components/Tab'
import FloatingButton from './components/FloatingButton'

function App() {
    const tabs = [
        { label: '기본 정보', value: 'info' },
        { label: '조리법', value: 'recipe' },
    ]
    const [searchParams, setSearchParams] = useSearchParams()
    const activeTab = searchParams.get('tab') || tabs[0].value

    return (
        <>
            <Tab
                tabs={tabs}
                activeTab={activeTab}
                onTabSelect={(value) => setSearchParams({ tab: value })}
            />
            <FloatingButton />
        </>
    )
}

export default App
