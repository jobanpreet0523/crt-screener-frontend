import React from "react";
export default function StatusBadge({ status }) {
  const colors = {
    CRT_CONFIRMED: "green",
    NEAR_CRT: "orange"
  };

  return (
    <span className="badge" style={{ background: colors[status] }}>
      {status}
    </span>
  );
}
