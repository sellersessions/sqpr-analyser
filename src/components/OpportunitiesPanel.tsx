import React, { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { SQPRData, Opportunity, OpportunityRule } from '../types';
import { COLORS, PANEL_STYLES, CURV_ANIMATIONS } from '../styles/designSystem';
import { Gem, AlertTriangle, TrendingUp, DollarSign, Zap, Search, CheckCircle, Target, ChevronLeft, ChevronRight } from 'lucide-react';

const OpportunitiesPanel: React.FC = () => {
  const { state } = useDashboard();
  const [activeTab, setActiveTab] = useState<'high' | 'medium' | 'low'>('high');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredOpportunity, setHoveredOpportunity] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const pageSize = 10;

  // Define opportunity rules
  const opportunityRules: OpportunityRule[] = [
    {
      id: 'hidden-gem',
      name: 'Hidden Gem',
      description: 'Low market share but high conversion rate - untapped potential',
      condition: (data: SQPRData) => {
        const impressionShare = data['Impressions: ASIN Share %'];
        const purchaseRate = data['Purchases: Purchase Rate %'] ||
          (data['Purchases: Total Count'] / data['Basket Adds: Total Count']) * 100;
        return impressionShare < 10 && purchaseRate > 50;
      },
      action: 'Increase PPC spend and improve SEO to capture more traffic',
      category: 'hidden-gem',
    },
    {
      id: 'funnel-bottleneck',
      name: 'Funnel Bottleneck',
      description: 'High click rate but low add-to-cart rate - listing optimization needed',
      condition: (data: SQPRData) => {
        const clickRate = data['Clicks: Click Rate %'] ||
          (data['Clicks: Total Count'] / data['Impressions: Total Count']) * 100;
        const basketAddRate = data['Basket Adds: Basket Add Rate %'] ||
          (data['Basket Adds: Total Count'] / data['Clicks: Total Count']) * 100;
        return clickRate > 10 && basketAddRate < 15;
      },
      action: 'Optimize product listing, images, and pricing strategy',
      category: 'funnel-bottleneck',
    },
    {
      id: 'high-traffic-low-conversion',
      name: 'High Traffic, Low Conversion',
      description: 'Good visibility but poor conversion - needs optimization',
      condition: (data: SQPRData) => {
        const impressions = data['Impressions: Total Count'];
        const overallCVR = (data['Purchases: Total Count'] / impressions) * 100;
        return impressions > 5000 && overallCVR < 1;
      },
      action: 'Review pricing, improve product images, and enhance A+ content',
      category: 'funnel-bottleneck',
    },
    {
      id: 'share-opportunity',
      name: 'Share Opportunity',
      description: 'Strong performance metrics with room to grow market share',
      condition: (data: SQPRData) => {
        const clickShare = data['Clicks: ASIN Share %'];
        const purchaseShare = data['Purchases: ASIN Share %'];
        const clickRate = data['Clicks: Click Rate %'] ||
          (data['Clicks: Total Count'] / data['Impressions: Total Count']) * 100;
        return clickShare > 15 && purchaseShare > 20 && clickRate > 8;
      },
      action: 'Scale advertising campaigns to capture more market share',
      category: 'share-opportunity',
    },
  ];

  const detectOpportunities = (): Opportunity[] => {
    const opportunities: Opportunity[] = [];

    state.filteredData.forEach((row, index) => {
      opportunityRules.forEach(rule => {
        if (rule.condition(row)) {
          // Calculate impact based on potential
          const impressions = row['Impressions: Total Count'];
          let impact: 'high' | 'medium' | 'low' = 'low';

          if (impressions > 10000) impact = 'high';
          else if (impressions > 3000) impact = 'medium';

          opportunities.push({
            id: `${rule.id}-${index}`,
            rule,
            data: row,
            impact,
          });
        }
      });
    });

    // Sort by impact and potential
    return opportunities.sort((a, b) => {
      const impactWeight = { high: 3, medium: 2, low: 1 };
      return impactWeight[b.impact] - impactWeight[a.impact];
    });
  };

  const allOpportunities = detectOpportunities();

  // Filter opportunities by impact level and add pagination
  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter(opp => opp.impact === activeTab);
  }, [allOpportunities, activeTab]);

  const paginatedOpportunities = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOpportunities.slice(startIndex, startIndex + pageSize);
  }, [filteredOpportunities, currentPage]);

  const totalPages = Math.ceil(filteredOpportunities.length / pageSize);

  // Reset page when switching tabs
  const handleTabChange = (tab: 'high' | 'medium' | 'low') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const opportunityCounts = {
    high: allOpportunities.filter(o => o.impact === 'high').length,
    medium: allOpportunities.filter(o => o.impact === 'medium').length,
    low: allOpportunities.filter(o => o.impact === 'low').length,
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hidden-gem': return Gem;
      case 'funnel-bottleneck': return AlertTriangle;
      case 'share-opportunity': return TrendingUp;
      case 'price-optimization': return DollarSign;
      default: return Zap;
    }
  };

  const getCategorySolidColor = (category: string) => {
    switch (category) {
      case 'hidden-gem': return COLORS.accent;
      case 'funnel-bottleneck': return '#ef4444';
      case 'share-opportunity': return '#10b981';
      case 'price-optimization': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'high': return {
        background: 'rgba(239, 68, 68, 0.2)',
        color: '#fca5a5',
        border: '1px solid rgba(239, 68, 68, 0.3)',
      };
      case 'medium': return {
        background: 'rgba(245, 158, 11, 0.2)',
        color: '#fcd34d',
        border: '1px solid rgba(245, 158, 11, 0.3)',
      };
      case 'low': return {
        background: 'rgba(16, 185, 129, 0.2)',
        color: '#6ee7b7',
        border: '1px solid rgba(16, 185, 129, 0.3)',
      };
      default: return {
        background: 'rgba(107, 114, 128, 0.2)',
        color: '#d1d5db',
        border: '1px solid rgba(107, 114, 128, 0.3)',
      };
    }
  };

  const handleMouseEnter = (e: React.MouseEvent, opportunityId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setHoveredOpportunity(opportunityId);
  };

  const handleMouseLeave = () => {
    setHoveredOpportunity(null);
  };

  const renderTooltip = (opportunity: Opportunity) => {
    if (hoveredOpportunity !== opportunity.id) return null;

    const data = opportunity.data;
    const impressions = data['Impressions: Total Count'];
    const clicks = data['Clicks: Total Count'];
    const basketAdds = data['Basket Adds: Total Count'];
    const purchases = data['Purchases: Total Count'];

    const clickRate = clicks && impressions ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
    const basketRate = basketAdds && clicks ? ((basketAdds / clicks) * 100).toFixed(2) : '0.00';
    const purchaseRate = purchases && basketAdds ? ((purchases / basketAdds) * 100).toFixed(2) : '0.00';
    const conversionRate = purchases && impressions ? ((purchases / impressions) * 100).toFixed(2) : '0.00';

    const impressionShare = data['Impressions: ASIN Share %']?.toFixed(1) || '0.0';
    const clickShare = data['Clicks: ASIN Share %']?.toFixed(1) || '0.0';
    const purchaseShare = data['Purchases: ASIN Share %']?.toFixed(1) || '0.0';

    return (
      <div
        style={{
          position: 'fixed',
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          transform: 'translateX(-50%) translateY(-100%)',
          zIndex: 1000,
          pointerEvents: 'none',
          ...PANEL_STYLES.glassmorphic,
          padding: '1rem',
          minWidth: '280px',
          maxWidth: '320px',
          fontSize: '0.75rem',
          lineHeight: '1.4',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        <div style={{
          fontWeight: '600',
          color: COLORS.textPrimary,
          marginBottom: '0.75rem',
          fontSize: '0.875rem'
        }}>
          {opportunity.data['Search Query']}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ color: COLORS.textMuted, marginBottom: '0.25rem' }}>Funnel Metrics</div>
            <div style={{ color: COLORS.textPrimary }}>CTR: {clickRate}%</div>
            <div style={{ color: COLORS.textPrimary }}>ATC Rate: {basketRate}%</div>
            <div style={{ color: COLORS.textPrimary }}>Purchase Rate: {purchaseRate}%</div>
            <div style={{ color: COLORS.textPrimary }}>Overall CVR: {conversionRate}%</div>
          </div>
          <div>
            <div style={{ color: COLORS.textMuted, marginBottom: '0.25rem' }}>Market Share</div>
            <div style={{ color: COLORS.textPrimary }}>Impressions: {impressionShare}%</div>
            <div style={{ color: COLORS.textPrimary }}>Clicks: {clickShare}%</div>
            <div style={{ color: COLORS.textPrimary }}>Purchases: {purchaseShare}%</div>
          </div>
        </div>

        <div style={{
          borderTop: `1px solid ${COLORS.accentBorder}`,
          paddingTop: '0.5rem',
          color: COLORS.textMuted,
          fontSize: '0.7rem'
        }}>
          <strong style={{ color: getCategorySolidColor(opportunity.rule.category) }}>
            {opportunity.rule.name}
          </strong> • {opportunity.impact.toUpperCase()} Impact
        </div>
      </div>
    );
  };

  if (state.data.length === 0) {
    return (
      <div className="text-center py-12">
        <div style={{ fontSize: '4rem', marginBottom: '1rem', color: COLORS.textMuted, display: 'flex', justifyContent: 'center' }}>
          <Search size={64} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: COLORS.textMuted, marginBottom: '0.5rem' }}>No Opportunities Detected</h3>
        <p style={{ color: COLORS.textMuted }}>Upload a CSV file to discover hidden opportunities</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: COLORS.textPrimary,
          marginBottom: '0.5rem'
        }}>
          Opportunities Detector
        </h2>
        <p style={{
          color: COLORS.textMuted,
          fontSize: '0.875rem'
        }}>
          Automated opportunity finder. Instantly highlights hidden gems, funnel bottlenecks, or outperforming/underperforming keywords, with actionable recommendations.
        </p>
      </div>

      {/* Opportunities Legend */}
      <div style={{
        ...PANEL_STYLES.glassmorphic,
        padding: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: COLORS.textPrimary,
            margin: 0
          }}>
            Opportunities Legend
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {/* Category Types */}
          <div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: COLORS.textMuted,
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Opportunity Categories
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { category: 'hidden-gem', name: 'Hidden Gem', description: 'Low market share, high conversion' },
                { category: 'funnel-bottleneck', name: 'Funnel Bottleneck', description: 'High traffic, poor conversion' },
                { category: 'share-opportunity', name: 'Share Opportunity', description: 'Strong metrics, growth potential' }
              ].map(({ category, name, description }) => (
                <div key={category} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.25rem',
                    height: '1.25rem',
                    borderRadius: '0.25rem',
                    background: getCategorySolidColor(category),
                    opacity: 0.8
                  }}>
                    {React.createElement(getCategoryIcon(category), { size: 12, color: 'white' })}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: COLORS.textPrimary,
                    fontWeight: '500'
                  }}>
                    {name}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: COLORS.textMuted,
                    opacity: 0.8
                  }}>
                    {description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Levels */}
          <div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: COLORS.textMuted,
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Impact Levels
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { impact: 'high', label: 'High Impact', threshold: '10,000+ impressions', color: '#ef4444' },
                { impact: 'medium', label: 'Medium Impact', threshold: '3,000-10,000 impressions', color: '#f59e0b' },
                { impact: 'low', label: 'Low Impact', threshold: '<3,000 impressions', color: '#10b981' }
              ].map(({ impact, label, threshold, color }) => (
                <div key={impact} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    borderRadius: '0.25rem',
                    background: color,
                    opacity: 0.8
                  }} />
                  <div style={{
                    fontSize: '0.75rem',
                    color: COLORS.textPrimary,
                    fontWeight: '500'
                  }}>
                    {label}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: COLORS.textMuted,
                    opacity: 0.8
                  }}>
                    {threshold}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: `1px solid ${COLORS.accentBorder}`,
          fontSize: '0.7rem',
          color: COLORS.textMuted,
          textAlign: 'center'
        }}>
          💡 Hover over any opportunity card for detailed performance breakdown
        </div>
      </div>

      <div style={{
        ...PANEL_STYLES.glassmorphic,
        backgroundImage: `
          linear-gradient(90deg, rgba(157, 78, 221, 0.1) 1px, transparent 1px),
          linear-gradient(rgba(157, 78, 221, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        backgroundPosition: '0 0, 0 0'
      }}>
        {/* Header with total count */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: COLORS.textPrimary
          }}>
            {allOpportunities.length} Opportunities Found
          </h3>
        </div>

        {/* Impact Level Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          justifyContent: 'center',
        }}>
          {(['high', 'medium', 'low'] as const).map((impact) => (
            <button
              key={impact}
              onClick={() => handleTabChange(impact)}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                borderRadius: '12px',
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '140px',
                justifyContent: 'center',
                ...(activeTab === impact ? {
                  background: impact === 'high'
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : impact === 'medium'
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  borderColor: impact === 'high' ? '#ef4444' : impact === 'medium' ? '#f59e0b' : '#10b981',
                  boxShadow: `0 4px 15px ${impact === 'high' ? 'rgba(239, 68, 68, 0.4)' : impact === 'medium' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                } : {
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: COLORS.textMuted,
                  borderColor: 'rgba(157, 78, 221, 0.3)',
                })
              }}
              onMouseEnter={(e) => {
                if (activeTab !== impact) {
                  e.currentTarget.style.background = 'rgba(157, 78, 221, 0.2)';
                  e.currentTarget.style.color = COLORS.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== impact) {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.color = COLORS.textMuted;
                }
              }}
            >
              {impact === 'high' && <AlertTriangle size={16} />}
              {impact === 'medium' && <Target size={16} />}
              {impact === 'low' && <CheckCircle size={16} />}
              <span>{impact} Impact</span>
              <span style={{
                background: 'rgba(0, 0, 0, 0.3)',
                color: 'white',
                padding: '0.125rem 0.375rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}>
                {opportunityCounts[impact]}
              </span>
            </button>
          ))}
        </div>

        {filteredOpportunities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#6ee7b7', display: 'flex', justifyContent: 'center' }}>
              <CheckCircle size={64} />
            </div>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: '500',
              color: '#6ee7b7',
              marginBottom: '0.5rem'
            }}>
              Great Job!
            </h4>
            <p style={{ color: COLORS.textMuted }}>
              No {activeTab} impact opportunities found in this category.
            </p>
            <p style={{
              color: COLORS.textMuted,
              fontSize: '0.875rem',
              marginTop: '0.5rem',
              opacity: 0.8
            }}>
              Try checking other impact levels or uploading more data.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {paginatedOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                style={{
                  ...CURV_ANIMATIONS.hoverLift,
                  position: 'relative',
                  padding: '1rem',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '0.75rem',
                  border: `1px solid ${getCategorySolidColor(opportunity.rule.category)}`,
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, CURV_ANIMATIONS.hoverLiftActive);
                  handleMouseEnter(e, opportunity.id);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
                  handleMouseLeave();
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '0.75rem',
                }}></div>
                <div style={{ position: 'relative' }}>
                  {/* Color Accent Indicator */}
                  <div style={{
                    position: 'absolute',
                    left: '-1rem',
                    top: '0',
                    bottom: '0',
                    width: '4px',
                    background: getCategorySolidColor(opportunity.rule.category),
                    borderRadius: '2px',
                    boxShadow: `0 0 10px ${getCategorySolidColor(opportunity.rule.category)}`
                  }} />
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                      }}>
                        {React.createElement(getCategoryIcon(opportunity.rule.category), { size: 24, color: 'white' })}
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: '1.125rem',
                          fontWeight: 'bold',
                          color: 'white'
                        }}>
                          {opportunity.rule.name}
                        </h4>
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                          {opportunity.data['Search Query']}
                        </p>
                      </div>
                    </div>

                    <span style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      borderRadius: '9999px',
                      ...getImpactBadgeColor(opportunity.impact),
                    }}>
                      {opportunity.impact.toUpperCase()} IMPACT
                    </span>
                  </div>

                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: `1px solid rgba(157, 78, 221, 0.15)`
                  }}>
                    {opportunity.rule.description}
                  </p>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    marginBottom: '1.25rem',
                  }}>
                    <h5 style={{
                      color: 'white',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem'
                    }}>
                      Key Metrics:
                    </h5>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      fontSize: '0.75rem',
                    }}>
                      <div style={{
                        paddingRight: '1rem',
                        borderRight: '1px solid rgba(157, 78, 221, 0.1)'
                      }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Impressions: </span>
                        <span style={{ color: 'white', fontWeight: '500' }}>
                          {opportunity.data['Impressions: Total Count'].toLocaleString()}
                        </span>
                      </div>
                      <div style={{
                        paddingRight: '1rem',
                        borderRight: '1px solid rgba(157, 78, 221, 0.1)'
                      }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Clicks: </span>
                        <span style={{ color: 'white', fontWeight: '500' }}>
                          {opportunity.data['Clicks: Total Count'].toLocaleString()}
                        </span>
                      </div>
                      <div style={{
                        paddingRight: '1rem',
                        borderRight: '1px solid rgba(157, 78, 221, 0.1)'
                      }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Purchases: </span>
                        <span style={{ color: 'white', fontWeight: '500' }}>
                          {opportunity.data['Purchases: Total Count'].toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>CVR: </span>
                        <span style={{ color: 'white', fontWeight: '500' }}>
                          {((opportunity.data['Purchases: Total Count'] / opportunity.data['Impressions: Total Count']) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                  }}>
                    <h5 style={{
                      color: 'white',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem'
                    }}>
                      Recommended Action:
                    </h5>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.875rem'
                    }}>
                      {opportunity.rule.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 0',
                borderTop: `1px solid rgba(157, 78, 221, 0.1)`,
                marginTop: '1rem',
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: COLORS.textMuted
                }}>
                  Page {currentPage} of {totalPages} • {filteredOpportunities.length} {activeTab} impact opportunities
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.5rem',
                      fontSize: '0.875rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      color: COLORS.textMuted,
                      border: `1px solid ${COLORS.accentBorder}`,
                      borderRadius: '6px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.background = COLORS.accentAlpha;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                      }
                    }}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '0.5rem',
                      fontSize: '0.875rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      color: COLORS.textMuted,
                      border: `1px solid ${COLORS.accentBorder}`,
                      borderRadius: '6px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.background = COLORS.accentAlpha;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                      }
                    }}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Render Tooltips */}
      {paginatedOpportunities.map((opportunity) => renderTooltip(opportunity))}
    </div>
  );
};

export default OpportunitiesPanel;