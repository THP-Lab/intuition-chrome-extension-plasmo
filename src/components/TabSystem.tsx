import React, { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabSystemProps {
  tabs: Tab[];
}

const TabSystem: React.FC<TabSystemProps> = ({ tabs }) => {

  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === index ? '2px solid gray' : 'none',
              backgroundColor: activeTab === index ? '' : 'transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default TabSystem;
