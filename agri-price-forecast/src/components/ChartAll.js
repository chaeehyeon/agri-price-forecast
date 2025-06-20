// src/components/ChartAll.js
import React from 'react';
import Plot from 'react-plotly.js';

function ChartAll({ target, selectedProduct, selectedMonth }) {
  if (!target) return <p>해당 데이터 없음</p>;

  return (
    <Plot
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
      data={[
        {
          x: [selectedMonth],
          y: [target.price],
          type: 'scatter',
          mode: 'markers+lines',
          name: '도매가격',
          yaxis: 'y1',
        },
        {
          x: [selectedMonth],
          y: [target.volume],
          type: 'bar',
          name: '거래량',
          width: 0.2, 
          yaxis: 'y2',
        },
      ]}
      layout={{
        autosize: true,
        bargap: 0.5,
        title: {
          text: `${selectedProduct} - ${selectedMonth}`,
          font: { size: 18 },
        },
        xaxis: {
          type: 'category',
          title: {
            text: '월',           // x축 레이블
            font: { size: 14 },
          },
        },
        yaxis: {
          title: {
            text: '도매가격 (원)', // 왼쪽 y축 레이블
            font: { size: 14 },
          },
          side: 'left',
        },
        yaxis2: {
          title: {
            text: '거래량',      // 오른쪽 y축 레이블
            font: { size: 14 },
          },
          overlaying: 'y',
          side: 'right',
        },
        showlegend: false,        // 범례 제거
        margin: { t: 60, b: 60, l: 60, r: 60 },
      }}
    />
  );
}

export default ChartAll;
