import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { FunnelStage } from '../types';
import { COLORS, PANEL_STYLES } from '../styles/designSystem';
import { RefreshCw, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const FunnelDiagram: React.FC = () => {
  const { state } = useDashboard();
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  if (state.data.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem 0',
        color: COLORS.textMuted 
      }}>
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '1rem', 
          display: 'flex', 
          justifyContent: 'center' 
        }}>
          <RefreshCw size={64} />
        </div>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '500', 
          marginBottom: '0.5rem' 
        }}>
          No Funnel Data
        </h3>
        <p>Upload a CSV file to visualize your customer journey</p>
      </div>
    );
  }

  // Calculate funnel stages
  const totals = state.filteredData.reduce(
    (acc, row) => ({
      impressions: acc.impressions + row['Impressions: Total Count'],
      impressionShare: acc.impressionShare + row['Impressions: ASIN Share %'],
      clicks: acc.clicks + row['Clicks: Total Count'],
      clickShare: acc.clickShare + row['Clicks: ASIN Share %'],
      basketAdds: acc.basketAdds + row['Basket Adds: Total Count'],
      basketAddShare: acc.basketAddShare + row['Basket Adds: ASIN Share %'],
      purchases: acc.purchases + row['Purchases: Total Count'],
      purchaseShare: acc.purchaseShare + row['Purchases: ASIN Share %'],
    }),
    {
      impressions: 0,
      impressionShare: 0,
      clicks: 0,
      clickShare: 0,
      basketAdds: 0,
      basketAddShare: 0,
      purchases: 0,
      purchaseShare: 0,
    }
  );

  const dataLength = state.filteredData.length || 1;
  const stages: FunnelStage[] = [
    {
      name: 'Impressions',
      count: totals.impressions,
      share: totals.impressionShare / dataLength,
    },
    {
      name: 'Clicks',
      count: totals.clicks,
      share: totals.clickShare / dataLength,
      conversionRate: (totals.clicks / totals.impressions) * 100,
    },
    {
      name: 'Basket Adds',
      count: totals.basketAdds,
      share: totals.basketAddShare / dataLength,
      conversionRate: (totals.basketAdds / totals.clicks) * 100,
    },
    {
      name: 'Purchases',
      count: totals.purchases,
      share: totals.purchaseShare / dataLength,
      conversionRate: (totals.purchases / totals.basketAdds) * 100,
    },
  ];

  // Calculate drop-offs for problem detection
  const dropOffs = stages.slice(1).map((stage, index) => {
    const previousStage = stages[index];
    const dropOffRate = ((previousStage.count - stage.count) / previousStage.count) * 100;
    return { 
      index: index + 1, 
      rate: dropOffRate,
      isProblematic: dropOffRate > 60, // Flag high drop-offs
      stageFrom: previousStage.name,
      stageTo: stage.name
    };
  });

  const largestDropOff = dropOffs.reduce((max, current) => 
    current.rate > max.rate ? current : max
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getStageWidth = (index: number) => {
    const maxWidth = 100;
    const minWidth = 30;
    const widthReduction = (maxWidth - minWidth) / (stages.length - 1);
    return maxWidth - (index * widthReduction);
  };

  const getStageColor = (index: number) => {
    const colors = [
      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Blue
      'linear-gradient(135deg, #10b981 0%, #047857 100%)', // Green  
      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Orange
      `linear-gradient(135deg, ${COLORS.accent} 0%, #a855f7 100%)`, // Purple
    ];
    return colors[index] || colors[colors.length - 1];
  };

  const getDropOffColor = (rate: number) => {
    if (rate > 70) return '#ef4444'; // Red - Critical
    if (rate > 50) return '#f59e0b'; // Orange - Warning  
    return '#6b7280'; // Gray - Normal
  };

  const getOpportunityType = (stage: FunnelStage, index: number) => {
    const cvr = stage.conversionRate || 0;
    const dropOff = dropOffs[index - 1];
    
    if (dropOff?.isProblematic) {
      return {
        type: 'critical',
        icon: AlertTriangle,
        title: 'Critical Drop-off',
        description: `${dropOff.rate.toFixed(1)}% of users leave here`,
        action: 'Optimize This Stage',
        color: '#ef4444'
      };
    }
    
    if (cvr > 0 && cvr < 30) {
      return {
        type: 'opportunity',
        icon: TrendingUp,
        title: 'Growth Opportunity', 
        description: `Low ${cvr.toFixed(1)}% conversion - potential to improve`,
        action: 'Boost Conversion',
        color: '#f59e0b'
      };
    }
    
    if (cvr > 70) {
      return {
        type: 'success',
        icon: CheckCircle,
        title: 'Performing Well',
        description: `Strong ${cvr.toFixed(1)}% conversion rate`,
        action: 'Scale This Success',
        color: '#10b981'
      };
    }
    
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: COLORS.textPrimary,
          marginBottom: '0.5rem',
          letterSpacing: '-0.025em',
        }}>
          Customer Journey Funnel
        </h2>
        <p style={{
          color: COLORS.textMuted,
          fontSize: '1rem',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Track your customer journey from first impression to final purchase. 
          Spot bottlenecks instantly and discover growth opportunities.
        </p>
      </div>

      {/* Main Funnel Visualization */}
      <div style={{
        ...PANEL_STYLES.glassmorphic,
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `
          linear-gradient(90deg, rgba(157, 78, 221, 0.1) 1px, transparent 1px),
          linear-gradient(rgba(157, 78, 221, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        backgroundPosition: '0 0, 0 0'
      }}>
        {/* Translucent Vertical Funnel Background */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '85%',
          height: 'calc(100% - 4rem)',
          background: `linear-gradient(180deg,
            rgba(157, 78, 221, 0.1) 0%,
            rgba(157, 78, 221, 0.35) 8%,
            rgba(157, 78, 221, 0.25) 25%,
            rgba(157, 78, 221, 0.18) 50%,
            rgba(157, 78, 221, 0.12) 75%,
            rgba(157, 78, 221, 0.08) 92%,
            rgba(157, 78, 221, 0.1) 100%)`,
          clipPath: 'polygon(22% 0%, 78% 0%, 60% 100%, 40% 100%)',
          borderRadius: '20px',
          zIndex: 0,
          filter: 'blur(0.5px)',
          opacity: 0.9,
        }} />

        {/* 3D Funnel Container */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '2rem',
          perspective: '1000px',
          zIndex: 1,
        }}>
          
          {/* Funnel Stages */}
          {stages.map((stage, index) => {
            const opportunity = getOpportunityType(stage, index);
            const isHovered = hoveredStage === index;
            const stageWidth = getStageWidth(index);
            
            return (
              <div key={stage.name} style={{ position: 'relative', width: '100%' }}>
                
                {/* Stage Container */}
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    width: `${stageWidth}%`,
                    minWidth: '300px',
                    height: '120px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '12px',
                    border: `1px solid ${isHovered ? COLORS.accent : 'rgba(157, 78, 221, 0.3)'}`,
                    backdropFilter: 'blur(8px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'scale(1.02) translateZ(10px)' : 'translateZ(0px)',
                    boxShadow: isHovered 
                      ? `0 20px 40px rgba(157, 78, 221, 0.4), 0 0 0 1px ${COLORS.accent}`
                      : '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={() => setHoveredStage(index)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  {/* Stage Content */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    padding: '0 2rem',
                    color: 'white'
                  }}>
                    
                    {/* Left Side - Stage Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '4px',
                        height: '60px',
                        background: getStageColor(index),
                        borderRadius: '2px',
                        boxShadow: `0 0 10px ${getStageColor(index)}`
                      }} />
                      <div>
                        <h3 style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          marginBottom: '0.25rem'
                        }}>
                          {stage.name}
                        </h3>
                        <p style={{
                          fontSize: '0.875rem',
                          opacity: 0.9
                        }}>
                          {stage.share.toFixed(1)}% market share
                        </p>
                      </div>
                    </div>
                    
                    {/* Center - Main Metric */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        marginBottom: '0.25rem'
                      }}>
                        {formatNumber(stage.count)}
                      </div>
                      {stage.conversionRate && (
                        <div style={{
                          fontSize: '1rem',
                          opacity: 0.9,
                          color: stage.conversionRate > 50 ? '#22c55e' : 
                                stage.conversionRate > 30 ? '#f59e0b' : '#ef4444'
                        }}>
                          {stage.conversionRate.toFixed(1)}% CVR
                        </div>
                      )}
                    </div>
                    
                    {/* Right Side - Opportunity Badge */}
                    {opportunity && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '8px',
                        border: `1px solid ${opportunity.color}`,
                      }}>
                        <opportunity.icon size={20} color={opportunity.color} />
                        <div>
                          <div style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '600',
                            color: opportunity.color 
                          }}>
                            {opportunity.title}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Drop-off Indicator */}
                {index < stages.length - 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0.5rem 0',
                    gap: '1rem'
                  }}>
                    {/* Arrow */}
                    <div style={{
                      width: '2px',
                      height: '40px',
                      background: `linear-gradient(180deg, ${getDropOffColor(dropOffs[index].rate)} 0%, transparent 100%)`,
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        bottom: '-5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '0',
                        height: '0',
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: `10px solid ${getDropOffColor(dropOffs[index].rate)}`
                      }} />
                    </div>
                    
                    {/* Drop-off Stats */}
                    <div style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '8px',
                      border: `1px solid ${getDropOffColor(dropOffs[index].rate)}`,
                      color: getDropOffColor(dropOffs[index].rate),
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      -{dropOffs[index].rate.toFixed(1)}% drop-off
                    </div>
                  </div>
                )}
                
              </div>
            );
          })}
        </div>

        {/* Opportunity Callouts */}
        {hoveredStage !== null && getOpportunityType(stages[hoveredStage], hoveredStage) && (
          <div style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            padding: '1.5rem',
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            border: `1px solid ${getOpportunityType(stages[hoveredStage], hoveredStage)?.color}`,
            maxWidth: '300px',
            color: 'white'
          }}>
            {(() => {
              const opp = getOpportunityType(stages[hoveredStage], hoveredStage)!;
              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <opp.icon size={24} color={opp.color} />
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: opp.color }}>
                      {opp.title}
                    </h4>
                  </div>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.5' }}>
                    {opp.description}
                  </p>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: opp.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {opp.action}
                  </button>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div style={{
        ...PANEL_STYLES.glassmorphic,
        padding: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: COLORS.accent,
              marginBottom: '0.5rem'
            }}>
              {((totals.purchases / totals.impressions) * 100).toFixed(2)}%
            </div>
            <div style={{ color: COLORS.textMuted }}>Overall Conversion</div>
          </div>
          
          <div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#ef4444',
              marginBottom: '0.5rem'
            }}>
              {largestDropOff.rate.toFixed(1)}%
            </div>
            <div style={{ color: COLORS.textMuted }}>Biggest Problem</div>
          </div>
          
          <div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#f59e0b',
              marginBottom: '0.5rem'
            }}>
              {largestDropOff.stageFrom} → {largestDropOff.stageTo}
            </div>
            <div style={{ color: COLORS.textMuted }}>Critical Stage</div>
          </div>
          
          <div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#10b981',
              marginBottom: '0.5rem'
            }}>
              {dropOffs.filter(d => d.isProblematic).length}
            </div>
            <div style={{ color: COLORS.textMuted }}>Issues to Fix</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelDiagram;