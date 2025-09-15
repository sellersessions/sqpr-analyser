import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { COLORS, PANEL_STYLES, CURV_ANIMATIONS } from '../styles/designSystem';
import { Eye, MousePointer, ShoppingCart, DollarSign, LucideIcon, BarChart3 } from 'lucide-react';

interface MetricCardProps {
  title: string;
  total: number;
  share: number;
  icon: LucideIcon;
  color: string;
  description: string;
  shareExplanation: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, total, share, icon, color, description, shareExplanation }) => {
  const formatNumber = (num: number) => {
    if (!isFinite(num) || isNaN(num)) return '0';
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return Math.round(num).toLocaleString();
  };

  const safeShare = isFinite(share) && !isNaN(share) ? Math.min(share, 100) : 0;

  return (
    <div style={{
      ...PANEL_STYLES.glassmorphic,
      ...CURV_ANIMATIONS.hoverLift,
    }}
    onMouseEnter={(e) => {
      Object.assign(e.currentTarget.style, CURV_ANIMATIONS.hoverLiftActive);
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = PANEL_STYLES.glassmorphic.boxShadow;
    }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: '1rem',
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.75rem',
          background: 'transparent',
          border: `1px solid rgba(157, 78, 221, 0.3)`,
        }}>
          {React.createElement(icon, { size: 24, color: 'rgba(157, 78, 221, 0.7)', strokeWidth: 1 })}
        </div>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{
          color: COLORS.textMuted,
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: 0,
          marginBottom: '0.5rem',
        }}>
          {title}
        </h3>
        
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}>
          <span style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: COLORS.textPrimary,
          }}>
            {formatNumber(total)}
          </span>
          <span style={{
            fontSize: '0.875rem',
            color: COLORS.textMuted,
          }}>
            total
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <div style={{
            flex: 1,
            height: '6px',
            background: 'rgba(157, 78, 221, 0.1)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div
              style={{
                height: '100%',
                background: color,
                borderRadius: '3px',
                width: `${safeShare}%`,
                transition: 'width 1s ease-in-out',
              }}
            ></div>
          </div>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: COLORS.textPrimary,
            minWidth: '45px',
          }}>
            {safeShare.toFixed(1)}%
          </span>
        </div>
        
        <p style={{
          fontSize: '0.75rem',
          color: COLORS.textMuted,
          margin: 0,
          marginTop: '0.5rem',
        }}>
          Market Share
        </p>
      </div>
      
      {/* Legend/Description */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(157, 78, 221, 0.05)',
        borderRadius: '8px',
        border: `1px solid rgba(157, 78, 221, 0.1)`,
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: COLORS.textPrimary,
          fontWeight: 500,
          marginBottom: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ 
            color: 'rgba(157, 78, 221, 0.7)', 
            fontSize: '0.875rem' 
          }}>ℹ️</span>
          What this means
        </div>
        <p style={{
          fontSize: '0.7rem',
          color: COLORS.textMuted,
          margin: 0,
          lineHeight: '1.4',
          marginBottom: '0.5rem',
        }}>
          {description}
        </p>
        <p style={{
          fontSize: '0.7rem',
          color: COLORS.textMuted,
          margin: 0,
          lineHeight: '1.4',
          fontStyle: 'italic',
        }}>
          <span style={{ fontWeight: 500 }}>Market Share:</span> {shareExplanation}
        </p>
      </div>
    </div>
  );
};

