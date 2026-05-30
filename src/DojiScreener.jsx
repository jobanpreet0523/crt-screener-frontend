import React, { useState, useEffect } from 'react';
import { fetchDojiScan } from './api';

export default function DojiScreener() {
  const [timeframe, setTimeframe] = useState('1D');
  const [screenerStocks, setScreenerStocks] = useState([]);
  const [screenerLoading, setScreenerLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('table'); 
  
  // ADVANCED: State for column sorting
  const [sortConfig, setSortConfig] = useState({ key: 'volume', direction: 'descending' });

  useEffect(() => {
    loadScreenerData(timeframe);
  }, [timeframe]);

  const loadScreenerData = async (selectedTimeframe) => {
    setScreenerLoading(true);
    try {
      const response = await fetchDojiScan(selectedTimeframe);
      if (response.ok) {
        setScreenerStocks(response.results || []);
      }
    } catch (err) {
      console.error("Data fetch exception:", err);
    } finally {
      setScreenerLoading(false);
    }
  };

  // ADVANCED: Interactive Column Sorting Logic Engine
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredStocks = React.useMemo(() => {
    let stocks = screenerStocks.filter(stock => 
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key !== null) {
      stocks.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Parse numerical values to ensure accurate sort order
        if (sortConfig.key === 'price' || sortConfig.key === 'change' || sortConfig.key === 'volume') {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return stocks;
  }, [screenerStocks, searchQuery, sortConfig]);

  // ADVANCED: CSV Data Exporter Utility (Beating Chartink's Excel tool)
  const exportToCSV = () => {
    const headers = ['Sr,Stock Name,Symbol,Price(INR),Change%,Volume\n'];
    const rows = filteredStocks.map((s, idx) => 
      `${idx + 1},${s.name},${s.symbol},${s.price},${s.change}%,${s.volume}`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Doji_Screener_${timeframe}.csv`);
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-sans antialiased">
      
      {/* Premium Header Banner */}
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-gray-900 to-slate-900 border border-gray-800 rounded-xl p-6 mb-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Doji Smart-Screener Pro
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Analyzing deep real-time candlestick patterns across Indian Equities. Powered by local pipeline execution.
            </p>
          </div>
          
          {/* Advanced Export & Meta controls */}
          <button 
            onClick={exportToCSV}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs px-4 py-2 rounded-lg border border-gray-700 font-medium flex items-center gap-2 transition-all"
          >
            📊 Export CSV Dataset
          </button>
        </div>
      </div>

      {/* Logic Rule Cards */}
      <div className="max-w-7xl mx-auto bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 shadow-xl">
        <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Active Analysis Logic</span>
          
          <div className="flex space-x-1 bg-black p-1 rounded-lg border border-gray-800">
            {['1D', '1W', '1M'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-1 text-xs font-semibold rounded-md transition-all ${
                  timeframe === tf ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf === '1D' ? 'Daily' : tf === '1W' ? 'Weekly' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-400">
          <div className="bg-black/40 p-2.5 rounded border border-gray-800/60 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Abs(Close - Open) ≤ (High - Low) * 0.05
          </div>
          <div className="bg-black/40 p-2.5 rounded border border-gray-800/60 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Accumulated Frame Volume &gt; 100,000 Equities
          </div>
        </div>
      </div>

      {/* Primary Workspace Section */}
      <div className="max-w-7xl mx-auto bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Workspace Toolbar controls */}
        <div className="p-4 bg-gray-900/60 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('table')}
              className={`pb-2 text-sm font-bold transition-all relative ${
                activeTab === 'table' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Filtered Assets ({filteredStocks.length})
              {activeTab === 'table' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`pb-2 text-sm font-bold transition-all relative ${
                activeTab === 'gallery' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Interactive Chart Room
              {activeTab === 'gallery' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />}
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by ticker symbol or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black text-gray-200 text-xs rounded-lg border border-gray-800 px-3 py-2 w-full sm:w-72 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        {activeTab === 'table' ? (
          /* ADVANCED TABLE WITH MULTI-COLUMN SORTING INDICATORS */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/30 text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-800 select-none">
                  <th className="p-4 w-16 text-center">Sr.</th>
                  <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('name')}>
                    Company {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="p-4">Symbol</th>
                  <th className="p-4">External Links</th>
                  <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('price')}>
                    Price {sortConfig.key === 'price' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('change')}>
                    Chg % {sortConfig.key === 'change' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="p-4 text-right pr-6 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('volume')}>
                    Volume {sortConfig.key === 'volume' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-xs font-medium">
                {screenerLoading ? (
                  <tr>
                    <td colSpan="7" className="p-16 text-center text-gray-400">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-emerald-500 mr-3 align-middle"></div>
                      Executing cross-market pattern scanners...
                    </td>
                  </tr>
                ) : filteredStocks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-16 text-center text-gray-500">
                      No assets detected matching current scanner rules.
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map((stock, index) => (
                    <tr key={stock.symbol} className="hover:bg-gray-800/20 transition-colors">
                      <td className="p-4 text-center text-gray-600 font-mono">{index + 1}</td>
                      <td className="p-4 text-white font-semibold">{stock.name}</td>
                      <td className="p-4">
                        <a 
                          href={`https://www.tradingview.com/symbols/NSE-${stock.symbol}/`}
                          target="_blank" rel="noreferrer" className="text-blue-400 font-bold hover:underline"
                        >
                          {stock.symbol}
                        </a>
                      </td>
                      <td className="p-4 text-gray-500">
                        <a 
                          href={`https://www.tradingview.com/symbols/NSE-${stock.symbol}/`}
                          target="_blank" rel="noreferrer" className="text-blue-500 hover:underline"
                        >
                          TradingView Chart
                        </a>
                      </td>
                      <td className="p-4 font-mono text-gray-300">₹{parseFloat(stock.price).toFixed(2)}</td>
                      <td className={`p-4 font-bold font-mono ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? `+${stock.change.toFixed(2)}%` : `${stock.change.toFixed(2)}%`}
                      </td>
                      <td className="p-4 text-right pr-6 font-mono text-gray-400">
                        {stock.volume.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ADVANCED: LIVE FULLY INTERACTIVE TRADINGVIEW GRAPH CORES */
          <div className="p-6 bg-black/10">
            {filteredStocks.length === 0 ? (
              <div className="p-16 text-center text-gray-500 text-xs">No active assets loaded.</div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredStocks.map((stock) => (
                  <div key={stock.symbol} className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                    <div className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{stock.symbol}</span>
                        <span className="text-xs text-gray-400 font-medium">| {stock.name}</span>
                      </div>
                      <span className={`text-xs font-mono font-bold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ₹{stock.price} ({stock.change >= 0 ? `+${stock.change}%` : `${stock.change}%`})
                      </span>
                    </div>
                    
                    {/* Live Embedding Framework Container Frame */}
                    <div className="w-full h-80 bg-gray-950">
                      <iframe
                        title={`tv-widget-${stock.symbol}`}
                        src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=NSE%3A${stock.symbol}&interval=${timeframe === '1D' ? 'D' : timeframe === '1W' ? 'W' : 'M'}&theme=dark&style=1&timezone=Asia%2FKolkata&studies=%5B%5D&timeline=false&showPopupButton=true&popupWidth=1000&popupHeight=650`}
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
