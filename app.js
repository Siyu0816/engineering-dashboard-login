(() => {
  "use strict";

  const data = window.MAINTENANCE_DATA;
  const colors = ["#5149ef", "#6963d9", "#edb743", "#8d78d4", "#df4658", "#706cc2"];
  const numberFormat = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
  const preciseNumberFormat = new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const translationPairs = [
    ["首页", "Home"],
    ["菜单", "Menu"],
    ["查看数据", "View data"],
    ["类别", "Category"],
    ["数值", "Value"],
    ["指标", "Metric"],
    ["来源说明", "Source"],
    ["关闭", "Close"],
    ["该图表当前没有可显示的明细行。", "No visual rows are available for this chart."],
    ["成本概览", "Cost Overview"],
    ["维护看板", "Maintenance Dashboard"],
    ["CAPEX绩效", "CAPEX Performance"],
    ["能源看板", "Energy Dashboard"],
    ["筛选器", "Slicers"],
    ["成本总览", "Overview"],
    ["区域成本", "Area"],
    ["成本明细", "Others"],
    ["维护合同", "Contract"],
    ["设备故障", "Breakdown"],
    ["工单执行", "Work Order"],
    ["每日工单", "Daily WO"],
    ["CAPEX 总览", "Capex-Overview"],
    ["CAPEX GR计划", "CAPEX GR Plan"],
    ["CAPEX 总览", "CAPEX Overview"],
    ["CAPEX 预算与执行", "CAPEX Budget and Execution"],
    ["总预算", "Total Budget"],
    ["已批准预算", "Approved Budget"],
    ["尚未占用", "Not Yet Occupied"],
    ["采购订单金额", "PO Value"],
    ["采购申请金额", "PR Value"],
    ["采购申请详情", "Purchase Requisition Details"],
    ["申请日期", "Requisition Date"],
    ["截止日期", "Deadline"],
    ["总金额", "Total Value"],
    ["返回CAPEX总览", "Back to CAPEX Overview"],
    ["小额支出：", "Small Spending:"],
    ["外部服务成本 + 外部材料成本（实际成本 < 5000 CHF）", "External Service Cost + External Material Cost (Actual Costs < 5000 CHF)"],
    ["改善：", "Improvement:"],
    ["ZPM6 工单成本", "ZPM6 Work Order Cost"],
    ["已收货金额", "GR Value"],
    ["未收货金额", "UnGR Value"],
    ["未收货", "UnGR"],
    ["已收货", "GR"],
    ["采购申请", "PR"],
    ["占用（未收货、已收货、采购申请）", "Occupied (UnGR & GR & PR)"],
    ["未收货 / 采购申请 / 已收货", "UnGR Value, PR Value and GR Value"],
    ["未收货 / 采购申请 / 已收货", "UnGR / PR / GR Value"],
    ["各项目未收货、已收货、采购申请与占用", "UnGR, GR, PR and Occupied (UnGR & GR & PR)"],
    ["按项目", "by Project"],
    ["占用", "Occupied"],
    ["能源", "Energy"],
    ["维护成本总览", "Maintenance Cost Overview"],
    ["区域维护成本", "Maintenance Cost by Area"],
    ["维护成本明细", "Maintenance Cost Details"],
    ["维护合同", "Maintenance Contracts"],
    ["CAPEX项目计划", "CAPEX Plan"],
    ["设备故障分析", "Equipment Breakdown"],
    ["工单执行", "Work Order Performance"],
    ["每日工单", "Daily Work Orders"],
    ["能源使用", "Energy"],
    ["电力/kwh", "Power/kwh"],
    ["天然气/m3", "Natural Gas/m3"],
    ["蒸汽/ton", "Steam/ton"],
    ["氮气/t", "Nitrogen/t"],
    ["生活污水/t", "Domestic waste water/t"],
    ["工业废水/t", "Industry waste water/t"],
    ["城市用水/m3", "City water/m3"],
    ["按月份和年份", "by Month and Year"],
    ["工程部运营中心", "Engineering Department Operations Center"],
    ["维护、投资、可靠性与能源运营总览", "Maintenance, investment, reliability and energy overview"],
    ["维护成本、预算执行和工单构成", "Maintenance cost, budget performance and work-order mix"],
    ["区域和成本中心的维护支出表现", "Maintenance costs by area and cost center"],
    ["按期间、工单类型和成本要素分析实际支出", "Actual cost by period, work-order type and cost element"],
    ["维护合同状态和年度计划金额", "Maintenance contract status and annual planned amount"],
    ["CAPEX项目预算、实际与承诺", "CAPEX budget, actual and committed amounts"],
    ["CAPEX计划与采购执行", "CAPEX plan and purchasing"],
    ["已收货金额、未交付累计金额、累计收货金额与预算", "Act GR, YTD, YTD GR and Budget"],
    ["按月", "by Month"],
    ["实际收货金额", "Act GR"],
    ["未交付累计金额", "YTD"],
    ["累计收货金额", "YTD GR"],
    ["预算", "Budget"],
    ["GR计划", "GR Plan"],
    ["年份", "Year"],
    ["短文本", "Short Text"],
    ["申请人", "Requisitioner"],
    ["待交付金额", "Still to be delivered (value)"],
    ["预计收货日期", "FCT GR month"],
    ["合计", "Total"],
    ["设备故障记录与停机时间", "Equipment breakdown records and downtime"],
    ["计划工单、按时完成与逾期", "Planned work orders, on-time and overdue completion"],
    ["工单进度与月度执行情况", "Work-order progress and monthly execution"],
    ["能源消耗、生产量及单位产量能耗", "Energy use, production volume and energy intensity"],
    ["预算", "Budget"],
    ["实际成本", "Actual Cost"],
    ["预算差额", "Variance"],
    ["预算执行率", "Budget Utilization"],
    ["改善", "Improvement"],
    ["未交付采购订单", "UnGR Value"],
    ["月度预算与实际成本", "Budget and Actual Cost by Month"],
    ["年度预算与实际成本", "Budget and Actual Cost by Year"],
    ["按成本要素的预算与实际成本", "Budget and Actual Cost by Cost Element"],
    ["按工单类型的预算与实际成本", "Budget and Actual Cost by Order Type"],
    ["预算", "Budget"],
    ["实际", "Actual Cost"],
    ["计划", "Planned Cost"],
    ["区域", "Area"],
    ["工单类型", "Order Type"],
    ["设备名称", "Equipment Name"],
    ["全选", "Select all"],
    ["清除", "Clear"],
    ["多选", "Multiple selections"],
    ["高于预算", "Over Budget"],
    ["低于预算", "Under Budget"],
    ["数据期间", "Reporting Period"],
    ["预算与实际成本", "Budget and Actual Cost"],
    ["年份", "Year"],
    ["月份", "Month"],
    ["全部成本要素", "All Cost Elements"],
    ["全部订单类型", "All Order Types"],
    ["成本要素", "Cost Element"],
    ["工单类型", "Order Type"],
    ["CNY", "CNY"],
    ["年度预算与实际成本", "Annual Budget and Actual Cost"],
    ["工单类型构成", "Work-Order Type"],
    ["月度实际成本趋势", "Monthly Actual Cost Trend"],
    ["成本要素", "Cost Element"],
    ["区域成本分析", "Cost by Area"],
    ["按区域和成本中心查看维护支出，点击图表进行联动筛选。", "View maintenance costs by area and cost center. Select a chart to cross-filter."],
    ["实际成本 by Scope", "Actual Cost by Scope"],
    ["成本中心排名", "Cost Center Ranking"],
    ["区域成本汇总", "Cost Summary by Area"],
    ["按区域、成本中心和工单类型汇总", "Summary by area, cost center and work-order type"],
    ["本地 Work Order Cost 源表记录及成本分类。", "Local Work Order Cost source rows and cost categories."],
    ["搜索工单、描述或设备", "Search order, description or equipment"],
    ["成本要素分布", "Cost Element Distribution"],
    ["月度工单成本", "Monthly Work-Order Cost"],
    ["维护工单明细", "Maintenance Work-Order Details"],
    ["财年", "Fiscal Year"],
    ["月份", "Month"],
    ["工单", "Work Order"],
    ["订单类型", "Order Type"],
    ["描述", "Description"],
    ["设备", "Equipment"],
    ["设备名称", "Equipment Name"],
    ["区域", "Area"],
    ["成本要素", "Cost Element"],
    ["实际成本", "Actual Cost"],
    ["合同概览", "Contract Overview"],
    ["合同及年度金额来自 Relationship.XLSX 的合同工作表。", "Contracts and annual amounts come from the contract sheet in Relationship.XLSX."],
    ["合同数量", "Contracts"],
    ["已过期", "Expired"],
    ["即将到期", "Expiring Soon"],
    ["有效合同", "Active Contracts"],
    ["合同清单", "Contract Register"],
    ["搜索合同编号或名称", "Search contract number or name"],
    ["项目预算", "Project Budget"],
    ["项目实际", "Project Actual"],
    ["承诺金额", "Committed Amount"],
    ["可用余额", "Available Balance"],
    ["项目清单", "Project List"],
    ["采购订单", "Purchase Orders"],
    ["采购订单金额", "Purchase Order Value"],
    ["未交付金额", "Open Delivery Value"],
    ["采购申请", "Purchase Requisitions"],
    ["采购订单币种分布", "Purchase Order Value by Currency"],
    ["采购申请状态", "Purchase Requisition Status"],
    ["采购订单明细", "Purchase Order Details"],
    ["未结采购订单", "Open Purchase Orders"],
    ["故障记录", "Breakdown Records"],
    ["设备数", "Equipment Count"],
    ["记录停机时长", "Recorded Downtime"],
    ["故障工单", "Breakdown Work Orders"],
    ["月度停机时间", "Monthly Downtime"],
    ["故障记录按设备统计", "Breakdown Records by Equipment"],
    ["工单总数", "Total Work Orders"],
    ["按时完成率", "On-Time Completion Rate"],
    ["逾期工单", "Overdue Work Orders"],
    ["关键工单", "Critical Work Orders"],
    ["通知数", "Notifications"],
    ["未来工作量", "Future Workload"],
    ["预防工单完成率", "Preventive Work-Order Completion Rate"],
    ["关键工单完成率", "Critical Work-Order Completion Rate"],
    ["能源使用", "Energy Use"],
    ["蒸汽", "Steam"],
    ["电力", "Power"],
    ["天然气", "Natural Gas"],
    ["生产量", "Production Volume"],
    ["全部财年", "All Years"],
    ["全部月份", "All Months"],
    ["全部区域", "All Areas"],
    ["全部工单类型", "All Work-Order Types"],
    ["全部设备", "All Equipment"],
    ["选择筛选项或点击图表可联动其他视觉对象", "Choose a filter or select a chart to cross-filter visuals"],
    ["重置筛选", "Reset Filters"],
    ["↺ 重置筛选", "↺ Reset Filters"],
    ["离线报表", "Offline Report"],
    ["本地数据快照", "Local Data Snapshot"],
    ["无需登录 · 无服务端请求", "No login · No server requests"],
    ["本地数据源 · 无需登录", "Local data · No login required"],
    ["未映射", "Unmapped"],
    ["设备未匹配", "Unmatched Equipment"],
    ["当前筛选条件下没有数据", "No data for the current filters"],
    ["没有匹配的合同", "No matching contracts"],
    ["结束日期早于今天", "End date is in the past"],
    ["未来 90 天内结束", "Ends within 90 days"],
    ["结束日期在未来", "End date is in the future"],
    ["源文件记录行数", "Source rows"],
    ["按设备编号去重", "Distinct equipment"],
    ["按 Order(IO) 去重", "Distinct Order(IO)"],
    ["工单实际发生额", "Actual work-order cost"],
    ["所选期间预算", "Budget for selected period"],
    ["预算 − 实际", "Budget − Actual"],
    ["数据期间", "Reporting Period"],
    ["成本概览", "Cost Overview"],
    ["合同编号", "Contract Number"],
    ["合同名称", "Contract Name"],
    ["开始日期", "Start Date"],
    ["结束日期", "End Date"],
    ["状态", "Status"],
    ["成本中心", "Cost Center"],
    ["设备编号", "Equipment Number"],
    ["设备描述", "Equipment Description"],
    ["功能位置", "Functional Location"],
    ["工单数", "Work Orders"],
    ["项目编号", "Project Number"],
    ["项目描述", "Project Description"],
    ["2026 预算", "2026 Budget"],
    ["2026 实际", "2026 Actual"],
    ["2026 承诺", "2026 Committed"],
    ["2026 可用", "2026 Available"],
    ["总预算", "Total Budget"],
    ["累计实际", "Cumulative Actual"],
    ["可用余额", "Available Balance"],
    ["工厂", "Plant"],
    ["工厂名称", "Plant Name"],
    ["逾期完成", "Completed Late"],
    ["逾期未完成", "Overdue"],
    ["PM 总数", "Total PM"],
    ["按时完成率", "On-Time Rate"],
    ["财年", "Fiscal Year"],
    ["订单组数", "Order Groups"],
    ["Scope", "Scope"],
    ["状态", "Status"],
    ["月度工单进度明细", "Monthly Work-Order Progress"],
    ["维护成本明细", "Maintenance Cost Details"],
    ["设备成本清单", "Equipment Cost Register"],
    ["设备维护成本排名", "Equipment Maintenance Cost Ranking"],
    ["设备成本按区域", "Equipment Cost by Area"],
    ["能源消耗趋势", "Energy Consumption Trend"],
    ["单位生产量能源强度", "Energy Intensity per Production Unit"],
    ["能源费用", "Energy Cost"],
    ["生产量构成", "Production Volume by Area"],
    ["设备故障分析", "Equipment Breakdown Analysis"],
    ["每日维护工单概览", "Daily Maintenance Work Order Overview"],
    ["按日期和状态显示工单数量与完成率", "Value and Completed Rate by Day and State"],
    ["数据来源：工单计划汇总表", "Source: WO Schedule Summary sheet"],
    ["汇总", "Summary"],
    ["工单状态", "State"],
    ["日期", "Day"],
    ["完成率", "Completed Rate"],
    ["已完成", "Done"],
    ["未开始", "Not started"],
    ["进行中", "Ongoing"],
    ["未计划", "Unplanned"],
    ["总计", "Total"],
    ["完成率（百分比）", "Completed Rate (%)"],
    ["工单明细报表", "Work Order Detail Report"],
    ["所有工单未完成数及按时完成率", "Total number of ALL Work Orders not complete & % completed on time"],
    ["关键工单未完成数及按时完成率", "Total number of CRITICAL Work Orders not complete & % completed on time"],
    ["预防工单未完成数及按时完成率", "Total number of PREVENTIVE Work Orders not complete & % completed on time"],
    ["按月查看", "by Month"],
    ["积压（全部）、逾期完成（全部）、按时完成（全部）及按时完成率（全部），按月", "Backlog (All), Compl. late (All), Compl. on time (All) and % On time (All) by Month"],
    ["积压（关键）、逾期完成（关键）、按时完成（关键）及按时完成率（关键），按月", "Backlog (Crit), Compl. late (Crit), Compl. on time (Crit) and % On time (Crit) by Month"],
    ["积压（预防）、逾期完成（预防）、按时完成（预防）及按时完成率（预防），按月", "Backlog (Prev), Compl. late (Prev), Compl. on time (Prev) and % On time (Prev) by Month"],
    ["全部工单", "All"],
    ["关键工单", "Critical"],
    ["预防工单", "Preventive"],
    ["积压（全部）", "Backlog (All)"],
    ["逾期完成（全部）", "Compl. late (All)"],
    ["按时完成（全部）", "Compl. on time (All)"],
    ["按时完成率（全部）", "% On time (All)"],
    ["积压（关键）", "Backlog (Crit)"],
    ["逾期完成（关键）", "Compl. late (Crit)"],
    ["按时完成（关键）", "Compl. on time (Crit)"],
    ["按时完成率（关键）", "% On time (Crit)"],
    ["积压（预防）", "Backlog (Prev)"],
    ["逾期完成（预防）", "Compl. late (Prev)"],
    ["按时完成（预防）", "Compl. on time (Prev)"],
    ["按时完成率（预防）", "% On time (Prev)"],
    ["月度工单按时与逾期", "Monthly On-Time and Late Work Orders"],
    ["工厂按时完成率", "On-Time Completion by Plant"],
    ["工厂月度工单状态", "Monthly Work-Order Status by Plant"],
    ["每月工单按时完成率", "Monthly Work-Order On-Time Rate"],
    ["预防工单趋势", "Preventive Work-Order Trend"],
    ["各工厂工单量", "Work-Order Volume by Plant"],
    ["按区域划分的实际成本", "Actual Cost by Area"],
    ["按成本中心划分的实际成本", "Actual Cost by Cost Center"],
    ["按成本要素划分的实际成本", "Actual Cost by Cost Element"],
    ["按工单类型划分的实际成本", "Actual Cost by Work-Order Type"],
    ["生产量 by area", "Production Volume by Area"],
    ["按月记录的停机时长", "Recorded Downtime by Month"],
    ["每月维护成本", "Monthly Maintenance Cost"],
    ["生产量与单位生产量维护成本", "Production Volume and Maintenance Cost per Production Unit"],
    ["实际成本 / kg", "Actual Cost / kg"],
    ["总成本中心", "Cost Centers"],
    ["查询无匹配记录", "No matching records"],
    ["维护、投资、可靠性与能源运营总览", "Maintenance, investment, reliability and energy overview"],
    ["打开菜单", "Open menu"],
    ["关闭菜单", "Close menu"],
    ["返回", "Back"],
    ["返回当前报表", "Back to current report"],
    ["工程部运营中心", "Engineering Department Operations Center"],
    ["工程", "Engineering"],
    ["运营中心", "Operations Center"],
    ["工程部运营", "ENGINEERING DEPARTMENT OPERATIONS"],
    ["区域明细报告", "Area Detail Report"],
    ["小额支出与改善", "Small Spending & Improvement"],
    ["合同跟进", "Contract Follow Up"],
    ["区域预算与实际成本", "Budget and Actual Cost by Area"],
    ["成本要素预算与实际成本", "Budget and Actual Cost by Cost Element"],
    ["工单类型预算与实际成本", "Budget and Actual Cost by Order Type"],
    ["设备实际成本排名", "Top Performing Equipments"],
    ["按月度实际成本排序", "Actual Cost by Month"],
    ["小额支出实际成本", "Actual Cost - Small Spending"],
    ["改善实际成本", "Actual Cost - Improvement"],
    ["按区域统计", "Actual Cost by Area"],
    ["按成本要素统计", "Actual Cost by Cost Element"],
    ["查看设备信息", "View equipment details"],
    ["查看未交付采购订单明细", "View UnGR details"],
    ["查看小额支出明细", "View small spending details"],
    ["查看改善明细", "View improvement details"],
    ["订单", "Order"],
    ["序号", "Sl no"],
    ["期间日期", "Period Date"],
    ["前", "Top"],
    ["短文本", "Short Text"],
    ["未交付金额", "UnGR Value"],
    ["单据日期", "Document Date"],
    ["申请人", "Requisitioner"],
    ["设备名称", "Equipment"],
    ["实际成本", "Actual Cost"],
    ["月度实际成本", "Actual Cost by Month"],
    ["区域", "Area"],
    ["财年", "Fiscal Year"],
    ["设备描述", "Equipment Description"],
    ["功能位置", "Functional Location"],
    ["工单数", "Work Orders"],
    ["合同实际成本", "Contract Cost"],
    ["按月统计", "Actual Cost by Month"],
    ["合同明细", "Contract Detail"],
    ["剩余天数", "Remaining Days"],
    ["小额支出明细", "Small Spending Detail"],
    ["改善明细", "Improvement Detail"],
    ["明细数据来自筛选后的工单实际成本。", "Details from filtered actual work-order costs."],
    ["返回图表", "Back to charts"],
    ["内部人工", "Internal Labor"],
    ["外部服务", "External Service"],
    ["内部材料", "Internal Material"],
    ["外部材料", "External Material"],
    ["场地占用", "Site occupied"],
    ["其他", "Others"],
    ["未映射", "Unmapped"],
    ["预防性维护", "PM"],
    ["纠正性维护", "CM"],
    ["菜单", "Menu"],
    ["筛选器", "Slicers"],
    ["报表页面", "Report Pages"],
    ["选择模块查看数据与明细", "Select a report page"],
    ["最多显示前 300 条当前筛选记录", "Filtered records"],
    ["合同清单记录", "Contract records"],
    ["按当前筛选汇总", "Current filter total"],
    ["去重订单编号", "Distinct work orders"],
    ["项目预算、实际、承诺及可用余额来自 CJ74 与 CJE0 工作簿。", "Project budget, actual, commitments and available balance from CJ74 and CJE0."],
    ["CJE0 项目总预算", "CJE0 total project budget"],
    ["CJE0 项目累计实际", "CJE0 cumulative project actual"],
    ["CJE0 未结承诺", "CJE0 open commitments"],
    ["项目组合可用金额", "Portfolio available balance"],
    ["项目预算与执行", "Project Budget and Execution"],
    ["项目实际成本要素", "Project Actual by Cost Element"],
    ["采购订单、未交付/未开票金额及采购申请。", "Purchase orders, open delivery/invoice and requisitions."],
    ["按源货币列示，不跨币种合并", "Source currencies shown separately"],
    ["源采购订单未交付金额", "Source open delivery amount"],
    ["故障工单和停机时间来自 Breakdown/Breakdown.xlsx。", "Breakdown orders and downtime from Breakdown.xlsx."],
    ["生产记录停机时间字段", "Recorded production downtime"],
    ["各类型工单业务中断停机时间（MTH）与年累计停机时间", "Downtime Hrs All WO Types With business interruption MTH and Downtime YTD"],
    ["各类型工单业务中断停机时间", "Downtime Hrs All WO Types With business interruption"],
    ["按月份", "by Month"],
    ["按设备", "by Equipment"],
    ["月度停机时间（小时）", "Monthly downtime (h)"],
    ["年累计停机时间（小时）", "Downtime YTD (h)"],
    ["停机时间（小时）", "Downtime (h)"],
    ["月度停机时间 ≤ 14 小时", "Monthly downtime ≤ 14 h"],
    ["月度停机时间 > 14 小时", "Monthly downtime > 14 h"],
    ["停机时间阈值 = 14 小时", "Downtime threshold = 14 h"],
    ["故障记录清单", "Breakdown Register"],
    ["每月计划工单、按时完成、逾期和关键工单情况来自 2026 WO.xlsx。", "Monthly planned, on-time, overdue and critical work orders from 2026 WO.xlsx."],
    ["汇总筛选后的工厂和月份", "Filtered plants and months"],
    ["源表 Over Due 字段", "Source Over Due field"],
    ["源表 Critical WOs 字段", "Source Critical WOs field"],
    ["当前 WO 工作簿按“工厂 × 月”汇总，没有逐日明细；本页按原 Daily WO 页面主题展示源表可支持的月度工单状态。", "The WO workbook is summarized by plant and month, with no daily records; this page shows monthly status at the available source grain."],
    ["已释放和未释放通知", "Released and unreleased notifications"],
    ["源表 Futur Workload", "Source Futur Workload field"],
    ["预防与关键工单趋势", "Preventive and Critical Work-Order Trend"],
    ["筛选期间汇总", "Selected period total"],
    ["低于预算", "Under Budget"],
    ["高于预算", "Over Budget"],
    ["整体预算基数", "Overall budget basis"],
    ["成本中心名称", "Cost Center Name"],
    ["实际成本 by Scope", "Actual Cost by Scope"],
    ["区域成本汇总", "Area Cost Summary"],
    ["合同状态", "Contract Status"],
    ["未注明", "Not specified"],
    ["计划金额", "Planned Amount"],
    ["合同成本", "Contract Cost"],
    ["剩余天数", "Days Remaining"],
    ["采购描述", "Purchase Description"],
    ["供应商", "Vendor"],
    ["订单日期", "Order Date"],
    ["币种", "Currency"],
    ["订单金额", "Order Value"],
    ["未交付金额", "Open Delivery Value"],
    ["未开票金额", "Open Invoice Value"],
    ["记录停机时间", "Recorded Downtime"],
    ["停机小时 (MTH)", "Downtime Hours (MTH)"],
    ["工单总数", "Total Work Orders"],
    ["按时完成", "Completed On Time"],
    ["PM 总数", "Total PM"],
    ["关键工单", "Critical Work Orders"],
    ["预防工单按时完成", "Preventive WOs On Time"],
    ["预防工单逾期完成", "Preventive WOs Completed Late"],
    ["能源消耗、生产量及单位产量能耗", "Energy consumption, production volume and energy intensity"],
    ["年度预算与实际成本", "Annual Budget and Actual Cost"],
    ["合同清单", "Contract Register"],
    ["合同概览", "Contract Overview"],
    ["维护合同总览", "Maintenance Contract Overview"],
    ["能源总览", "Energy Overview"],
    ["维护工单明细", "Maintenance Work-Order Details"],
    ["CNY", "CNY"],
    ["设备", "Equipment"],
    ["区域", "Area"]
  ];
  const translations = {
    zh: new Map(translationPairs.map(([zh, en]) => [en, zh])),
    en: new Map(translationPairs)
  };
  const originalTextNodes = new WeakMap();
  const originalAttributes = new WeakMap();
  const state = {
    view: "home",
    expandedHomeGroup: null,
    language: "zh",
    currency: "CNY",
    year: ["2026"],
    yearFilterTouched: false,
    capexYear: ["2026"],
    capexPlanYear: "2026",
    month: [],
    scope: [],
    costType: [],
    costElement: [],
    orderType: [],
    equipment: [],
    selection: null,
    contractQuery: "",
    workOrderQuery: "",
    spendingDetail: null,
    capexPrDetail: false
  };
  const viewYearFilters = new Map();
  const views = {
    home: {
      title: "工程部运营中心",
      breadcrumb: "首页",
      description: "维护、投资、可靠性与能源运营总览"
    },
    overview: {
      title: "Maintenance Cost Overview",
      breadcrumb: "Overview",
      description: "维护成本、预算执行和工单构成"
    },
    area: {
      title: "Area Detail Report",
      breadcrumb: "Area",
      description: ""
    },
    details: {
      title: "Small Spending & Improvement",
      breadcrumb: "Others",
      description: ""
    },
    contracts: {
      title: "Contract Follow Up",
      breadcrumb: "Contract",
      description: ""
    },
    capex: {
      title: "CAPEX Overview",
      breadcrumb: "CAPEX 总览",
      description: "CAPEX 预算与执行"
    },
    capexPlan: {
      title: "CAPEX项目计划",
      breadcrumb: "CAPEX GR计划",
      description: "CAPEX计划与采购执行"
    },
    breakdown: {
      title: "Equipment Breakdown",
      breadcrumb: "Breakdown",
      description: "设备故障记录与停机时间"
    },
    workOrder: {
      title: "Work Order Detail Report",
      breadcrumb: "Work Order",
      description: ""
    },
    dailyWO: {
      title: "Daily Maintenance Work Order Overview",
      breadcrumb: "Daily WO",
      description: ""
    },
    energy: {
      title: "Energy Overview",
      breadcrumb: "Energy",
      description: "能源消耗、生产量及单位产量能耗"
    }
  };
  const homeGroups = [
    {
      id: "cost",
      title: "成本概览",
      subtitle: "Cost Overview",
      icon: "▣",
      items: [
        ["overview", "维护成本总览", "Overview"],
        ["area", "区域维护成本", "Area"],
        ["details", "维护成本明细", "Others"],
        ["contracts", "维护合同", "Contract"]
      ]
    },
    {
      id: "maintenance",
      title: "维护看板",
      subtitle: "Maintenance Dashboard",
      icon: "⚒",
      items: [
        ["breakdown", "设备故障分析", "Breakdown"],
        ["workOrder", "工单执行", "Work Order"],
        ["dailyWO", "每日工单", "Daily WO"]
      ]
    },
    {
      id: "capex",
      title: "CAPEX绩效",
      subtitle: "CAPEX Performance",
      icon: "▤",
      items: [
        ["capex", "CAPEX 总览", "CAPEX Overview"],
        ["capexPlan", "CAPEX项目计划", "CAPEX GR Plan"]
      ]
    },
    {
      id: "energy",
      title: "能源看板",
      subtitle: "Energy Dashboard",
      icon: "⚛",
      items: [
        ["energy", "能源使用", "Energy"]
      ]
    }
  ];
  const svgNS = "http://www.w3.org/2000/svg";

  function element(tag, attributes = {}, text) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      node.setAttribute(key, value);
    }
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function svgElement(tag, attributes = {}, text) {
    const node = document.createElementNS(svgNS, tag);
    for (const [key, value] of Object.entries(attributes)) {
      node.setAttribute(key, value);
    }
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function appendDataLabel(svg, attributes, value, text) {
    const label = svgElement("text", attributes, text);
    if (state.view === "overview" || state.view === "area") {
      const numericValue = Number(value);
      label.style.fill = numericValue > 0
        ? "#24945a"
        : numericValue < 0
          ? "#df4658"
          : "#46506a";
    }
    svg.append(label);
    return label;
  }

  function applyLanguage() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (node.parentElement.closest('[data-portal], [data-zh], #exp-scene-desc, #exp-scene-visual')) {
        node = walker.nextNode();
        continue;
      }
      if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
      const original = originalTextNodes.get(node);
      const match = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const translated = translateText(match[2]);
      node.nodeValue = translated === undefined
        ? original
        : `${match[1]}${translated}${match[3]}`;
      node = walker.nextNode();
    }

    document.querySelectorAll("[aria-label], [placeholder], [title]").forEach(elementNode => {
      if (elementNode.closest('[data-portal]')) return;
      if (!originalAttributes.has(elementNode)) {
        originalAttributes.set(elementNode, {
          ariaLabel: elementNode.getAttribute("aria-label"),
          placeholder: elementNode.getAttribute("placeholder"),
          title: elementNode.getAttribute("title")
        });
      }
      const original = originalAttributes.get(elementNode);
      for (const [attribute, value] of [
        ["aria-label", original.ariaLabel],
        ["placeholder", original.placeholder],
        ["title", original.title]
      ]) {
        if (value === null) continue;
        elementNode.setAttribute(
          attribute,
          translateText(value)
        );
      }

    });

    document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
    const langLabel = state.language === "zh" ? "English" : "中文";
    const langAria = state.language === "zh" ? "Switch to English" : "Switch to Chinese";
    for (const btnId of ["language-toggle", "home-language-toggle"]) {
      const btn = document.getElementById(btnId);
      if (!btn) continue;
      btn.textContent = langLabel;
      btn.setAttribute("aria-label", langAria);
    }
  }

  function translateText(value) {
    const translated = translations[state.language].get(value);
    if (translated !== undefined) return translated;
    if (state.language === "en") {
      const period = value.match(/^(.+?) · 截至 (.+)$/);
      if (period) return `${period[1]} · through ${period[2]}`;
      const month = value.match(/^(.+?) · (\d+) 月$/);
      if (month) return `${month[1]} · Month ${month[2]}`;
      const count = value.match(/^([\d,.]+) 个成本中心$/);
      if (count) return `${count[1]} cost centers`;
      const rows = value.match(/^([\d,.]+) 条$/);
      if (rows) return `${rows[1]} rows`;
      const selection = value.match(/^(.+?)：(.+) ×$/);
      if (selection) return `${translations.en.get(selection[1]) || selection[1]}: ${selection[2]} ×`;
    } else {
      const period = value.match(/^(.+?) · through (.+)$/);
      if (period) return `${period[1]} · 截至 ${period[2]}`;
      const month = value.match(/^(.+?) · Month (\d+)$/);
      if (month) return `${month[1]} · ${month[2]} 月`;
      const count = value.match(/^([\d,.]+) cost centers$/);
      if (count) return `${count[1]} 个成本中心`;
      const rows = value.match(/^([\d,.]+) rows$/);
      if (rows) return `${rows[1]} 条`;
      const selection = value.match(/^(.+?): (.+) ×$/);
      if (selection) return `${translations.zh.get(selection[1]) || selection[1]}：${selection[2]} ×`;
    }
    if (state.language === "en" && /[\p{Script=Han}\u3000-\u303f\uff00-\uffef]/u.test(value)) {
      const englishText = value
        .replace(/[\p{Script=Han}\u3000-\u303f\uff00-\uffef]+/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
      return englishText || value;
    }
    return value;
  }

  function setMobileMenu(open) {
    document.body.classList.toggle("menu-open", open);
    document.getElementById("menu-toggle").setAttribute("aria-expanded", String(open));
    document.getElementById("menu-toggle").setAttribute(
      "aria-label",
      state.language === "zh"
        ? open ? "关闭菜单" : "打开菜单"
        : open ? "Close menu" : "Open menu"
    );
  }

  function showDetailTable(title, headers, rows, total) {
    const dialog = document.getElementById("detail-dialog");
    const content = document.getElementById("detail-dialog-content");
    document.getElementById("detail-dialog-title").textContent = title;
    content.replaceChildren();
    if (!rows.length) {
      content.append(element("p", { class: "empty-state" }, "当前筛选条件下没有数据"));
    } else {
      const table = makeTable(headers, rows);
      if (total) {
        const footer = element("tfoot");
        const row = element("tr");
        row.append(
          element("th", { colspan: String(Math.max(1, headers.length - 1)) }, total.label),
          element("th", { class: "numeric" }, total.render(total.value))
        );
        footer.append(row);
        table.append(footer);
      }
      content.append(table);
    }
    if (!dialog.open) dialog.showModal();
    applyLanguage();
  }

  function showUngrdetails() {
    const orders = data.ungrOrders
      .slice()
      .sort((a, b) =>
        String(b.date).localeCompare(String(a.date))
      );
    showDetailTable("未交付采购订单", [
      { key: "purchaseOrder", label: "采购订单" },
      { key: "description", label: "短文本" },
      {
        key: "openDeliveryValue",
        label: "待交付金额",
        numeric: true,

        sortValue: row =>
          convertCurrency(
            row.openDeliveryValue,
            row.currency || "CNY",
            "CNY"
          ),

        render: (value, row) =>
          fullMoney(
            convertCurrency(
              value,
              row.currency || "CNY",
              "CNY"
            )
          )
      },
      { key: "date", label: "单据日期" },
      { key: "requisitioner", label: "申请人" }
    ], orders, {
      label: "合计",
      value: sum(orders, "openDeliveryValue"),
      render: fullMoney
    });
  }

  function showEquipmentDetails() {
    const rows = getEquipmentCostRows();
    showDetailTable("设备信息", [
      { key: "description", label: "设备名称" },
      { key: "actual", label: "实际成本", numeric: true, render: fullMoney },
      { key: "area", label: "区域" },
      { key: "functionalLocation", label: "功能位置" },
      { key: "costCenter", label: "成本中心" },
      { key: "orderCount", label: "工单数", numeric: true }
    ], rows);
  }

  function sum(rows, field) {
    return rows.reduce((total, row) => total + (Number(row[field]) || 0), 0);
  }

  function convertCurrency(value, sourceCurrency = data.currency || "CNY", targetCurrency = state.currency) {
    const rates = data.capex.plan.exchangeRates;
    const sourceRate = Number(rates[sourceCurrency]);
    const targetRate = Number(rates[targetCurrency]);
    if (!Number.isFinite(sourceRate) || sourceRate <= 0 ||
        !Number.isFinite(targetRate) || targetRate <= 0) {
      throw new Error(`Missing exchange rate for ${sourceCurrency} to ${targetCurrency}.`);
    }
    return (Number(value) || 0) / sourceRate * targetRate;
  }

  function currencyPrefix() {
    return state.currency === "CNY" ? "¥" : `${state.currency} `;
  }

  function compactMoney(value) {
    const amount = convertCurrency(value);
    const absolute = Math.abs(amount);
    if (absolute === 0) return `${currencyPrefix()}0K`;
    const digits = absolute < 10000 ? 1 : 0;
    const formatted = new Intl.NumberFormat(
      state.language === "zh" ? "zh-CN" : "en-US",
      { minimumFractionDigits: digits, maximumFractionDigits: digits }
    ).format(amount / 1000);
    return `${currencyPrefix()}${formatted}K`;
  }

  function axisMillionsMoney(value) {
    const formatted = new Intl.NumberFormat(
      state.language === "zh" ? "zh-CN" : "en-US",
      { maximumFractionDigits: 1 }
    ).format(convertCurrency(value) / 1_000_000);
    return `${currencyPrefix()}${formatted}M`;
  }

  function capexChartMoney(value) {
    return `${(convertCurrency(value) / 1_000_000).toFixed(2)}M`;
  }

  function capexOverviewMoney(value) {
    const amount = convertCurrency(value);
    return Math.abs(amount) >= 1_000_000
      ? `${currencyPrefix()}${(amount / 1_000_000).toFixed(2)}M`
      : `${currencyPrefix()}${Math.round(amount / 1000)}K`;
  }

  function capexOverviewAxisMoney(value) {
    return `${currencyPrefix()}${(convertCurrency(value) / 1_000_000).toFixed(1)}M`;
  }

  function capexOverviewPercentage(value) {
    return `${(Number(value) || 0).toFixed(2)}%`;
  }

  function kpiMoney(value) {
    return `${currencyPrefix()}${numberFormat.format(Math.round(convertCurrency(value) / 1000))}K`;
  }

  function fullMoney(value) {
    return `${currencyPrefix()}${preciseNumberFormat.format(convertCurrency(value))}`;
  }

  function fullSourceCurrency(value, currency) {
    const formatted = preciseNumberFormat.format(convertCurrency(value, currency || "CNY"));
    return `${currencyPrefix()}${formatted}`;
  }

  function compactSourceCurrency(value, currency) {
    const amount = convertCurrency(value, currency || "CNY");
    const absolute = Math.abs(amount);
    const compact = absolute === 0
      ? "0K"
      : `${(amount / 1000).toFixed(absolute < 10000 ? 1 : 0)}K`;
    return `${currencyPrefix()}${compact}`;
  }

  function percentage(value) {
    return `${(Number(value) || 0).toFixed(1)}%`;
  }

  const mappedCostElements=new Set(['Internal Labor','External Service','Internal Material','External Material']);
  function isMappedLabel(value) {
    const s=String(value??'').trim();
    return !!s&&!/^(unmapped|unknown|undefined|null|nan|unassigned|not mapped|not specified|source text|\(blank\)|未映射|未分配|未匹配|设备未匹配|未指定|未知|空白)$/i.test(s);
  }

  function sortedUnique(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) =>
      String(a).localeCompare(String(b), "zh-CN", { numeric: true })
    );
  }

  function populateSelect(select, values, allLabel) {
    select.multiple = true;
    select.replaceChildren(new Option(allLabel, "all"));
    for (const value of values) {
      if (!isMappedLabel(typeof value==='object'?value.value:value)) continue;
      if (select.id==='cost-element-filter'&&!mappedCostElements.has(typeof value==='object'?value.value:value)) continue;
      if (typeof value === "string") {
        select.add(new Option(value, value));
      } else {
        select.add(new Option(value.label, value.value));
      }
    }
  }

  function mountMultiPicker(select, field) {
    const picker = element("div", { class: "multi-picker", "data-filter": field });
    const trigger = element("button", {
      class: "multi-picker-trigger",
      type: "button",
      "aria-expanded": "false"
    });
    const menu = element("div", { class: "multi-picker-menu", hidden: true });
    const optionList = element("div", { class: "multi-picker-options" });
    const selectAll = element("label", { class: "multi-picker-option multi-picker-all" });
    const allCheckbox = element("input", { type: "checkbox", value: "all" });
    selectAll.append(allCheckbox, element("span", {}, "全选"));
    optionList.append(selectAll);
    for (const option of [...select.options].slice(1)) {
      const optionLabel = element("label", { class: "multi-picker-option" });
      const checkbox = element("input", { type: "checkbox", value: option.value });
      optionLabel.append(checkbox, element("span", {}, option.textContent));
      optionList.append(optionLabel);
    }
    menu.append(optionList);
    picker.append(trigger, menu);
    select.hidden = true;
    select.after(picker);

    trigger.addEventListener("click", () => {
      const open = menu.hidden;
      document.querySelectorAll(".multi-picker-menu").forEach(item => { item.hidden = true; });
      document.querySelectorAll(".multi-picker-trigger").forEach(item => item.setAttribute("aria-expanded", "false"));
      menu.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
    });
    optionList.addEventListener("change", event => {
      const checkbox = event.target;
      if (!(checkbox instanceof HTMLInputElement)) return;
      if (checkbox.value === "all" && checkbox.checked) {
        state[field] = [];
      } else {
        state[field] = [...optionList.querySelectorAll('input[type="checkbox"]:checked')]
          .map(input => input.value)
          .filter(value => value !== "all");
      }
      if (checkbox.value === "all" && !checkbox.checked && state[field].length === 0) {
        state[field] = [];
      }
      if (field === "year") state.yearFilterTouched = true;
      state.selection = null;
      render();
    });
    syncMultiPicker(field);
  }

  function syncMultiPicker(field) {
    const picker = document.querySelector(`.multi-picker[data-filter="${field}"]`);
    if (!picker) return;
    const select = picker.parentElement.querySelector("select");
    const selected = state[field];
    const checkboxes = picker.querySelectorAll('input[type="checkbox"]');
    const allCheckbox = picker.querySelector('input[value="all"]');
    allCheckbox.checked = selected.length === 0;
    for (const checkbox of checkboxes) {
      if (checkbox.value !== "all") checkbox.checked = selected.includes(checkbox.value);
    }
    const names = selected.map(value =>
      select.options.namedItem(value)?.textContent ||
      [...select.options].find(option => option.value === value)?.textContent ||
      value
    );
    const caption = selected.length === 0
      ? select.options[0]?.textContent || "All"
      : selected.length === 1 ? names[0] : `${names.length} ${state.language === "zh" ? "项已选" : "selected"}`;
    picker.querySelector(".multi-picker-trigger").textContent = caption;
    picker.querySelectorAll(".multi-picker-option span").forEach(span => {
      if (span.closest(".multi-picker-all")) span.textContent = translateText("全选");
    });
  }

  function refreshMonthLabels() {
    const select = document.getElementById("month-filter");
    if (!select) return;
    const formatter = new Intl.DateTimeFormat(state.language === "zh" ? "zh-CN" : "en", {
      month: state.language === "zh" ? "long" : "short"
    });
    for (const option of [...select.options].slice(1)) {
      option.textContent = formatter.format(new Date(2026, Number(option.value) - 1, 1));
    }
    const picker = document.querySelector('.multi-picker[data-filter="month"]');
    picker?.querySelectorAll('.multi-picker-option input:not([value="all"])').forEach(input => {
      const option = [...select.options].find(item => item.value === input.value);
      if (option) input.nextElementSibling.textContent = option.textContent;
    });
    syncMultiPicker("month");
  }

  function refreshScopeLabels() {
    const select = document.getElementById("scope-filter");
    const picker = document.querySelector('.multi-picker[data-filter="scope"]');
    if (!select || !picker) return;
    for (const option of [...select.options].slice(1)) {
      option.textContent = translateText(option.value);
    }
    picker.querySelectorAll('.multi-picker-option input:not([value="all"])').forEach(input => {
      const option = [...select.options].find(item => item.value === input.value);
      if (option) input.nextElementSibling.textContent = option.textContent;
    });
    syncMultiPicker("scope");
  }

  function matchesSelection(selection, value) {
    return selection.length === 0 || selection.includes(String(value));
  }

  function getEquipmentName(equipmentId) {
    const equipment = data.equipment.find(row => row.equipment === equipmentId);
    if (equipment?.description) return equipment.description;
    const breakdown = data.breakdowns.find(row => row.equipment === equipmentId);
    return breakdown?.equipmentName || "设备未匹配";
  }

  function passesFilters(row, excludedSelectionField, ignoreMonth = false, ignoreYear = false) {
    if (!ignoreYear && !matchesSelection(state.year, row.year)) return false;
    if (!ignoreMonth && !matchesSelection(state.month, row.month)) return false;
    if (!matchesSelection(state.scope, row.scope)) return false;
    if (!matchesSelection(state.costType, row.costType)) return false;
    if (!matchesSelection(state.costElement, row.costElement)) return false;
    if (!matchesSelection(state.orderType, row.orderType)) return false;
    if (
      state.selection &&
      state.selection.field !== excludedSelectionField &&
      row[state.selection.field] !== undefined &&
      String(row[state.selection.field]) !== String(state.selection.value)
    ) {
      return false;
    }
    return true;
  }

  function filteredActual(excludedSelectionField, ignoreMonth = false, ignoreYear = false) {
    return data.actual.filter(row => passesFilters(row, excludedSelectionField, ignoreMonth, ignoreYear));
  }

  const orderTypeBudgetShares = {
    PM: 0.60,
    CM: 0.20,
    Improvement: 0.15
  };

  function selectedOrderTypeBudgetShare() {
    if (!state.orderType.length && !state.costType.length) return undefined;
    const selectedTypes = new Set(
      data.actual
        .filter(row =>
          matchesSelection(state.orderType, row.orderType) &&
          matchesSelection(state.costType, row.costType)
        )
        .map(row => row.costType)
        .filter(type => Object.prototype.hasOwnProperty.call(orderTypeBudgetShares, type))
    );
    if (selectedTypes.size !== 1) return null;
    return orderTypeBudgetShares[[...selectedTypes][0]];
  }

  function filteredBudget(excludedSelectionField, ignoreYear = false, applyOrderTypeShare = true) {
    const rows = data.budget.filter(row => {
      if (!ignoreYear && !matchesSelection(state.year, row.year)) return false;
      if (!matchesSelection(state.scope, row.scope)) return false;
      if (!matchesSelection(state.costElement, row.costElement)) return false;
      if (
        state.selection &&
        state.selection.field !== excludedSelectionField &&
        ["scope", "costCenter", "costElement"].includes(state.selection.field) &&
        String(row[state.selection.field]) !== String(state.selection.value)
      ) {
        return false;
      }
      return true;
    });
    const share = applyOrderTypeShare ? selectedOrderTypeBudgetShare() : undefined;
    if (share === null) return [];
    if (share !== undefined) {
      return rows.map(row => ({ ...row, budget: row.budget * share }));
    }
    return rows;
  }

  function budgetPeriodFactor(year) {
    if (state.month.length) return state.month.length / 12;
    const lastActualMonth = data.actual.reduce((latest, row) =>
      String(row.year) === String(year)
        ? Math.max(latest, Number(row.month) || 0)
        : latest, 0);
    return lastActualMonth ? lastActualMonth / 12 : 1;
  }

  function proratedBudgetRows(rows) {
    return rows.map(row => ({
      ...row,
      budget: row.budget * budgetPeriodFactor(row.year)
    }));
  }

  function selectedPeriodBudget(rows) {
    return sum(proratedBudgetRows(rows), "budget");
  }

  function aggregate(rows, field, valueField = "actual") {
    const grouped = new Map();
    for (const row of rows) {
      if (!isMappedLabel(row[field])) continue;
      const key = String(row[field]);
      grouped.set(key, (grouped.get(key) || 0) + (Number(row[valueField]) || 0));
    }
    return [...grouped].map(([label, value]) => ({ label, value }));
  }

  function setSelection(field, value) {
    if (state.selection?.field === field && String(state.selection.value) === String(value)) {
      state.selection = null;
    } else {
      state.selection = { field, value };
    }
    if (field === "scope") {
      state.scope = state.selection ? [String(value)] : [];
    }
    if (field === "year") {
      state.year = state.selection ? [String(value)] : [];
      state.yearFilterTouched = true;
    }
    if (field === "month") {
      state.month = state.selection ? [String(value)] : [];
    }
    if (field === "equipment") {
      state.equipment = state.selection ? [String(value)] : [];
    }
    if (field === "costType") {
      state.costType = state.selection ? [String(value)] : [];
    }
    render();
  }

  function updateSelectionChip() {
    const chip = document.getElementById("selection-chip");
    chip.replaceChildren();
    if (!state.selection) {
      chip.hidden = true;
      return;
    }
    chip.hidden = false;
    const names = {
      scope: "区域",
      costCenter: "成本中心",
      costType: "工单类型",
      costElement: "成本要素",
      orderType: "订单类型",
      equipment: "设备",
      functionalLocation: "功能位置"
    };
    const value = state.selection.field === "equipment"
      ? getEquipmentName(String(state.selection.value))
      : state.selection.value;
    chip.textContent = `${names[state.selection.field] || state.selection.field}：${value} ×`;
    chip.title = "点击清除此图表筛选";
  }

  function drawEmpty(container, message = "当前筛选条件下没有数据") {
    container.replaceChildren(element("div", { class: "empty-state" }, message));
  }

  function createSvg(container, width, height, label) {
    const svg = svgElement("svg", {
      class: "svg-chart",
      viewBox: `0 0 ${width} ${height}`,
      role: "img",
      "aria-label": translateText(label),
      preserveAspectRatio: "none"
    });
    container.replaceChildren(svg);
    return svg;
  }

  function addTooltip(node, label, value, formatter = compactMoney) {
    const text = `${translateText(label)}: ${formatter(value)}`;
    node.setAttribute("data-tooltip", text);
    node.setAttribute("aria-label", text);
  }

  function showChartTooltip(target, clientX, clientY) {
    const tooltip = document.getElementById("chart-tooltip");
    const content = target?.closest?.("[data-tooltip]")?.getAttribute("data-tooltip");
    if (!tooltip || !content) return;
    tooltip.textContent = content;
    tooltip.hidden = false;
    const margin = 12;
    const bounds = tooltip.getBoundingClientRect();
    tooltip.style.left = `${Math.max(margin, Math.min(clientX + 14, innerWidth - bounds.width - margin))}px`;
    tooltip.style.top = `${Math.max(margin, Math.min(clientY + 14, innerHeight - bounds.height - margin))}px`;
  }

  function hideChartTooltip() {
    const tooltip = document.getElementById("chart-tooltip");
    if (tooltip) tooltip.hidden = true;
  }

  function addGrid(svg, x1, y, x2) {
    svg.append(svgElement("line", {
      x1, y1: y, x2, y2: y, class: "svg-grid-line"
    }));
  }

  function addAxisTitles(svg, width, height, xLabel) {
    svg.append(svgElement("text", {
      x: 12,
      y: height / 2,
      "text-anchor": "middle",
      class: "svg-category svg-axis-title",
      transform: `rotate(-90 12 ${height / 2})`
    }, translateText("预算与实际成本")));
    svg.append(svgElement("text", {
      x: width / 2,
      y: height - 1,
      "text-anchor": "middle",
      class: "svg-category"
    }, translateText(xLabel)));
  }

  function renderBars(containerId, rows, filterField, options = {}) {
    const container = document.getElementById(containerId);
    const values = rows
      .filter(item => isMappedLabel(item.key??item.label)&&isMappedLabel(item.label)&&Number.isFinite(Number(item.value)))
      .slice();
    if (options.sort !== false) values.sort((a, b) => b.value - a.value);
    if (!values.length) return drawEmpty(container);

    const height = Math.max(container.clientHeight - 14, 180);
    const width = Math.max(container.clientWidth - 14, 280);
    const left = 70;
    const right = 12;
    const top = 26;
    const longestLabel = Math.max(...values.map(item => String(item.label).length));
    const bottom = options.showAllLabels ? Math.max(170,longestLabel*6+28) : longestLabel > 12 ? Math.min(104, Math.max(78, height * 0.32)) : 46;
    const plotHeight = height - top - bottom;
    const plotWidth = width - left - right;
    const minimum = Math.min(0, ...values.map(item => item.value));
    const maximum = Math.max(1, ...values.map(item => item.value));
    const range = maximum - minimum || 1;
    const baseline = top + plotHeight - ((0 - minimum) / range) * plotHeight;
    const svg = createSvg(container, width, height, options.label || "Column chart");
    svg.style.width = "100%";
    svg.style.height = "100%";

    for (let tick = 0; tick <= 4; tick++) {
      const value = maximum - (range * tick) / 4;
      const y = top + (plotHeight * tick) / 4;
      addGrid(svg, left, y, width - right);
      svg.append(svgElement("text", {
        x: left - 7,
        y: y + 3,
        "text-anchor": "end",
        class: "svg-value"
      }, options.formatAxis ? options.formatAxis(value) : compactMoney(value)));
    }

    const dataLabelStride = Math.max(
      1,
      Math.ceil(values.length / Math.max(1, Math.floor(plotWidth / 72)))
    );
    const labelStride = options.showAllLabels ? 1 : Math.max(1,Math.ceil(values.length / Math.max(1,Math.floor(plotWidth/62))));
    values.forEach((item, index) => {
      const center = left + (plotWidth * (index + 0.5)) / values.length;
      const barWidth = Math.max(2, Math.min(38, (plotWidth / values.length) * 0.76));
      const valueY = top + plotHeight - ((item.value - minimum) / range) * plotHeight;
      const bar = svgElement("rect", {
        x: center - barWidth / 2,
        y: Math.min(valueY, baseline),
        width: barWidth,
        height: Math.max(1, Math.abs(baseline - valueY)),
        rx: 2,
        fill: options.color || colors[index % colors.length],
        class: "svg-bar",
        tabindex: "0",
        role: filterField ? "button" : "img"
      });
      addTooltip(
        bar,
        item.label,
        item.value,
        options.formatTooltip ? value => options.formatTooltip(value, item) : compactMoney
      );
      if (filterField) {
        bar.addEventListener("click", () => setSelection(filterField, item.key ?? item.label));
        bar.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelection(filterField, item.key ?? item.label);
          }
        });
      }
      svg.append(bar);
      if ((values.length <= 12 || options.showAllValues) &&
          (index % dataLabelStride === 0 || index === values.length - 1)) {
        appendDataLabel(svg, {
          x: center,
          y: Math.max(12, valueY - 16),
          "text-anchor": "middle",
          class: "svg-value"
        }, item.value, options.formatValue ? options.formatValue(item.value, item) : compactMoney(item.value));
      }
      if (index % labelStride === 0 || index === values.length - 1) {
        const category = svgElement("text", {
          x: center,
          y: height - bottom + 11,
          "text-anchor": "end",
          class: "svg-category",
          transform: `rotate(${options.showAllLabels?-90:-45} ${center} ${height - bottom + 11})`
        }, !options.showAllLabels&&item.label.length > 28 ? `${item.label.slice(0, 25)}…` : item.label);
        category.setAttribute("data-tooltip", translateText(item.label));
        svg.append(category);
      }
    });
  }

  function renderComparison(container, rows, options) {
    const comparisonMoney = value => {
      const converted = convertCurrency(value);
      const large = Math.abs(converted) >= 1000000;
      const divisor = large ? 1000000 : 1000;
      return currencyPrefix() + new Intl.NumberFormat(state.language==='zh'?'zh-CN':'en-US', {maximumFractionDigits:large?2:1}).format(converted/divisor) + (large?'M':'K');
    };
    window.EngineeringComparison.render(container, rows.filter(row=>isMappedLabel(row.key)&&isMappedLabel(row.label)), {...options,language:state.language,formatMoney:comparisonMoney,formatExact:value=>currencyPrefix()+new Intl.NumberFormat(state.language==='zh'?'zh-CN':'en-US',{minimumFractionDigits:2,maximumFractionDigits:2}).format(convertCurrency(value)),formatAxis:axisMillionsMoney});
  }

  function renderAnnualChart() {
    const container = document.getElementById("annual-chart");
    const actualByYear = new Map(
      aggregate(filteredActual(undefined, true, true), "year").map(item => [item.label, item.value])
    );
    const budgetIsBlank = selectedOrderTypeBudgetShare() === null;
    const budgetByYear = new Map(budgetIsBlank ? [] :
      aggregate(
        proratedBudgetRows(
          filteredBudget(undefined, true).filter(row => row.costElement !== "Unmapped")
        ),
        "year",
        "budget"
      )
        .map(item => [item.label, item.value]));
    const years = data.years.map(String);
    if (!years.length) return drawEmpty(container);
    const productionByYear = new Map();
    for (const row of data.production) {
      const year = String(row.year);
      productionByYear.set(year, (productionByYear.get(year) || 0) + (Number(row.total) || 0));
    }
    const costPerKgByYear = new Map(years.map(year => {
      const productionKg = (productionByYear.get(year) || 0) * 1000;
      const costPerKg = productionKg
        ? convertCurrency(actualByYear.get(year) || 0) / productionKg
        : null;
      return [year, costPerKg];
    }));
    renderComparison(container, years.map(year => ({key:year,label:year,budget:budgetIsBlank?null:(budgetByYear.get(year)||0),actual:actualByYear.get(year)||0,extra:costPerKgByYear.get(year)})), {kind:'annual',onSelect:year=>{state.year=state.year.length===1&&state.year[0]===year?[]:[year];render();},extraLabel:state.language==='zh'?'实际成本 / kg':'Actual cost / kg',extraFormat:value=>value===null?'—':currencyPrefix()+value.toFixed(3)});
  }

  function renderBudgetActualColumns(containerId, categoryField, useOrderTypeBudget = false) {
    const container = document.getElementById(containerId);
    const actualRows = filteredActual();
    const budgetIsBlank = !useOrderTypeBudget && selectedOrderTypeBudgetShare() === null;
    const actual = new Map(
      groupedPeriod(actualRows, [categoryField], "actual")
        .map(row => [String(row[categoryField]), row.value])
    );
    const budget = new Map();
    if (useOrderTypeBudget) {
      const totalBudget = selectedPeriodBudget(
        filteredBudget(undefined, false, false).filter(row => row.costElement !== "Unmapped")
      );
      for (const [type, share] of Object.entries(orderTypeBudgetShares)) {
        budget.set(type, totalBudget * share);
      }
    } else {
      for (const row of filteredBudget().filter(item => item.costElement !== "Unmapped")) {
        const key = String(row[categoryField] || "Unmapped");
        budget.set(
          key,
          (budget.get(key) || 0) + row.budget * budgetPeriodFactor(row.year)
        );
      }
    }
    const categoryOrder = categoryField === "scope"
      ? ["LC", "Site occupied", "Others", "WH", "SD", "OC", "FC"]
      : categoryField === "costElement"
      ? ["Internal Labor", "External Service", "Internal Material", "External Material"]
      : categoryField === "costType"
        ? ["PM", "CM", "Improvement"]
        : [];
    const labels = [...new Set([...actual.keys(), ...budget.keys()])].filter(label=>isMappedLabel(label)&&(categoryField!=='costElement'||mappedCostElements.has(label))).sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a);
      const bIndex = categoryOrder.indexOf(b);
      if (aIndex >= 0 || bIndex >= 0) {
        return (aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex) -
          (bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex);
      }
      return a.localeCompare(b);
    });
    if (!labels.length) return drawEmpty(container);

    renderComparison(container, labels.map(label=>({key:label,label:translateText(label),budget:budgetIsBlank?null:(budget.get(label)||0),actual:actual.get(label)||0})), {kind:'horizontal',onSelect:label=>setSelection(categoryField,label)});
  }

  function renderMonthlyBudgetActual() {
    const container = document.getElementById("trend-chart");
    const actualByMonth = new Map(
      groupedPeriod(filteredActual(), ["month"], "actual")
        .map(row => [Number(row.month), row.value])
    );
    const budgetIsBlank = selectedOrderTypeBudgetShare() === null;
    const monthlyBudget = budgetIsBlank
      ? null
      : sum(filteredBudget().filter(row => row.costElement !== "Unmapped"), "budget") / 12;
    const months = [...actualByMonth.keys()].filter(month => month >= 1 && month <= 12).sort((a, b) => a - b);
    if (!months.length) return drawEmpty(container);

    window.EngineeringReportViews.monthly(container,months.map(month=>({key:month,label:new Intl.DateTimeFormat(state.language==='zh'?'zh-CN':'en',{month:'short'}).format(new Date(2026,month-1,1)),budget:monthlyBudget,actual:actualByMonth.get(month)||0})),{language:state.language,money:fullMoney,compact:compactMoney,axis:axisMillionsMoney,onSelect:month=>setSelection('month',month)});
  }

  function renderSeriesChart(containerId, rows, series, label, options = {}) {
    const container = document.getElementById(containerId);
    rows=rows.filter(row=>isMappedLabel(row.label));
    if (!rows.length) return drawEmpty(container);

    const width = Math.max(container.clientWidth - 14, 300);
    const height = Math.max(container.clientHeight - 22, 175);
    const left = 51;
    const right = 12;
    const top = 18;
    const longestLabel = Math.max(...rows.map(row => String(row.axisLabel || row.label).length));
    const bottom = longestLabel > 10 ? 76 : 34;
    const plotHeight = height - top - bottom;
    const plotWidth = width - left - right;
    const svg = createSvg(container, width, height, label);
    for (let i = 0; i <= 4; i++) {
      const y = top + (plotHeight * i) / 4;
      addGrid(svg, left, y, width - right);
    }

    const seriesPoints = [];
    const columnCount = options.columnSeries ?? Math.max(1, series.length - 1);
    const categoryWidth = plotWidth / rows.length;
    const barWidth = Math.min(28, categoryWidth * 0.7 / Math.max(1, columnCount));
    series.forEach((item, seriesIndex) => {
      const valid = rows.map(row => Number(row[item.key]) || 0);
      const min = Math.min(0, ...valid);
      const max = Math.max(1, ...valid);
      const range = max - min || 1;
      const points = valid.map((value, index) => {
        const categoryCenter = left + categoryWidth * (index + 0.5);
        const x = seriesIndex < columnCount
          ? categoryCenter + (seriesIndex - (columnCount - 1) / 2) * barWidth
          : categoryCenter;
        const normalized = (value - min) / range;
        const y = top + plotHeight - normalized * plotHeight;
        return { x, y, value, row: rows[index] };
      });
      seriesPoints.push(points);
      if (seriesIndex < columnCount) {
        points.forEach(point => {
          const column = svgElement("rect", {
            x: point.x - barWidth / 2,
            y: point.y,
            width: barWidth,
            height: Math.max(1, top + plotHeight - point.y),
            rx: 2,
            fill: item.color || colors[seriesIndex % colors.length],
            class: "svg-bar"
          });
          addTooltip(
            column,
            `${point.row.label} · ${item.label}`,
            point.value,
            options.formatTooltip || (value => numberFormat.format(value))
          );
          svg.append(column);
        });
      } else {
        const path = points.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
        svg.append(svgElement("path", {
          d: path,
          fill: "none",
          stroke: item.color || colors[seriesIndex % colors.length],
          "stroke-width": 2,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          opacity: .92
        }));
      }
      points.forEach((point, index) => {
        if (seriesIndex < columnCount) return;
        const circle = svgElement("circle", {
          cx: point.x,
          cy: point.y,
          r: rows.length < 20 ? 3 : 2,
          fill: item.color || colors[seriesIndex % colors.length],
          stroke: "#fff",
          "stroke-width": 1.2,
          class: "svg-point"
        });
        addTooltip(circle, `${point.row.label} · ${item.label}`, point.value,
          options.formatTooltip || (value => numberFormat.format(value)));
        svg.append(circle);
        if (seriesIndex === columnCount && (rows.length <= 14 || index % 3 === 0 || index === rows.length - 1)) {
          const label = String(point.row.axisLabel || point.row.label);
          const labelY = height - bottom + 9;
          const labelAttributes = {
            x: point.x,
            y: labelY,
            "text-anchor": longestLabel > 10 ? "end" : "middle",
            "data-tooltip": translateText(label)
          };
          if (longestLabel > 10) {
            labelAttributes.transform = `rotate(-45 ${point.x} ${labelY})`;
          }
          svg.append(svgElement("text", labelAttributes,
            label.length > 28 ? `${label.slice(0, 25)}…` : label));
        }
      });
    });

    const legend = element("div", { class: "chart-legend multi-series-legend" });
    for (const [index, item] of series.entries()) {
      const entry = element("span", { class: "legend-item" });
      entry.append(element("i", {
        class: index < columnCount ? "legend-swatch column-swatch" : "legend-swatch",
        style: `background:${item.color || colors[index % colors.length]}`
      }));
      entry.append(document.createTextNode(item.label));
      legend.append(entry);
    }
    if (options.indexed) {
      const note = element("span", {}, "折线按各指标自身区间归一化；悬停查看原值");
      note.style.cssText = "color:#9aa8b2;font-size:9px";
      legend.append(note);
    }
    container.append(legend);
    svg.style.height = `${Math.max(160, container.clientHeight - legend.offsetHeight - 8)}px`;
    return seriesPoints;
  }

  function renderDonut() {
    const container = document.getElementById("type-chart");
    const values = aggregate(filteredActual("costType"), "costType")
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
    if (!values.length) return drawEmpty(container);

    const width = Math.max(container.clientWidth - 14, 260);
    const height = Math.max(container.clientHeight - 12, 190);
    const svg = createSvg(container, width, height, "按工单类型划分的实际成本");
    const cx = width * .32;
    const cy = height * .48;
    const radius = Math.min(height * .32, width * .22);
    const total = values.reduce((acc, item) => acc + item.value, 0);
    let angle = -Math.PI / 2;

    values.forEach((item, index) => {
      const next = angle + (item.value / total) * Math.PI * 2;
      const large = next - angle > Math.PI ? 1 : 0;
      const start = [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
      const end = [cx + radius * Math.cos(next), cy + radius * Math.sin(next)];
      const segment = svgElement("path", {
        d: `M ${cx} ${cy} L ${start[0]} ${start[1]} A ${radius} ${radius} 0 ${large} 1 ${end[0]} ${end[1]} Z`,
        fill: colors[index % colors.length],
        stroke: "#fff",
        "stroke-width": 2,
        class: "pie-segment",
        tabindex: "0",
        role: "button"
      });
      addTooltip(segment, item.label, item.value);
      segment.addEventListener("click", () => setSelection("costType", item.label));
      segment.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setSelection("costType", item.label);
        }
      });
      svg.append(segment);
      angle = next;
    });

    const legend = svgElement("g", { transform: `translate(${width * .61}, ${Math.max(30, height * .18)})` });
    values.forEach((item, index) => {
      const y = index * 35;
      legend.append(svgElement("rect", {
        x: 0, y, width: 9, height: 9, rx: 2, fill: colors[index % colors.length]
      }));
      legend.append(svgElement("text", { x: 15, y: y + 8 }, item.label));
      appendDataLabel(legend, {
        x: 15, y: y + 22, fill: "#a1adb4", "font-size": 9
      }, item.value, `${compactMoney(item.value)} · ${percentage((item.value / total) * 100)}`);
    });
    svg.append(legend);
  }

  function renderDonutValues(
    containerId,
    values,
    label,
    filterField = "costElement",
    palette = {},
    formatAmount = compactMoney,
    formatPercentage = percentage
  ) {
    const container = document.getElementById(containerId);
    const rows = values.filter(item => isMappedLabel(item.label)&&(filterField!=='costElement'||mappedCostElements.has(item.label))&&Number(item.value)>0);
    if (!rows.length) return drawEmpty(container);

    if (containerId === "small-spending-element-chart" || containerId === "improvement-element-chart") {
      window.EngineeringReportViews.composition(container, rows.map((item, index) => ({
        ...item, color: palette[item.label] || colors[index % colors.length]
      })), {
        label: translateText(label), totalLabel: translateText("实际成本"),
        translate: translateText, money: formatAmount, exact: fullMoney, percentage: formatPercentage,
        onSelect: item => setSelection(filterField, item.key ?? item.label)
      });
      return;
    }

    const width = Math.max(container.clientWidth - 14, 260);
    const height = Math.max(container.clientHeight - 12, 190);
    const svg = createSvg(container, width, height, label);
    const cx = width * .32;
    const cy = height * .48;
    const radius = Math.min(height * .31, width * .2);
    const thickness = Math.max(12, radius * .28);
    const circumference = Math.PI * radius * 2;
    const total = sum(rows, "value");
    let offset = 0;
    rows.forEach((item, index) => {
      const length = (item.value / total) * circumference;
      const segment = svgElement("circle", {
        cx,
        cy,
        r: radius,
        fill: "none",
        stroke: palette[item.label] || colors[index % colors.length],
        "stroke-width": thickness,
        "stroke-dasharray": `${length} ${circumference - length}`,
        "stroke-dashoffset": -offset,
        transform: `rotate(-90 ${cx} ${cy})`,
        class: "donut-segment",
        tabindex: "0",
        role: "button"
      });
      addTooltip(segment, item.label, item.value);
      if (filterField) {
        segment.addEventListener("click", () => setSelection(filterField, item.key ?? item.label));
        segment.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelection(filterField, item.key ?? item.label);
          }
        });
      }
      svg.append(segment);
      offset += length;
    });
    appendDataLabel(svg, {
      x: cx,
      y: cy + 6,
      "text-anchor": "middle",
      class: "donut-total"
    }, total, formatAmount(total));

    const legend = svgElement("g", {
      transform: `translate(${width * .61}, ${Math.max(28, height * .19)})`
    });
    rows.forEach((item, index) => {
      const y = index * 36;
      legend.append(svgElement("rect", {
        x: 0,
        y,
        width: 9,
        height: 9,
        rx: 2,
        fill: palette[item.label] || colors[index % colors.length]
      }));
      legend.append(svgElement("text", { x: 15, y: y + 8 }, item.label));
      appendDataLabel(legend, {
        x: 15,
        y: y + 23,
        class: "svg-value"
      }, item.value, `${formatAmount(item.value)} · ${formatPercentage(item.value / total * 100)}`);
    });
    svg.append(legend);
  }

  function setKpiText(id, value) {
    document.getElementById(id).textContent = value;
  }

  function renderKpis(prefix = "kpi-") {
    const actualRows = filteredActual();
    const budgetShare = selectedOrderTypeBudgetShare();
    const budgetRows = filteredBudget().filter(row => row.costElement !== "Unmapped");
    const actual = sum(actualRows, "actual");
    const budget = budgetShare === null ? null : selectedPeriodBudget(budgetRows);
    const variance = budget === null ? null : budget - actual;
    setKpiText(`${prefix}budget`, budget === null ? "—" : kpiMoney(budget));
    setKpiText(`${prefix}actual`, kpiMoney(actual));
    setKpiText(`${prefix}variance`, variance === null ? "—" : kpiMoney(variance));
    const varianceFoot = document.getElementById(`${prefix}variance-foot`);
    if (varianceFoot) {
      varianceFoot.textContent = variance === null ? "" : variance >= 0 ? "低于预算" : "高于预算";
    }
    const typeTotals = new Map(
      groupedPeriod(actualRows, ["costType"], "actual").map(row => [row.costType, row.value])
    );
    for (const [type, id] of [["PM", "pm"], ["CM", "cm"], ["Improvement", "improvement"]]) {
      setKpiText(`${prefix}${id}`, `${(actual ? (typeTotals.get(type) || 0) / actual * 100 : 0).toFixed(2)}%`);
    }
    const ungrValue = data.ungrOrders.reduce((total, row) => {
      return total + convertCurrency(
        row.openDeliveryValue,
        row.currency || "CNY",
        "CNY"
      );
    }, 0);

    setKpiText("kpi-ungr-value", kpiMoney(ungrValue));
    // const ungrValue = sum(
    //   data.ungrOrders.filter(row => row.currency === "CNY"),
    //   "openDeliveryValue"
    // );
    // setKpiText("kpi-ungr-value", kpiMoney(ungrValue));
  }

  function renderAnnual() {
    renderAnnualChart();
  }

  function totalsByDimension(rows, field, valueField = "actual") {
    const values = new Map();
    for (const row of rows) {
      if (!isMappedLabel(row[field])) continue;
      const key = String(row[field]);
      const current = values.get(key) || { label: key, key, value: 0 };
      current.value += Number(row[valueField]) || 0;
      values.set(key, current);
    }
    return [...values.values()].sort((a, b) => b.value - a.value);
  }

  function makeTable(headers, rows, options = {}) {
    const table = element("table", { class: "data-table" });
    const thead = element("thead");
    const headerRow = element("tr");
    let sortState = null;
    const tbody = element("tbody");

    const renderRows = () => {
      const sortedRows = rows.map((row, index) => ({ row, index }));
      if (sortState) {
        const header = headers.find(item => item.key === sortState.key);
        sortedRows.sort((left, right) => {
          // const a = left.row[sortState.key];
          // const b = right.row[sortState.key];
          const header = headers.find(
            item => item.key === sortState.key
          );

          const a = header?.sortValue
            ? header.sortValue(left.row)
            : left.row[sortState.key];

          const b = header?.sortValue
            ? header.sortValue(right.row)
            : right.row[sortState.key];
          const aEmpty = a == null || a === "";
          const bEmpty = b == null || b === "";
          if (aEmpty || bEmpty) return aEmpty === bEmpty ? left.index - right.index : aEmpty ? 1 : -1;
          let comparison;
          if (header?.numeric || (typeof a === "number" && typeof b === "number")) {
            comparison = (Number(a) || 0) - (Number(b) || 0);
          } else {
            const aText = typeof a === "object" ? String(a.label ?? "") : String(a);
            const bText = typeof b === "object" ? String(b.label ?? "") : String(b);
            comparison = aText.localeCompare(bText, undefined, { numeric: true, sensitivity: "base" });
          }
          return comparison * sortState.direction || left.index - right.index;
        });
      }
      tbody.replaceChildren();
      for (const { row } of sortedRows) {
        const tr = element("tr", { class: options.clickField ? "clickable-row" : "" });
        if (options.clickField) {
          tr.addEventListener("click", () => setSelection(options.clickField, row[options.clickField]));
        }
        for (const header of headers) {
          const value = row[header.key];
          const displayValue=(typeof value==='string'&&!isMappedLabel(value))?'—':value;
          const rendered = displayValue==='—'?'—':header.render ? header.render(value, row) : String(value ?? '—');
          const td = element("td", { class: header.numeric ? "numeric" : "" });
          td.dataset.label=translateText(header.label);
          if (rendered instanceof Node) {
            td.append(rendered);
          } else {
            td.textContent = rendered;
          }
          tr.append(td);
        }
        tbody.append(tr);
      }
    };

    for (const header of headers) {
      const th = element("th", {
        class: header.numeric ? "numeric" : ""
      });
      if (header.sortable !== false && header.key && !Array.isArray(rows[0]?.[header.key])) {
        const button = element("button", {
          class: "table-sort-button",
          type: "button",
          "aria-label": `${header.label} sort`
        });
        button.append(
          element("span", {}, header.label),
          element("span", { class: "sort-indicator", "aria-hidden": "true" }, "↕")
        );
        button.addEventListener("click", () => {
          sortState = {
            key: header.key,
            direction: sortState?.key === header.key && sortState.direction === -1 ? 1 : -1
          };
          for (const current of headerRow.querySelectorAll("th[data-sort-key]")) {
            const key = current.dataset.sortKey;
            current.setAttribute("aria-sort", key === sortState.key
              ? sortState.direction === -1 ? "descending" : "ascending"
              : "none");
            const indicator = current.querySelector(".sort-indicator");
            indicator.textContent = key !== sortState.key ? "↕" : sortState.direction === -1 ? "↓" : "↑";
          }
          renderRows();
        });
        th.dataset.sortKey = header.key;
        th.setAttribute("aria-sort", "none");
        th.append(button);
      } else {
        th.textContent = header.label;
      }
      headerRow.append(th);
    }
    thead.append(headerRow);
    table.append(thead);

    renderRows();
    table.append(tbody);
    return table;
  }

  function filteredWorkOrders() {
    return data.workOrders.filter(row => {
      if (!matchesSelection(state.year, row.year)) return false;
      if (!matchesSelection(state.month, row.month)) return false;
      if (!matchesSelection(state.scope, row.scope)) return false;
      if (!matchesSelection(state.costType, row.costType)) return false;
      if (!matchesSelection(state.costElement, row.costElement)) return false;
      if (!matchesSelection(state.orderType, row.orderType)) return false;
      if (!matchesSelection(state.equipment, row.equipment)) return false;
      if (
        state.selection &&
        state.selection.field === "costElement" &&
        row.costElement !== state.selection.value
      ) return false;
      return true;
    });
  }

  function renderEquipmentSparkline(values) {
    const width = 110;
    const height = 26;
    const min = Math.min(0, ...values);
    const max = Math.max(1, ...values);
    const range = max - min || 1;
    const points = values.map((value, index) => {
      const x = values.length < 2 ? width / 2 : 2 + (width - 4) * index / (values.length - 1);
      const y = height - 3 - (value - min) / range * (height - 7);
      return `${x},${y}`;
    }).join(" ");
    const svg = svgElement("svg", {
      class: "equipment-sparkline",
      viewBox: `0 0 ${width} ${height}`,
      role: "img",
      "aria-label": translateText("Actual Cost by Month")
    });
    svg.append(svgElement("polyline", {
      points,
      fill: "none",
      stroke: "#292777",
      "stroke-width": 1.5,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }));
    return svg;
  }

  function renderAreaEquipmentTable() {
    const container = document.getElementById("area-equipment-table");
    const equipmentById = new Map(data.equipment.map(row => [row.equipment, row]));
    const totalsByDescription = new Map();
    for (const row of filteredWorkOrders()) {
      const description = equipmentById.get(row.equipment)?.description;
      if (!description) continue;

      const item = totalsByDescription.get(description) || {
        description,
        actual: 0,
        monthly: new Map()
      };
      item.actual += row.actual;
      item.monthly.set(row.month, (item.monthly.get(row.month) || 0) + row.actual);
      totalsByDescription.set(description, item);
    }
    const rows = [...totalsByDescription.values()]
      .sort((a, b) => Math.abs(b.actual) - Math.abs(a.actual))
      .slice(0, Number(document.getElementById("top-equipment-count").value) || 10)
      .map((row, index) => ({
        ...row,
        rank: index + 1,
        monthly: data.months.map(month => row.monthly.get(month) || 0)
      }));
    if (!rows.length) return drawEmpty(container);
    container.replaceChildren(makeTable([
      { key: "rank", label: "序号", numeric: true },
      { key: "description", label: "设备名称" },
      { key: "actual", label: "实际成本", numeric: true, render: fullMoney },
      { key: "monthly", label: "月度实际成本", render: values => renderEquipmentSparkline(values) }
    ], rows));
  }

  function getSpendingRows(kind) {
    return filteredWorkOrders()
      .filter(row => {
        if (kind === "improvement") return row.costType === "Improvement";
        return ["External Service", "External Material"].includes(row.costElement) &&
          convertCurrency(row.actual, data.currency || "CNY", "CHF") < 5000;
      })
      .sort((a, b) => Math.abs(b.actual) - Math.abs(a.actual));
  }

  function renderSpendingDetails(kind) {
    const smallSpending = kind === "small-spending";
    const rows = getSpendingRows(kind).map(row => ({
      ...row,
      period: `${row.year}-${String(row.month).padStart(2, "0")}`
    }));
    document.getElementById("spending-summary").hidden = true;
    document.getElementById("spending-detail-panel").hidden = false;
    document.getElementById("spending-detail-title").textContent =
      smallSpending ? "小额支出明细" : "改善明细";
    document.getElementById("spending-detail-description").textContent =
      "明细数据来自筛选后的工单实际成本。";
    const container = document.getElementById("spending-detail-table");
    if (!rows.length) {
      drawEmpty(container);
      return;
    }
    container.replaceChildren(makeTable([
      { key: "order", label: "工单" },
      { key: "orderType", label: "订单类型" },
      { key: "description", label: "描述" },
      { key: "costElement", label: "成本要素" },
      { key: "actual", label: "实际成本", numeric: true, render: fullMoney },
      { key: "scope", label: "区域" },
      { key: "period", label: "期间日期" }
    ], rows));
    setTimeout(() => {
      document.getElementById("spending-detail-panel").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 40);
  }

  function renderSpendingCharts() {
    const smallSpending = getSpendingRows("small-spending");
    const improvement = getSpendingRows("improvement");
    renderBars(
      "small-spending-area-chart",
      totalsByDimension(smallSpending, "scope"),
      "scope",
      { color: "#292777", label: "小额支出按区域的实际成本" }
    );
    renderDonutValues(
      "small-spending-element-chart",
      totalsByDimension(smallSpending, "costElement"),
      "小额支出按成本要素的实际成本",
      "costElement",
      { "External Service": "#17136f", "External Material": "#cbd4f0" }
    );
    renderBars(
      "improvement-area-chart",
      totalsByDimension(improvement, "scope"),
      "scope",
      { color: "#292777", label: "改善按区域的实际成本" }
    );
    renderDonutValues(
      "improvement-element-chart",
      totalsByDimension(improvement, "costElement"),
      "改善按成本要素的实际成本",
      "costElement",
      {
        "Internal Labor": "#f36a35",
        "External Service": "#17136f",
        "External Material": "#cbd4f0",
        "Internal Material": "#8f1b83"
      }
    );
  }

  function normalizeOrderNumber(value) {
    return String(value ?? "").trim().replace(/\.0$/, "");
  }

  function contractOrderMap() {
    return new Map(
      (data.contracts || [])
        .filter(contract => normalizeOrderNumber(contract.order))
        .map(contract => [normalizeOrderNumber(contract.order), contract])
    );
  }

  function contractStatus(contract) {
    const end = new Date(contract.end);
    if (Number.isNaN(end.getTime())) return { label: "未注明", className: "" };
    const days = Math.ceil((end.getTime() - Date.now()) / 86400000);
    if (days < 0) return { label: "已过期", className: "status-expired" };
    if (days <= 90) return { label: "即将到期", className: "status-expiring" };
    return { label: "有效", className: "status-active" };
  }

  function renderContracts() {
    const contracts = data.contracts || [];
    const byOrder = contractOrderMap();
    const actualByContract = new Map();
    const actualByMonth = new Map();
    for (const row of filteredWorkOrders()) {
      const contract = byOrder.get(normalizeOrderNumber(row.order));
      if (!contract) continue;
      actualByContract.set(contract.id, (actualByContract.get(contract.id) || 0) + row.actual);
      actualByMonth.set(row.month, (actualByMonth.get(row.month) || 0) + row.actual);
    }
    const monthlyRows = [...actualByMonth]
      .sort(([a], [b]) => a - b)
      .map(([month, value]) => ({
        label: new Intl.DateTimeFormat(state.language === "zh" ? "zh-CN" : "en", { month: "short" })
          .format(new Date(2026, month - 1, 1)),
        key: month,
        value
      }));
    renderBars("contract-cost-chart", monthlyRows, null, {
      sort: false,
      color: "#292777",
      label: "合同月度实际成本",
      formatTooltip: compactMoney
    });
    const query = (state.contractQuery || "").trim().toLowerCase();
    const filteredContracts = query
      ? contracts.filter(c =>
          String(c.id || "").toLowerCase().includes(query) ||
          String(c.name || "").toLowerCase().includes(query)
        )
      : contracts;
    const visible = filteredContracts.map(contract => {
      const status = contractStatus(contract);
      const endDate = new Date(contract.end);
      const remainingDays = Number.isNaN(endDate.getTime())
        ? null
        : Math.ceil((endDate.getTime() - Date.now()) / 86400000);
      return {
        ...contract,
        status,
        actual: actualByContract.get(contract.id) || 0,
        remainingDays
      };
    });
    const priority={'status-expiring':0,'status-active':1,'status-expired':2,'':3};
    visible.sort((a,b)=>(priority[a.status.className]??3)-(priority[b.status.className]??3)||(a.remainingDays??Infinity)-(b.remainingDays??Infinity)||String(a.id).localeCompare(String(b.id)));
    const container = document.getElementById("contract-table");
    if (!visible.length) return drawEmpty(container, "没有匹配的合同");
    container.replaceChildren(makeTable([
      { key: "id", label: "合同编号" },
      { key: "name", label: "合同名称" },
      { key: "start", label: "开始日期" },
      { key: "end", label: "结束日期" },
      { key: "actual", label: "合同成本", numeric: true, render: fullMoney },
      {
        key: "status",
        label: "状态",
        render: status => {
          const span = element("span", {
            class: `status-pill ${status.className}`
          }, status.label);
          return span;
        }
      },
      { key: "remainingDays", label: "剩余天数", numeric: true, render: value => value ?? "—" }
    ], visible));
  }

  function renderAreaCharts() {
    renderKpis("area-kpi-");
    renderBudgetActualColumns("area-scope-chart", "scope");
    renderBudgetActualColumns("area-element-chart", "costElement");
    renderBudgetActualColumns("area-type-chart", "costType", true);
    renderAreaEquipmentTable();
  }

  function renderDetails() {
    if (state.spendingDetail) {
      renderSpendingDetails(state.spendingDetail);
      return;
    }
    document.getElementById("spending-summary").hidden = false;
    document.getElementById("spending-detail-panel").hidden = true;
    renderSpendingCharts();
  }

  function renderOverview() {
    renderKpis();
    renderAnnualChart();
    renderMonthlyBudgetActual();
    renderBudgetActualColumns("element-chart", "costElement");
    renderBudgetActualColumns("type-chart", "costType", true);
  }

  function groupedPeriod(rows, fields, valueField) {
    const groups = new Map();
    for (const row of rows) {
      if (fields.some(field=>!isMappedLabel(row[field]))) continue;
      const key = fields.map(field => String(row[field] ?? "")).join("|");
      const item = groups.get(key) || Object.fromEntries(fields.map(field => [field, row[field]]));
      item.value = (item.value || 0) + (Number(row[valueField]) || 0);
      groups.set(key, item);
    }
    return [...groups.values()];
  }

  function getEnergyRows() {
    return data.energy.filter(row =>
      matchesSelection(state.year, row.year) &&
      matchesSelection(state.month, row.month)
    ).sort((a, b) => a.year - b.year || a.month - b.month);
  }

  function renderEnergyUtilityChart(containerId, rows, config) {
    const container = document.getElementById(containerId);
    const years = [...new Set(rows.map(row => Number(row.year)))].sort((a, b) => a - b);
    const chartRows = rows.filter(row => years.includes(Number(row.year)));
    if (!chartRows.length) return drawEmpty(container);

    const months = state.month.length
      ? [...new Set(chartRows.map(row => Number(row.month)))].sort((a, b) => a - b)
      : Array.from({ length: 12 }, (_, index) => index + 1);
    const rowsByPeriod = new Map(chartRows.map(row => [`${row.year}-${row.month}`, row]));
    const values = months.flatMap(month => years.map(year => {
      const row = rowsByPeriod.get(`${year}-${month}`);
      return row ? Number(row[config.key]) || 0 : 0;
    }));
    const intensities = months.flatMap(month => {
      return years.flatMap(year => {
      const row = rowsByPeriod.get(`${year}-${month}`);
        return row && Number(row.production) > 0 ? [Number(row[config.intensityKey]) || 0] : [];
      });
    });
    const maximumConsumption = Math.max(0, ...values) * 1.12 || 1;
    const minimumIntensityValue = intensities.length ? Math.min(...intensities) : 0;
    const maximumIntensityValue = intensities.length ? Math.max(...intensities) : 0;
    const intensitySpan = maximumIntensityValue - minimumIntensityValue;
    const intensityPadding = intensitySpan * 0.08 || Math.max(maximumIntensityValue * 0.08, 0.00000001);
    const minimumIntensity = Math.max(0, minimumIntensityValue - intensityPadding);
    const maximumIntensity = maximumIntensityValue + intensityPadding || 1;
    const intensityRange = maximumIntensity - minimumIntensity || 1;
    const width = Math.max(container.clientWidth - 14, 300);
    const height = Math.max(container.clientHeight - 74, 190);
    const left = 58;
    const right = 62;
    const top = 18;
    const bottom = 34;
    const plotBottom = height - bottom;
    const totalPlotHeight = plotBottom - top;
    const lineTop = top;
    const lineHeight = Math.round(totalPlotHeight * 0.5);
    const sectionGap = Math.max(34, Math.round(totalPlotHeight * 0.1));
    const barTop = lineTop + lineHeight + sectionGap;
    const barHeight = plotBottom - barTop;
    const plotWidth = width - left - right;
    const categoryWidth = plotWidth / months.length;
    const barWidth = Math.min(24, categoryWidth * 0.68 / years.length);
    const colorPalette = ["#cbd3eb", "#403a9c", "#f26736", "#258c77", "#7b637e", "#c19a2b"];
    const yearColors = Object.fromEntries(years.map((year, index) => [
      year,
      ({ 2024: "#cbd3eb", 2025: "#403a9c", 2026: "#f26736" })[year] || colorPalette[index % colorPalette.length]
    ]));
    const lineColors = Object.fromEntries(years.map((year, index) => [
      year,
      ({ 2024: "#7187bd", 2025: "#19145f", 2026: "#d94d20" })[year] || colorPalette[index % colorPalette.length]
    ]));
    const localizedTitle = translateText(config.title);
    const svg = createSvg(container, width, height, config.title);
    svg.style.width = "100%";
    svg.style.height = `${height}px`;

    for (let tick = 0; tick <= 6; tick++) {
      const ratio = 1 - tick / 6;
      const lineY = lineTop + lineHeight * (tick / 6);
      addGrid(svg, left, lineY, width - right);
      const intensity = minimumIntensity + intensityRange * ratio;
      svg.append(svgElement("text", {
        x: width - right + 8,
        y: lineY + 3,
        "text-anchor": "start",
        class: "svg-category"
      }, formatEnergyIntensity(intensity, intensityRange / 6)));
    }

    for (let tick = 0; tick <= 4; tick++) {
      const ratio = 1 - tick / 4;
      const barY = barTop + barHeight * (tick / 4);
      addGrid(svg, left, barY, width - right);
      const consumption = maximumConsumption * ratio;
      svg.append(svgElement("text", {
        x: left - 8,
        y: barY + 3,
        "text-anchor": "end",
        class: "svg-category"
      }, formatEnergyAxisValue(consumption)));
    }

    const monthFormatter = new Intl.DateTimeFormat(state.language === "zh" ? "zh-CN" : "en-US", {
      month: "short"
    });
    const lineLayers = [];
    years.forEach((year, yearIndex) => {
      months.forEach((month, monthIndex) => {
        const row = rowsByPeriod.get(`${year}-${month}`);
        const value = row ? Number(row[config.key]) || 0 : 0;
        if (value <= 0) return;
        const center = left + categoryWidth * (monthIndex + 0.5);
        const x = center + (yearIndex - (years.length - 1) / 2) * barWidth;
        const valueHeight = (value / maximumConsumption) * barHeight;
        const bar = svgElement("rect", {
          x: x - barWidth / 2,
          y: barTop + barHeight - valueHeight,
          width: barWidth,
          height: valueHeight,
          rx: 2,
          fill: yearColors[year],
          class: "svg-bar"
        });
        addTooltip(bar, `${localizedTitle} · ${monthFormatter.format(new Date(2026, month - 1, 1))} · ${year}`, value,
          formatEnergyTooltip);
        svg.append(bar);
      });

      let path = "";
      let hasPreviousPoint = false;
      const linePoints = [];
      months.forEach((month, monthIndex) => {
        const row = rowsByPeriod.get(`${year}-${month}`);
        if (!row || Number(row.production) <= 0) {
          hasPreviousPoint = false;
          return;
        }
        const value = Number(row[config.intensityKey]) || 0;
        const point = {
          x: left + categoryWidth * (monthIndex + 0.5),
          y: lineTop + lineHeight - ((value - minimumIntensity) / intensityRange) * lineHeight
        };
        path += `${hasPreviousPoint ? "L" : "M"}${point.x},${point.y} `;
        hasPreviousPoint = true;
        linePoints.push({ ...point, month, value });
      });
      if (path) lineLayers.push({ year, path: path.trim(), points: linePoints });
    });

    lineLayers.forEach(({ year, path, points }) => {
      svg.append(svgElement("path", {
        d: path,
        fill: "none",
        stroke: "#fff",
        "stroke-width": 4.5,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));
      svg.append(svgElement("path", {
        d: path,
        fill: "none",
        stroke: lineColors[year],
        "stroke-width": 2.4,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));
      points.forEach(point => {
        const marker = svgElement("circle", {
          cx: point.x,
          cy: point.y,
          r: 3.2,
          fill: lineColors[year],
          stroke: "#fff",
          "stroke-width": 1.2,
          class: "svg-point"
        });
        const intensityLabel = state.language === "zh" ? `${localizedTitle} 每 kg ${year}` : `${localizedTitle} per KG ${year}`;
        addTooltip(marker, `${intensityLabel} · ${monthFormatter.format(new Date(2026, point.month - 1, 1))}`,
          point.value, formatEnergyTooltip);
        svg.append(marker);
      });
    });

    months.forEach((month, index) => {
      const x = left + categoryWidth * (index + 0.5);
      svg.append(svgElement("text", {
        x,
        y: height - 8,
        "text-anchor": "middle",
        class: "svg-category"
      }, monthFormatter.format(new Date(2026, month - 1, 1))));
    });

    const legend = element("div", { class: "chart-legend multi-series-legend" });
    for (const year of years) {
      const entry = element("span", { class: "legend-item" });
      entry.append(element("i", {
        class: "legend-swatch column-swatch",
        style: `background:${yearColors[year]}`
      }));
      entry.append(document.createTextNode(String(year)));
      legend.append(entry);
    }
    for (const year of years) {
      const entry = element("span", { class: "legend-item" });
      entry.append(element("i", {
        class: "legend-swatch",
        style: `background:transparent;border-top:2px solid ${lineColors[year]};border-radius:0;height:0;width:14px`
      }));
      entry.append(document.createTextNode(state.language === "zh"
        ? `${localizedTitle} 每 kg ${year}`
        : `${localizedTitle} per KG ${year}`));
      legend.append(entry);
    }
    container.insertBefore(legend, svg);
  }

  function formatEnergyAxisValue(value) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
    return numberFormat.format(Math.round(value));
  }

  function formatEnergyIntensity(value, interval) {
    const maximumFractionDigits = interval > 0
      ? Math.min(8, Math.max(0, Math.ceil(-Math.log10(interval)) + 1))
      : 8;
    return new Intl.NumberFormat(state.language === "zh" ? "zh-CN" : "en-US", {
      maximumFractionDigits
    }).format(value);
  }

  function formatEnergyTooltip(value) {
    const maximumFractionDigits = value >= 1000 ? 2 : value >= 0.1 ? 4 : 8;
    return new Intl.NumberFormat(state.language === "zh" ? "zh-CN" : "en-US", {
      maximumFractionDigits
    }).format(value);
  }

  function getSelectedWorkOrderStatus() {
    return data.workOrderStatus.filter(row =>
      matchesSelection(state.year, row.year) &&
      matchesSelection(state.month, row.month)
    );
  }

  function monthLabel(row) {
    return `${row.year}-${String(row.month).padStart(2, "0")}`;
  }

  function bindCardTilt(card) {
    const maxAngle = 12;
    card.addEventListener("pointerenter", () => {
      card.style.transition = "transform 0.08s ease-out, border-color 0.22s ease, box-shadow 0.22s ease";
    });
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const xRatio = (event.clientX - rect.left) / rect.width;
      const yRatio = (event.clientY - rect.top) / rect.height;
      const rotateY = ((xRatio - 0.5) * 2 * maxAngle).toFixed(2);
      const rotateX = ((0.5 - yRatio) * 2 * maxAngle).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.22s ease, box-shadow 0.22s ease";
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    });
  }


  function setHomeCardsOpen(open) {
    const stageEl = document.getElementById("home-stage");
    const revealEl = document.getElementById("home-cards-reveal");
    if (!stageEl || !revealEl) return;
    if (state.view !== "home" || !open) {
      stageEl.classList.remove("cards-open");
      revealEl.classList.remove("is-visible");
    } else {
      stageEl.classList.add("cards-open");
      revealEl.classList.add("is-visible");
    }
  }

  function updateHomeScrollReveal() {
    if (state.view !== "home") {
      setHomeCardsOpen(false);
    }
  }

  function renderHome() { /* The four domain entries are managed by portal.js. */ }

  function getEquipmentCostRows() {
    const equipment = new Map(data.equipment.map(row => [row.equipment, row]));
    const totals = new Map();
    for (const row of filteredWorkOrders()) {
      const key = row.equipment;
      const item = totals.get(key) || {
        equipment: key,
        description: row.equipmentName,
        actual: 0,
        orders: new Set(),
        scope: row.scope,
        costCenter: row.costCenter
      };
      item.actual += row.actual;
      item.orders.add(row.order);
      totals.set(key, item);
    }
    return [...totals.values()].map(item => {
      const detail = equipment.get(item.equipment) || {};
      return {
        ...item,
        description: detail.description || item.description || "设备未匹配",
        functionalLocation: detail.functionalLocation || "—",
        area: detail.area || "—",
        abc: detail.abc || "—",
        orderCount: item.orders.size
      };
    }).sort((a, b) => Math.abs(b.actual) - Math.abs(a.actual));
  }

  function renderCapexGauge() {
    // const {totalBudget,approvedBudget}=data.capex.overview;
    const years =
        state.capexYear.length
            ? state.capexYear
            : ["2026","2027","2028","2029"];
    const selectedOverviews =
        years.map(
            year =>
                data.capex.overview.years[year]
        );

    // const totalBudget =
    //     selectedOverviews.reduce(
    //         (s,x) => s + (x?.totalBudget || 0),
    //         0
    //     );

    const totalBudget =
        data.capex.overview.totalBudget;

    const approvedBudget =
        selectedOverviews.reduce(
            (s,x) => s + (x?.approvedBudget || 0),
            0
        );
  //   const overview =
  //       data.capex.overview.years[
  //           state.capexYear
  //       ];

  //   const totalBudget =
  //       overview.totalBudget;

  //   const approvedBudget =
  //       overview.approvedBudget;
    window.EngineeringReportViews.approval(document.getElementById('capex-budget-gauge'),totalBudget,approvedBudget,{language:state.language,money:capexOverviewMoney});
  }

  function renderCapexDistribution() {
    // const overview=
    // const overview =
    //     data.capex.overview.years[
    //         state.capexYear
    //     ];
    const years =
        state.capexYear.length
            ? state.capexYear
            : ["2026","2027","2028","2029"];
    const selectedOverviews =
        years.map(
            year =>
                data.capex.overview.years[year]
        );

    const overview = {
        ungrValue:
            selectedOverviews.reduce(
                (s,x)=>s+(x?.ungrValue||0),
                0
            ),

        prValue:
            selectedOverviews.reduce(
                (s,x)=>s+(x?.prValue||0),
                0
            ),

        grValue:
            selectedOverviews.reduce(
                (s,x)=>s+(x?.grValue||0),
                0
            )
    };
    window.EngineeringReportViews.distribution(document.getElementById('capex-distribution-chart'),[
      {label:translateText('未收货金额'),value:overview.ungrValue,color:'#171276'},
      {label:translateText('采购申请金额'),value:overview.prValue,color:'#ed6a36'},
      {label:translateText('已收货金额'),value:overview.grValue,color:'#cbd2ec'}
    ],{language:state.language,money:capexOverviewMoney,percentage:capexOverviewPercentage});
  }

  let capexProjectPage = 0;
  function renderCapexProjectChart() {
    const years =
        state.capexYear.length
            ? state.capexYear
            : ["2026","2027","2028","2029"];

    const getBudget = row =>
        years.reduce(
            (sum,year)=>
                sum +
                (row[`budget${year}`] || 0),
            0
        );
    const getGR = row =>
        years.reduce(
            (sum,year)=>
                sum +
                (row[`grValue${year}`] || 0),
            0
        );

    const getUnGR = row =>
        years.reduce(
            (sum,year)=>
                sum +
                (row[`ungrValue${year}`] || 0),
            0
        );

    const getPR = row =>
        years.reduce(
            (sum,year)=>
                sum +
                (row[`prValue${year}`] || 0),
            0
        );

    const container = document.getElementById("capex-project-chart");
    const allRows = data.capex.overview.projectSummary;
    if (!allRows.length) return drawEmpty(container);
    const pageSize = container.clientWidth < 540 ? 4 : container.clientWidth < 1000 ? 8 : allRows.length;
    const pageCount = Math.ceil(allRows.length / pageSize);
    capexProjectPage = Math.min(capexProjectPage, pageCount - 1);
    const rows = allRows.slice(capexProjectPage * pageSize, (capexProjectPage + 1) * pageSize);

    const width = Math.max(container.clientWidth - 14, 280);
    const height = Math.max(container.clientHeight - (pageCount > 1 ? 76 : 35), 250);
    const left = 78;
    const right = 18;
    const top = 28;
    const bottom = 108;
    const plotHeight = height - top - bottom;
    const plotWidth = width - left - right;
    // const year = state.capexYear;
    const positiveTotals = allRows.map(row =>
      Math.max(
        getBudget(row),
        Math.max(0, getUnGR(row)) + Math.max(0, getGR(row)) + Math.max(0, getPR(row))
      )
    );
    const negativeTotals = allRows.map(row =>
      Math.min(0, getUnGR(row)) + Math.min(0, getGR(row)) + Math.min(0, getPR(row))
    );
    const maxTotal = Math.max(1, ...positiveTotals);
    const minTotal = Math.min(0, ...negativeTotals);
    const rawStep = maxTotal / 7;
    const magnitude = 10 ** Math.floor(Math.log10(rawStep));
    const normalizedStep = rawStep / magnitude;
    const step = (normalizedStep <= 1 ? 1 : normalizedStep <= 2 ? 2 : normalizedStep <= 5 ? 5 : 10) * magnitude;
    const axisMax = Math.max(step, Math.ceil(maxTotal / step) * step);
    const axisMin = minTotal < -step * .1 ? Math.floor(minTotal / step) * step : 0;
    const axisRange = axisMax - axisMin;
    const yForValue = value => top + (axisMax - value) / axisRange * plotHeight;
    const zeroY = yForValue(0);
    const svg = createSvg(
      container,
      width,
      height,
      translateText("各项目未收货、已收货、采购申请与占用")
    );
    svg.style.width = "100%";
    svg.style.height = `${height}px`;

    for (let value = axisMax; value >= axisMin - step * .001; value -= step) {
      const y = yForValue(value);
      addGrid(svg, left, y, width - right);
      svg.append(svgElement("text", {
        x: left - 8,
        y: y + 3,
        "text-anchor": "end",
        class: "svg-value"
      }, capexOverviewAxisMoney(value)));
    }

    const categoryWidth = plotWidth / rows.length;
    const barWidth = Math.max(8, Math.min(34, categoryWidth * .68));
    // const series = [
    //   { key: "ungrValue", label: "未收货", color: "#171276" },
    //   { key: "grValue", label: "已收货", color: "#cbd2ec" },
    //   { key: "prValue", label: "采购申请", color: "#ed6a36" }
    // ];
    const series = [
        {
            label:"未收货",
            color:"#171276",
            getter:getUnGR
        },
        {
            label:"已收货",
            color:"#cbd2ec",
            getter:getGR
        },
        {
            label:"采购申请",
            color:"#ed6a36",
            getter:getPR
        }
    ];
    const occupiedPoints = [];

    rows.forEach((row, index) => {
      const center = left + categoryWidth * (index + .5);
      let positiveStack = 0;
      let negativeStack = 0;
      for (const item of series) {
        // const value = row[item.key];
        const value = item.getter(row);
        const segmentHeight = Math.abs(value) / axisRange * plotHeight;
        const isNegative = value < 0;
        const y = isNegative
          ? zeroY + negativeStack
          : zeroY - positiveStack - segmentHeight;
        if (value !== 0) {
          const bar = svgElement("rect", {
            x: center - barWidth / 2,
            y,
            width: barWidth,
            height: Math.max(1, segmentHeight),
            fill: item.color,
            class: "svg-bar"
          });
          addTooltip(bar, `${row.wbs} · ${row.name} · ${translateText(item.label)}`, value);
          svg.append(bar);
        }
        if (isNegative) negativeStack += segmentHeight;
        else positiveStack += segmentHeight;
      }

      // const occupied = row.grValue + row.ungrValue + row.prValue;
      const occupied = getGR(row) + getUnGR(row) + getPR(row);
      const remainingBudget = getBudget(row) - occupied;
      const pointY = yForValue(occupied);
      const budgetY = yForValue(getBudget(row));
      const errorBar = svgElement("line", {
        x1: center,
        y1: pointY,
        x2: center,
        y2: budgetY,
        stroke: "#f04c58",
        "stroke-width": 1.4,
        class: "capex-error-bar"
      });
      addTooltip(
        errorBar,
        `${row.wbs} ${row.name} · ${translateText("Approved Budget")}`,
        getBudget(row)
      );
      svg.append(errorBar);
      for (const y of new Set([pointY, budgetY])) {
        svg.append(svgElement("line", {
          x1: center - 5,
          y1: y,
          x2: center + 5,
          y2: y,
          stroke: "#f04c58",
          "stroke-width": 1.4,
          class: "capex-error-cap"
        }));
      }

      occupiedPoints.push({ x: center, y: pointY, value: occupied, budget: getBudget(row), row });
      const category = svgElement("text", {
        x: center,
        y: height - bottom + 12,
        "text-anchor": "middle",
        class: "svg-category capex-project-label",
        "font-size": 8
      });
      const labelLines = [row.wbs, ...(row.name.match(/.{1,9}/g) || [])];
      labelLines.slice(0, 5).forEach((line, lineIndex) => {
        category.append(svgElement("tspan", {
          x: center,
          dy: lineIndex === 0 ? 0 : 9
        }, line));
      });
      category.setAttribute("data-tooltip", `${row.wbs} ${row.name}`);
      svg.append(category);
      appendDataLabel(svg, {
        x: center,
        y: Math.max(12, Math.min(yForValue(getBudget(row)), pointY) - 16),
        "text-anchor": "middle",
        class: "svg-value capex-budget-label"
      }, remainingBudget, capexChartMoney(remainingBudget));
    });

    occupiedPoints.forEach(point => {
      const dot = svgElement("circle", {
        cx: point.x,
        cy: point.y,
        r: 3.5,
        fill: "#710080",
        stroke: "#fff",
        "stroke-width": 1.3,
        class: "svg-point"
      });
      addTooltip(
        dot,
        `${point.row.wbs} · ${point.row.name} · ${translateText("占用")}`,
        point.value
      );
      svg.append(dot);
    });

    // One focusable hit area per project includes zero amounts and the full budget balance.
    rows.forEach((row, index) => {
      const occupied = getGR(row) + getUnGR(row) + getPR(row);
      const labels = state.language === "zh"
        ? ["未收货", "已收货", "采购申请", "已占用", "未占用"]
        : ["Unreceived", "Received", "Purchase requisitions", "Occupied", "Unoccupied"];
      const values = [
          getUnGR(row),
          getGR(row),
          getPR(row),
          occupied,
          getBudget(row) - occupied
      ]
      // const values = [row.ungrValue, row.grValue, row.prValue, occupied, getBudget(row) - occupied];
      const tip = `${row.wbs} · ${row.name}\n` + labels.map((label, i) => `${label}: ${fullMoney(values[i])}`).join("\n");
      svg.append(svgElement("rect", {
        x: left + categoryWidth * index, y: top, width: categoryWidth, height: height - top,
        fill: "transparent", tabindex: 0, class: "capex-project-hit",
        "data-tooltip": tip, "aria-label": tip
      }));
    });

    const legend = element("div", { class: "chart-legend capex-legend" });
    for (const item of [
    ...series,
    { label: "占用（未收货、已收货、采购申请）", color: "#710080", point: true }
    ]) {
    const entry = element("span", { class: "legend-item" });
    entry.append(element("i", {
      class: item.point ? "legend-swatch capex-point-swatch" : "legend-swatch",
      style: `background:${item.color}`
    }));
    entry.append(document.createTextNode(translateText(item.label)));
      legend.append(entry);
    }
    container.append(legend);
    if (pageCount > 1) {
      const pager = element("div", { class: "project-pagination", role: "group", "aria-label": state.language === "zh" ? "项目分页" : "Project pages" });
      const previous = element("button", { type: "button" }, state.language === "zh" ? "上一组" : "Previous");
      const next = element("button", { type: "button" }, state.language === "zh" ? "下一组" : "Next");
      previous.disabled = capexProjectPage === 0;
      next.disabled = capexProjectPage === pageCount - 1;
      previous.addEventListener("click", () => { capexProjectPage--; hideChartTooltip(); renderCapexProjectChart(); });
      next.addEventListener("click", () => { capexProjectPage++; hideChartTooltip(); renderCapexProjectChart(); });
      const status = element("span", { "aria-live": "polite" }, `${capexProjectPage * pageSize + 1}–${Math.min((capexProjectPage + 1) * pageSize, allRows.length)} / ${allRows.length}`);
      pager.append(previous, status, next);
      container.append(pager);
    }
  }

  function renderCapexPrDetails() {
    const container = document.getElementById("capex-pr-detail-table");
    const rows = [...(data.capex.requisitions || [])]
      .filter(row => row.description || row.requisitioner || row.value)
      .sort((a, b) => String(b.requisitionDate).localeCompare(String(a.requisitionDate)));
    if (!rows.length) return drawEmpty(container);

    const table = makeTable([
      { key: "requisitioner", label: "申请人" },
      { key: "description", label: "短文本" },
      {
        key: "value",
        label: "总金额",
        numeric: true,
        render: value => preciseNumberFormat.format(convertCurrency(value))
      },
      { key: "requisitionDate", label: "申请日期" },
      { key: "nextMonthDate", label: "截止日期" }
    ], rows);
    const footer = element("tfoot");
    const totalRow = element("tr");
    totalRow.append(
      element("th", { colspan: "2" }, "合计"),
      element("th", { class: "numeric" },
        preciseNumberFormat.format(convertCurrency(sum(rows, "value")))),
      element("td"),
      element("td")
    );
    footer.append(totalRow);
    table.append(footer);
    container.replaceChildren(table);
  }

  function renderCapex() {
    // const overview = data.capex.overview;
    const years =
        state.capexYear.length
            ? state.capexYear
            : ["2026","2027","2028","2029"];
    const selectedOverviews =
        years.map(
            year =>
                data.capex.overview.years[year]
        );
    const overview = {

        // totalBudget:
        //     selectedOverviews.reduce(
        //         (s,x)=>
        //             s + x.totalBudget,
        //         0
        //     ),

        totalBudget:
            data.capex.overview.totalBudget,

        approvedBudget:
            selectedOverviews.reduce(
                (s,x)=>
                    s +
                    x.approvedBudget,
                0
            ),

        notYetOccupied:
            selectedOverviews.reduce(
                (s,x)=>
                    s +
                    x.notYetOccupied,
                0
            ),

        poValue:
            selectedOverviews.reduce(
                (s,x)=>
                    s +
                    x.poValue,
                0
            ),

        prValue:
            selectedOverviews.reduce(
                (s,x)=>
                    s +
                    x.prValue,
                0
            ),

        grValue:
            selectedOverviews.reduce(
                (s,x)=>
                    s +
                    x.grValue,
                0
            ),

        ungrValue:
            selectedOverviews.reduce(
                (s,x)=>
                    s +
                    x.ungrValue,
                0
            )

    };
    setKpiText("capex-overview-total-budget", capexOverviewMoney(overview.totalBudget));
    setKpiText("capex-overview-approved-budget", capexOverviewMoney(overview.approvedBudget));
    setKpiText("capex-overview-not-yet-occupied", capexOverviewMoney(overview.notYetOccupied));
    setKpiText("capex-overview-po-value", capexOverviewMoney(overview.poValue));
    setKpiText("capex-overview-pr-value", capexOverviewMoney(overview.prValue));
    setKpiText("capex-overview-gr-value", capexOverviewMoney(overview.grValue));
    setKpiText("capex-overview-ungr-value", capexOverviewMoney(overview.ungrValue));
    document.getElementById("capex-pr-detail-panel").hidden = !state.capexPrDetail;
    document.getElementById("capex-grid").hidden = state.capexPrDetail;
    if (state.capexPrDetail) {
      renderCapexPrDetails();
      return;
    }
    renderCapexGauge();
    renderCapexDistribution();
    renderCapexProjectChart();
  }

  function capexPlanMillions(value, digits = 1) {
    const formatted = new Intl.NumberFormat(
      state.language === "zh" ? "zh-CN" : "en-US",
      { minimumFractionDigits: digits, maximumFractionDigits: digits }
    ).format(convertCurrency(value) / 1_000_000);
    return `${currencyPrefix()}${formatted}M`;
  }

  function renderCapexPlanLegend() {
    const legend = document.getElementById("capex-plan-legend");
    legend.replaceChildren();
    for (const item of [
      { label: "实际收货金额", color: "#171276" },
      { label: "未交付累计金额", color: "#cbd2ec" },
      { label: "累计收货金额", color: "#ed6a36", line: true },
      { label: "预算", color: "#710080", line: true }
    ]) {
      const entry = element("span", { class: "legend-item" });
      entry.append(element("i", {
        class: item.line ? "legend-swatch capex-plan-line-swatch" : "legend-swatch",
        style: item.line ? `border-color:${item.color}` : `background:${item.color}`
      }));
      entry.append(document.createTextNode(translateText(item.label)));
      legend.append(entry);
    }
  }

  function renderCapexPlanTrend() {
    const container = document.getElementById("capex-plan-trend-chart");
    const year = Number(state.capexPlanYear);
    const rows = data.capex.plan.monthly.filter(row => row.year === year);
    if (!rows.length) return drawEmpty(container);

    const width = Math.max(container.clientWidth - 14, 360);
    const height = Math.max(container.clientHeight - 8, 240);
    const left = 76;
    const right = 18;
    const top = 24;
    const bottom = 32;
    const plotHeight = height - top - bottom;
    const plotWidth = width - left - right;
    const maximum = Math.max(
      1,
      ...rows.map(row => Math.max(row.ytdGR, row.budget, row.actGR + row.ytd))
    );
    const rawStep = maximum / 6;
    const magnitude = 10 ** Math.floor(Math.log10(rawStep));
    const normalizedStep = rawStep / magnitude;
    const step = (normalizedStep <= 1 ? 1 : normalizedStep <= 2 ? 2 : normalizedStep <= 5 ? 5 : 10) * magnitude;
    const axisMax = Math.max(step, Math.ceil(maximum / step) * step);
    const negativeMin = Math.min(0, ...rows.map(row => row.actGR), ...rows.map(row => row.ytd));
    const axisMin = negativeMin < -step * .1 ? Math.floor(negativeMin / step) * step : 0;
    const axisRange = axisMax - axisMin;
    const yForValue = value => top + (axisMax - value) / axisRange * plotHeight;
    const zeroY = yForValue(0);
    const svg = createSvg(
      container,
      width,
      height,
      "已收货金额、未交付累计金额、累计收货金额与预算"
    );
    svg.style.width = "100%";
    svg.style.height = `${height}px`;

    for (let value = axisMax; value >= axisMin - step * .001; value -= step) {
      const y = yForValue(value);
      addGrid(svg, left, y, width - right);
      svg.append(svgElement("text", {
        x: left - 8,
        y: y + 3,
        "text-anchor": "end",
        class: "svg-value"
      }, capexPlanMillions(value, 0)));
    }

    const categoryWidth = plotWidth / rows.length;
    const barWidth = Math.max(12, Math.min(42, categoryWidth * .62));
    const budgetY = yForValue(data.capex.plan.budget2026);
    const budgetLine = svgElement("line", {
      x1: left,
      y1: budgetY,
      x2: width - right,
      y2: budgetY,
      stroke: "#710080",
      "stroke-width": 2,
      class: "capex-plan-budget-line"
    });
    addTooltip(
      budgetLine,
      "预算",
      data.capex.plan.budget2026,
      value => capexPlanMillions(value, 2)
    );
    svg.append(budgetLine);

    const linePoints = [];
    const totalLabels = [];
    rows.forEach((row, index) => {
      const center = left + categoryWidth * (index + .5);
      let positiveBase = 0;
      let negativeBase = 0;
      for (const item of [
        { key: "actGR", label: "实际收货金额", color: "#171276" },
        { key: "ytd", label: "未交付累计金额", color: "#cbd2ec" }
      ]) {
        const value = Number(row[item.key]) || 0;
        if (!value) continue;
        const segmentStart = value > 0 ? positiveBase : negativeBase;
        const segmentEnd = segmentStart + value;
        const segmentTop = Math.min(yForValue(segmentStart), yForValue(segmentEnd));
        const segmentHeight = Math.abs(yForValue(segmentStart) - yForValue(segmentEnd));
        const bar = svgElement("rect", {
          x: center - barWidth / 2,
          y: segmentTop,
          width: barWidth,
          height: Math.max(1, segmentHeight),
          fill: item.color,
          class: "svg-bar"
        });
        addTooltip(bar, item.label, value, amount => capexPlanMillions(amount, 2));
        svg.append(bar);
        if (segmentHeight >= 18) {
          appendDataLabel(svg, {
            x: center,
            y: segmentTop + segmentHeight / 2 + 3,
            "text-anchor": "middle",
            class: `capex-plan-segment-label ${item.key === "actGR" ? "capex-plan-segment-label-act" : "capex-plan-segment-label-ytd"}`
          }, value, capexPlanMillions(value));
        }
        if (value > 0) positiveBase = segmentEnd;
        else negativeBase = segmentEnd;
      }

      const totalY = yForValue(row.ytdGR);
      linePoints.push(`${center},${totalY}`);
      totalLabels.push({ x: center, y: totalY, value: row.ytdGR });
      const monthLabel = new Intl.DateTimeFormat(
        state.language === "zh" ? "zh-CN" : "en",
        { month: state.language === "zh" ? "numeric" : "short" }
      ).format(new Date(year, row.month - 1, 1));
      svg.append(svgElement("text", {
        x: center,
        y: height - bottom + 16,
        "text-anchor": "middle",
        class: "svg-category"
      }, monthLabel));
    });

    const totalLine = svgElement("polyline", {
      points: linePoints.join(" "),
      fill: "none",
      stroke: "#ed6a36",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: "capex-plan-total-line"
    });
    totalLine.setAttribute(
      "data-tooltip",
      `${translateText("累计收货金额")}: ${capexPlanMillions(totalLabels[totalLabels.length - 1].value, 2)}`
    );
    svg.append(totalLine);
    const totalLabelStride = Math.max(1, Math.ceil(64 / categoryWidth));
    totalLabels.forEach((point, index) => {
      svg.append(svgElement("circle", {
        cx: point.x,
        cy: point.y,
        r: 2,
        fill: "#ed6a36",
        "data-tooltip": `${translateText("累计收货金额")}: ${capexPlanMillions(point.value, 2)}`
      }));
      if (index % totalLabelStride !== 0 && index !== totalLabels.length - 1) return;
      appendDataLabel(svg, {
        x: point.x,
        y: point.y - 12,
        "text-anchor": "middle",
        class: "capex-plan-total-label"
      }, point.value, capexPlanMillions(point.value));
    });
  }

  function renderCapexPlanGauge() {
    const container = document.getElementById("capex-plan-ungr-gauge");
    const value = data.capex.plan.ungrValue, maximum = data.capex.plan.assigned2026;
    const ratio = maximum > 0 ? value / maximum : 0;
    const width = Math.max(container.clientWidth - 14, 220), height = Math.max(container.clientHeight - 12, 225);
    const svg = createSvg(container, width, height, "未交付采购订单");
    svg.style.width = "100%"; svg.style.height = height+"px";
    const cx=width/2,cy=height*.43,radius=Math.min(width*.37,height*.3);
    const track=svgElement("circle",{cx,cy,r:radius,fill:"none",stroke:"#e3e6ef","stroke-width":16});
    const progress=svgElement("circle",{cx,cy,r:radius,fill:"none",stroke:"#171276","stroke-width":16,"stroke-linecap":"round",pathLength:100,"stroke-dasharray":Math.min(1,ratio)*100+" 100",transform:"rotate(-90 "+cx+" "+cy+")"});
    addTooltip(progress,"未交付采购订单",value,amount=>capexPlanMillions(amount,2));svg.append(track,progress);
    appendDataLabel(svg,{x:cx,y:cy+2,"text-anchor":"middle",class:"capex-plan-gauge-value"},value,capexPlanMillions(value,2));
    svg.append(svgElement("text",{x:cx,y:cy+25,"text-anchor":"middle",class:"capex-plan-gauge-caption"},state.language==="zh"?"未交付金额":"Open delivery value"));
    svg.append(svgElement("text",{x:cx,y:cy+radius+40,"text-anchor":"middle",class:"capex-plan-gauge-ratio"},(ratio*100).toFixed(1)+"%"));
    svg.append(svgElement("text",{x:cx,y:cy+radius+61,"text-anchor":"middle",class:"capex-plan-gauge-caption"},(state.language==="zh"?"占已分配金额 ":"of assigned ")+capexPlanMillions(maximum,2)));
  }

  function renderCapexPlanTable() {
    const orders = data.capex.purchaseOrders.filter(
      row => Number(row.openDeliveryValue) > 0
    );
    const isOverdue = row => {
      if (!row.fctGrMonth) return false;
      const forecastDate = new Date(`${row.fctGrMonth}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !Number.isNaN(forecastDate.getTime()) && forecastDate < today;
    };
    const amountFormat = new Intl.NumberFormat(
      state.language === "zh" ? "zh-CN" : "en-US",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    );
    const headers = [
      { key: "wbs", label: "WBS" },
      { key: "purchaseOrder", label: "PO" },
      {
        key: "description",
        label: "短文本",
        render: (value, row) => isOverdue(row)
          ? element("span", { class: "capex-overdue-value" }, value)
          : value
      },
      { key: "requisitioner", label: "申请人" },
      {
        key: "netOrderValueCny",
        label: state.language === "zh"
          ? `未交付金额 (${state.currency})`
          : `Open Delivery Value (${state.currency})`,
        numeric: true,
        render: value => amountFormat.format(convertCurrency(value))
      },
      {
        key: "fctGrMonth",
        label: "预计收货日期",
        render: (value, row) => isOverdue(row)
          ? element("span", { class: "capex-overdue-value" }, value)
          : value
      }
    ];
    const table = makeTable(headers, orders);
    const footer = element("tfoot");
    const totalRow = element("tr", { class: "capex-plan-total-row" });
    totalRow.append(element("td", { colspan: "4" }, translateText("合计")));
    totalRow.append(element("td", { class: "numeric" },
      amountFormat.format(convertCurrency(sum(orders, "netOrderValueCny")))));
    totalRow.append(element("td"));
    footer.append(totalRow);
    table.append(footer);
    document.getElementById("capex-gr-plan-table").replaceChildren(table);
  }

  function renderCapexPlan() {
    renderCapexPlanLegend();
    renderCapexPlanTrend();
    renderCapexPlanGauge();
    renderCapexPlanTable();
  }

  function selectedBreakdowns() {
    return data.breakdowns.filter(row =>
      matchesSelection(state.year, row.year) &&
      matchesSelection(state.month, row.month) &&
      matchesSelection(state.equipment, row.equipment)
    );
  }

  function renderBreakdownTrend(rows) {
    const container = document.getElementById("breakdown-trend-chart");
    const chartRows = rows.filter(row => row.year && row.month);
    if (!chartRows.length) return drawEmpty(container);

    const selectedYears = data.breakdowns
      .filter(row => matchesSelection(state.year, row.year))
      .map(row => Number(row.year))
      .filter(Number.isFinite);
    const currentYear = Math.max(...selectedYears);
    const months = [...new Set(chartRows.map(row => Number(row.month)))]
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
    const monthlyValues = new Map(months.map(month => [
      month,
      sum(chartRows.filter(row => Number(row.month) === month), "recordedDowntime")
    ]));
    const ytdValues = new Map(months.map(month => [
      month,
      sum(data.breakdowns.filter(row =>
        Number(row.year) === currentYear && Number(row.month) <= month
      ), "recordedDowntime")
    ]));
    const width = Math.max(container.clientWidth - 14, 300);
    const height = Math.max(container.clientHeight - 22, 175);
    const left = 44;
    const right = 46;
    const top = 18;
    const bottom = 36;
    const plotHeight = height - top - bottom;
    const plotWidth = width - left - right;
    const maxMonthly = Math.max(15, Math.ceil(Math.max(0, ...monthlyValues.values()) / 5) * 5);
    const maxYtd = Math.max(20, Math.ceil(Math.max(0, ...ytdValues.values()) / 20) * 20);
    const downtimeLabelFormat = new Intl.NumberFormat(
      state.language === "zh" ? "zh-CN" : "en",
      { maximumFractionDigits: 1 }
    );
    const svg = createSvg(
      container,
      width,
      height,
      "各类型工单业务中断停机时间（MTH）与年累计停机时间"
    );
    const pointX = index => left + plotWidth * (index + 0.5) / months.length;
    const pointY = value => top + plotHeight * (1 - value / maxYtd);

    for (let tick = 0; tick <= maxMonthly / 5; tick++) {
      const ratio = tick / (maxMonthly / 5);
      const y = top + plotHeight * ratio;
      addGrid(svg, left, y, width - right);
      svg.append(svgElement("text", {
        x: left - 6,
        y: y + 3,
        "text-anchor": "end",
        class: "svg-value"
      }, numberFormat.format(Math.round(maxMonthly * (1 - ratio)))));
    }
    for (let value = 0; value <= maxYtd; value += 20) {
      const y = top + plotHeight * (1 - value / maxYtd);
      svg.append(svgElement("text", {
        x: width - right + 6,
        y: y + 3,
        "text-anchor": "start",
        class: "svg-value"
      }, numberFormat.format(value)));
    }

    const thresholdY = top + plotHeight * (1 - 14 / maxMonthly);
    svg.append(svgElement("line", {
      x1: left,
      y1: thresholdY,
      x2: width - right,
      y2: thresholdY,
      stroke: "#7a82b2",
      "stroke-width": 1.5,
      "stroke-dasharray": "3 4",
      "data-threshold": "14"
    }));
    addTooltip(
      svg.lastElementChild,
      translateText("停机时间阈值 = 14 小时"),
      14,
      amount => `${downtimeLabelFormat.format(amount)} h`
    );

    const barWidth = Math.max(4, Math.min(34, plotWidth / months.length * 0.66));
    months.forEach((month, index) => {
      const value = monthlyValues.get(month) || 0;
      const center = pointX(index);
      const barY = top + plotHeight * (1 - value / maxMonthly);
      const bar = svgElement("rect", {
        x: center - barWidth / 2,
        y: barY,
        width: barWidth,
        height: Math.max(1, top + plotHeight - barY),
        rx: 2,
        fill: value > 14 ? "#d94350" : "#cbd3eb",
        class: "svg-bar"
      });
      const monthLabel = new Intl.DateTimeFormat(
        state.language === "zh" ? "zh-CN" : "en",
        { month: state.language === "zh" ? "long" : "short" }
      ).format(new Date(2000, month - 1, 1));
      addTooltip(
        bar,
        `${monthLabel} · ${translateText("月度停机时间（小时）")}`,
        value,
        amount => `${preciseNumberFormat.format(amount)} h`
      );
      svg.append(bar);
      appendDataLabel(svg, {
        x: center,
        y: Math.max(12, barY - 16),
        "text-anchor": "middle",
        class: "svg-value"
      }, value, downtimeLabelFormat.format(value));
      svg.append(svgElement("text", {
        x: center,
        y: height - 12,
        "text-anchor": "middle",
        class: "svg-category"
      }, monthLabel));
    });

    const linePath = months.map((month, index) =>
      `${index ? "L" : "M"}${pointX(index)},${pointY(ytdValues.get(month) || 0)}`
    ).join(" ");
    svg.append(svgElement("path", {
      d: linePath,
      fill: "none",
      stroke: "#11117a",
      "stroke-width": 2.5,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }));
    months.forEach((month, index) => {
      const value = ytdValues.get(month) || 0;
      const point = svgElement("circle", {
        cx: pointX(index),
        cy: pointY(value),
        r: 3.5,
        fill: "#11117a",
        stroke: "#fff",
        "stroke-width": 1.5,
        class: "svg-point"
      });
      const monthLabel = new Intl.DateTimeFormat(
        state.language === "zh" ? "zh-CN" : "en",
        { month: state.language === "zh" ? "long" : "short" }
      ).format(new Date(2000, month - 1, 1));
      addTooltip(
        point,
        `${monthLabel} · ${translateText("年累计停机时间（小时）")}`,
        value,
        amount => `${preciseNumberFormat.format(amount)} h`
      );
      svg.append(point);
    });

    const legend = element("div", { class: "chart-legend multi-series-legend" });
    for (const [label, color, className, style] of [
      ["月度停机时间 ≤ 14 小时", "#cbd3eb", "legend-swatch column-swatch", ""],
      ["月度停机时间 > 14 小时", "#d94350", "legend-swatch column-swatch", ""],
      ["停机时间阈值 = 14 小时", "#7a82b2", "legend-swatch", "background:transparent;border-top:1.5px dashed #7a82b2;border-radius:0;height:0;width:12px"],
      ["年累计停机时间（小时）", "#11117a", "legend-swatch", ""]
    ]) {
      const item = element("span", { class: "legend-item" });
      item.append(element("i", {
        class: className,
        style: style || `background:${color}`
      }));
      item.append(document.createTextNode(translateText(label)));
      legend.append(item);
    }
    container.append(legend);
    svg.style.height = `${Math.max(160, container.clientHeight - legend.offsetHeight - 8)}px`;
  }

  function renderBreakdown() {
    const rows = selectedBreakdowns();
    setKpiText("breakdown-count", numberFormat.format(rows.length));
    setKpiText("breakdown-equipment", numberFormat.format(new Set(rows.map(row => row.equipment).filter(item => item !== "Unmapped")).size));
    setKpiText("breakdown-hours", `${numberFormat.format(Math.round(sum(rows, "recordedDowntime")))} h`);
    setKpiText("breakdown-orders", numberFormat.format(new Set(rows.map(row => row.order).filter(item => item !== "Unmapped")).size));
    renderBreakdownTrend(rows);
    const equipmentCounts = new Map();
    for (const row of rows) {
      if (!isMappedLabel(row.equipmentName)) continue;
      const key = row.equipmentName;
      equipmentCounts.set(key, (equipmentCounts.get(key) || 0) + (Number(row.recordedDowntime) || 0));
    }
    renderBars(
      "breakdown-equipment-chart",
      [...equipmentCounts].map(([label, value]) => ({ label, key: label, value })),
      null,
      {
        color: "#11117a",
        label: "各类型工单业务中断停机时间",
        formatAxis: value => numberFormat.format(Math.round(value)),
        formatValue: value => new Intl.NumberFormat(
          state.language === "zh" ? "zh-CN" : "en",
          { maximumFractionDigits: 1 }
        ).format(value),
        formatTooltip: value => `${preciseNumberFormat.format(value)} h`,
        showAllLabels: true,
        showAllValues: true
      }
    );
    const bQuery = (state.workOrderQuery || "").trim().toLowerCase();
    const tableRows = bQuery
      ? rows.filter(r =>
          String(r.order || "").toLowerCase().includes(bQuery) ||
          String(r.description || "").toLowerCase().includes(bQuery) ||
          String(r.equipmentName || "").toLowerCase().includes(bQuery) ||
          String(r.functionalLocation || "").toLowerCase().includes(bQuery)
        )
      : rows;
    const container = document.getElementById("breakdown-table");
    container.replaceChildren(makeTable([
      { key: "year", label: "财年" },
      { key: "month", label: "月份" },
      { key: "order", label: "工单" },
      { key: "description", label: "故障描述" },
      { key: "equipmentName", label: "设备名称" },
      { key: "functionalLocation", label: "功能位置" },
      { key: "recordedDowntime", label: "记录停机时间", numeric: true, render: value => numberFormat.format(value) },
      { key: "rca", label: "RCA / PDCA" }
    ], tableRows));
  }

  function getStatusRows() {
    return getSelectedWorkOrderStatus();
  }

  function renderWorkOrderStatus() {
    const rows = getStatusRows();
    renderWorkOrderChart("wo-all-chart", rows, {
      backlog: "overdue",
      late: "late",
      onTime: "onTime",
      group: "all",
      label: "所有工单未完成数及按时完成率"
    });
    renderWorkOrderChart("wo-critical-chart", rows, {
      backlog: "criticalOverdue",
      late: "criticalLate",
      onTime: "criticalOnTime",
      group: "critical",
      label: "关键工单未完成数及按时完成率"
    });
    renderWorkOrderChart("wo-preventive-chart", rows, {
      backlog: "pmOverdue",
      late: "pmLate",
      onTime: "pmOnTime",
      group: "preventive",
      label: "预防工单未完成数及按时完成率"
    });
  }

  function renderWorkOrderChart(containerId, rows, measure) {
    const container = document.getElementById(containerId);
    const periods = new Map();
    for (const row of rows) {
      const key = `${row.year}-${row.month}`;
      const period = periods.get(key) || {
        year: Number(row.year),
        month: Number(row.month),
        backlog: 0,
        late: 0,
        onTime: 0
      };
      period.backlog += Number(row[measure.backlog]) || 0;
      period.late += Number(row[measure.late]) || 0;
      period.onTime += Number(row[measure.onTime]) || 0;
      periods.set(key, period);
    }
    const values = [...periods.values()]
      .filter(row => row.backlog + row.late + row.onTime > 0)
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map(row => ({
        ...row,
        total: row.backlog + row.late + row.onTime,
        rate: (row.onTime + row.late + row.backlog)
          ? row.onTime / (row.onTime + row.late + row.backlog) * 100
          : 0,
        label: `${row.year}-${String(row.month).padStart(2, "0")}`
      }));
    if (!values.length) return drawEmpty(container);

    const width = Math.max(container.clientWidth - 14, 300);
    const height = Math.max(container.clientHeight - 22, 175);
    const left = 44;
    const right = 42;
    const top = 24;
    const bottom = 35;
    const plotHeight = height - top - bottom;
    const plotWidth = width - left - right;
    const maxTotal = Math.max(...values.map(row => row.total));
    const tickStep = maxTotal <= 150 ? 50 : maxTotal <= 250 ? 50 : 100;
    const maxCount = Math.max(tickStep, Math.ceil(maxTotal / tickStep) * tickStep);
    const svg = createSvg(container, width, height, measure.label);
    svg.style.width = "100%";
    svg.style.height = "100%";
    const categoryWidth = plotWidth / values.length;
    const barWidth = Math.max(5, Math.min(42, categoryWidth * 0.58));
    const baseline = top + plotHeight;
    const yCount = value => baseline - (value / maxCount) * plotHeight;
    const yRate = value => baseline - (value / 100) * plotHeight;
    const monthFormatter = new Intl.DateTimeFormat(
      state.language === "zh" ? "zh-CN" : "en",
      { month: state.language === "zh" ? "long" : "short" }
    );

    for (let value = 0; value <= maxCount; value += tickStep) {
      const y = yCount(value);
      addGrid(svg, left, y, width - right);
      svg.append(svgElement("text", {
        x: left - 7,
        y: y + 3,
        "text-anchor": "end",
        class: "svg-value"
      }, numberFormat.format(value)));
    }
    for (let value = 0; value <= 100; value += 20) {
      svg.append(svgElement("text", {
        x: width - right + 6,
        y: yRate(value) + 3,
        "text-anchor": "start",
        class: "svg-value"
      }, `${value}%`));
    }

    const stackedColors = {
      backlog: "#f36c3d",
      late: "#cfd5eb",
      onTime: "#15117b"
    };
    values.forEach((row, index) => {
      const center = left + categoryWidth * (index + 0.5);
      let segmentBottom = baseline;
      for (const key of ["backlog", "late", "onTime"]) {
        const value = row[key];
        if (value <= 0) continue;
        const segmentHeight = value / maxCount * plotHeight;
        const segment = svgElement("rect", {
          x: center - barWidth / 2,
          y: segmentBottom - segmentHeight,
          width: barWidth,
          height: Math.max(segmentHeight, 1),
          fill: stackedColors[key],
          class: "svg-bar"
        });
        const metricLabel = translateText(
          key === "backlog" ? `积压（${measure.group === "all" ? "全部" : measure.group === "critical" ? "关键" : "预防"}）`
            : key === "late" ? `逾期完成（${measure.group === "all" ? "全部" : measure.group === "critical" ? "关键" : "预防"}）`
              : `按时完成（${measure.group === "all" ? "全部" : measure.group === "critical" ? "关键" : "预防"}）`
        );
        addTooltip(
          segment,
          `${row.label} · ${metricLabel}`,
          value,
          amount => numberFormat.format(Math.round(amount))
        );
        svg.append(segment);
        segmentBottom -= segmentHeight;
      }

      const totalLabel = numberFormat.format(Math.round(row.total));
      const labelWidth = Math.max(25, totalLabel.length * 6 + 8);
      const labelY = Math.max(4, yCount(row.total) - 18);
      svg.append(svgElement("rect", {
        x: center - labelWidth / 2,
        y: labelY,
        width: labelWidth,
        height: 15,
        rx: 2,
        fill: "#fff",
        stroke: "#dfe3ec",
        "stroke-width": .7,
        opacity: .98
      }));
      appendDataLabel(svg, {
        x: center,
        y: labelY + 10.5,
        "text-anchor": "middle",
        class: "svg-value"
      }, row.total, totalLabel);
      svg.append(svgElement("text", {
        x: center,
        y: height - 11,
        "text-anchor": "middle",
        class: "svg-category"
      }, monthFormatter.format(new Date(2000, row.month - 1, 1))));
    });

    const linePoints = values.map((row, index) => ({
      x: left + categoryWidth * (index + 0.5),
      y: yRate(row.rate),
      row
    }));
    let linePath = `M${linePoints[0].x},${linePoints[0].y}`;
    for (let index = 1; index < linePoints.length; index++) {
      const previous = linePoints[index - 1];
      const current = linePoints[index];
      const middleX = (previous.x + current.x) / 2;
      linePath += ` C${middleX},${previous.y} ${middleX},${current.y} ${current.x},${current.y}`;
    }
    svg.append(svgElement("path", {
      d: linePath,
      fill: "none",
      stroke: "#800080",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }));
    linePoints.forEach(point => {
      const hitArea = svgElement("circle", {
        cx: point.x,
        cy: point.y,
        r: 7,
        fill: "transparent"
      });
      addTooltip(
        hitArea,
        `${point.row.label} · ${translateText(`按时完成率（${measure.group === "all" ? "全部" : measure.group === "critical" ? "关键" : "预防"}）`)}`,
        point.row.rate,
        percentage
      );
      svg.append(hitArea);
    });

    const groupWord = measure.group === "all" ? "全部" : measure.group === "critical" ? "关键" : "预防";
    const legend = element("div", { class: "chart-legend multi-series-legend" });
    const series = [
      [`积压（${groupWord}）`, stackedColors.backlog, "column-swatch"],
      [`逾期完成（${groupWord}）`, stackedColors.late, "column-swatch"],
      [`按时完成（${groupWord}）`, stackedColors.onTime, "column-swatch"],
      [`按时完成率（${groupWord}）`, "#800080", ""]
    ];
    for (const [label, color, extraClass] of series) {
      const item = element("span", { class: "legend-item" });
      item.append(element("i", {
        class: `legend-swatch ${extraClass}`.trim(),
        style: `background:${color}`
      }));
      item.append(document.createTextNode(translateText(label)));
      legend.append(item);
    }
    container.append(legend);
    svg.style.height = `${Math.max(145, container.clientHeight - legend.offsetHeight - 8)}px`;
  }

  function selectCurrentWorkOrderMonth() {
    const now = new Date();
    state.year = ["2026"];
    state.month = [String(now.getMonth() + 1)];
    state.yearFilterTouched = true;
    state.selection = null;
  }

  function selectDefaultEnergyPeriod() {
    state.year = ["2024", "2025", "2026"];
    state.month = [];
    state.yearFilterTouched = true;
    state.selection = null;
  }

  function restoreViewYearFilter(previousView, nextView) {
    if (previousView === nextView) return;
    if (previousView) {
      viewYearFilters.set(previousView, {
        year: [...state.year], touched: state.yearFilterTouched
      });
    }
    if (nextView === "dailyWO") selectCurrentWorkOrderMonth();
    if (nextView === "energy") selectDefaultEnergyPeriod();
    const saved = viewYearFilters.get(nextView);
    state.year = [...(saved?.year ?? (nextView === "energy" ? ["2024", "2025", "2026"] : ["2026"]))];
    state.yearFilterTouched = saved?.touched ?? false;
    if (state.selection?.field === "year") state.selection = null;
  }

  function renderDailyWorkOrders() {
    const rows=(data.workOrderSchedule||[]).filter(row=>matchesSelection(state.year,row.year)&&matchesSelection(state.month,row.month));
    renderDailyScheduleChart(rows);
    window.EngineeringReportViews.dailySummary(document.getElementById('daily-schedule-table'),rows,{language:state.language,translate:translateText,percentage,number:numberFormat});
  }

  function renderDailyScheduleChart(rows) {
    const container = document.getElementById("daily-schedule-chart");
    if (!rows.length) return drawEmpty(container);

    const stateValues = new Map(
      ["Done", "Not started", "Ongoing", "Unplanned", "Total"].map(state => [
        state,
        Array.from({ length: 31 }, (_, index) => rows
          .filter(row => row.state === state)
          .reduce((total, row) => total + (Number(row[`day${index + 1}`]) || 0), 0))
      ])
    );
    const dayCount = Math.max(...rows.map(row => new Date(Number(row.year), Number(row.month), 0).getDate()));
    const days = Array.from({ length: dayCount }, (_, index) => index + 1);
    const rateValues = days.map((_, index) => {
      const total = stateValues.get("Total")[index];
      const completed = stateValues.get("Done")[index] + stateValues.get("Unplanned")[index];
      return total ? completed / total * 100 : 0;
    });
    const totalValues = days.map((_, index) =>
      ["Done", "Not started", "Ongoing", "Unplanned"]
        .reduce((total, state) => total + stateValues.get(state)[index], 0)
    );
    const maxTotal = Math.max(0, ...totalValues);
    const tickStep = Math.max(5, Math.ceil(maxTotal / 6 / 5) * 5);
    const maxCount = Math.max(tickStep, Math.ceil(maxTotal / tickStep) * tickStep);
    const width = Math.max(container.clientWidth - 14, 300);
    const height = Math.max(container.clientHeight - 22, 240);
    const left = 43;
    const right = 43;
    const top = 36;
    const bottom = 34;
    const plotHeight = height - top - bottom;
    const plotWidth = width - left - right;
    const categoryWidth = plotWidth / days.length;
    const barWidth = Math.max(3, Math.min(20, categoryWidth * 0.68));
    const baseline = top + plotHeight;
    const yCount = value => baseline - value / maxCount * plotHeight;
    const yRate = value => baseline - value / 100 * plotHeight;
    const svg = createSvg(container, width, height, "每日维护工单概览");
    svg.style.width = "100%";
    svg.style.height = "100%";

    for (let value = 0; value <= maxCount; value += tickStep) {
      const y = yCount(value);
      addGrid(svg, left, y, width - right);
      svg.append(svgElement("text", {
        x: left - 6,
        y: y + 3,
        "text-anchor": "end",
        class: "svg-value"
      }, numberFormat.format(value)));
    }
    for (let value = 0; value <= 100; value += 20) {
      svg.append(svgElement("text", {
        x: width - right + 6,
        y: yRate(value) + 3,
        "text-anchor": "start",
        class: "svg-value"
      }, `${value}%`));
    }

    const stack = [
      { state: "Done", color: "#15117b" },
      { state: "Not started", color: "#a9c7e5" },
      { state: "Ongoing", color: "#5b9bd5" },
      { state: "Unplanned", color: "#f5999b" }
    ];
    days.forEach((day, index) => {
      const center = left + categoryWidth * (index + 0.5);
      let segmentBottom = baseline;
      for (const item of stack) {
        const value = stateValues.get(item.state)[index];
        if (value <= 0) continue;
        const segmentHeight = value / maxCount * plotHeight;
        const bar = svgElement("rect", {
          x: center - barWidth / 2,
          y: segmentBottom - segmentHeight,
          width: barWidth,
          height: Math.max(1, segmentHeight),
          fill: item.color,
          class: "svg-bar"
        });
        addTooltip(
          bar,
          `${state.language === "zh" ? `第${day}日` : `Day ${day}`} · ${translateText(item.state)}`,
          value,
          amount => numberFormat.format(amount)
        );
        svg.append(bar);
        segmentBottom -= segmentHeight;
      }

      const total = totalValues[index];
      const showPointLabels = categoryWidth >= 25 || day % 5 === 1 || day === 31;
      if (total > 0 && showPointLabels) {
        const totalLabel = numberFormat.format(total);
        const preferredY = Math.max(12, yCount(total) - 16);
        const labelTop = preferredY - 10;
        const labelBottom = preferredY + 2;
        const labelWidth = totalLabel.length * 6 + 8;
        const intersectedColumnTop = days.reduce((highestTop, _, columnIndex) => {
          const columnTotal = totalValues[columnIndex];
          const columnCenter = left + categoryWidth * (columnIndex + 0.5);
          const columnTop = yCount(columnTotal);
          const overlapsHorizontally = Math.abs(columnCenter - center) <
            (barWidth + labelWidth) / 2;
          const overlapsVertically = labelTop < baseline && labelBottom > columnTop;
          return columnTotal > 0 && overlapsHorizontally && overlapsVertically
            ? Math.min(highestTop, columnTop)
            : highestTop;
        }, Number.POSITIVE_INFINITY);
        const labelY = Number.isFinite(intersectedColumnTop)
          ? Math.min(preferredY, intersectedColumnTop - 8)
          : preferredY;
        appendDataLabel(svg, {
          x: center,
          y: labelY,
          "text-anchor": "middle",
          class: "svg-value"
        }, total, totalLabel);
      }
      svg.append(svgElement("text", {
        x: center,
        y: height - 11,
        "text-anchor": "middle",
        class: "svg-category"
      }, String(day)));
    });

    let linePath = days.map((_, index) => {
      const x = left + categoryWidth * (index + 0.5);
      const y = yRate(rateValues[index]);
      return `${index ? "L" : "M"}${x},${y}`;
    }).join(" ");
    svg.append(svgElement("path", {
      d: linePath,
      fill: "none",
      stroke: "#15117b",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }));
    days.forEach((day, index) => {
      const x = left + categoryWidth * (index + 0.5);
      const y = yRate(rateValues[index]);
      const rate = rateValues[index];
      const point = svgElement("circle", {
        cx: x,
        cy: y,
        r: 7,
        fill: "transparent"
      });
      addTooltip(
        point,
        `${state.language === "zh" ? `第${day}日` : `Day ${day}`} · ${translateText("完成率")}`,
        rate,
        percentage
      );
      svg.append(point);
      if (categoryWidth >= 25 || day % 5 === 1 || day === 31) {
        const label = `${Math.round(rate)}%`;
        const preferredY = rate >= 96 ? y + 14 : y - 6;
        const labelTop = preferredY - 10;
        const labelBottom = preferredY + 2;
        const labelWidth = label.length * 6 + 8;
        const intersectedColumnTop = days.reduce((highestTop, _, columnIndex) => {
          const columnTotal = totalValues[columnIndex];
          const columnCenter = left + categoryWidth * (columnIndex + 0.5);
          const columnTop = yCount(columnTotal);
          const overlapsHorizontally = Math.abs(columnCenter - x) <
            (barWidth + labelWidth) / 2;
          const overlapsVertically = labelTop < baseline && labelBottom > columnTop;
          return columnTotal > 0 && overlapsHorizontally && overlapsVertically
            ? Math.min(highestTop, columnTop)
            : highestTop;
        }, Number.POSITIVE_INFINITY);
        const labelY = Number.isFinite(intersectedColumnTop)
          ? Math.min(preferredY, intersectedColumnTop - 8)
          : preferredY;
        appendDataLabel(svg, {
          x,
          y: labelY,
          "text-anchor": "middle",
          class: "svg-value"
        }, rate, label);
      }
    });

    const legend = element("div", { class: "chart-legend multi-series-legend" });
    for (const item of [
      ...stack,
      { state: "Completed Rate", color: "#15117b", line: true }
    ]) {
      const entry = element("span", { class: "legend-item" });
      entry.append(element("i", {
        class: item.line ? "legend-swatch" : "legend-swatch column-swatch",
        style: item.line
          ? "background:transparent;border-top:2px solid #15117b;border-radius:0;height:0;width:12px"
          : `background:${item.color}`
      }));
      entry.append(document.createTextNode(translateText(item.state)));
      legend.append(entry);
    }
    container.append(legend);
    svg.style.height = `${Math.max(180, container.clientHeight - legend.offsetHeight - 8)}px`;
  }

  function renderEnergy() {
    const rows = getEnergyRows();
    setKpiText("energy-steam", numberFormat.format(Math.round(sum(rows, "steam"))));
    setKpiText("energy-power", numberFormat.format(Math.round(sum(rows, "power"))));
    setKpiText("energy-gas", numberFormat.format(Math.round(sum(rows, "naturalGas"))));
    setKpiText("energy-production", numberFormat.format(Math.round(sum(rows, "production"))));
    const chartRows = rows;
    const charts = [
      ["energy-power-chart", { key: "power", intensityKey: "powerPerKg", title: "Power/kwh" }],
      ["energy-gas-chart", { key: "naturalGas", intensityKey: "naturalGasPerKg", title: "Natural Gas/m3" }],
      ["energy-steam-chart", { key: "steam", intensityKey: "steamPerKg", title: "Steam/ton" }],
      ["energy-nitrogen-chart", { key: "nitrogen", intensityKey: "nitrogenPerKg", title: "Nitrogen/t" }],
      ["energy-domestic-wastewater-chart", { key: "domesticWastewater", intensityKey: "domesticWastewaterPerKg", title: "Domestic waste water/t" }],
      ["energy-industry-wastewater-chart", { key: "industryWastewater", intensityKey: "industryWastewaterPerKg", title: "Industry waste water/t" }],
      ["energy-city-water-chart", { key: "cityWater", intensityKey: "cityWaterPerKg", title: "City water/m3" }]
    ];
    charts.forEach(([containerId, config]) => renderEnergyUtilityChart(containerId, chartRows, config));
  }

  function render() {
    hideChartTooltip();
    const previousView = document.body.dataset.view;
    restoreViewYearFilter(previousView, state.view);
    document.body.dataset.view = state.view;
    if (previousView !== state.view) window.scrollTo({top: 0, behavior: "instant"});
    document.querySelector(".filter-bar").hidden = ["capexPlan", "home"].includes(state.view);
    document.querySelector(".period-chip").hidden = ["capexPlan", "home"].includes(state.view);
    refreshMonthLabels();
    refreshScopeLabels();
    for (const field of ["year", "month", "scope", "costType", "costElement", "orderType", "capexYear"]) {
      syncMultiPicker(field);
    }
    updateSelectionChip();

    for (const [view, details] of Object.entries(views)) {
      document.getElementById(`view-${view}`).hidden = state.view !== view;
      if (state.view === view) {
        document.getElementById("page-title").textContent = details.title;
        document.getElementById("breadcrumb-current").textContent = details.breadcrumb;
        document.getElementById("page-description").textContent = details.description;
        document.getElementById("page-description").hidden = !details.description;
      }
    }
    const maintenanceView = ["home", "overview", "area", "details"].includes(state.view);
    const dateFilterView = [
      "home", "overview", "area", "details",
      "breakdown", "workOrder", "dailyWO", "energy"
    ].includes(state.view);
    document.getElementById("year-filter").disabled = !dateFilterView;
    document.getElementById("month-filter").disabled = !dateFilterView;
    document.getElementById("scope-filter").disabled = !maintenanceView;
    document.getElementById("type-filter").disabled = !maintenanceView;
    document.getElementById("cost-element-filter").disabled = !maintenanceView;
    document.getElementById("order-type-filter").disabled = !maintenanceView;
    const filterSelectIds = {
      year: "year-filter",
      month: "month-filter",
      scope: "scope-filter",
      costType: "type-filter",
      costElement: "cost-element-filter",
      orderType: "order-type-filter"
    };
    for (const [field, selectId] of Object.entries(filterSelectIds)) {
      const select = document.getElementById(selectId);
      const picker = document.querySelector(`.multi-picker[data-filter="${field}"]`);
      picker.querySelector(".multi-picker-trigger").disabled = select.disabled;
    }
    document.querySelectorAll(".nav-item[data-view]").forEach(button => {
      button.classList.toggle("active", button.dataset.view === state.view);
      button.setAttribute("aria-current", button.dataset.view === state.view ? "page" : "false");
    });
    const activeNav = document.querySelector(`.nav-item[data-view="${state.view}"]`);
    if (activeNav) {
      const submenu = activeNav.closest(".nav-submenu");
      document.querySelectorAll(".nav-submenu").forEach(menu => {
        const active = menu === submenu;
        menu.hidden = !active;
        const toggle = document.querySelector(`.nav-group-toggle[data-nav-group="${menu.dataset.navSubmenu}"]`);
        toggle.setAttribute("aria-expanded", String(active));
      });
    }

    const allYears = sortedUnique([
      ...data.years,
      ...data.energy.map(row => row.year),
      ...data.workOrderStatus.map(row => row.year),
      ...data.workOrderSchedule.map(row => row.year),
      ...data.breakdowns.map(row => row.year)
    ]).map(String);
    const selectedYears = state.year.length === 0 ? allYears : state.year;
    const latestMonth = filteredActual().reduce((latest, row) => {
      const key = `${row.year}-${String(row.month).padStart(2, "0")}`;
      return key > latest ? key : latest;
    }, "");
    const monthFormatter = new Intl.DateTimeFormat(state.language === "zh" ? "zh-CN" : "en", {
      month: state.language === "zh" ? "long" : "short"
    });
    document.getElementById("period-label").textContent =
      state.month.length > 0
        ? `${selectedYears.join(" · ")} · ${state.month
          .map(month => monthFormatter.format(new Date(2026, Number(month) - 1, 1)))
          .join(", ")}`
        : latestMonth
          ? `${selectedYears.join(" · ")} · 截至 ${latestMonth}`
          : selectedYears.join(" · ");

    if (state.view === "home") renderHome();
    if (state.view === "overview") renderOverview();
    if (state.view === "area") renderAreaCharts();
    if (state.view === "details") renderDetails();
    if (state.view === "contracts") renderContracts();
    if (state.view === "capex") renderCapex();
    if (state.view === "capexPlan") renderCapexPlan();
    if (state.view === "breakdown") renderBreakdown();
    if (state.view === "workOrder") renderWorkOrderStatus();
    if (state.view === "dailyWO") renderDailyWorkOrders();
    if (state.view === "energy") renderEnergy();
    applyLanguage();
    renderCurrencyControl();
    document.dispatchEvent(new CustomEvent('engineering:render', { detail: { view: state.view, language: state.language, currency: state.currency } }));
  }

  function renderCurrencyControl() {
    const button = document.getElementById("currency-toggle");
    const label = document.getElementById("currency-rate-label");
    const annualChartUnit = document.getElementById("annual-chart-unit");
    const rate = Number(data.capex.plan.exchangeRates.CHF);
    const rateText = new Intl.NumberFormat(
      state.language === "zh" ? "zh-CN" : "en-US",
      { maximumFractionDigits: 6 }
    ).format(rate);
    button.textContent = state.currency;
    annualChartUnit.textContent = state.currency;
    button.setAttribute(
      "aria-label",
      state.language === "zh"
        ? `切换显示币种，当前为 ${state.currency}`
        : `Toggle display currency, currently ${state.currency}`
    );
    button.title = button.getAttribute("aria-label");
    label.textContent = state.language === "zh"
      ? `汇率：1 CNY = ${rateText} CHF`
      : `Rate: 1 CNY = ${rateText} CHF`;
  }


  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = element("div", { class: "toast-item" }, message);
    container.append(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(6px)";
      toast.style.transition = "all 0.2s ease";
      setTimeout(() => toast.remove(), 220);
    }, 2200);
  }

  function resetAllFilters() {
    state.year = ["2026"];
    state.yearFilterTouched = false;
    state.month = [];
    if (state.view === "dailyWO") selectCurrentWorkOrderMonth();
    if (state.view === "energy") selectDefaultEnergyPeriod();
    state.scope = [];
    state.costType = [];
    state.costElement = [];
    state.orderType = [];
    state.equipment = [];
    state.selection = null;
    state.contractQuery = "";
    state.workOrderQuery = "";
    const contractSearch = document.getElementById("contract-search");
    if (contractSearch) contractSearch.value = "";
    const breakdownSearch = document.getElementById("breakdown-search");
    if (breakdownSearch) breakdownSearch.value = "";
    render();
    showToast(state.language === "zh" ? "已重置所有筛选条件" : "All filters reset");
  }

  function initialize() {
    if (!data || !Array.isArray(data.actual) || !Array.isArray(data.budget)) {
      document.querySelector(".main-content").replaceChildren(
        element("section", { class: "snapshot-notice" },
          "无法加载 dashboard-data.js。请运行 build_data.py 重新生成本地数据。")
      );
      return;
    }
    const allYears = sortedUnique([
      ...data.years,
      ...data.energy.map(row => row.year),
      ...data.workOrderStatus.map(row => row.year),
      ...data.workOrderSchedule.map(row => row.year),
      ...data.breakdowns.map(row => row.year)
    ]).map(String);
    populateSelect(document.getElementById("year-filter"), allYears, "全部财年");
    populateSelect(
      document.getElementById("month-filter"),
      data.months.map(String),
      "全部月份"
    );
    populateSelect(
      document.getElementById("scope-filter"),
      sortedUnique(data.actual.map(row => row.scope)),
      "全部区域"
    );
    populateSelect(
      document.getElementById("type-filter"),
      sortedUnique(data.actual.map(row => row.costType)),
      "全部工单类型"
    );
    populateSelect(
      document.getElementById("cost-element-filter"),
      sortedUnique(data.actual.map(row => row.costElement)),
      "全部成本要素"
    );
    populateSelect(
      document.getElementById("order-type-filter"),
      sortedUnique(data.actual.map(row => row.orderType)),
      "全部订单类型"
    );
    const capexPlanYears = (data.capex.plan?.years || []).map(String);
    state.capexPlanYear = capexPlanYears.includes("2026")
      ? "2026"
      : capexPlanYears[capexPlanYears.length - 1] || "";
    const capexPlanYearSelect = document.getElementById("capex-plan-year");
    capexPlanYearSelect.replaceChildren(
      ...capexPlanYears.map(year => new Option(year, year))
    );
    capexPlanYearSelect.value = state.capexPlanYear;
    capexPlanYearSelect.addEventListener("change", () => {
      state.capexPlanYear = capexPlanYearSelect.value;
      render();
    });
    const capexYearSelect =
        document.getElementById(
            "capex-year-filter"
        );

    if (capexYearSelect) {

        capexYearSelect.replaceChildren(
            new Option("全部年份","all"),
            new Option("2026","2026"),
            new Option("2027","2027"),
            new Option("2028","2028"),
            new Option("2029","2029")
        );

        [...capexYearSelect.options]
            .forEach(option => {

                if (
                    state.capexYear.includes(
                        option.value
                    )
                ) {
                    option.selected = true;
                }

            });
        mountMultiPicker(
          document.getElementById(
              "capex-year-filter"
          ),
          "capexYear"
      );
    }
    // const capexYearSelect =
    //     document.getElementById("capex-year-filter");

    // if (capexYearSelect) {

    //     capexYearSelect.replaceChildren(
    //         new Option("2026","2026"),
    //         new Option("2027","2027"),
    //         new Option("2028","2028"),
    //         new Option("2029 ff","2029")
    //     );

    //     capexYearSelect.value =
    //         state.capexYear;

    //     capexYearSelect.addEventListener(
    //         "change",
    //         () => {

    //             state.capexYear =
    //                 capexYearSelect.value;

    //             renderCapex();

    //         }
    //     );
    // }
    mountMultiPicker(document.getElementById("year-filter"), "year");
    mountMultiPicker(document.getElementById("month-filter"), "month");
    mountMultiPicker(document.getElementById("scope-filter"), "scope");
    mountMultiPicker(document.getElementById("type-filter"), "costType");
    mountMultiPicker(document.getElementById("cost-element-filter"), "costElement");
    mountMultiPicker(document.getElementById("order-type-filter"), "orderType");

    document.querySelectorAll("[data-detail-action]").forEach(button => {
      button.addEventListener("click", () => {
        const action = button.dataset.detailAction;
        if (action === "ungr") showUngrdetails();
        if (action === "equipment") showEquipmentDetails();
        if (action === "capex-pr") {
          state.capexPrDetail = true;
          render();
        }
        if (action === "small-spending" || action === "improvement") {
          state.spendingDetail = action;
          render();
        }
      });
    });
    document.getElementById("detail-dialog-close").addEventListener("click", () => {
      document.getElementById("detail-dialog").close();
    });
    document.getElementById("spending-detail-back").addEventListener("click", () => {
      state.spendingDetail = null;
      render();
    });
    document.getElementById("capex-pr-detail-back").addEventListener("click", () => {
      state.capexPrDetail = false;
      render();
    });
    document.getElementById("nav-back").addEventListener("click", () => {
      setMobileMenu(false);
    });
    document.getElementById("top-equipment-count").addEventListener("change", renderAreaEquipmentTable);

    document.querySelectorAll(".nav-item[data-view]").forEach(button => {
      button.addEventListener("click", () => {
        state.view = button.dataset.view;
        state.spendingDetail = null;
        setMobileMenu(false);
        render();
      });
    });
    document.querySelectorAll(".nav-group-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const target = document.querySelector(`[data-nav-submenu="${button.dataset.navGroup}"]`);
        const open = target.hidden;
        document.querySelectorAll(".nav-submenu").forEach(menu => { menu.hidden = true; });
        document.querySelectorAll(".nav-group-toggle").forEach(toggle => toggle.setAttribute("aria-expanded", "false"));
        target.hidden = !open;
        button.setAttribute("aria-expanded", String(open));
      });
    });
    document.getElementById("menu-toggle").addEventListener("click", () => {
      setMobileMenu(!document.body.classList.contains("menu-open"));
    });
    document.getElementById("menu-backdrop").addEventListener("click", () => setMobileMenu(false));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") setMobileMenu(false);
    });

    const resetBtn = document.getElementById("global-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", resetAllFilters);
    }
    const contractSearch = document.getElementById("contract-search");
    if (contractSearch) {
      contractSearch.addEventListener("input", event => {
        state.contractQuery = event.target.value;
        renderContracts();
        applyLanguage();
      });
    }
    const breakdownSearch = document.getElementById("breakdown-search");
    if (breakdownSearch) {
      breakdownSearch.addEventListener("input", event => {
        state.workOrderQuery = event.target.value;
        renderBreakdown();
        applyLanguage();
      });
    }
    document.getElementById("language-toggle").addEventListener("click", () => {
      state.language = state.language === "zh" ? "en" : "zh";
      render();
      showToast(state.language === "zh" ? "已切换为中文" : "Switched to English");
    });
    document.getElementById("currency-toggle").addEventListener("click", () => {
      state.currency = state.currency === "CNY" ? "CHF" : "CNY";
      render();
      showToast(state.language === "zh" ? `显示币种已切换为 ${state.currency}` : `Currency switched to ${state.currency}`);
    });
    document.body.addEventListener("pointerover", event => {
      const target = event.target.closest?.("[data-tooltip]");
      if (target) showChartTooltip(target, event.clientX, event.clientY);
    });
    document.body.addEventListener("pointermove", event => {
      const target = event.target.closest?.("[data-tooltip]");
      if (target) showChartTooltip(target, event.clientX, event.clientY);
    });
    document.body.addEventListener("pointerout", event => {
      if (event.target.closest?.("[data-tooltip]") &&
          !event.relatedTarget?.closest?.("[data-tooltip]")) hideChartTooltip();
    });
    document.body.addEventListener("focusin", event => {
      const target = event.target.closest?.("[data-tooltip]");
      if (target) {
        const bounds = target.getBoundingClientRect();
        showChartTooltip(target, bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
      }
    });
    document.body.addEventListener("focusout", event => {
      if (event.target.closest?.("[data-tooltip]")) hideChartTooltip();
    });
    document.addEventListener("click", event => {
      if (event.target.closest(".multi-picker")) return;
      document.querySelectorAll(".multi-picker-menu").forEach(menu => { menu.hidden = true; });
      document.querySelectorAll(".multi-picker-trigger").forEach(button => button.setAttribute("aria-expanded", "false"));
    });
    document.getElementById("selection-chip").addEventListener("click", () => {
      if (state.selection?.field === "scope") state.scope = [];
      if (state.selection?.field === "equipment") state.equipment = [];
      state.selection = null;
      render();
    });

    const homeLangBtn = document.getElementById("home-language-toggle");
    if (homeLangBtn) {
      homeLangBtn.addEventListener("click", () => {
        state.language = state.language === "zh" ? "en" : "zh";
        render();
        showToast(state.language === "zh" ? "已切换为中文" : "Switched to English");
      });
    }
    let resizeFrame;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => render());
    });
    render();
  }

  document.addEventListener('engineering:navigate', event => {
    if (!Object.hasOwn(views, event.detail?.view)) return;
    state.view = event.detail.view;
    state.spendingDetail = null;
    setMobileMenu(false);
    render();
  });
  initialize();
})();
