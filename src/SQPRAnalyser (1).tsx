import React, { useState } from 'react';
import Papa from 'papaparse';
import { FileSpreadsheet, Download, Upload } from 'lucide-react';


const COLORS = {
  bgPrimary: 'rgb(3, 12, 27)',
  bgHeader: 'linear-gradient(180deg, rgb(18, 11, 41) 0%, rgb(13, 18, 41) 40%, rgb(4, 16, 32) 70%, rgb(3, 12, 27) 100%)',
  bgPanel: 'linear-gradient(135deg, rgb(18, 11, 41), rgb(13, 18, 41))',
  accent: 'rgb(157, 78, 221)',
  accentAlpha: 'rgba(157, 78, 221, 0.3)',
  accentBorder: 'rgba(157, 78, 221, 0.5)',
  textPrimary: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
};

const SQPRAnalyser: React.FC = () => {

  const [csvData0, setCsvData0] = useState<Array<Record<string, any>>>([
  {
    "Search Query": "rat bait box",
    "Search Query Score": 24,
    "Search Query Volume": 4575,
    "Impressions: Total Count": 123899,
    "Impressions: ASIN Count": 978,
    "Impressions: ASIN Share %": 0.79,
    "Clicks: Total Count": 2376,
    "Clicks: Click Rate %": 51.93,
    "Clicks: ASIN Count": 9,
    "Clicks: ASIN Share %": 0.38,
    "Clicks: Price (Median)": 14.99,
    "Clicks: ASIN Price (Median)": 18.99,
    "Clicks: Same-Day Shipping Speed": 271,
    "Clicks: 1D-Shipping Speed": 1582,
    "Clicks: 2D-Shipping Speed": 273,
    "Basket Adds: Total Count": 782,
    "Basket Adds: Basket Add Rate %": 17.09,
    "Basket Adds: ASIN Count": 4,
    "Basket Adds: ASIN Share %": 0.51,
    "Basket Adds: Price (Median)": 14.95,
    "Basket Adds: ASIN Price (Median)": 18.99,
    "Basket Adds: Same-Day Shipping Speed": 88,
    "Basket Adds: 1D-Shipping Speed": 545,
    "Basket Adds: 2D-Shipping Speed": 81,
    "Purchases: Total Count": 502,
    "Purchases: Purchase Rate %": 10.97,
    "Purchases: ASIN Count": 2,
    "Purchases: ASIN Share %": 0.4,
    "Purchases: Price (Median)": 14.99,
    "Purchases: ASIN Price (Median)": 18.99,
    "Purchases: Same-Day Shipping Speed": 53,
    "Purchases: 1D-Shipping Speed": 373,
    "Purchases: 2D-Shipping Speed": 50,
    "Reporting Date": "2025-08-31"
  },
  {
    "Search Query": "humane rat traps for outdoors",
    "Search Query Score": 40,
    "Search Query Volume": 992,
    "Impressions: Total Count": 26411,
    "Impressions: ASIN Count": 697,
    "Impressions: ASIN Share %": 2.64,
    "Clicks: Total Count": 541,
    "Clicks: Click Rate %": 54.54,
    "Clicks: ASIN Count": 14,
    "Clicks: ASIN Share %": 2.59,
    "Clicks: Price (Median)": 14.99,
    "Clicks: ASIN Price (Median)": 18.99,
    "Clicks: Same-Day Shipping Speed": 55,
    "Clicks: 1D-Shipping Speed": 369,
    "Clicks: 2D-Shipping Speed": 60,
    "Basket Adds: Total Count": 152,
    "Basket Adds: Basket Add Rate %": 15.32,
    "Basket Adds: ASIN Count": 2,
    "Basket Adds: ASIN Share %": 1.32,
    "Basket Adds: Price (Median)": 14.99,
    "Basket Adds: ASIN Price (Median)": 18.99,
    "Basket Adds: Same-Day Shipping Speed": 14,
    "Basket Adds: 1D-Shipping Speed": 106,
    "Basket Adds: 2D-Shipping Speed": 20,
    "Purchases: Total Count": 97,
    "Purchases: Purchase Rate %": 9.78,
    "Purchases: ASIN Count": 1,
    "Purchases: ASIN Share %": 1.03,
    "Purchases: Price (Median)": 15.99,
    "Purchases: ASIN Price (Median)": 18.99,
    "Purchases: Same-Day Shipping Speed": 11,
    "Purchases: 1D-Shipping Speed": 70,
    "Purchases: 2D-Shipping Speed": 12,
    "Reporting Date": "2025-08-31"
  },
  {
    "Search Query": "rat",
    "Search Query Score": 6,
    "Search Query Volume": 9132,
    "Impressions: Total Count": 204228,
    "Impressions: ASIN Count": 2451,
    "Impressions: ASIN Share %": 1.2,
    "Clicks: Total Count": 899,
    "Clicks: Click Rate %": 9.84,
    "Clicks: ASIN Count": 28,
    "Clicks: ASIN Share %": 3.11,
    "Clicks: Price (Median)": 14.99,
    "Clicks: ASIN Price (Median)": 18.99,
    "Clicks: Same-Day Shipping Speed": 177,
    "Clicks: 1D-Shipping Speed": 536,
    "Clicks: 2D-Shipping Speed": 86,
    "Basket Adds: Total Count": 216,
    "Basket Adds: Basket Add Rate %": 2.37,
    "Basket Adds: ASIN Count": 9,
    "Basket Adds: ASIN Share %": 4.17,
    "Basket Adds: Price (Median)": 12.29,
    "Basket Adds: ASIN Price (Median)": 18.99,
    "Basket Adds: Same-Day Shipping Speed": 46,
    "Basket Adds: 1D-Shipping Speed": 131,
    "Basket Adds: 2D-Shipping Speed": 12,
    "Purchases: Total Count": 104,
    "Purchases: Purchase Rate %": 1.14,
    "Purchases: ASIN Count": 6,
    "Purchases: ASIN Share %": 5.77,
    "Purchases: Price (Median)": 10.77,
    "Purchases: ASIN Price (Median)": 18.99,
    "Purchases: Same-Day Shipping Speed": 20,
    "Purchases: 1D-Shipping Speed": 71,
    "Purchases: 2D-Shipping Speed": 3,
    "Reporting Date": "2025-08-31"
  },
  {
    "Search Query": "rat-trap",
    "Search Query Score": 37,
    "Search Query Volume": 302,
    "Impressions: Total Count": 9234,
    "Impressions: ASIN Count": 408,
    "Impressions: ASIN Share %": 4.42,
    "Clicks: Total Count": 115,
    "Clicks: Click Rate %": 38.08,
    "Clicks: ASIN Count": 9,
    "Clicks: ASIN Share %": 7.83,
    "Clicks: Price (Median)": 15.96,
    "Clicks: ASIN Price (Median)": 18.99,
    "Clicks: Same-Day Shipping Speed": 16,
    "Clicks: 1D-Shipping Speed": 74,
    "Clicks: 2D-Shipping Speed": 15,
    "Basket Adds: Total Count": 25,
    "Basket Adds: Basket Add Rate %": 8.28,
    "Basket Adds: ASIN Count": 2,
    "Basket Adds: ASIN Share %": 8,
    "Basket Adds: Price (Median)": 13.95,
    "Basket Adds: ASIN Price (Median)": 18.99,
    "Basket Adds: Same-Day Shipping Speed": 7,
    "Basket Adds: 1D-Shipping Speed": 13,
    "Basket Adds: 2D-Shipping Speed": 4,
    "Purchases: Total Count": 20,
    "Purchases: Purchase Rate %": 6.62,
    "Purchases: ASIN Count": 2,
    "Purchases: ASIN Share %": 10,
    "Purchases: Price (Median)": 14.98,
    "Purchases: ASIN Price (Median)": 18.99,
    "Purchases: Same-Day Shipping Speed": 7,
    "Purchases: 1D-Shipping Speed": 9,
    "Purchases: 2D-Shipping Speed": 3,
    "Reporting Date": "2025-08-31"
  },
  {
    "Search Query": "shadow rat trap box",
    "Search Query Score": 52,
    "Search Query Volume": 4,
    "Impressions: Total Count": 162,
    "Impressions: ASIN Count": 4,
    "Impressions: ASIN Share %": 2.47,
    "Clicks: Total Count": 3,
    "Clicks: Click Rate %": 75,
    "Clicks: ASIN Count": 3,
    "Clicks: ASIN Share %": 100,
    "Clicks: Price (Median)": 18.99,
    "Clicks: ASIN Price (Median)": 18.99,
    "Clicks: Same-Day Shipping Speed": "",
    "Clicks: 1D-Shipping Speed": 3,
    "Clicks: 2D-Shipping Speed": "",
    "Basket Adds: Total Count": 2,
    "Basket Adds: Basket Add Rate %": 50,
    "Basket Adds: ASIN Count": 2,
    "Basket Adds: ASIN Share %": 100,
    "Basket Adds: Price (Median)": 18.99,
    "Basket Adds: ASIN Price (Median)": 18.99,
    "Basket Adds: Same-Day Shipping Speed": "",
    "Basket Adds: 1D-Shipping Speed": 2,
    "Basket Adds: 2D-Shipping Speed": "",
    "Purchases: Total Count": 2,
    "Purchases: Purchase Rate %": 50,
    "Purchases: ASIN Count": 2,
    "Purchases: ASIN Share %": 100,
    "Purchases: Price (Median)": 18.99,
    "Purchases: ASIN Price (Median)": 18.99,
    "Purchases: Same-Day Shipping Speed": "",
    "Purchases: 1D-Shipping Speed": 2,
    "Purchases: 2D-Shipping Speed": "",
    "Reporting Date": "2025-08-31"
  },
  {
    "Search Query": "garden rat trap",
    "Search Query Score": 29,
    "Search Query Volume": 64,
    "Impressions: Total Count": 2083,
    "Impressions: ASIN Count": 98,
    "Impressions: ASIN Share %": 4.7,
    "Clicks: Total Count": 28,
    "Clicks: Click Rate %": 43.75,
    "Clicks: ASIN Count": 5,
    "Clicks: ASIN Share %": 17.86,
    "Clicks: Price (Median)": 16.99,
    "Clicks: ASIN Price (Median)": 18.99,
    "Clicks: Same-Day Shipping Speed": 4,
    "Clicks: 1D-Shipping Speed": 20,
    "Clicks: 2D-Shipping Speed": 1,
    "Basket Adds: Total Count": 6,
    "Basket Adds: Basket Add Rate %": 9.38,
    "Basket Adds: ASIN Count": 3,
    "Basket Adds: ASIN Share %": 50,
    "Basket Adds: Price (Median)": 18.99,
    "Basket Adds: ASIN Price (Median)": 18.99,
    "Basket Adds: Same-Day Shipping Speed": "",
    "Basket Adds: 1D-Shipping Speed": 4,
    "Basket Adds: 2D-Shipping Speed": "",
    "Purchases: Total Count": 4,
    "Purchases: Purchase Rate %": 6.25,
    "Purchases: ASIN Count": 3,
    "Purchases: ASIN Share %": 75,
    "Purchases: Price (Median)": 18.99,
    "Purchases: ASIN Price (Median)": 18.99,
    "Purchases: Same-Day Shipping Speed": "",
    "Purchases: 1D-Shipping Speed": 3,
    "Purchases: 2D-Shipping Speed": "",
    "Reporting Date": "2025-08-31"
  },
  {
    "Search Query": "rat trsp",
    "Search Query Score": 76,
    "Search Query Volume": 22,
    "Impressions: Total Count": 437,
    "Impressions: ASIN Count": 34,
    "Impressions: ASIN Share %": 7.78,
    "Clicks: Total Count": 12,
    "Clicks: Click Rate %": 54.55,
    "Clicks: ASIN Count": 2,
    "Clicks: ASIN Share %": 16.67,
    "Clicks: Price (Median)": 16.49,
    "Clicks: ASIN Price (Median)": 18.99,
    "Clicks: Same-Day Shipping Speed": 4,
    "Clicks: 1D-Shipping Speed": 6,
    "Clicks: 2D-Shipping Speed": 2,
    "Basket Adds: Total Count": 8,
    "Basket Adds: Basket Add Rate %": 36.36,
    "Basket Adds: ASIN Count": 2,
    "Basket Adds: ASIN Share %": 25,
    "Basket Adds: Price (Median)": 16.99,
    "Basket Adds: ASIN Price (Median)": 18.99,
    "Basket Adds: Same-Day Shipping Speed": 3,
    "Basket Adds: 1D-Shipping Speed": 3,
    "Basket Adds: 2D-Shipping Speed": 2,
    "Purchases: Total Count": 2,
    "Purchases: Purchase Rate %": 9.09,
    "Purchases: ASIN Count": 1,
    "Purchases: ASIN Share %": 50,
    "Purchases: Price (Median)": 16.99,
    "Purchases: ASIN Price (Median)": 18.99,
    "Purchases: Same-Day Shipping Speed": "",
    "Purchases: 1D-Shipping Speed": "",
    "Purchases: 2D-Shipping Speed": 2,
    "Reporting Date": "2025-08-31"
  },
  {
    "Search Query": "big rat traps that kill instantly",
    "Search Query Score": 72,
    "Search Query Volume": 105,
    "Impressions: Total Count": 2463,
    "Impressions: ASIN Count": 114,
    "Impressions: ASIN Share %": 4.63,
    "Clicks: Total Count": 66,
    "Clicks: Click Rate %": 62.86,
    "Clicks: ASIN Count": 8,
    "Clicks: ASIN Share %": 12.12,
    "Clicks: Price (Median)": 12.99,
    "Clicks: ASIN Price (Median)": 18.99,
    "Clicks: Same-Day Shipping Speed": 1,
    "Clicks: 1D-Shipping Speed": 54,
    "Clicks: 2D-Shipping Speed": 7,
    "Basket Adds: Total Count": 11,
    "Basket Adds: Basket Add Rate %": 10.48,
    "Basket Adds: ASIN Count": 1,
    "Basket Adds: ASIN Share %": 9.09,
    "Basket Adds: Price (Median)": 12.99,
    "Basket Adds: ASIN Price (Median)": 18.99,
    "Basket Adds: Same-Day Shipping Speed": "",
    "Basket Adds: 1D-Shipping Speed": 11,
    "Basket Adds: 2D-Shipping Speed": "",
    "Purchases: Total Count": 5,
    "Purchases: Purchase Rate %": 4.76,
    "Purchases: ASIN Count": 1,
    "Purchases: ASIN Share %": 20,
    "Purchases: Price (Median)": 11.99,
    "Purchases: ASIN Price (Median)": 18.99,
    "Purchases: Same-Day Shipping Speed": "",
    "Purchases: 1D-Shipping Speed": 5,
    "Purchases: 2D-Shipping Speed": "",
    "Reporting Date": "2025-08-31"
  },
  {
    "Search Query": "pet safe rat trap",
    "Search Query Score": 39,
    "Search Query Volume": 60,
    "Impressions: Total Count": 1517,
    "Impressions: ASIN Count": 84,
    "Impressions: ASIN Share %": 5.54,
    "Clicks: Total Count": 29,
    "Clicks: Click Rate %": 48.33,
    "Clicks: ASIN Count": 7,
    "Clicks: ASIN Share %": 24.14,
    "Clicks: Price (Median)": 16.99,
    "Clicks: ASIN Price (Median)": 18.99,
    "Clicks: Same-Day Shipping Speed": 6,
    "Clicks: 1D-Shipping Speed": 19,
    "Clicks: 2D-Shipping Speed": 4,
    "Basket Adds: Total Count": 16,
    "Basket Adds: Basket Add Rate %": 26.67,
    "Basket Adds: ASIN Count": 3,
    "Basket Adds: ASIN Share %": 18.75,
    "Basket Adds: Price (Median)": 16.49,
    "Basket Adds: ASIN Price (Median)": 18.99,
    "Basket Adds: Same-Day Shipping Speed": 5,
    "Basket Adds: 1D-Shipping Speed": 9,
    "Basket Adds: 2D-Shipping Speed": 2,
    "Purchases: Total Count": 9,
    "Purchases: Purchase Rate %": 15,
    "Purchases: ASIN Count": 2,
    "Purchases: ASIN Share %": 22.22,
    "Purchases: Price (Median)": 16.99,
    "Purchases: ASIN Price (Median)": 18.99,
    "Purchases: Same-Day Shipping Speed": 1,
    "Purchases: 1D-Shipping Speed": 6,
    "Purchases: 2D-Shipping Speed": 2,
    "Reporting Date": "2025-08-31"
  },
  {
    "Search Query": "pet safe rodent killer",
    "Search Query Score": 82,
    "Search Query Volume": 54,
    "Impressions: Total Count": 1110,
    "Impressions: ASIN Count": 84,
    "Impressions: ASIN Share %": 7.57,
    "Clicks: Total Count": 24,
    "Clicks: Click Rate %": 44.44,
    "Clicks: ASIN Count": 5,
    "Clicks: ASIN Share %": 20.83,
    "Clicks: Price (Median)": 16.99,
    "Clicks: ASIN Price (Median)": 18.99,
    "Clicks: Same-Day Shipping Speed": 4,
    "Clicks: 1D-Shipping Speed": 15,
    "Clicks: 2D-Shipping Speed": 4,
    "Basket Adds: Total Count": 4,
    "Basket Adds: Basket Add Rate %": 7.41,
    "Basket Adds: ASIN Count": 1,
    "Basket Adds: ASIN Share %": 25,
    "Basket Adds: Price (Median)": 16.99,
    "Basket Adds: ASIN Price (Median)": 18.99,
    "Basket Adds: Same-Day Shipping Speed": "",
    "Basket Adds: 1D-Shipping Speed": 4,
    "Basket Adds: 2D-Shipping Speed": "",
    "Purchases: Total Count": 2,
    "Purchases: Purchase Rate %": 3.7,
    "Purchases: ASIN Count": 1,
    "Purchases: ASIN Share %": 50,
    "Purchases: Price (Median)": 18.99,
    "Purchases: ASIN Price (Median)": 18.99,
    "Purchases: Same-Day Shipping Speed": "",
    "Purchases: 1D-Shipping Speed": 2,
    "Purchases: 2D-Shipping Speed": "",
    "Reporting Date": "2025-08-31"
  },
  {
    "Search Query": "pet proof rat traps",
    "Search Query Score": 96,
    "Search Query Volume": 19,
    "Impressions: Total Count": 507,
    "Impressions: ASIN Count": 19,
    "Impressions: ASIN Share %": 3.75,
    "Clicks: Total Count": 12,
    "Clicks: Click Rate %": 63.16,
    "Clicks: ASIN Count": 4,
    "Clicks: ASIN Share %": 33.33,
    "Clicks: Price (Median)": 17.99,
    "Clicks: ASIN Price (Median)": 18.99,
    "Clicks: Same-Day Shipping Speed": "",
    "Clicks: 1D-Shipping Speed": 10,
    "Clicks: 2D-Shipping Speed": 2,
    "Basket Adds: Total Count": 3,
    "Basket Adds: Basket Add Rate %": 15.79,
    "Basket Adds: ASIN Count": 1,
    "Basket Adds: ASIN Share %": 33.33,
    "Basket Adds: Price (Median)": 16.49,
    "Basket Adds: ASIN Price (Median)": 18.99,
    "Basket Adds: Same-Day Shipping Speed": "",
    "Basket Adds: 1D-Shipping Speed": 3,
    "Basket Adds: 2D-Shipping Speed": "",
    "Purchases: Total Count": 3,
    "Purchases: Purchase Rate %": 15.79,
    "Purchases: ASIN Count": 1,
    "Purchases: ASIN Share %": 33.33,
    "Purchases: Price (Median)": 16.49,
    "Purchases: ASIN Price (Median)": 18.99,
    "Purchases: Same-Day Shipping Speed": "",
    "Purchases: 1D-Shipping Speed": 3,
    "Purchases: 2D-Shipping Speed": "",
    "Reporting Date": "2025-08-31"
  }
]);
  const [csvColumns0, setCsvColumns0] = useState<string[]>(["Search Query","Search Query Score","Search Query Volume","Impressions: Total Count","Impressions: ASIN Count","Impressions: ASIN Share %","Clicks: Total Count","Clicks: Click Rate %","Clicks: ASIN Count","Clicks: ASIN Share %","Clicks: Price (Median)","Clicks: ASIN Price (Median)","Clicks: Same-Day Shipping Speed","Clicks: 1D-Shipping Speed","Clicks: 2D-Shipping Speed","Basket Adds: Total Count","Basket Adds: Basket Add Rate %","Basket Adds: ASIN Count","Basket Adds: ASIN Share %","Basket Adds: Price (Median)","Basket Adds: ASIN Price (Median)","Basket Adds: Same-Day Shipping Speed","Basket Adds: 1D-Shipping Speed","Basket Adds: 2D-Shipping Speed","Purchases: Total Count","Purchases: Purchase Rate %","Purchases: ASIN Count","Purchases: ASIN Share %","Purchases: Price (Median)","Purchases: ASIN Price (Median)","Purchases: Same-Day Shipping Speed","Purchases: 1D-Shipping Speed","Purchases: 2D-Shipping Speed","Reporting Date"]);
  const [csvTextInput0, setCsvTextInput0] = useState<string>('');
  const [selectedRows0, setSelectedRows0] = useState<Set<number>>(new Set());
  const [editingHeader0, setEditingHeader0] = useState<string | null>(null);
  const [editingCell0, setEditingCell0] = useState<{rowIndex: number, colKey: string} | null>(null);

  const processCSVText = (
    csvText: string,
    setCsvColumns: (columns: string[]) => void,
    setCsvData: (data: Array<Record<string, any>>) => void,
    setCsvTextInput: (text: string) => void
  ): void => {
    if (!csvText.trim()) return;
    
    try {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: (results: any) => {
          if (results.data && Array.isArray(results.data) && results.data.length > 0) {
            const firstRow = results.data[0] as Record<string, any>;
            if (firstRow && typeof firstRow === 'object') {
              const columns = Object.keys(firstRow);
              setCsvColumns(columns);
              setCsvData(results.data as Array<Record<string, any>>);
              setCsvTextInput('');
            }
          }
        },
        error: (error: any) => {
          console.error('CSV parsing error:', error);
          alert('Error parsing CSV file. Please check the format.');
        }
      });
    } catch (error) {
      console.error('CSV processing error:', error);
      alert('Error processing CSV file.');
    }
  };

  const loadTestData = (
    setCsvColumns: (columns: string[]) => void,
    setCsvData: (data: Array<Record<string, any>>) => void
  ): void => {
    const testColumns = ['Name', 'Age', 'City', 'Occupation'];
    const testData = [
      { Name: 'John Doe', Age: '30', City: 'New York', Occupation: 'Engineer' },
      { Name: 'Jane Smith', Age: '25', City: 'Los Angeles', Occupation: 'Designer' },
      { Name: 'Mike Johnson', Age: '35', City: 'Chicago', Occupation: 'Manager' },
      { Name: 'Sarah Wilson', Age: '28', City: 'Miami', Occupation: 'Developer' },
      { Name: 'David Brown', Age: '32', City: 'Seattle', Occupation: 'Analyst' }
    ];
    setCsvColumns(testColumns);
    setCsvData(testData);
  };

  const updateCellData = (
    rowIndex: number,
    columnName: string,
    newValue: string,
    setCsvData: (updater: (prev: Array<Record<string, any>>) => Array<Record<string, any>>) => void
  ): void => {
    setCsvData(prev => prev.map((row, index) => index === rowIndex ? { ...row, [columnName]: newValue } : row));
  };

  const updateColumnHeader = (
    oldHeader: string,
    newHeader: string,
    setCsvData: (updater: (prev: Array<Record<string, any>>) => Array<Record<string, any>>) => void,
    setCsvColumns: (updater: (prev: string[]) => string[]) => void
  ): void => {
    setCsvData(prev => prev.map(row => {
      const newRow: Record<string, any> = {};
      Object.keys(row).forEach(key => { newRow[key === oldHeader ? newHeader.trim() : key] = row[key]; });
      return newRow;
    }));
    setCsvColumns(prev => prev.map(col => col === oldHeader ? newHeader.trim() : col));
  };

  const addNewRow = (
    csvColumns: string[],
    setCsvData: (updater: (prev: Array<Record<string, any>>) => Array<Record<string, any>>) => void
  ): void => {
    const newRow: Record<string, any> = {};
    csvColumns.forEach(col => { newRow[col] = ''; });
    setCsvData(prev => [...prev, newRow]);
  };

  const addNewColumn = (
    csvColumns: string[],
    setCsvData: (updater: (prev: Array<Record<string, any>>) => Array<Record<string, any>>) => void,
    setCsvColumns: (updater: (prev: string[]) => string[]) => void
  ): void => {
    const newColumnName = `Column ${csvColumns.length + 1}`;
    setCsvData(prev => prev.map(row => ({ ...row, [newColumnName]: '' })) );
    setCsvColumns(prev => [...prev, newColumnName]);
  };

  const deleteColumn = (
    columnName: string,
    setCsvData: (updater: (prev: Array<Record<string, any>>) => Array<Record<string, any>>) => void,
    setCsvColumns: (updater: (prev: string[]) => string[]) => void
  ): void => {
    setCsvData(prev => prev.map(row => { const newRow = { ...row }; delete newRow[columnName]; return newRow; }));
    setCsvColumns(prev => prev.filter(col => col !== columnName));
  };

  const deleteSelectedRows = (
    selectedRows: Set<number>,
    setCsvData: (updater: (prev: Array<Record<string, any>>) => Array<Record<string, any>>) => void,
    setSelectedRows: (rows: Set<number>) => void
  ): void => {
    setCsvData(prev => prev.filter((_, index) => !selectedRows.has(index)));
    setSelectedRows(new Set());
  };

  const clearData = (
    setCsvData: (data: Array<Record<string, any>>) => void,
    setSelectedRows: (rows: Set<number>) => void
  ): void => {
    setCsvData([]);
    setSelectedRows(new Set());
  };

  const downloadCSV = (
    csvData: Array<Record<string, any>>,
    csvColumns: string[]
  ): void => {
    if (csvData.length === 0) return;
    const csvContent = [
      csvColumns.join(','),
      ...csvData.map(row => csvColumns.map(col => `"${(row[col] || '').toString()}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ background: COLORS.bgPrimary, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gridTemplateRows: 'repeat(10, 165px)',
          columnGap: '0px',
          rowGap: '0px',
          padding: 0,
          flex: 1,
        }}
      >
      <div
        style={{
          gridColumn: '2 / span 6',
          gridRow: '1 / span 2',
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: 0,
          paddingRight: 0,
          minWidth: 0,
          minHeight: 0,
          height: '100%',
          overflow: 'visible',
        }}
      >
      {/* Enhanced Header Component with Container & Animation */}
      
      <style dangerouslySetInnerHTML={{__html: `@keyframes headerRotateheader-1757653911228 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}} />
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
          border: '1.5px solid rgba(157, 78, 221, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          flex: 1,
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
            background: 'radial-gradient(circle, rgba(157, 78, 221, 0.2) 0%, transparent 70%)',
            animation: 'headerRotateheader-1757653911228 30s linear infinite',
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
            

            {/* Header Content Group (Title + Subtitle + Stage Info) */}
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
                  letterSpacing: undefined,
                  margin: 0,
                  maxWidth: '600px',
                  textAlign: 'center',
                  textShadow: undefined,
                }}
              >
                Advanced Search Performance Analytics for Amazon Sellers
              </div>

              {/* Stage Info */}
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgb(157, 78, 221)',
                  letterSpacing: '1px',
                  margin: 0,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  marginTop: '0.5rem',
                  textShadow: undefined,
                }}
              >
                AI-Powered Tool
              </div>
            </div>
          </div>
      </header>
      </div>
      <div
        style={{
          gridColumn: '2 / span 6',
          gridRow: '3 / span 3',
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: 0,
          paddingRight: 0,
          minWidth: 0,
          minHeight: 0,
          height: '100%',
          overflow: 'visible',
        }}
      >
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
            background: COLORS.bgPanel,
            border: '1px solid ' + COLORS.accentBorder,
            borderRadius: '0.75rem',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            minHeight: '0',
            maxHeight: '495px',
            overflow: 'auto',
          }}
        >
                   {csvData0.length === 0 ? (
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
                  style={{
                    border: '2px dashed ' + COLORS.accentBorder,
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    textAlign: 'center',
                    background: 'rgba(157, 78, 221, 0.02)',
                    transition: 'all 0.2s',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '200px',
                    cursor: 'pointer',
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).style.borderColor = COLORS.accent;
                    (e.currentTarget as HTMLElement).style.background = COLORS.accentAlpha;
                  }}
                  onDragLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = COLORS.accentBorder;
                    (e.currentTarget as HTMLElement).style.background = 'rgba(157, 78, 221, 0.02)';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).style.borderColor = COLORS.accentBorder;
                    (e.currentTarget as HTMLElement).style.background = 'rgba(157, 78, 221, 0.02)';
                    const files = Array.from(e.dataTransfer.files);
                    const csvFile = files.find((file) => /csv/i.test(file.type) || /\.csv$/i.test(file.name));
                    if (csvFile) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const csvContent = (event.target?.result || '') as string;
                        processCSVText(csvContent, setCsvColumns0, setCsvData0, setCsvTextInput0);
                      };
                      reader.readAsText(csvFile);
                    } else {
                      alert('Please drop a valid CSV file.');
                    }
                  }}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      const fileInput = (e.currentTarget as HTMLElement).querySelector('input[type="file"]') as HTMLInputElement;
                      if (fileInput) fileInput.click();
                    }
                  }}
                >
                  <div style={{ width: '5rem', height: '5rem', margin: '0 auto 1rem auto', background: 'rgba(157, 78, 221, 0.1)', border: '2px solid rgba(157, 78, 221, 0.3)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                    <Upload size={40} style={{ color: 'rgba(157, 78, 221, 0.6)' }} />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem' }}>
                    Drop your files here
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    or click to browse from your computer
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(157, 78, 221, 0.2)', border: '1px solid rgba(157, 78, 221, 0.3)', color: 'rgba(157, 78, 221, 0.8)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      CSV
                    </span>
                  </div>

                  <button
                    style={{
                      position: 'relative',
                      padding: '1rem 2rem',
                      background: 'transparent',
                      color: '#ffffff',
                      border: '2px solid transparent',
                      borderRadius: '1rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      backgroundImage:
                        'linear-gradient(#030c1b, #030c1b), linear-gradient(135deg, #9d4edd 0%, #c084fc 100%)',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
  display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
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
                    onClick={() => {
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                      if (fileInput) fileInput.click();
                    }}
                  >
                    <Upload size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Browse Files
                  </button>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const csvContent = (event.target?.result || '') as string;
                          processCSVText(csvContent, setCsvColumns0, setCsvData0, setCsvTextInput0);
                        };
                        reader.readAsText(file);
                      }
                    }}
                    onClick={(e) => {
                      (e.currentTarget as HTMLInputElement).value = '';
                    }}
                  />
                </div>
              </div>
              
              <div
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() => loadTestData(setCsvColumns0, setCsvData0)}
                  style={{
                    background: COLORS.accent,
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Load Test Data
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  zIndex: 10,
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => addNewColumn(csvColumns0, setCsvData0, setCsvColumns0)}
                  style={{
                    background: COLORS.accent,
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                >
                  + Add Column
                </button>
                <button
                  onClick={() => addNewRow(csvColumns0, setCsvData0)}
                  style={{
                    background: COLORS.accent,
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                >
                  + Add Row
                </button>
                {selectedRows0.size > 0 && (
                  <button
                    onClick={() => deleteSelectedRows(selectedRows0, setCsvData0, setSelectedRows0)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    Delete Selected ({selectedRows0.size})
                  </button>
                )}
              </div>
              <div
                style={{
                  background: COLORS.bgPrimary,
                  border: '1px solid ' + COLORS.accentBorder,
                  borderRadius: '0.5rem',
                  flex: 1,
                  minHeight: '0',
                  overflow: 'auto',
                  position: 'relative',
                  zIndex: 10,
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.75rem',
                    minWidth: 'fit-content',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: COLORS.bgPanel,
                        borderBottom: '1px solid ' + COLORS.accentBorder,
                      }}
                    >
                      <th
                        style={{
                          padding: '1rem',
                          textAlign: 'center',
                          color: COLORS.textPrimary,
                          fontWeight: '600',
                          borderRight: '1px solid ' + COLORS.accentBorder,
                          width: '50px',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={csvData0.length > 0 && csvData0.every((_, index) => selectedRows0.has(index))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRows0(new Set(Array.from({ length: csvData0.length }, (_, i) => i)));
                            } else {
                              setSelectedRows0(new Set());
                            }
                          }}
                          style={{
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer',
                          }}
                        />
                      </th>
                      {csvColumns0.map((col, index) => (
                        <th key={index}
                          onClick={() => {
                            setEditingHeader0(editingHeader0 === col ? null : col);
                          }}
                          style={{
                            padding: '0.75rem 1rem',
                            textAlign: 'left',
                            color: COLORS.textPrimary,
                            fontWeight: '600',
                            borderRight: index < csvColumns0.length - 1 ? '1px solid ' + COLORS.accentBorder : 'none',
                            whiteSpace: 'nowrap',
                            overflow: 'visible',
                            textOverflow: 'ellipsis',
                            minWidth: '120px',
                            maxWidth: '200px',
                            position: 'relative',
                            cursor: 'pointer',
                            background: editingHeader0 === col ? 'rgba(157, 78, 221, 0.12)' : 'transparent'
                          }}
                        >
                          {editingHeader0 === col ? (
                            <input
                              autoFocus
                              defaultValue={col}
                              onBlur={(e) => {
                                const newHeader = e.target.value.trim();
                                if (newHeader && newHeader !== col) {
                                  updateColumnHeader(col, newHeader, setCsvData0, setCsvColumns0);
                                }
                                setEditingHeader0(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  (e.target as HTMLInputElement).blur();
                                } else if (e.key === 'Escape') {
                                  setEditingHeader0(null);
                                }
                              }}
                              style={{
                                background: 'rgba(157, 78, 221, 0.2)',
                                border: '2px solid rgb(157, 78, 221)',
                                borderRadius: '0.25rem',
                                padding: '0.25rem 0.5rem',
                                color: COLORS.textPrimary,
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                outline: 'none',
                                width: '100%',
                                boxSizing: 'border-box'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.5rem'
                              }}
                              onMouseEnter={(e) => {
                                const deleteBtn = (e.currentTarget as HTMLElement).querySelector('.delete-btn') as HTMLElement;
                                if (deleteBtn) deleteBtn.style.display = 'flex';
                              }}
                              onMouseLeave={(e) => {
                                const deleteBtn = (e.currentTarget as HTMLElement).querySelector('.delete-btn') as HTMLElement;
                                if (deleteBtn) deleteBtn.style.display = 'none';
                              }}
                            >
                              <span style={{ flex: 1 }}>{col}</span>
                              {csvColumns0.length > 1 && (
                                <button
                                  className="delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteColumn(col, setCsvData0, setCsvColumns0);
                                  }}
                                  style={{
                                    background: '#ef4444',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    display: 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData0.map((row, rowIndex) => (
                      <tr key={rowIndex}
                        style={{
                          borderBottom: rowIndex < csvData0.length - 1 ? '1px solid ' + COLORS.accentBorder : 'none',
                          backgroundColor: selectedRows0.has(rowIndex) ? 'rgba(157, 78, 221, 0.1)' : 'transparent',
                        }}
                      >
                        <td
                          style={{
                            padding: '1rem',
                            textAlign: 'center',
                            color: COLORS.textPrimary,
                            borderRight: '1px solid ' + COLORS.accentBorder,
                            width: '50px',
                            position: 'relative',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRows0.has(rowIndex)}
                            onChange={(e) => {
                              const newSelectedRows = new Set(selectedRows0);
                              if (e.target.checked) { newSelectedRows.add(rowIndex); } else { newSelectedRows.delete(rowIndex); }
                              setSelectedRows0(newSelectedRows);
                            }}
                            style={{
                              width: '16px',
                              height: '16px',
                              cursor: 'pointer',
                            }}
                          />
                        </td>
                        {csvColumns0.map((col, colIndex) => (
                          <td key={colIndex}
                            onClick={() => {
                              setEditingCell0(editingCell0?.rowIndex === rowIndex && editingCell0?.colKey === col 
                                ? null 
                                : { rowIndex, colKey: col });
                            }}
                            style={{
                              padding: '0.75rem 1rem',
                              color: COLORS.textPrimary,
                              borderRight: colIndex < csvColumns0.length - 1 ? '1px solid ' + COLORS.accentBorder : 'none',
                              whiteSpace: 'nowrap',
                              overflow: 'visible',
                              textOverflow: 'ellipsis',
                              minWidth: '120px',
                              maxWidth: '200px',
                              position: 'relative',
                              cursor: 'pointer',
                              background: editingCell0?.rowIndex === rowIndex && editingCell0?.colKey === col 
                                ? 'rgba(157, 78, 221, 0.12)' : 'transparent'
                            }}
                          >
                            {editingCell0?.rowIndex === rowIndex && editingCell0?.colKey === col ? (
                              <textarea
                                autoFocus
                                defaultValue={String(row[col] || '')}
                                onBlur={(e) => {
                                  const newValue = e.target.value;
                                  updateCellData(rowIndex, col, newValue, setCsvData0);
                                  setEditingCell0(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    (e.target as HTMLTextAreaElement).blur();
                                  } else if (e.key === 'Escape') {
                                    setEditingCell0(null);
                                  }
                                }}
                                style={{
                                  position: 'absolute',
                                  left: '1rem',
                                  right: '1rem',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  zIndex: 2,
                                  boxSizing: 'border-box',
                                  background: 'rgba(157, 78, 221, 0.02)',
                                  color: COLORS.textPrimary,
                                  border: '1px solid ' + COLORS.accent,
                                  borderRadius: '0.25rem',
                                  padding: '0.25rem 0.5rem',
                                  outline: 'none',
                                  fontFamily: 'inherit',
                                  lineHeight: '1.25rem',
                                  maxHeight: '2.5rem',
                                  overflowY: 'auto',
                                  resize: 'none',
                                  fontSize: '0.75rem'
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span
                                style={{
                                  display: 'block',
                                  maxWidth: '240px',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  overflowY: 'auto',
                                  lineHeight: '1.25rem',
                                  maxHeight: '2.5rem'
                                }}
                              >
                                {String(row[col] || '')}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {csvData0.length === 0 && csvColumns0.length > 0 && (
                      <tr>
                        <td colSpan={csvColumns0.length + 1}
                          style={{ padding: '2rem', textAlign: 'center', color: COLORS.textMuted, fontStyle: 'italic' }}
                        >
                          No data rows. Use "+ Row" to add data.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => clearData(setCsvData0, setSelectedRows0)}
                    style={{
                      background: 'transparent',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: '0.375rem',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                    }}
                  >
                    Clear All Data
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => downloadCSV(csvData0, csvColumns0)}
                    style={{
                      background: COLORS.accent,
                      color: COLORS.textPrimary,
                      border: 'none',
                      borderRadius: '0.375rem',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Download size={16} /> Download CSV
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      </div>
      <div
        style={{
          gridColumn: '2 / span 6',
          gridRow: '10 / span 1',
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: 0,
          paddingRight: 0,
          minWidth: 0,
          minHeight: 0,
          height: '100%',
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
          borderTop: '1px solid rgba(157, 78, 221, 0.5)',
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

export default SQPRAnalyser;
