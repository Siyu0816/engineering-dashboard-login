# Engineering Department Operations Center Dashboard

The site is a login-free, locally rendered recreation of the usable report pages in `Engineering Operations Center.pbix`. It reads generated data from the Excel files in the parent folder and its `BU`, `Breakdown`, `Capex`, `Energy`, `Order Cost`, and `WO` subfolders. It does not use a Power BI embed, call Power BI Service, or require an Entra app.

The PBIX connects to a remote Power BI semantic model, so this page recreates its page structure and available report interactions from the supplied local data; model-only measures and pixel-exact visuals cannot be reproduced from the PBIX file alone.

## Report pages

The navigation follows the PBIX page names:

- Home
- Overview-MC, Area-MC, Others-MC, Contract-MC
- Capex-Overview, Capex-GR Plan
- Breakdown, Work Order, Daily WO, Energy

The pages have shared multi-select year/month and relevant cost/area filters, interactive charts with value tooltips, report-style navigation, and source-backed tables; Home has no filter bar, and the report content is centered with a 1,280-pixel maximum width. The top bar includes a CNY/CHF display toggle on every page and shows the exchange rate from the CAPEX Currency sheet (`1 CNY = 0.114 CHF` in the current snapshot); amounts are converted for display without changing source data. Table headers can be clicked to sort values ascending/descending; month slicers use localized month labels, and chart currency labels/tooltips generally use K units. Maintenance Overview budget/actual chart y-axes use M units for readability. The hamburger navigation has a standalone Home item and four collapsible report groups. Its compact top-right arrow closes the menu without changing the current report page. The Givaudan mark appears in the menu and report heading. The UnGR KPI opens rows from `WO/ME2N_UnGR.XLSX`; Area-MC's equipment information button opens equipment-register details; Small Spending & Improvement opens the corresponding order-cost rows and uses the Power BI-style cost-element donut palette. The Area-MC equipment ranking joins Order Cost `Equipment` to `Relationship.XLSX` → `Equipment IH08` on `Equipment`, groups actual costs by the matched `Description`, and excludes unmatched/blank descriptions. Contract Follow Up contains its monthly contract-order actual-cost chart and contract table; expiring contracts are highlighted red and expired contracts gray. Overview-MC opens on fiscal year 2026 and follows the supplied report layout with seven KPI cards in one row on desktop and four budget/actual charts. Its annual actual-cost columns are red when actual exceeds budget and navy otherwise; the actual-cost-per-kg line occupies a separate band above the columns, with a right axis in the currently selected display currency per kilogram; this divides converted annual actual cost by `Energy/CN18 Production Volume.xlsx` `Total` × 1,000. Actual-cost columns in the other budget/actual charts use the same red/navy rule. Excel row data is aggregated from local source files by the Python generator.

## Source mapping

- Maintenance costs, costs by scope/element/type, and work-order detail: the monthly `../Order Cost/YYYY-MM.XLSX` files (the generator also supports a single `Work Order Cost.xlsx` fallback)
- Budget and cost-center/type mappings, equipment, contract register, and outsourcing examples: `../BU/BU 2024-2026.XLSX` and `../Relationship.XLSX`. Cost elements, cost-element identifiers, order types, cost centers, equipment and contract orders are joined from the corresponding relationship sheets.
- CAPEX overview cards and project chart: `../Capex/2026 CN18 Capex Status.xlsx` (`SUMMARY`), `CJE0.xlsx` (`CJE0`), and `ME5A.XLSX`
- CAPEX actuals, GR plan, and exchange rates: `../Capex/CJ74.XLSX`, `ME2N.xlsx`, `CJE0.xlsx`, and the `Currency` sheet in `2026 CN18 Capex Status.xlsx`
- UnGR purchase orders: `../WO/ME2N_UnGR.XLSX`
- Work-order execution: `../WO/2026 WO.xlsx`
- Daily work-order schedule: `../WO/2026 WO Schedule.xlsx` (`Summary` sheet)
- Breakdown detail: `../Breakdown/Breakdown.xlsx`
- Production and utilities: `../Energy/CN18 Production Volume.xlsx` and `../Energy/utility consumption in cz site2026.xlsx`

## Important source-grain limitations

