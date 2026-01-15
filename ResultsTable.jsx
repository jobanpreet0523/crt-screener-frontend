import StatusBadge from "./StatusBadge";

export default function ResultsTable({ data }) {
  if (!data.length) {
    return <p>No CRT found for selected timeframe.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Timeframe</th>
          <th>Status</th>
          <th>Chart</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td>{row.symbol}</td>
            <td>{row.timeframe}</td>
            <td><StatusBadge status={row.type} /></td>
            <td>
              <a
                href={`https://www.tradingview.com/chart/?symbol=${row.symbol}`}
                target="_blank"
              >
                View
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
