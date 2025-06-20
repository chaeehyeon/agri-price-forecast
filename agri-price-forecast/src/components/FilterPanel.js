// FilterPanel.js
function FilterPanel({
  products,
  years,
  months,
  selectedProduct,
  setSelectedProduct,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
}) {
  return (
    <div>
      <label>
        품목:
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          {products.map((prod) => (
            <option key={prod}>{prod}</option>
          ))}
        </select>
      </label>
      <label>
        연도:
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
      </label>
      <label>
        월:
        <select
          value={selectedMonth.slice(5, 7)}
          onChange={(e) =>
            setSelectedMonth(`${selectedYear}-${e.target.value}`)
          }
        >
          {months.map((mon) => (
            <option key={mon} value={mon}>
              {mon}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
export default FilterPanel;
