import React from 'react'

interface Tab {
  label: string
  content: React.ReactNode
}

interface TabSystemProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tab: string) => void
}

const TabSystem: React.FC<TabSystemProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => onTabChange(tab.label)}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === tab.label ? '2px solid gray' : 'none',
              backgroundColor: activeTab === tab.label ? '' : 'transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {tabs.find((tab) => tab.label === activeTab)?.content}
      </div>
    </div>
  )
}

export default TabSystem