- The source workbooks are snapshots, so changes in Excel or Power BI do not automatically refresh the page. Rerun the data generator after updating a workbook.
- The main maintenance workbook contains 32 summary rows without a posting period or detail dimensions. They are excluded from filterable actual-cost metrics to avoid assigning aggregate values to invented categories.
- BU budget rows labeled `Unmapped` are excluded from mapped budget comparisons. The annual budget is spread evenly across 12 months for monthly comparisons and month-filtered KPI totals because the local BU files do not contain a monthly budget.
- BU budget data has no order-type dimension. In the order-type chart, the comparison series uses the `Planned costs` field from `Work Order Cost.xlsx`; it is source-backed planned cost, not a separately supplied BU budget by order type.
- The `Work Order` page uses the monthly-by-plant `../WO/2026 WO.xlsx` source. The `Daily WO` page uses the daily-by-state `Summary` sheet in `data/WO/2026 WO Schedule.xlsx`; its completed-rate line is (Done + Unplanned) / Total, with zero returned when the total is zero.
- For the Daily WO page, daily Total WO is recalculated from the four Summary state rows because several cached workbook totals do not reconcile with their component states; Completed Rate then follows (Done + Unplanned) / Total.
- The `Work Order` page recreates the source report's three monthly stacked-column/line visuals: all work orders, critical work orders, and preventive work orders. The columns stack overdue, completed late, and completed on time; the line uses on-time / (on-time + late + overdue) on a percentage axis.
- CAPEX Overview has seven source-mapped KPI cards. Total Budget comes from the `Total BU` row in the status workbook. Approved Budget and Not Yet Occupied use the WBS projects listed in the status workbook's `Overview CJE0` sheet. PO, GR, and UnGR cards sum their respective 2026 fields across all CJE0 project rows; PR Value sums ME5A `Total Value`. Occupied is GR + UnGR + PR. Its gauge compares Approved Budget to Total Budget. The project chart uses WBS rows in `Overview CJE0`, joining CJE0's 2026 GR/UnGR/Budget values to ME5A PR amounts using the project WBS embedded in the ME5A short text. It plots UnGR (dark navy), GR (light lavender), and PR (orange) as stacked columns, purple Occupied points (no connecting line), and red error bars from Occupied to the CJE0 `Budg in OC--2026` value; the numeric error-bar labels show `Budget - Occupied`. The x-axis label is `WBS + " " + project name`. Nonzero requisitions that cannot be matched to a CJE0 WBS stop data generation rather than being silently dropped. Visible overview amounts use M units (sub-million KPI amounts use K); source values remain in CNY and are converted only for display when CHF is selected.
- CAPEX GR Plan follows the supplied report: monthly Act GR YTD sums CJ74 `Vbl. value/Obj. curr` where `Name of offsetting account` is `GR / IR IM&S`; YTD sums ME2N still-to-be-delivered value divided by the matching currency rate; YTD GR is their sum; Budget and the gauge maximum sum CJE0 `Budg in OC--2026` and `Assigned--2026` across project rows. The UnGR gauge and its table amounts/totals use converted CNY values. The table filters ME2N rows to `Still to be delivered (value) > 0`, derives WBS from the first 12 characters of `Short Text`, and forecasts FCT GR month with a two-month `EDATE` offset from `Document Date`. The local Currency sheet does not contain EUR, so the EUR rate shown in the supplied report image (0.1308) is used; any other nonzero currency without a rate stops generation with an explicit error. CAPEX project summary values are shown as supplied by their mapped source tables.
- Energy utility values come from `data/Energy/utility consumption in cz site2026.xlsx`, sheet `utility consumption`: Power/kwh = L (Head), Natural Gas/m3 = BK (Head), Steam/ton = AV (Head (800)), Nitrogen/t = AH (Head), Domestic waste water/t = D (volume/t), Industry waste water/t = G (volume/t), and City water/m3 = BW (m3). Production volume is joined by year/month from the first worksheet in `data/Energy/CN18 Production Volume.xlsx`, field `Total`.
- Energy intensity is calculated for each utility as `utility consumption / (Production Volume.Total * 1000)`, with zero returned when production is missing or zero. The Energy dashboard shows 2024, 2025, and 2026 monthly per-kg lines in a separate upper plot and consumption columns in a lower plot, each with its own scale; small intensity values retain eight decimal places in the generated snapshot.
- Breakdown charts use the source `生产记录停机时间` field. The monthly chart shows monthly downtime and a `Downtime YTD` line calculated for the current year through each displayed month, matching the report's `ALL(Breakdown)` filter behavior. A dotted 14-hour reference line separates red monthly bars above 14 from light-blue bars at or below 14; the equipment chart sums the same downtime field by equipment name and uses dark navy bars.
- Filter values are multi-select. When English is selected, dashboard interface text is translated and unsupported Chinese-only source labels are shown as `Source text` rather than left in Chinese.

## Regenerate the data snapshot

Requirements: Python 3 and pandas with an Excel reader such as openpyxl.
Run the following command from the project directory:

```powershell
python .\build_data.py
```

This writes `dashboard-data.js`, a local data snapshot used by the page. It includes the source rows required for work-order and purchasing tables; keep the project folder on an access-controlled drive.

## Open the page

The dashboard uses local JavaScript and CSS and requires no login, chart CDN, or Power BI service:
Optionally run the server from the project directory:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000/`. You can also open `index.html` directly in a modern browser.

## Project files

- `index.html` — report navigation and view layouts
- `styles.css` — responsive report styling
- `app.js` — chart rendering, navigation, filters, and interactions
- `build_data.py` — reads and aggregates the local Excel sources
- `dashboard-data.js` — generated data snapshot
- `img/` — Givaudan menu/page logomarks and favicon
