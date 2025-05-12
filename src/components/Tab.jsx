import React from 'react'
import css from './Tab.module.css'

const Tab = ({ tabs, activeTab, onTabSelect }) => {
    return (
        <div className={css.tabCon}>
            {tabs.map(({ label, value }) => (
                <button
                    key={value}
                    className={activeTab === value ? css.active : ''}
                    onClick={() => onTabSelect(value)}
                >
                    {label}
                </button>
            ))}
        </div>
    )
}

export default Tab
