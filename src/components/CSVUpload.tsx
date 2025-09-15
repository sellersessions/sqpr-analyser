import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, X } from 'lucide-react';
import Papa from 'papaparse';
import { useDashboard } from '../context/DashboardContext';
import { SQPRData } from '../types';
import { COLORS, BUTTON_STYLES, PANEL_STYLES } from '../styles/designSystem';

const REQUIRED_COLUMNS = [
  'Search Query',
  'Impressions: Total Count',
  'Clicks: Total Count',
  'Basket Adds: Total Count',
  'Purchases: Total Count',
];

// Sample data from the design system
const SAMPLE_DATA: SQPRData[] = [
  {
    "Search Query": "wireless headphones",
    "Search Query Score": 85,
    "Impressions: Total Count": 15420,
    "Impressions: ASIN Share %": 8.5,
    "Clicks: Total Count": 892,
    "Clicks: Click Rate %": 5.8,
    "Clicks: ASIN Share %": 12.3,
    "Basket Adds: Total Count": 156,
    "Basket Adds: Basket Add Rate %": 17.5,
    "Basket Adds: ASIN Share %": 9.8,
    "Purchases: Total Count": 87,
    "Purchases: Purchase Rate %": 55.8,
    "Purchases: ASIN Share %": 14.2,
    'Clicks: Price (Median)': 79.99,
  },
  {
    "Search Query": "bluetooth speaker",
    "Search Query Score": 72,
    "Impressions: Total Count": 9850,
    "Impressions: ASIN Share %": 15.2,
    "Clicks: Total Count": 445,
    "Clicks: Click Rate %": 4.5,
    "Clicks: ASIN Share %": 18.7,
    "Basket Adds: Total Count": 89,
    "Basket Adds: Basket Add Rate %": 20.0,
    "Basket Adds: ASIN Share %": 16.4,
    "Purchases: Total Count": 32,
    "Purchases: Purchase Rate %": 35.9,
    "Purchases: ASIN Share %": 12.8,
    'Clicks: Price (Median)': 49.99,
  },
  {
    "Search Query": "phone case",
    "Search Query Score": 91,
    "Impressions: Total Count": 25600,
    "Impressions: ASIN Share %": 5.4,
    "Clicks: Total Count": 1280,
    "Clicks: Click Rate %": 5.0,
    "Clicks: ASIN Share %": 7.8,
    "Basket Adds: Total Count": 320,
    "Basket Adds: Basket Add Rate %": 25.0,
    "Basket Adds: ASIN Share %": 8.9,
    "Purchases: Total Count": 198,
    "Purchases: Purchase Rate %": 61.9,
    "Purchases: ASIN Share %": 11.2,
    'Clicks: Price (Median)': 24.99,
  },
];