const OverviewDashboard: React.FC = () => {
  const { state } = useDashboard();
  
  const safeAdd = (a: number, b: any): number => {
    const numA = isFinite(a) ? a : 0;
    const numB = typeof b === 'number' ? b : parseFloat(b) || 0;
    return numA + (isFinite(numB) ? numB : 0);
  };

  const safeDivide = (numerator: number, denominator: number): number => {
    if (denominator === 0 || !isFinite(denominator) || !isFinite(numerator)) return 0;
    const result = numerator / denominator;
    return isFinite(result) ? result : 0;
  };
  
  if (state.data.length === 0) {
    return (
      <div style={{
        ...PANEL_STYLES.main,
        textAlign: 'center',
        padding: '3rem',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5, color: COLORS.textMuted, display: 'flex', justifyContent: 'center' }}>
          <BarChart3 size={64} />
        </div>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: COLORS.textMuted,
          marginBottom: '0.5rem',
        }}>
          No Data Available
        </h3>
        <p style={{ color: COLORS.textMuted, fontSize: '0.875rem' }}>
          Upload a CSV file to see your performance metrics
        </p>
      </div>
    );
  }

  // Calculate totals with safe arithmetic
  const totals = state.filteredData.reduce(
    (acc, row) => ({
      impressions: safeAdd(acc.impressions, row['Impressions: Total Count']),
      impressionShare: safeAdd(acc.impressionShare, row['Impressions: ASIN Share %']),
      clicks: safeAdd(acc.clicks, row['Clicks: Total Count']),
      clickShare: safeAdd(acc.clickShare, row['Clicks: ASIN Share %']),
      basketAdds: safeAdd(acc.basketAdds, row['Basket Adds: Total Count']),
      basketAddShare: safeAdd(acc.basketAddShare, row['Basket Adds: ASIN Share %']),
      purchases: safeAdd(acc.purchases, row['Purchases: Total Count']),
      purchaseShare: safeAdd(acc.purchaseShare, row['Purchases: ASIN Share %']),
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

  // Calculate average shares with safe division
  const dataLength = state.filteredData.length || 1;
  const avgShares = {
    impressions: safeDivide(totals.impressionShare, dataLength),
    clicks: safeDivide(totals.clickShare, dataLength),
    basketAdds: safeDivide(totals.basketAddShare, dataLength),
    purchases: safeDivide(totals.purchaseShare, dataLength),
  };

  const metrics = [
    {
      title: 'Impressions',
      total: totals.impressions,
      share: avgShares.impressions,
      icon: Eye,
      color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      description: 'The number of times your product appeared in Amazon search results. This is the top of your sales funnel - more impressions mean more visibility.',
      shareExplanation: 'Your average share of total impressions across all search terms (higher = more dominant presence).'
    },
    {
      title: 'Clicks',
      total: totals.clicks,
      share: avgShares.clicks,
      icon: MousePointer,
      color: 'linear-gradient(135deg, #10b981, #047857)',
      description: 'How many shoppers clicked on your product after seeing it. This shows how compelling your listing is compared to competitors.',
      shareExplanation: 'Your average share of total clicks across search terms (higher = more attractive listing).'
    },
    {
      title: 'Basket Adds',
      total: totals.basketAdds,
      share: avgShares.basketAdds,
      icon: ShoppingCart,
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      description: 'Customers who added your product to their cart. This indicates strong purchase intent and product appeal.',
      shareExplanation: 'Your average share of basket additions (higher = more compelling product details/pricing).'
    },
    {
      title: 'Purchases',
      total: totals.purchases,
      share: avgShares.purchases,
      icon: DollarSign,
      color: `linear-gradient(135deg, ${COLORS.accent}, #a855f7)`,
      description: 'Actual sales completed. The ultimate goal of your Amazon strategy - converting interest into revenue.',
      shareExplanation: 'Your average share of total purchases (higher = winning more sales from competitors).'
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: COLORS.textPrimary,
          marginBottom: '0.5rem',
          letterSpacing: '-0.025em',
        }}>
          Overview Dashboard
        </h2>
        <p style={{
          color: COLORS.textMuted,
          fontSize: '1rem',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          Your account's performance at a glance—see total impressions, clicks, add-to-carts, and purchases, plus your market share at each stage.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div style={PANEL_STYLES.card}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: '0.5rem',
          }}>
            Performance Summary
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: COLORS.textMuted,
            margin: 0,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.4',
          }}>
            Conversion rates show how effectively you move customers through your sales funnel
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#3b82f6',
              marginBottom: '0.25rem',
            }}>
              {(safeDivide(totals.clicks, totals.impressions) * 100).toFixed(1)}%
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}>
              Click Rate
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: COLORS.textMuted,
              lineHeight: '1.3',
              opacity: 0.8,
            }}>
              How appealing your listing is compared to competitors
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#10b981',
              marginBottom: '0.25rem',
            }}>
              {(safeDivide(totals.basketAdds, totals.clicks) * 100).toFixed(1)}%
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}>
              Add-to-Cart Rate
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: COLORS.textMuted,
              lineHeight: '1.3',
              opacity: 0.8,
            }}>
              How convincing your product details and pricing are
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#f59e0b',
              marginBottom: '0.25rem',
            }}>
              {(safeDivide(totals.purchases, totals.basketAdds) * 100).toFixed(1)}%
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}>
              Purchase Rate
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: COLORS.textMuted,
              lineHeight: '1.3',
              opacity: 0.8,
            }}>
              How well you convert cart additions to actual sales
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: COLORS.accent,
              marginBottom: '0.25rem',
            }}>
              {(safeDivide(totals.purchases, totals.impressions) * 100).toFixed(2)}%
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}>
              Overall CVR
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: COLORS.textMuted,
              lineHeight: '1.3',
              opacity: 0.8,
            }}>
              Your complete funnel: from impression to purchase
            </div>
          </div>
        </div>
        
        {/* Funnel Explanation */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(157, 78, 221, 0.05)',
          borderRadius: '12px',
          border: `1px solid rgba(157, 78, 221, 0.1)`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
          }}>
            <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>💡</span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: COLORS.textPrimary,
            }}>
              Understanding Your Sales Funnel
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            fontSize: '0.75rem',
            color: COLORS.textMuted,
            textAlign: 'center',
            flexWrap: 'wrap',
          }}>
            <div style={{ minWidth: '140px' }}>
              <div style={{
                marginBottom: '0.5rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center',
                fontSize: '0.875rem',
                color: COLORS.textPrimary,
              }}>
                <Eye size={16} color="rgba(157, 78, 221, 0.7)" strokeWidth={1} />
                Impressions
              </div>
              <div style={{ lineHeight: '1.3', fontSize: '0.7rem' }}>Shoppers see your product in search results</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem', color: 'rgba(157, 78, 221, 0.6)' }}>→</span>
            </div>
            <div style={{ minWidth: '140px' }}>
              <div style={{
                marginBottom: '0.5rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center',
                fontSize: '0.875rem',
                color: COLORS.textPrimary,
              }}>
                <MousePointer size={16} color="rgba(157, 78, 221, 0.7)" strokeWidth={1} />
                Clicks
              </div>
              <div style={{ lineHeight: '1.3', fontSize: '0.7rem' }}>Interested shoppers click to learn more</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem', color: 'rgba(157, 78, 221, 0.6)' }}>→</span>
            </div>
            <div style={{ minWidth: '140px' }}>
              <div style={{
                marginBottom: '0.5rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center',
                fontSize: '0.875rem',
                color: COLORS.textPrimary,
              }}>
                <ShoppingCart size={16} color="rgba(157, 78, 221, 0.7)" strokeWidth={1} />
                Cart Adds
              </div>
              <div style={{ lineHeight: '1.3', fontSize: '0.7rem' }}>Convinced shoppers add to cart</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem', color: 'rgba(157, 78, 221, 0.6)' }}>→</span>
            </div>
            <div style={{ minWidth: '140px' }}>
              <div style={{
                marginBottom: '0.5rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center',
                fontSize: '0.875rem',
                color: COLORS.textPrimary,
              }}>
                <DollarSign size={16} color="rgba(157, 78, 221, 0.7)" strokeWidth={1} />
                Purchases
              </div>
              <div style={{ lineHeight: '1.3', fontSize: '0.7rem' }}>Final step: completed sales</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;