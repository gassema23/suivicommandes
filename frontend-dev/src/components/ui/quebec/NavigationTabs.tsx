"use client";

import React, { useState } from "react";

interface TabContent {
  id: string;
  label: string;
  content: () => React.ReactNode;
}

interface NavigationTabsProps {
  tabs: TabContent[];
  defaultTab?: string;
  className?: string;
}

export function NavigationTabs({
  tabs,
  defaultTab,
  className = "",
}: NavigationTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={`w-full ${className}`}>
      {/* Navigation des onglets */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="tab-content mt-4">
        <div className="tab-pane active">{activeTabContent?.content()}</div>
      </div>
    </div>
  );
}
