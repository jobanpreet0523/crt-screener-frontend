import React, { useState } from 'react';

export default function DojiScreener() {
  const [timeframe, setTimeframe] = useState('1D');
  const [activeTab, setActiveTab] = useState('results');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: 'symbol', order: 'asc' });

  const stockDatabase = [
    { name: "HDFC Bank Ltd.", symbol: "HDFCBANK", price: 1511.00, volume: 4800000, per_chg: "+0.07%", rawChg: 0.07, bse: "500180", doji: { '1D': true, '1W': true, '1M': true } },
    { name: "ICICI Bank Ltd.", symbol: "ICICIBANK", price: 1120.40, volume: 3900000, per_chg: "+0.64%", rawChg: 0.64, bse: "532174", doji: { '1D': true, '1W': false, '1M': true } },
    { name: "Reliance Industries Ltd.", symbol: "RELIANCE", price: 2450.50, volume: 3400000, per_chg: "+0.02%", rawChg: 0.02, bse: "500325", doji: { '1D': true, '1W': true, '1M': false } },
    { name: "State Bank of India", symbol: "SBIN", price: 780.20, volume: 6100000, per_chg: "-0.15%", rawChg: -0.15, bse: "500112", doji: { '1D': true, '1W': true, '1M': false } },
    { name: "Tata Consultancy Services", symbol: "TCS", price: 3851.00, volume: 1200000, per_chg: "+0.05%", rawChg: 0.05, bse: "532540", doji: { '1D': true, '1W': false, '1M': false } },
    { name: "Wipro Ltd.", symbol: "WIPRO", price: 432.00, volume: 950000, per_chg: "-0.85%", rawChg: -0.85, bse: "576851", doji: { '1D': false, '1W': true, '1M': false } },
    { name: "Infosys Ltd.", symbol: "INFY", price: 1455.00, volume: 2100000, per_chg: "-1.24%", rawChg: -1.24, bse: "500209", doji: { '1D': false, '1W': false, '1M': false } }
  ];

  const handleSort = (key) => {
    setSort({
      key,
      order: sort.key === key && sort.order === 'asc' ? 'desc' : 'asc'
    });
  };

  const processData = () => {
    let output = stockDatabase.filter(item => item.doji[timeframe]);

    if (search.trim()) {
      const q = search.toLowerCase();
      output = output.filter(item => 
        item.name.toLowerCase().includes(q) || item.symbol.toLowerCase().includes(q)
      );
    }

    output.sort((a, b) => {
      let fieldA = a[sort.key];
      let fieldB = b[sort.key];
      if (typeof fieldA === 'string') {
        return sort.order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      }
      return sort.order === 'asc' ? fieldA - fieldB : fieldB - a[sort.key];
    });

    return output;
  };

  const computedStocks = processData();

  return (
    <div>
      <header className="ci-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="#" className="ci-logo">CHARTINK<span>.com</span></a>
          <nav className="ci-nav">
            <a href="#" className="ci-nav-link">Dashboard</a>
            <a href="#" className="ci-nav-link active">Charts</a>
            <a href="#" className="ci-nav-link">Screeners</a>
            <a href="#" className="ci-nav-link">Premium</a>
          </nav>
        </div>
        <button className="btn-scan">Create Scan</button>
      </header>

      <div className="ci-container">
        <div className="ci-panel meta-title">
          <h1>Doji - 2 Candlestick Screener</h1>
          <p style={{marginTop: '6px'}}>Filters stocks forming equilibrium neutral doji patterns across selected execution windows.</p>
        </div>

        <div className="ci-panel">
          <div className="engine-bar">
            <div className="engine-title">Filter Logic Engine</div>
            <div className="tf-group">
              {['1D', '1W', '1M'].map(tf => (
                <button 
                  key={tf}
                  className={`tf-btn ${timeframe === tf ? 'active' : ''}`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf === '1D' ? 'Daily' : tf === '1W' ? 'Weekly' : 'Monthly'}
                </button>
              ))}
            </div>
          </div>
          <div className="rule-pill">
            <span className="badge-pass">Pass</span>
            <span>Latest Close matches Latest Open within 0.1% of Close (Doji Body Rule)</span>
          </div>
          <div className="rule-pill">
            <span className="badge-pass">Pass</span>
            <span>Latest Volume greater than 100,000 (Liquidity Rule)</span>
          </div>
        </div>

        <div className="ci-tabs">
          <button className={`ci-tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
            Filtered Stocks ({computedStocks.length})
          </button>
          <button className={`ci-tab-btn ${activeTab === 'charts' ? 'active' : ''}`} onClick={() => setActiveTab('charts')}>
            Multi-Chart Gallery
          </button>
        </div>

        {activeTab === 'results' ? (
          <div className="ci-panel" style={{padding: '0 0 12px 0'}}>
            <div style={{padding: '14px 16px', background: '#fafbfc', borderBottom: '1px solid #e2e8f0'}}>
              <input 
                type="text" 
                className="search-bar" 
                placeholder="Search symbol or company name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="table-wrapper">
              <table className="ci-table">
                <thead>
                  <tr>
                    <th className="text-center" style={{width: '60px'}}>Sr.</th>
                    <th style={{cursor: 'pointer'}} onClick={() => handleSort('name')}>Stock Name</th>
                    <th style={{cursor: 'pointer'}} onClick={() => handleSort('symbol')}>Symbol</th>
                    <th>Links</th>
                    <th className="text-right" style={{cursor: 'pointer'}} onClick={() => handleSort('price')}>Price (INR)</th>
                    <th className="text-right" style={{cursor: 'pointer'}} onClick={() => handleSort('rawChg')}>Chg %</th>
                    <th className="text-right" style={{cursor: 'pointer'}} onClick={() => handleSort('volume')}>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {computedStocks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center" style={{padding: '24px', color: '#64748b'}}>No equities match the criteria rules.</td>
                    </tr>
                  ) : (
                    computedStocks.map((stock, i) => (
                      <tr key={stock.symbol}>
                        <td className="text-center font-mono" style={{color: '#94a3b8'}}>{i + 1}</td>
                        <td style={{fontWeight: '600', color: '#1e293b'}}>{stock.name}</td>
                        <td><a href="#" className="stock-link">{stock.symbol}</a></td>
                        <td>
                          <span style={{fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace'}}>
                            <a href={`https://bseindia.com/stock-share-price/x/${stock.bse}`} target="_blank" rel="noreferrer" style={{color: '#64748b', textDecoration: 'none'}}>BSE</a> • Chart
                          </span>
                        </td>
                        <td className="text-right font-mono" style={{fontWeight: 500}}>₹{stock.price.toFixed(2)}</td>
                        <td className={`text-right font-mono ${stock.rawChg >= 0 ? 'text-green' : 'text-red'}`}>{stock.per_chg}</td>
                        <td className="text-right font-mono" style={{color: '#64748b'}}>{stock.volume.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="charts-grid">
            {computedStocks.slice(0, 4).map(stock => (
              <div className="chart-card" key={stock.symbol}>
                <div className="chart-header">
                  <span>{stock.symbol} ({timeframe})</span>
                  <span className={stock.rawChg >= 0 ? 'text-green' : 'text-red'}>₹{stock.price.toFixed(2)}</span>
                </div>
                <div className="chart-body">
                  <div style={{position: 'absolute', top: '8px', left: '10px', color: '#475569', fontSize: '10px', fontFamily: 'monospace'}}>
                    Interactive Preview Engine
                  </div>
                  <div style={{width: '2px', height: '130px', background: '#64748b', position: 'absolute'}}></div>
                  <div style={{width: '36px', height: '2px', background: '#ffffff', position: 'absolute'}}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
