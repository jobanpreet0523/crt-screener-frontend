import React, { useState, useEffect } from 'react';
import { fetchDojiScan } from './api';

export default function DojiScreener() {
  const [timeframe, setTimeframe] = useState('1D');
  const [screenerStocks, setScreenerStocks] = useState([]);
  const [screenerLoading, setScreenerLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('table'); 
  
  // ADVANCED FEATURE: Track table sorting state
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

  // ADVANCED FEATURE: Dynamic Column Sorting
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

  // ADVANCED FEATURE: Data sheet exporter tool
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
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 p-6 font-sans">
      
      {/* Chartink Styled Top Header Panel */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#1a2b4c] mb-1">Doji - 2 Candlestick Screener</h1>
            <p className="text-xs text-gray-500">
              Filters stocks forming precise equilibrium neutral doji patterns across selected timeframes.
            </p>
          </div>
          <button 
            onClick={exportToCSV}
            className="bg-[#24a0ed] hover:bg-blue-600 text-white text-xs px-4 py-2 rounded font-semibold shadow-sm transition-all"
          >
            📥 Download CSV Dataset
          </button>
        </div>
      </div>

      {/* Filter Engine Logic Cards */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">FILTER LOGIC ENGINE</span>
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded border border-gray-200及">
            {['1D', '1W', '1M'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-1 text-xs font-semibold rounded transition-all ${
                  timeframe === tf ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tf === '1D' ? 'Daily' : tf === '1W' ? 'Weekly' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-white p-2 px-3 rounded border border-gray-100 flex items-center gap-3 text-xs text-gray-600 shadow-sm">
            <span className="bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">PASS</span>
            <span>Latest Close matches Latest Open within 0.1% of Close (Doji Body Rule)</span>
          </div>
          <div className="bg-white p-2 px-3 rounded border border-gray-100 flex items-center gap-3 text-xs text-gray-600 shadow-sm">
            <span className="bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">PASS</span>
            <span>Latest Volume greater than 100,000 (Liquidity Rule)</span>
          </div>
        </div>
      </div>

      {/* Main Table & Tab Module Container */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        
        <div className="p-4 bg-white border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('table')}
              className={`pb-2 text-sm font-bold transition-all relative ${
                activeTab === 'table' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Filtered Stocks ({filteredStocks.length})
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`pb-2 text-sm font-bold transition-all relative ${
                activeTab === 'gallery' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Interactive Multi-Chart Gallery
            </button>
          </div>

          <input
            type="text"
            placeholder="Quick search symbol or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white text-gray-800 text-xs rounded border border-gray-300 px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:border-emerald-500 font-medium shadow-sm"
          />
        </div>

        {activeTab === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] text-gray-500 text-[11px] font-bold uppercase border-b border-gray-200 select-none">
                  <th className="p-3 w-16 text-center border-r border-gray-100">Sr.</th>
                  <th className="p-3 cursor-pointer hover:bg-gray-100 border-r border-gray-100" onClick={() => requestSort('name')}>
                    Stock Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="p-3 border-r border-gray-100">Symbol</th>
                  <th className="p-3 border-r border-gray-100">Links</th>
                  <th className="p-3 cursor-pointer hover:bg-gray-100 border-r border-gray-100" onClick={() => requestSort('price')}>
                    Price (INR) {sortConfig.key === 'price' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="p-3 cursor-pointer hover:bg-gray-100 border-r border-gray-100" onClick={() => requestSort('change')}>
                    Chg % {sortConfig.key === 'change' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="p-3 text-right pr-6 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('volume')}>
                    Volume {sortConfig.key === 'volume' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs text-gray-700">
                {screenerLoading ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-gray-400">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-emerald-500 mr-3 align-middle" />
                      Scanning technical matrices...
                    </td>
                  </tr>
                ) : filteredStocks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-gray-400">
                      No stocks found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map((stock, index) => (
                    <tr key={stock.symbol} className="hover:bg-gray-50 transition-all">
                      <td className="p-3 text-center text-gray-400 border-r border-gray-100">{index + 1}</td>
                      <td className="p-3 font-semibold text-gray-900 border-r border-gray-100">{stock.name}</td>
                      <td className="p-3 border-r border-gray-100">
                        <a 
                          href={`https://www.tradingview.com/symbols/NSE-${stock.symbol}/`}
                          target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline"
                        >
                          {stock.symbol}
                        </a>
                      </td>
                      <td className="p-3 text-gray-400 text-[11px] border-r border-gray-100">
                        <span>BSE •</span>{' '}
                        <a 
                          href={`https://www.tradingview.com/symbols/NSE-${stock.symbol}/`}
                          target="_blank" rel="noreferrer" className="text-blue-600 hover:underline"
                        >
                          Chart
                        </a>
                      </td>
                      <td className="p-3 font-mono border-r border-gray-100">₹{parseFloat(stock.price).toFixed(2)}</td>
                      <td className={`p-3 font-bold font-mono border-r border-gray-100 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? `+${stock.change.toFixed(2)}%` : `${stock.change.toFixed(2)}%`}
                      </td>
                      <td className="p-3 text-right pr-6 font-mono text-gray-600">
                        {stock.volume.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ADVANCED COMPONENT: INTERACTIVE LIVE TRADINGVIEW EMBEDS */
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            {filteredStocks.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No active assets available.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredStocks.map((stock) => (
                  <div key={stock.symbol} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-xs text-gray-800">{stock.name} ({stock.symbol})</span>
                      <span className={`text-xs font-mono font-bold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{stock.price} ({stock.change >= 0 ? `+${stock.change}%` : `${stock.change}%`})
                      </span>
                    </div>
                    <div className="w-full h-80 bg-white">
                      <iframe
                        title={`tv-widget-${stock.symbol}`}
                        src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=NSE%3A${stock.symbol}&interval=${timeframe === '1D' ? 'D' : timeframe === '1W' ? 'W' : 'M'}&theme=light&style=1&timezone=Asia%2FKolkata&studies=%5B%5D&timeline=false&showPopupButton=true&popupWidth=1000&popupHeight=650`}
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
