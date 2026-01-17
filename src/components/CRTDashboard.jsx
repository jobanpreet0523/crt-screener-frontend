import { useState } from "react";

export default function CRTDashboard() {
  const [timeframe, setTimeframe] = useState("Daily");

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* LEFT SIDEBAR (FILTERS) */}
      <aside className="w-72 bg-white border-r p-4">
        <h2 className="text-lg font-semibold mb-4">CRT Filters</h2>

        {/* Timeframe */}
        <label className="block text-sm font-medium mb-1">Timeframe</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option>5m</option>
          <option>15m</option>
          <option>1H</option>
          <option>Daily</option>
        </select>

        {/* CRT Type */}
        <label className="block text-sm font-medium mb-1">CRT Type</label>
        <select className="w-full border rounded px-3 py-2 mb-4">
          <option>All</option>
          <option>Bullish CRT</option>
          <option>Bearish CRT</option>
        </select>

        {/* Session */}
        <label className="block text-sm font-medium mb-1">Session</label>
        <select className="w-full border rounded px-3 py-2 mb-4">
          <option>Any</option>
          <option>Asia</option>
          <option>London</option>
          <option>New York</option>
        </select>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Run Scan
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">
          CRT Screener Results
        </h1>

        {/* RESULTS TABLE */}
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Symbol</th>
                <th className="px-4 py-3 text-left">Timeframe</th>
                <th className="px-4 py-3 text-left">CRT Type</th>
                <th className="px-4 py-3 text-left">Chart</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">ES</td>
                <td className="px-4 py-3">Daily</td>
                <td className="px-4 py-3 text-green-600">Bullish CRT</td>
                <td className="px-4 py-3">
                  <a
                    href="https://www.tradingview.com/chart/?symbol=ES1!"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
              </tr>

              <tr className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">NQ</td>
                <td className="px-4 py-3">Daily</td>
                <td className="px-4 py-3 text-red-600">Bearish CRT</td>
                <td className="px-4 py-3">
                  <a
                    href="https://www.tradingview.com/chart/?symbol=NQ1!"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
