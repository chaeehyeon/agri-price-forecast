import React, { useEffect, useState } from "react";
import "./App.css";
import FilterPanel from "./components/FilterPanel";
import ChartAll from "./components/ChartAll";
import ChartClimate from "./components/ChartClimate";
import ChartTemp from "./components/ChartTemp";
import ChartSunlight from "./components/ChartSunlight";

function App() {
  const [data, setData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedYear, setSelectedYear] = useState(""); // 연도 필터 state 추가
  const [selectedMonth, setSelectedMonth] = useState("");
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || ""
  );
  const [rainValue, setRainValue] = useState("");
  const [temperatureValue, setTemperatureValue] = useState("");
  const [sunlightValue, setSunlightValue] = useState("");
  const [volumeValue, setVolumeValue] = useState("");

  useEffect(() => {
    if (!nickname) return; // 닉네임 없으면 대기
    fetch(`http://127.0.0.1:5000/api/data?user=${encodeURIComponent(nickname)}`)
      .then((res) => res.json())
      .then((json) => {
        const cleanedData = json.map((row) => ({
          ...row,
          price: Number(row.price),
          volume: Number(row.volume),
          month: row.month,
        }));
        setData(cleanedData);

        setSelectedProduct(cleanedData[0].product);
        setSelectedYear(cleanedData[0].month.slice(0, 4));
        setSelectedMonth(cleanedData[0].month);
      })
      .catch((err) => console.error("API 호출 실패:", err));
  }, [nickname]);

  const allMonths = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  if (!data) return <p>데이터 불러오는 중...</p>;

  // 상품, 연도, 월 목록 뽑기
  const products = Array.from(new Set(data.map((row) => row.product)));
  const years = Array.from(new Set(data.map((row) => row.month.slice(0, 4))));
  // 연-월 목록: 선택된 연도에 해당하는 월만 필터링
  // App.js
  const months = Array.from(
    new Set(
      data
        .filter(
          (row) =>
            row.product === selectedProduct &&
            row.month.startsWith(selectedYear)
        )
        .map((row) => {
          // 무조건 두 자리로 맞추기!
          return row.month.slice(5, 7).padStart(2, "0");
        }) // 반드시 5~7자리, 즉 "03", "11", "12" 추출
    )
  ).sort();

  // 선택 조건에 맞는 데이터 찾기
  const target = data.find(
    (row) => row.product === selectedProduct && row.month === selectedMonth
  );
  const filteredData = data.filter(
    (row) => row.product === selectedProduct && row.month === selectedMonth
  );
  function NicknameInput({ nickname, setNickname }) {
    const [value, setValue] = useState(nickname || "");

    const handleSubmit = (e) => {
      e.preventDefault();
      setNickname(value);
      localStorage.setItem("nickname", value);
    };

    return (
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="닉네임(별명)을 입력하세요"
          style={{ fontSize: 16, padding: 6, borderRadius: 6 }}
          required
        />
        <button type="submit" style={{ marginLeft: 10 }}>
          확인
        </button>
      </form>
    );
  }
  if (!nickname) {
    return <NicknameInput nickname={nickname} setNickname={setNickname} />;
  }
  function LogViewer() {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
      fetch("http://127.0.0.1:5000/api/log")
        .then((res) => res.json())
        .then((json) => setLogs(json.reverse())); // 최신순
    }, []);

    // 날짜 포맷 예쁘게 함수
    const formatTime = (time) => {
      const t = new Date(time);
      // yyyy-mm-dd HH:MM
      return t.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontWeight: "bold" }}>최근 사용 내역</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            maxHeight: 240,
            overflowY: "auto",
          }}
        >
          {logs.length === 0 ? (
            <span style={{ color: "#888" }}>최근 조회 기록이 없습니다.</span>
          ) : (
            logs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  padding: "10px 18px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.09)",
                  fontSize: 14,
                  color: "#222",
                  borderLeft: "4px solid",
                }}
              >
                <div>
                  <b>{formatTime(log.time)}</b>에 조회함
                </div>
                {/* ip나 url은 관리자만 보는 용도라면 빼도 OK */}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  function handlePredict() {
    fetch("http://127.0.0.1:5000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: selectedProduct,
        rain: Number(rainValue),
        temperature: Number(temperatureValue),
        sunlight: Number(sunlightValue),
        volume: Number(volumeValue),
        year: Number(selectedYear),
        month: Number(selectedMonth),
      }),
    })
      .then((res) => res.json())
      .then((data) =>
        alert("예측 가격: " + Math.round(data.prediction) + "원")
      );
  }

  return (
    <div className="app-container">
      {/* 1. 필터 영역 (카드 스타일) */}
      <div className="filter-wrapper">
        <div className="filter-panel">
          <FilterPanel
            products={products}
            years={years}
            months={allMonths}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
      </div>

      {/* 2. 차트 2열 */}
      <div className="charts">
        <div className="card chart-card">
          <ChartAll
            target={target}
            selectedProduct={selectedProduct}
            selectedMonth={selectedMonth}
          />
        </div>
        <div className="card chart-card">
          <ChartClimate
            filteredData={filteredData}
            selectedProduct={selectedProduct}
          />
        </div>
        <div className="card chart-card">
          <ChartTemp
            filteredData={filteredData}
            selectedProduct={selectedProduct}
          />
        </div>
        <div className="card chart-card">
          <ChartSunlight
            filteredData={filteredData}
            selectedProduct={selectedProduct}
          />
        </div>
      </div>

      {/* 3. 로그 */}
      <div className="card log-viewer">
        <LogViewer />
      </div>

      {/* 4. 예측 입력 폼 */}
      <div className="card predict-form">
        <h3>예측용 입력값</h3>
        <label>
          강수량:
          <input
            value={rainValue}
            onChange={(e) => setRainValue(e.target.value)}
          />
        </label>
        <label>
          기온:
          <input
            value={temperatureValue}
            onChange={(e) => setTemperatureValue(e.target.value)}
          />
        </label>
        <label>
          일조량:
          <input
            value={sunlightValue}
            onChange={(e) => setSunlightValue(e.target.value)}
          />
        </label>
        <label>
          거래량:
          <input
            value={volumeValue}
            onChange={(e) => setVolumeValue(e.target.value)}
          />
        </label>
        <button onClick={handlePredict}>예측하기</button>
      </div>
    </div>
  );
}

export default App;
