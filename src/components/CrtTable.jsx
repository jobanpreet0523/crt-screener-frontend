export default function CrtTable({ data }) {
  if (data.length === 0) {
    return <p>No CRT setups found</p>;
  }

  return (
    <table border="1" cellPadding="8" style={{ marginTop: "15px" }}>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Direction</th>
          <th>CRT Type</th>
          <th>Entry</th>
          <th>SL</th>
          <th>Target</th>
          <th>Grade</th>
          <th>Liquidity</th>
          <th>HTF Bias</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td>{row.symbol}</td>
            <td>{row.direction}</td>
            <td>{row.crt_type}</td>
            <td>{row.entry}</td>
            <td>{row.sl}</td>
            <td>{row.target}</td>
            <td>{row.grade}</td>
            <td>{row.liquidity}</td>
            <td>{row.htf_bias}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
