import React from "react";
import Plot from "react-plotly.js";

function ChartClimate({ filteredData, selectedProduct }) {
  if (!filteredData || filteredData.length === 0)
    return <p>기후 데이터 없음</p>;

  return (
    <div className="card chart-card" style={{ height: 300, marginTop: 24 }}>
    <Plot
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
      data={[
        {
          x: filteredData.map((d) => d.rain),
          y: filteredData.map((d) => d.volume),
          mode: "markers",
          type: "scatter",
          marker: { size: 10 },
          name: "거래량",
        },
      ]}
      layout={{
        autosize: true,
        title: {
          text: `${selectedProduct} - 강수량 vs 거래량`,
          font: { size: 18 },
        },
        xaxis: {
          title: {
            text: "강수량 (mm)",
            font: { size: 14 },
          },
          zeroline: false,
        },
        yaxis: {
          title: {
            text: "거래량",
            font: { size: 14 },
          },
        },
        margin: { t: 60, r: 40, b: 60, l: 60 },
        slowlegend: false,
      }}
    />
    </div>
  );
}

export default ChartClimate;