const CSVUpload: React.FC = () => {
  const { actions } = useDashboard();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateColumns = (headers: string[]): { isValid: boolean; missing: string[] } => {
    console.log('Validating CSV headers:', headers);
    console.log('Required columns:', REQUIRED_COLUMNS);
    
    const missing = REQUIRED_COLUMNS.filter(col => {
      const found = headers.includes(col);
      if (!found) {
        console.log(`Missing required column: ${col}`);
      }
      return !found;
    });
    
    const isValid = missing.length === 0;
    console.log('Validation result:', { isValid, missing });
    return { isValid, missing };
  };

  const safeCalculate = (numerator: any, denominator: any): number => {
    const num = typeof numerator === 'number' ? numerator : parseFloat(numerator) || 0;
    const denom = typeof denominator === 'number' ? denominator : parseFloat(denominator) || 0;
    if (denom === 0 || !isFinite(denom) || !isFinite(num)) return 0;
    const result = (num / denom) * 100;
    return isFinite(result) ? result : 0;
  };

  const convertToNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateMissingRates = useCallback((data: SQPRData[]): SQPRData[] => {
    return data.map(row => {
      // Convert string values to numbers
      const impressions = convertToNumber(row['Impressions: Total Count']);
      const clicks = convertToNumber(row['Clicks: Total Count']);
      const basketAdds = convertToNumber(row['Basket Adds: Total Count']);
      const purchases = convertToNumber(row['Purchases: Total Count']);

      return {
        ...row,
        // Ensure all numeric fields are properly converted
        'Impressions: Total Count': impressions,
        'Clicks: Total Count': clicks,
        'Basket Adds: Total Count': basketAdds,
        'Purchases: Total Count': purchases,
        'Search Query Score': convertToNumber(row['Search Query Score']),
        'Impressions: ASIN Share %': convertToNumber(row['Impressions: ASIN Share %']),
        'Clicks: ASIN Share %': convertToNumber(row['Clicks: ASIN Share %']),
        'Basket Adds: ASIN Share %': convertToNumber(row['Basket Adds: ASIN Share %']),
        'Purchases: ASIN Share %': convertToNumber(row['Purchases: ASIN Share %']),
        // Calculate missing rates with safe division
        'Clicks: Click Rate %': convertToNumber(row['Clicks: Click Rate %']) || safeCalculate(clicks, impressions),
        'Basket Adds: Basket Add Rate %': convertToNumber(row['Basket Adds: Basket Add Rate %']) || safeCalculate(basketAdds, clicks),
        'Purchases: Purchase Rate %': convertToNumber(row['Purchases: Purchase Rate %']) || safeCalculate(purchases, basketAdds),
      };
    });
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    actions.setLoading(true);
    setUploadStatus('idle');

    Papa.parse(file, {
      complete: (results: Papa.ParseResult<SQPRData>) => {
        try {
          console.log('CSV Parse Results:', {
            data: results.data.slice(0, 2), // First 2 rows for debugging
            errors: results.errors,
            meta: results.meta
          });

          if (results.errors.length > 0) {
            console.error('CSV parsing errors:', results.errors);
            // Only throw error for critical parsing issues, not field count mismatches
            const criticalErrors = results.errors.filter(error => 
              !error.message.includes('Too many fields') && 
              !error.message.includes('expected') &&
              error.type === 'Delimiter'
            );
            
            if (criticalErrors.length > 0) {
              throw new Error(`CSV parsing error: ${criticalErrors[0].message}`);
            }
          }

          if (!results.data || results.data.length === 0) {
            throw new Error('CSV file appears to be empty or could not be parsed.');
          }

          const headers = Object.keys(results.data[0] || {});
          const validation = validateColumns(headers);

          if (!validation.isValid) {
            throw new Error(
              `Missing required columns: ${validation.missing.join(', ')}. Please ensure your CSV contains all required SQPR columns.`
            );
          }

          console.log(`Successfully parsed ${results.data.length} rows with ${headers.length} columns`);
          const processedData = calculateMissingRates(results.data);
          actions.setData(processedData);
          setUploadStatus('success');
          setErrorMessage('');
        } catch (error) {
          console.error('Error processing CSV:', error);
          const message = error instanceof Error ? error.message : 'Unknown error occurred';
          setErrorMessage(message);
          setUploadStatus('error');
          actions.setError(message);
        } finally {
          actions.setLoading(false);
        }
      },
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep all fields as strings initially for safer processing
      transformHeader: (header: string) => header.trim(), // Clean up header names
    });
  }, [actions, calculateMissingRates]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const loadTestData = () => {
    console.log('Loading test data...');
    // Clear any previous errors first
    actions.setError(null);
    setErrorMessage('');
    setUploadStatus('idle');
    actions.setLoading(true);
    
    setTimeout(() => {
      try {
        console.log('Setting sample data:', SAMPLE_DATA);
        actions.setData(SAMPLE_DATA);
        setUploadStatus('success');
        setErrorMessage('');
        console.log('Test data loaded successfully');
      } catch (error) {
        console.error('Error loading test data:', error);
        const message = error instanceof Error ? error.message : 'Failed to load test data';
        setErrorMessage(message);
        setUploadStatus('error');
        actions.setError(message);
      } finally {
        actions.setLoading(false);
      }
    }, 100); // Reduced delay for faster testing
  };

  return (
    <section
      style={{
        background: COLORS.bgPrimary,
        marginTop: '24px',
        marginBottom: '24px',
        marginLeft: '0px',
        marginRight: '0px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '0',
      }}
    >
      <div
        style={{
          ...PANEL_STYLES.glassmorphic,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '400px',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            minHeight: '0',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${COLORS.accentBorder}`,
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                padding: '2rem',
                textAlign: 'center',
                background: isDragActive 
                  ? COLORS.accentAlpha 
                  : uploadStatus === 'success'
                  ? 'rgba(34, 197, 94, 0.1)'
                  : uploadStatus === 'error'
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(157, 78, 221, 0.02)',
                borderColor: isDragActive
                  ? COLORS.accent
                  : uploadStatus === 'success'
                  ? 'rgba(34, 197, 94, 0.5)'
                  : uploadStatus === 'error'
                  ? 'rgba(239, 68, 68, 0.5)'
                  : COLORS.accentBorder,
                transition: 'all 0.2s',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
                cursor: 'pointer',
              }}
            >
              <input {...getInputProps()} />
              
              {uploadStatus === 'idle' && (
                <>
                  <div style={{ 
                    width: '5rem', 
                    height: '5rem', 
                    margin: '0 auto 1rem auto', 
                    background: 'rgba(157, 78, 221, 0.1)', 
                    border: '2px solid rgba(157, 78, 221, 0.3)', 
                    borderRadius: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    transition: 'all 0.3s' 
                  }}>
                    <Upload size={40} style={{ color: 'rgba(157, 78, 221, 0.6)' }} />
                  </div>

                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    color: '#ffffff', 
                    marginBottom: '0.25rem' 
                  }}>
                    {isDragActive ? 'Drop your CSV file here...' : 'Drop your files here'}
                  </h3>
                  
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontSize: '0.875rem', 
                    marginBottom: '1rem' 
                  }}>
                    or click to browse from your computer
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    gap: '0.75rem', 
                    justifyContent: 'center', 
                    flexWrap: 'wrap', 
                    marginBottom: '1rem' 
                  }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      background: 'rgba(157, 78, 221, 0.2)', 
                      border: '1px solid rgba(157, 78, 221, 0.3)', 
                      color: 'rgba(157, 78, 221, 0.8)', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '500', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em' 
                    }}>
                      CSV
                    </span>
                  </div>

                  <button
                    type="button"
                    style={{
                      ...BUTTON_STYLES.gradient,
                      marginTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.color = '#c084fc';
                      target.style.textShadow = '0 0 20px rgba(157, 78, 221, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.color = '#ffffff';
                      target.style.textShadow = 'none';
                    }}
                  >
                    <Upload size={18} />
                    Browse Files
                  </button>
                </>
              )}
              
              {uploadStatus === 'success' && (
                <>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#22c55e', display: 'flex', justifyContent: 'center' }}>
                    <CheckCircle size={64} />
                  </div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    color: 'rgb(34, 197, 94)', 
                    marginBottom: '0.5rem' 
                  }}>
                    CSV file uploaded successfully!
                  </h3>
                  <p style={{ color: COLORS.textMuted, fontSize: '0.875rem' }}>
                    Your data is ready for analysis.
                  </p>
                </>
              )}
              
              {uploadStatus === 'error' && (
                <>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#ef4444', display: 'flex', justifyContent: 'center' }}>
                    <X size={64} />
                  </div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    color: '#ef4444', 
                    marginBottom: '0.5rem' 
                  }}>
                    Upload Failed
                  </h3>
                  <p style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{errorMessage}</p>
                </>
              )}
            </div>
          </div>
          
          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={loadTestData}
              type="button"
              style={{
                ...BUTTON_STYLES.primary,
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgb(147, 51, 234)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = COLORS.accent;
              }}
            >
              Load Test Data
            </button>
            
            <button
              onClick={() => {
                actions.setError(null);
                setErrorMessage('');
                setUploadStatus('idle');
              }}
              type="button"
              style={{
                ...BUTTON_STYLES.primary,
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                background: 'transparent',
                border: `1px solid ${COLORS.accent}`,
                color: COLORS.accent,
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
              Clear Errors
            </button>
          </div>

          <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: COLORS.textMuted }}>
            <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Required CSV columns:</p>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '0.25rem' 
            }}>
              {REQUIRED_COLUMNS.map(col => (
                <li key={col} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    background: COLORS.accent, 
                    borderRadius: '50%', 
                    marginRight: '0.5rem' 
                  }}></span>
                  {col}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CSVUpload;