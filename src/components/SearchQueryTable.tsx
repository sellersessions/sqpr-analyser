import React, { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { SQPRData } from '../types';
import { COLORS, PANEL_STYLES } from '../styles/designSystem';
import { ArrowUpDown, ArrowDown, ArrowUp, Search, TrendingUp, TrendingDown, Diamond, AlertTriangle, Eye, Star, Activity } from 'lucide-react';

interface TableColumn {
  key: keyof SQPRData;
  label: string;
  sortable: boolean;
  format?: (value: any) => string;
}

const SearchQueryTable: React.FC = () => {
  const { state } = useDashboard();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof SQPRData>('Impressions: Total Count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const formatNumber = (v: any): number => {
    if (v === null || v === undefined || v === '') return 0;
    const num = typeof v === 'number' ? v : parseFloat(v);
    return isNaN(num) ? 0 : num;
  };

  const formatInteger = (v: any): number => {
    if (v === null || v === undefined || v === '') return 0;
    const num = typeof v === 'number' ? v : parseInt(v, 10);
    return isNaN(num) ? 0 : num;
  };

  const columns: TableColumn[] = [
    { key: 'Search Query', label: 'Search Query', sortable: true },
    { key: 'Search Query Score', label: 'Score', sortable: true },
    { key: 'Impressions: Total Count', label: 'Impressions', sortable: true, format: (v) => formatInteger(v).toLocaleString() },
    { key: 'Impressions: ASIN Share %', label: 'Imp. Share %', sortable: true, format: (v) => `${formatNumber(v).toFixed(1)}%` },
    { key: 'Clicks: Total Count', label: 'Clicks', sortable: true, format: (v) => formatInteger(v).toLocaleString() },
    { key: 'Clicks: Click Rate %', label: 'CTR %', sortable: true, format: (v) => `${formatNumber(v).toFixed(1)}%` },
    { key: 'Clicks: ASIN Share %', label: 'Click Share %', sortable: true, format: (v) => `${formatNumber(v).toFixed(1)}%` },
    { key: 'Basket Adds: Total Count', label: 'Add to Cart', sortable: true, format: (v) => formatInteger(v).toLocaleString() },
    { key: 'Basket Adds: Basket Add Rate %', label: 'ATC Rate %', sortable: true, format: (v) => `${formatNumber(v).toFixed(1)}%` },
    { key: 'Basket Adds: ASIN Share %', label: 'ATC Share %', sortable: true, format: (v) => `${formatNumber(v).toFixed(1)}%` },
    { key: 'Purchases: Total Count', label: 'Purchases', sortable: true, format: (v) => formatInteger(v).toLocaleString() },
    { key: 'Purchases: Purchase Rate %', label: 'Purchase Rate %', sortable: true, format: (v) => `${formatNumber(v).toFixed(1)}%` },
    { key: 'Purchases: ASIN Share %', label: 'Purchase Share %', sortable: true, format: (v) => `${formatNumber(v).toFixed(1)}%` },
  ];

  const filteredData = useMemo(() => {
    let data = state.filteredData;
    
    // Apply search filter
    if (searchTerm.trim()) {
      data = data.filter(row =>
        row['Search Query'].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    data = [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      }
      
      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();
      return sortOrder === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
    });
    
    return data;
  }, [state.filteredData, searchTerm, sortBy, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (columnKey: keyof SQPRData) => {
    const newOrder = sortBy === columnKey && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(columnKey);
    setSortOrder(newOrder);
  };

  const getSortIcon = (columnKey: keyof SQPRData) => {
    if (sortBy !== columnKey) return ArrowUpDown;
    return sortOrder === 'desc' ? ArrowDown : ArrowUp;
  };

  // Helper functions for insights
  const getTopPerformers = () => {
    const sorted = [...filteredData].sort((a, b) => {
      const aImpressions = formatNumber(a['Impressions: Total Count']);
      const bImpressions = formatNumber(b['Impressions: Total Count']);
      return bImpressions - aImpressions; // Sort by impression volume
    });
    return sorted.slice(0, 3);
  };

  const getHiddenGems = () => {
    return filteredData.filter(row => {
      const impressions = formatNumber(row['Impressions: Total Count']);
      const ctr = formatNumber(row['Clicks: Click Rate %']);
      const cvr = (formatNumber(row['Purchases: Total Count']) / formatNumber(row['Clicks: Total Count'])) * 100;
      return impressions < 50000 && ctr > 3 && cvr > 10; // Lower volume but high performance
    }).slice(0, 3);
  };

  const getBiggestDropoffs = () => {
    return filteredData.filter(row => {
      const ctr = formatNumber(row['Clicks: Click Rate %']);
      const atcRate = formatNumber(row['Basket Adds: Basket Add Rate %']);
      return ctr > 2 && atcRate < 10; // Good CTR but poor ATC rate - conversion issue
    }).slice(0, 3);
  };

  // Performance scoring algorithm - combines multiple metrics for overall health score
  const getPerformanceScore = (row: SQPRData) => {
    const ctr = formatNumber(row['Clicks: Click Rate %']);
    const atcRate = formatNumber(row['Basket Adds: Basket Add Rate %']);
    const purchaseRate = formatNumber(row['Purchases: Purchase Rate %']);
    const impressionShare = formatNumber(row['Impressions: ASIN Share %']);

    // Weighted scoring: CTR (30%), ATC Rate (25%), Purchase Rate (25%), Market Share (20%)
    const score = (ctr * 0.3) + (atcRate * 0.25) + (purchaseRate * 0.25) + (impressionShare * 0.2);
    return Math.min(100, Math.max(0, score)); // Cap between 0-100%
  };

  const getQueryType = (row: SQPRData) => {
    const impressions = formatNumber(row['Impressions: Total Count']);
    const ctr = formatNumber(row['Clicks: Click Rate %']);
    const atcRate = formatNumber(row['Basket Adds: Basket Add Rate %']);

    if (impressions > 50000 && ctr > 3) return { type: 'Rising Star', color: '#10b981', icon: Star };
    if (ctr > 2 && atcRate > 3) return { type: 'Stable Performer', color: '#3b82f6', icon: Activity };
    if (ctr < 1 || atcRate < 1) return { type: 'Needs Attention', color: '#ef4444', icon: AlertTriangle };
    return { type: 'Stable Performer', color: '#3b82f6', icon: Activity };
  };

  if (state.data.length === 0) {
    return (
      <div className="text-center py-12">
        <div style={{ fontSize: '4rem', marginBottom: '1rem', color: COLORS.textMuted, display: 'flex', justifyContent: 'center' }}>
          <Search size={64} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: COLORS.textMuted, marginBottom: '0.5rem' }}>No Data to Explore</h3>
        <p style={{ color: COLORS.textMuted }}>Upload a CSV file to explore your search query performance</p>
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
          Search Query Explorer
        </h2>
        <p style={{ 
          color: COLORS.textMuted, 
          fontSize: '0.875rem' 
        }}>
          Explore each search term's full performance funnel. Filter and sort to identify top-growing keywords, bottlenecks, and outliers instantly.
        </p>
      </div>

      {/* Insights Callouts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        {/* Top Growing */}
        <div style={{
          ...PANEL_STYLES.glassmorphic,
          padding: '1rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <TrendingUp size={18} color="#10b981" strokeWidth={1} />
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10b981', margin: 0 }}>
              Top Growing
            </h3>
          </div>
          <div style={{ fontSize: '0.75rem', color: COLORS.textMuted, lineHeight: '1.4' }}>
            {getTopPerformers().length > 0 ? (
              <div>
                {getTopPerformers().slice(0, 3).map((item, idx) => (
                  <div key={idx} style={{ marginBottom: idx < 2 ? '0.25rem' : 0 }}>
                    {idx + 1}. {item['Search Query']}
                  </div>
                ))}
              </div>
            ) : 'No high-volume keywords found'}
          </div>
        </div>

        {/* Hidden Gem */}
        <div style={{
          ...PANEL_STYLES.glassmorphic,
          padding: '1rem',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Diamond size={18} color="#f59e0b" strokeWidth={1} />
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f59e0b', margin: 0 }}>
              Hidden Gem
            </h3>
          </div>
          <div style={{ fontSize: '0.75rem', color: COLORS.textMuted, lineHeight: '1.4' }}>
            {getHiddenGems().length > 0 ? (
              <div>
                {getHiddenGems().slice(0, 3).map((item, idx) => (
                  <div key={idx} style={{ marginBottom: idx < 2 ? '0.25rem' : 0 }}>
                    {idx + 1}. {item['Search Query']}
                  </div>
                ))}
              </div>
            ) : 'No hidden gems identified'}
          </div>
        </div>

        {/* Biggest Drop-off */}
        <div style={{
          ...PANEL_STYLES.glassmorphic,
          padding: '1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <TrendingDown size={18} color="#ef4444" strokeWidth={1} />
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ef4444', margin: 0 }}>
              Biggest Drop-off
            </h3>
          </div>
          <div style={{ fontSize: '0.75rem', color: COLORS.textMuted, lineHeight: '1.4' }}>
            {getBiggestDropoffs().length > 0 ? (
              <div>
                {getBiggestDropoffs().slice(0, 3).map((item, idx) => (
                  <div key={idx} style={{ marginBottom: idx < 2 ? '0.25rem' : 0 }}>
                    {idx + 1}. {item['Search Query']}
                  </div>
                ))}
              </div>
            ) : 'No significant drop-offs detected'}
          </div>
        </div>
      </div>

      {/* Contextual Info Banner */}
      <div style={{
        ...PANEL_STYLES.glassmorphic,
        padding: '1rem',
        marginBottom: '1rem',
        background: 'rgba(157, 78, 221, 0.1)',
        border: '1px solid rgba(157, 78, 221, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Eye size={20} color={COLORS.accent} strokeWidth={1} />
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '0.25rem' }}>
              Performance Insights
            </div>
            <div style={{ fontSize: '0.75rem', color: COLORS.textMuted }}>
              {filteredData.length} keywords analyzed • {getHiddenGems().length} hidden gems • {getBiggestDropoffs().length} need attention
            </div>
          </div>
        </div>
        <button style={{
          padding: '0.5rem 1rem',
          background: `linear-gradient(135deg, ${COLORS.accent} 0%, #c084fc 100%)`,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Explore Insights
        </button>
      </div>

      {/* Performance Score Legend */}
      <div style={{
        ...PANEL_STYLES.glassmorphic,
        padding: '1rem',
        marginBottom: '1rem',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(157, 78, 221, 0.2)',
      }}>
        <div style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: COLORS.textPrimary,
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <Activity size={16} color={COLORS.accent} strokeWidth={1} />
          Performance Score Legend
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          fontSize: '0.75rem',
          color: COLORS.textMuted,
        }}>
          {/* Score Ranges */}
          <div>
            <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: COLORS.textPrimary, fontWeight: '500' }}>
              Score Ranges
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: 'rgba(16, 185, 129, 0.3)',
                  border: '1px solid #10b981'
                }} />
                <span>51-100%: Excellent</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: 'rgba(245, 158, 11, 0.3)',
                  border: '1px solid #f59e0b'
                }} />
                <span>26-50%: Good</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: 'rgba(239, 68, 68, 0.3)',
                  border: '1px solid #ef4444'
                }} />
                <span>0-25%: Needs Work</span>
              </div>
            </div>
          </div>

          {/* Algorithm Breakdown */}
          <div>
            <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: COLORS.textPrimary, fontWeight: '500' }}>
              Algorithm Weights
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', lineHeight: '1.4' }}>
              <span>• Click Rate: 30%</span>
              <span>• Add-to-Cart Rate: 25%</span>
              <span>• Purchase Rate: 25%</span>
              <span>• Market Share: 20%</span>
            </div>
          </div>

          {/* Query Types */}
          <div>
            <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: COLORS.textPrimary, fontWeight: '500' }}>
              Query Classifications
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={12} color="#10b981" strokeWidth={1} />
                <span>Rising Star</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={12} color="#3b82f6" strokeWidth={1} />
                <span>Stable Performer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={12} color="#ef4444" strokeWidth={1} />
                <span>Needs Attention</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div style={{
        ...PANEL_STYLES.glassmorphic,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div style={{ flex: 1, width: '100%' }}>
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'rgba(0, 0, 0, 0.6)',
              border: `1px solid ${COLORS.accentBorder}`,
              borderRadius: '0.5rem',
              color: COLORS.textPrimary,
              fontSize: '0.875rem',
              outline: 'none',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease-in-out',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = COLORS.accent;
              e.target.style.boxShadow = `0 0 0 2px ${COLORS.accentAlpha}`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = COLORS.accentBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem' 
        }}>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              padding: '0.5rem 0.75rem',
              background: 'rgba(0, 0, 0, 0.6)',
              border: `1px solid ${COLORS.accentBorder}`,
              borderRadius: '0.5rem',
              color: COLORS.textPrimary,
              fontSize: '0.875rem',
              outline: 'none',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
            }}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          
          <span style={{ 
            fontSize: '0.875rem', 
            color: COLORS.textMuted 
          }}>
            {filteredData.length} results
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={{
        ...PANEL_STYLES.glassmorphic,
        overflow: 'hidden',
        padding: 0,
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: COLORS.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: column.sortable ? 'pointer' : 'default',
                      transition: 'background-color 0.2s ease-in-out',
                      borderBottom: `1px solid ${COLORS.accentBorder}`,
                    }}
                    onClick={() => column.sortable && handleSort(column.key)}
                    onMouseEnter={(e) => {
                      if (column.sortable) {
                        e.currentTarget.style.background = COLORS.accentAlpha;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (column.sortable) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem' 
                    }}>
                      <span>{column.label}</span>
                      {column.sortable && (
                        <span style={{ 
                          color: COLORS.textMuted, 
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                        }}>
                          {React.createElement(getSortIcon(column.key), { size: 14 })}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: `1px solid rgba(157, 78, 221, 0.1)`,
                    transition: 'background-color 0.15s ease-in-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(157, 78, 221, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      {column.key === 'Search Query' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
                          {/* Search Query Text */}
                          <div style={{
                            color: COLORS.textPrimary,
                            fontWeight: '500',
                            fontSize: '0.875rem',
                          }}>
                            {row[column.key] ?? 'N/A'}
                          </div>

                          {/* Badges Row - Fixed Layout */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap' }}>
                            {/* Query Type Indicator - Fixed Width */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.125rem 0.375rem',
                              borderRadius: '3px',
                              background: `${getQueryType(row).color}20`,
                              border: `1px solid ${getQueryType(row).color}40`,
                              minWidth: '90px',
                              justifyContent: 'center',
                            }}>
                              {React.createElement(getQueryType(row).icon, {
                                size: 10,
                                color: getQueryType(row).color,
                                strokeWidth: 1
                              })}
                              <span style={{
                                fontSize: '0.55rem',
                                fontWeight: '600',
                                color: getQueryType(row).color,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                whiteSpace: 'nowrap',
                              }}>
                                {getQueryType(row).type.replace(' ', ' ')}
                              </span>
                            </div>

                            {/* Performance Score Indicator - Fixed Width */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.125rem 0.375rem',
                                borderRadius: '3px',
                                minWidth: '55px',
                                justifyContent: 'center',
                                background: getPerformanceScore(row) > 50
                                  ? 'rgba(16, 185, 129, 0.2)'
                                  : getPerformanceScore(row) > 25
                                  ? 'rgba(245, 158, 11, 0.2)'
                                  : 'rgba(239, 68, 68, 0.2)',
                                cursor: 'help',
                                position: 'relative',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={() => setHoveredTooltip(`score-${index}`)}
                              onMouseLeave={() => setHoveredTooltip(null)}
                            >
                              {getPerformanceScore(row) > 50 ? (
                                <TrendingUp size={10} color="#10b981" strokeWidth={1} />
                              ) : getPerformanceScore(row) > 25 ? (
                                <Activity size={10} color="#f59e0b" strokeWidth={1} />
                              ) : (
                                <TrendingDown size={10} color="#ef4444" strokeWidth={1} />
                              )}
                              <span style={{
                                fontSize: '0.6rem',
                                color: getPerformanceScore(row) > 50
                                  ? '#10b981'
                                  : getPerformanceScore(row) > 25
                                  ? '#f59e0b'
                                  : '#ef4444',
                                fontWeight: '600',
                              }}>
                                {getPerformanceScore(row).toFixed(0)}%
                              </span>

                              {/* Tooltip */}
                              {hoveredTooltip === `score-${index}` && (
                                <div style={{
                                  position: 'absolute',
                                  bottom: '100%',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  marginBottom: '8px',
                                  padding: '0.5rem',
                                  background: 'rgba(0, 0, 0, 0.9)',
                                  backdropFilter: 'blur(12px)',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(157, 78, 221, 0.3)',
                                  fontSize: '0.65rem',
                                  color: 'white',
                                  whiteSpace: 'nowrap',
                                  zIndex: 1000,
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                                }}>
                                  <div style={{ marginBottom: '0.25rem', fontWeight: '600', color: COLORS.accent }}>
                                    Performance Breakdown:
                                  </div>
                                  <div>CTR: {formatNumber(row['Clicks: Click Rate %']).toFixed(1)}% (30%)</div>
                                  <div>ATC: {formatNumber(row['Basket Adds: Basket Add Rate %']).toFixed(1)}% (25%)</div>
                                  <div>CVR: {formatNumber(row['Purchases: Purchase Rate %']).toFixed(1)}% (25%)</div>
                                  <div>Share: {formatNumber(row['Impressions: ASIN Share %']).toFixed(1)}% (20%)</div>
                                  {/* Tooltip Arrow */}
                                  <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '5px solid transparent',
                                    borderRight: '5px solid transparent',
                                    borderTop: '5px solid rgba(0, 0, 0, 0.9)',
                                  }} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span style={{
                          color: COLORS.textMuted,
                          fontWeight: '400',
                        }}>
                          {column.format
                            ? column.format(row[column.key])
                            : (row[column.key] ?? 'N/A')
                          }
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '0.75rem 1rem',
            borderTop: `1px solid ${COLORS.accentBorder}`,
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div style={{ 
                fontSize: '0.875rem', 
                color: COLORS.textMuted 
              }}>
                Page {currentPage} of {totalPages}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: COLORS.textMuted,
                    border: `1px solid ${COLORS.accentBorder}`,
                    borderRadius: '0.375rem',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    transition: 'all 0.2s ease-in-out',
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
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        background: pageNum === currentPage 
                          ? `linear-gradient(135deg, ${COLORS.accent} 0%, #c084fc 100%)`
                          : 'rgba(0, 0, 0, 0.4)',
                        color: pageNum === currentPage ? 'white' : COLORS.textMuted,
                        border: `1px solid ${COLORS.accentBorder}`,
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        boxShadow: pageNum === currentPage 
                          ? `0 4px 15px ${COLORS.accentAlpha}`
                          : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (pageNum !== currentPage) {
                          e.currentTarget.style.background = COLORS.accentAlpha;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (pageNum !== currentPage) {
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                        }
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: COLORS.textMuted,
                    border: `1px solid ${COLORS.accentBorder}`,
                    borderRadius: '0.375rem',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    transition: 'all 0.2s ease-in-out',
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
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchQueryTable;