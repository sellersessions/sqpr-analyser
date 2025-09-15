import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import CSVUpload from './components/CSVUpload';
import OverviewDashboard from './components/OverviewDashboard';
import SearchQueryTable from './components/SearchQueryTable';
import FunnelDiagram from './components/FunnelDiagram';
import OpportunitiesPanel from './components/OpportunitiesPanel';
import { COLORS } from './styles/designSystem';
import { BarChart3, Search, TrendingDown, Gem, Upload } from 'lucide-react';

const AppContent: React.FC = () => {
  const { state } = useDashboard();
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'funnel' | 'opportunities'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'table' as const, label: 'Explorer', icon: Search },
    { id: 'funnel' as const, label: 'Funnel', icon: TrendingDown },
    { id: 'opportunities' as const, label: 'Opportunities', icon: Gem },
  ];

  return (
    <div style={{ 
      background: COLORS.bgPrimary, 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gridTemplateRows: 'auto auto 1fr auto',
          columnGap: '0px',
          rowGap: '0px',
          padding: 0,
          flex: 1,
        }}
      >
        {/* Enhanced Header */}
        <div
          style={{
            gridColumn: '2 / span 6',
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: 0,
            paddingRight: 0,
            minWidth: 0,
            minHeight: 0,
            overflow: 'visible',
          }}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes headerRotate { 
                from { transform: rotate(0deg); } 
                to { transform: rotate(360deg); } 
              }
            `
          }} />
          <header
            style={{
              textAlign: 'center',
              marginTop: '20px',
              marginBottom: '40px',
              marginLeft: '0px',
              marginRight: '0px',
              padding: '40px',
              background: 'rgba(3, 12, 27, 0.6)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: `1.5px solid ${COLORS.accentBorder}`,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Rotating background animation */}
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `radial-gradient(circle, ${COLORS.accentAlpha} 0%, transparent 70%)`,
                animation: 'headerRotate 30s linear infinite',
                opacity: 0.3,
                zIndex: 0,
              }}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0px',
                maxWidth: '800px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Header Content Group */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                {/* Title */}
                <h1
                  style={{
                    fontSize: '72px',
                    fontWeight: 700,
                    margin: 0,
                    color: '#ffffff',
                    letterSpacing: '-2px',
                    textAlign: 'center',
                    textShadow: '0 0 25px rgba(255, 255, 255, 0.6), 0 0 50px rgba(255, 255, 255, 0.4), 0 0 100px rgba(157, 78, 221, 0.4)',
                  }}
                >
                  SQPR Analyser
                </h1>

                {/* Subtitle */}
                <div
                  style={{
                    fontSize: '20px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    maxWidth: '600px',
                    textAlign: 'center',
                  }}
                >
                  Advanced Search Performance Analytics for Amazon Sellers
                </div>

                {/* Stage Info */}
                <div
                  style={{
                    fontSize: '14px',
                    color: COLORS.accent,
                    letterSpacing: '1px',
                    margin: 0,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    marginTop: '0.5rem',
                  }}
                >
                  POWERED BY CURV
                </div>
              </div>
            </div>
          </header>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            gridColumn: '2 / span 6',
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: 0,
            paddingRight: 0,
            minWidth: 0,
            minHeight: 0,
            overflow: 'visible',
          }}
        >
          {state.data.length === 0 ? (
            /* Upload Section */
            <div style={{ marginBottom: '2rem' }}>
              <CSVUpload />
            </div>
          ) : (
            /* Dashboard */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Navigation Tabs */}
              <div style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                justifyContent: 'center', 
                flexWrap: 'wrap' 
              }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: activeTab === tab.id 
                        ? 'linear-gradient(135deg, #9d4edd 0%, #c084fc 100%)' 
                        : 'rgba(0, 0, 0, 0.3)',
                      color: activeTab === tab.id ? 'white' : COLORS.textPrimary,
                      border: activeTab === tab.id 
                        ? '1px solid rgba(157, 78, 221, 0.5)' 
                        : `1px solid rgba(157, 78, 221, 0.15)`,
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 300ms ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      boxShadow: activeTab === tab.id 
                        ? '0 8px 25px rgba(157, 78, 221, 0.4), 0 0 20px rgba(157, 78, 221, 0.2)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.background = 'rgba(157, 78, 221, 0.2)';
                        e.currentTarget.style.color = COLORS.accent;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(157, 78, 221, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                        e.currentTarget.style.color = COLORS.textPrimary;
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                      }
                    }}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>


              {/* Loading State */}
              {state.isLoading && (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{
                    display: 'inline-block',
                    width: '2rem',
                    height: '2rem',
                    border: '2px solid rgba(157, 78, 221, 0.3)',
                    borderTop: `2px solid ${COLORS.accent}`,
                    borderRadius: '50%',
                    animation: 'headerRotate 1s linear infinite',
                  }}></div>
                  <p style={{ color: COLORS.textMuted, marginTop: '1rem' }}>Loading...</p>
                </div>
              )}

              {/* Error State */}
              {state.error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                }}>
                  <h3 style={{ color: '#ef4444', fontWeight: 600, marginBottom: '0.5rem' }}>Error</h3>
                  <p style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{state.error}</p>
                </div>
              )}

              {/* Tab Content */}
              {!state.isLoading && !state.error && (
                <div style={{ minHeight: '500px' }}>
                  {activeTab === 'overview' && <OverviewDashboard />}
                  {activeTab === 'table' && <SearchQueryTable />}
                  {activeTab === 'funnel' && <FunnelDiagram />}
                  {activeTab === 'opportunities' && <OpportunitiesPanel />}
                </div>
              )}

              {/* Quick Actions */}
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  onClick={() => {
                    if (window.confirm('This will clear all data and start over. Continue?')) {
                      window.location.reload();
                    }
                  }}
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'transparent',
                    color: COLORS.accent,
                    border: `1px solid ${COLORS.accent}`,
                    borderRadius: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = COLORS.accentAlpha;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = COLORS.accent;
                  }}
                >
                  <Upload size={18} />
                  Upload New File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            gridColumn: '2 / span 6',
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: 0,
            paddingRight: 0,
            minWidth: 0,
            minHeight: 0,
            overflow: 'visible',
          }}
        >
          <footer
            style={{
              textAlign: 'center',
              padding: '40px 0 40px',
              marginTop: '30px',
              marginLeft: '0px',
              marginRight: '0px',
              opacity: 0.6,
              fontSize: '14px',
              borderTop: `1px solid ${COLORS.accentBorder}`,
            }}
          >
            {/* Footer Title */}
            <div
              style={{
                fontWeight: 600,
                marginBottom: '8px',
                fontSize: '16px',
                color: '#ffffff',
              }}
            >
              SQPR Analyser
            </div>

            {/* Footer Subtitle */}
            <div
              style={{
                fontSize: '12px',
                opacity: 0.7,
                marginBottom: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 400,
              }}
            >
              Advanced Search Performance Analytics for Amazon Sellers
            </div>

            {/* Footer Credits */}
            <div
              style={{
                fontSize: '11px',
                opacity: 0.5,
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 400,
                letterSpacing: '0.5px',
              }}
            >
              Produced By Danny McMillan | CURV Tools | A Seller Sessions Production 2025
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <DashboardProvider>
      <AppContent />
    </DashboardProvider>
  );
}

export default App;