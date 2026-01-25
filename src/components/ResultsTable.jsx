export default function ResultsTable({ data }) {
  if (!data.length) return <p>No results</p>;

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Close</th>
          <th>Volume</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.symbol}>
            <td>{row.symbol}</td>
            <td>{row.close}</td>
            <td>{row.volume}</td>
            <td>{row.grade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
