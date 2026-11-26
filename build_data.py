import json
import re
from pathlib import Path

import pandas as pd


PROJECT_DIR = Path(__file__).resolve().parent
SOURCE_DIR = Path(
    r"C:\Users\bais\Givaudan International SA\Engineering - Opex"
)
WO_DIR = Path(
    r"C:\Users\bais\Givaudan International SA\STD_F&B_Changzhou_Site - 01. CZ daily meeting"
)
CAPEX_DIR = Path(
    r"C:\Users\bais\Givaudan International SA\Engineering - Capex Review Meetings"
)
# SOURCE_DIR = PROJECT_DIR / "data"
OUTPUT_FILE = PROJECT_DIR / "dashboard-data.js"
MONTHS = {
    name.upper(): index
    for index, name in enumerate(
        ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
        start=1,
    )
}


def clean_key(value):
    if pd.isna(value):
        return "Unmapped"
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value).strip() or "Unmapped"


def clean_text(value):
    if pd.isna(value):
        return ""
    if isinstance(value, (pd.Timestamp,)):
        return value.date().isoformat()
    return str(value).strip()


def number(value):
    if pd.isna(value):
        return 0.0
    return round(float(value), 2)


def parse_sap_number(value):
    if pd.isna(value):
        return 0.0
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).replace("\xa0", "").replace(" ", "").strip()
    if not text:
        return 0.0
    text = re.sub(r"[^0-9,.\-]", "", text)
    if "," in text:
        text = text.replace(".", "").replace(",", ".")
    elif text.count(".") > 1:
        text = text.replace(".", "")
    elif "." in text:
        left, right = text.split(".", 1)
        if len(right) == 3 and left.lstrip("-").isdigit() and right.isdigit():
            text = left + right
    try:
        return float(text)
    except ValueError:
        return 0.0


def month_year(value):
    if pd.isna(value):
        return None, None
    parts = str(value).split(".", maxsplit=1)
    if len(parts) != 2:
        return None, None
    try:
        month = int(float(parts[0]))
        year = int(float(parts[1]))
        return (month, year) if 1 <= month <= 12 else (None, None)
    except ValueError:
        return None, None


def records_from_frame(frame, fields, numeric=(), dates=()):
    records = []
    for _, row in frame.iterrows():
        item = {}
        for field in fields:
            value = row.get(field)
            if field in numeric:
                item[field] = number(value)
            elif field in dates:
                item[field] = clean_text(value)
            else:
                item[field] = clean_text(value)
        records.append(item)
    return records


def read_actual_data():
    relationship_file = SOURCE_DIR / "Relationship.XLSX"
    order_cost_dir = SOURCE_DIR / "Order Cost"
    monthly_files = sorted(
        path
        for path in order_cost_dir.glob("*.xls*")
        if re.fullmatch(r"\d{4}-\d{2}", path.stem)
    )
    if monthly_files:
        actual = pd.concat(
            (pd.read_excel(path) for path in monthly_files),
            ignore_index=True,
            sort=False,
        )
    else:
        source_file = order_cost_dir / "Work Order Cost.xlsx"
        if not source_file.exists():
            source_file = SOURCE_DIR / "Work Order Cost.xlsx"
        if not source_file.exists():
            raise FileNotFoundError(
                "No monthly YYYY-MM order-cost workbooks or Work Order Cost.xlsx found."
            )
        actual = pd.read_excel(source_file)
    relationships = pd.ExcelFile(relationship_file)

    cost_elements = pd.read_excel(relationship_file, sheet_name="Cost Element")
    order_types = pd.read_excel(relationship_file, sheet_name="Order Type")
    cost_centers = pd.read_excel(relationship_file, sheet_name="Cost Center")

    actual["costCenter"] = actual["Cost Center"].map(clean_key)
    centers = cost_centers.copy()
    centers["costCenter"] = centers["Cost Center"].map(clean_key)
    centers = centers.drop_duplicates("costCenter", keep="last")
    centers = centers.set_index("costCenter")
    actual["scope"] = actual["costCenter"].map(centers["Scope"]).map(clean_key)
    actual["area"] = actual["costCenter"].map(centers["CO object name"]).map(clean_key)

    cost_elements["Description"] = cost_elements["Description"].map(clean_key)
    actual["costElement"] = actual["Description.1"].map(
        cost_elements.set_index("Description")["Cost element"]
    ).map(clean_key)

    order_types["Order Type"] = order_types["Order Type"].map(clean_key)
    actual["orderType"] = actual["Order Type"].map(clean_key)
    actual["costType"] = actual["orderType"].map(
        order_types.set_index("Order Type")["Cost Type"]
    ).map(clean_key)

    period = actual["Posting Period"].map(month_year)
    actual["month"] = period.map(lambda item: item[0])
    actual["year"] = period.map(lambda item: item[1])
    actual["actual"] = pd.to_numeric(actual["Actual costs"], errors="coerce").fillna(0)
    actual["planned"] = pd.to_numeric(actual["Planned costs"], errors="coerce").fillna(0)

    group_fields = [
        "year",
        "month",
        "scope",
        "area",
        "costCenter",
        "costType",
        "orderType",
        "costElement",
    ]
    valid_actual = actual.dropna(subset=["year", "month"])
    summary_rows = actual[actual["year"].isna() | actual["month"].isna()]
    grouped = (
        valid_actual
        .groupby(group_fields, dropna=False)
        .agg(
            actual=("actual", "sum"),
            planned=("planned", "sum"),
            orders=("Order", "nunique"),
        )
        .reset_index()
    )
    grouped["year"] = grouped["year"].astype(int)
    grouped["month"] = grouped["month"].astype(int)
    grouped = grouped.rename(columns={"area": "costCenterName"})

    summary_row_info = {
        "count": int(len(summary_rows)),
        "actual": number(summary_rows["actual"].sum()),
    }
    detail_rows = actual.dropna(subset=["year", "month", "Order"]).copy()
    detail_rows["year"] = detail_rows["year"].astype(int)
    detail_rows["month"] = detail_rows["month"].astype(int)
    order_details = []
    for _, row in detail_rows.iterrows():
        order_details.append(
            {
                "year": int(row["year"]),
                "month": int(row["month"]),
                "order": clean_key(row["Order"]),
                "orderType": clean_text(row["Order Type"]),
                "costType": clean_text(row["costType"]),
                "description": clean_text(row["Description"]),
                "equipment": clean_key(row["Equipment"]),
                "costCenter": clean_text(row["costCenter"]),
                "scope": clean_text(row["scope"]),
                "costElement": clean_text(row["costElement"]),
                "valueCategory": clean_text(row["Value category"]),
                "activityType": clean_key(row["MaintActivityType"]),
                "currency": clean_text(row["Currency"]),
                "actual": number(row["actual"]),
                "planned": number(row["planned"]),
            }
        )
    return (
        actual,
        grouped,
        cost_centers,
        relationships,
        summary_row_info,
        order_details,
    )


def read_budget(cost_centers, relationships):
    centers = cost_centers.copy()
    centers["costCenter"] = centers["Cost Center"].map(clean_key)
    centers = centers.drop_duplicates("costCenter", keep="last").set_index("costCenter")

    identifier = pd.read_excel(
        SOURCE_DIR / "Relationship.XLSX", sheet_name="Cost Element Identifier"
    )
    identifier["Identifier"] = identifier["Identifier"].map(clean_key)
    element_map = identifier.set_index("Identifier")["Cost element"]

    frames = []
    for year in (2024, 2025, 2026):
        budget = pd.read_excel(SOURCE_DIR / "BU" / f"BU {year}.XLSX")
        budget["year"] = year
        budget["costCenter"] = budget["Cost Center"].map(clean_key)
        budget["scope"] = budget["costCenter"].map(centers["Scope"]).map(clean_key)
        budget["costCenterName"] = budget["costCenter"].map(
            centers["CO object name"]
        ).map(clean_key)
        budget["costElement"] = budget["Cost Element"].map(clean_key).map(element_map)
        budget["costElement"] = budget["costElement"].fillna(
            budget["Cost element descr."]
        ).map(clean_key)
        budget["budget"] = pd.to_numeric(
            budget["Total val. rep.crcy"], errors="coerce"
        ).fillna(0)
        frames.append(budget)

    combined = pd.concat(frames, ignore_index=True)
    grouped = (
        combined.groupby(
            ["year", "scope", "costCenter", "costCenterName", "costElement"],
            dropna=False,
        )["budget"]
        .sum()
        .reset_index()
    )
    grouped["year"] = grouped["year"].astype(int)
    return grouped


def read_contracts(relationships):
    if "CONTRACT" not in relationships.sheet_names:
        return []

    contracts = pd.read_excel(SOURCE_DIR / "Relationship.XLSX", sheet_name="CONTRACT")
    results = []
    for _, row in contracts.iterrows():
        item = {
            "id": clean_text(row.get("合同号")),
            "name": clean_text(row.get("合同名称")),
            "start": clean_text(row.get("开始")),
            "end": clean_text(row.get("结束")),
            "description": clean_text(row.get("Description")),
            "order": clean_text(row.get("WO(external service + external material)")),
            "annualBudget": {},
        }
        for year in range(2025, 2030):
            item["annualBudget"][str(year)] = number(row.get(str(year)))
        if item["id"] or item["name"]:
            results.append(item)
    return results


def read_equipment(relationships):
    frame = pd.read_excel(SOURCE_DIR / "Relationship.XLSX", sheet_name="Equipment IH08")
    fields = [
        "Equipment",
        "Description",
        "Functional Loc.",
        "Description7",
        "ABC indic.",
        "Object type",
        "Cost Center",
        "Main WorkCtr",
        "MaintPlant",
        "EquipCategory",
        "ConstructYear",
        "Gross Weight",
        "Vendor",
        "User status",
        "TechIdentNo.",
    ]
    output = []
    for _, row in frame.iterrows():
        output.append(
            {
                "equipment": clean_key(row.get("Equipment")),
                "description": clean_text(row.get("Description")),
                "functionalLocation": clean_text(row.get("Functional Loc.")),
                "area": clean_text(row.get("Description7")),
                "abc": clean_text(row.get("ABC indic.")),
                "objectType": clean_text(row.get("Object type")),
                "costCenter": clean_key(row.get("Cost Center")),
                "workCenter": clean_text(row.get("Main WorkCtr")),
                "plant": clean_text(row.get("MaintPlant")),
                "category": clean_text(row.get("EquipCategory")),
                "constructYear": clean_text(row.get("ConstructYear")),
                "weight": number(row.get("Gross Weight")),
                "vendor": clean_text(row.get("Vendor")),
                "status": clean_text(row.get("User status")),
                "technicalId": clean_text(row.get("TechIdentNo.")),
            }
        )
    return output


def read_work_order_status():
    frame = pd.read_excel(SOURCE_DIR / "WO" / "2026 WO.xlsx")
    records = []
    for _, row in frame.iterrows():
        month, year = month_year(row.get("Cal. year / month"))
        if month is None:
            continue
        records.append(
            {
                "year": year,
                "month": month,
                "plant": clean_text(row.get("Plant.")),
                "plantName": clean_text(row.get("Plant Name")),
                "total": number(row.get("Total Number WO")),
                "onTime": number(row.get("Completed\nOn Time")),
                "onTimeYtd": number(row.get("Completed\nOn Time (YTD)")),
                "late": number(row.get("Completed Late")),
                "overdue": number(row.get("Over\nDue")),
                "future": number(row.get("Futur Workload")),
                "releasedNotifications": number(
                    row.get('Total Number\n"released" Notifications\nNot assigned to a WO')
                ),
                "unreleasedNotifications": number(
                    row.get("Total Number Notifications\n(Not yet released)")
                ),
                "onTimeRate": number(row.get("On Time %")),
                "pmTotal": number(row.get("Total Number WO\n(ZPM3 + ZPM5)")),
                "pmOnTime": number(row.get("Completed On Time\n(ZPM3 + ZPM5)")),
                "pmLate": number(row.get("Completed Late\n(ZPM3 + ZPM5)")),
                "pmOverdue": number(row.get("Over Due\n(ZPM3 + ZPM5)")),
                "pmOnTimeRate": number(row.get("On Time %\n(ZPM3 + ZPM5)")),
                "criticalTotal": number(row.get("Total Number WO\n(Critical WOs)")),
                "criticalOnTime": number(row.get("Completed On Time\n(Critical WOs)")),
                "criticalLate": number(row.get("Completed Late\n(Critical WOs)")),
                "criticalOverdue": number(row.get("Over Due\n(Critical orders)")),
                "criticalOnTimeRate": number(row.get("On Time %\n(Critical WOs)")),
            }
        )
    return records


def read_work_order_schedule_summary():
    frame = pd.read_excel(
        WO_DIR / "2026 WO Schedule.xlsx",
        sheet_name="Summary",
        header=None,
    )
    state_order = ["Unplanned", "Not started", "Ongoing", "Done", "Total"]
    monthly_rows = {}
    for _, row in frame.iterrows():
        month_value = row.iloc[0]
        state = clean_text(row.iloc[1])
        if pd.isna(month_value) or state not in state_order:
            continue
        month = int(month_value)
        if month < 1 or month > 12:
            continue
        monthly_rows.setdefault(month, {})[state] = {
            f"day{day}": number(row.iloc[day + 1])
            for day in range(1, 32)
        }

    records = []
    for month, states in sorted(monthly_rows.items()):
        # Rebuild totals because cached Summary formulas can disagree with the state rows.
        states["Total"] = {
            f"day{day}": sum(
                states.get(state, {}).get(f"day{day}", 0)
                for state in state_order[:-1]
            )
            for day in range(1, 32)
        }
        for state in state_order:
            if state not in states:
                continue
            records.append(
                {
                    "year": 2026,
                    "month": month,
                    "state": state,
                    **states[state],
                }
            )

        done = states.get("Done", {})
        unplanned = states.get("Unplanned", {})
        total = states["Total"]
        records.append(
            {
                "year": 2026,
                "month": month,
                "state": "Completed Rate",
                **{
                    f"day{day}": (
                        (done.get(f"day{day}", 0) + unplanned.get(f"day{day}", 0))
                        / total[f"day{day}"]
                        if total[f"day{day}"]
                        else 0
                    )
                    for day in range(1, 32)
                },
            }
        )
    return records


def read_breakdown(equipment_names):
    frame = pd.read_excel(SOURCE_DIR / "Breakdown" / "Breakdown.xlsx")
    records = []
    for _, row in frame.iterrows():
        month, year = month_year(row.get("Cal. year / month"))
        records.append(
            {
                "year": year,
                "month": month,
                "order": clean_key(row.get("Order(IO)")),
                "description": clean_text(row.get("Description")),
                "equipment": clean_key(row.get("Equipment")),
                "equipmentName": equipment_names.get(
                    clean_key(row.get("Equipment")), ""
                ) or clean_text(row.get("Equipment Des")) or "设备未匹配",
                "equipmentDescription": clean_text(row.get("Equipment Des")),
                "functionalLocation": clean_text(row.get("Functional Location")),
                "recordedDowntime": number(row.get("生产记录停机时间")),
                "downtimeHours": number(
                    row.get(
                        "Downtime Hrs\nAll WO Types\nWith business interruption\nMTH"
                    )
                ),
                "rca": clean_text(
                    row.get(
                        "RCA/PDCA : V:\\Changzhou Operations\\50 Maintenance\\02 - "
                        "Daily Maintenance 日常维修\\0201 - PDCA"
                    )
                ),
            }
        )
    return records


def read_work_order_purchases():
    frame = pd.read_excel(SOURCE_DIR / "WO" / "ME2N_UnGR.XLSX")
    records = []
    for _, row in frame.iterrows():
        records.append(
            {
                "purchaseOrder": clean_key(row.get("Purchasing Document")),
                "plant": clean_text(row.get("Plant")),
                "vendor": clean_text(row.get("Vendor/supplying plant")),
                "item": clean_key(row.get("Item")),
                "description": clean_text(row.get("Short Text")),
                "date": clean_text(row.get("Document Date")),
                "currency": clean_text(row.get("Currency")),
                "orderValue": number(row.get("Net Order Value")),
                "openDeliveryValue": number(row.get("Still to be delivered (value)")),
                "openInvoiceValue": number(row.get("Still to be invoiced (val.)")),
                "requisitioner": clean_text(row.get("Requisitioner")),
            }
        )
    return records


def read_energy_data():
    utility_file = SOURCE_DIR / "Energy" / "utility consumption in cz site2026.xlsx"
    utility = pd.read_excel(utility_file, sheet_name="utility consumption")
    energy = []
    current_year = None
    for _, row in utility.iterrows():
        if pd.notna(row.iloc[0]):
            try:
                current_year = int(float(row.iloc[0]))
            except (TypeError, ValueError):
                current_year = None
        month_label = clean_text(row.iloc[1]).upper()
        month = MONTHS.get(month_label)
        if current_year is None or month is None:
            continue
        energy.append(
            {
                "year": current_year,
                "month": month,
                "totalCost": number(row.iloc[2]),
                "power": number(row.iloc[11]),
                "cda": number(row.iloc[20]),
                "nitrogen": number(row.iloc[33]),
                "domesticWastewater": number(row.iloc[3]),
                "industryWastewater": number(row.iloc[6]),
                "steam": number(row.iloc[47]),
                "naturalGas": number(row.iloc[62]),
                "cityWater": number(row.iloc[74]),
            }
        )

    volume = pd.read_excel(SOURCE_DIR / "Energy" / "CN18 Production Volume.xlsx")
    production = []
    for _, row in volume.iterrows():
        date = clean_text(row.get("Date"))
        parts = date.split("-", maxsplit=1)
        if len(parts) != 2:
            continue
        try:
            year, month = int(parts[0]), int(parts[1])
        except ValueError:
            continue
        production.append(
            {
                "year": year,
                "month": month,
                "LC": number(row.get("LC")),
                "OC": number(row.get("OC")),
                "FC": number(row.get("FC")),
                "SD": number(row.get("SD")),
                "total": number(row.get("Total")),
            }
        )

    production_by_period = {(row["year"], row["month"]): row for row in production}
    for row in energy:
        row["production"] = production_by_period.get((row["year"], row["month"]), {}).get(
            "total", 0
        )
        denominator = row["production"] * 1000
        for field in (
            "power",
            "naturalGas",
            "steam",
            "nitrogen",
            "domesticWastewater",
            "industryWastewater",
            "cityWater",
        ):
            row[f"{field}PerKg"] = round(row[field] / denominator, 8) if denominator else 0
    return energy, production


def read_capex_data():
    project_frame = pd.read_excel(SOURCE_DIR / "Capex" / "CJE0.xlsx", sheet_name="CJE0")
    status_file = CAPEX_DIR / "2026 CN18 Capex Status.xlsx"
    exchange_rate_frame = pd.read_excel(status_file, sheet_name="Currency")
    exchange_rates = {
        clean_text(row.get("Currency Code")).upper(): parse_sap_number(row.get("Rate"))
        for _, row in exchange_rate_frame.iterrows()
        if clean_text(row.get("Currency Code"))
    }
    exchange_rates.setdefault("USD", 0.1505)
    exchange_rates.setdefault("EUR", 0.1308)
    projects = []
    for _, row in project_frame.iterrows():
        project = clean_text(row.get("Object"))
        if not project.strip().startswith("PRJ "):
            continue
        projects.append(
            {
                "project": project.strip(),
                "name": clean_text(row.get("Unnamed: 1")),
                "budgetTotal": parse_sap_number(row.get("Budg in OC--Total")),
                "actualTotal": parse_sap_number(row.get("Act in OC--Total")),
                "committedTotal": parse_sap_number(row.get("Cmmt.in OC--Total")),
                "assignedTotal": parse_sap_number(row.get("Assigned--Total")),
                "availableTotal": parse_sap_number(row.get("Available--Total")),
                "budget2026": parse_sap_number(row.get("Budg in OC--2026")),
                "budget2027": parse_sap_number(row.get("Budg in OC--2027")),
                "budget2028": parse_sap_number(row.get("Budg in OC--2028")),
                "budget2029": parse_sap_number(row.get("Budg in OC--2029 ff")),
                "actual2026": parse_sap_number(row.get("Act in OC--2026")),
                "actual2027": parse_sap_number(row.get("Act in OC--2027")),
                "actual2028": parse_sap_number(row.get("Act in OC--2028")),
                "actual2029": parse_sap_number(row.get("Act in OC--2029 ff")),
                "committed2026": parse_sap_number(row.get("Cmmt.in OC--2026")),
                "committed2027": parse_sap_number(row.get("Cmmt.in OC--2027")),
                "committed2028": parse_sap_number(row.get("Cmmt.in OC--2028")),
                "committed2029": parse_sap_number(row.get("Cmmt.in OC--2029 ff")),
                "assigned2026": parse_sap_number(row.get("Assigned--2026")),
                "assigned2027": parse_sap_number(row.get("Assigned--2027")),
                "assigned2028": parse_sap_number(row.get("Assigned--2028")),
                "assigned2029": parse_sap_number(row.get("Assigned--2029 ff")),
                "available2026": parse_sap_number(row.get("Available--2026")),
                "available2027": parse_sap_number(row.get("Available--2027")),
                "available2028": parse_sap_number(row.get("Available--2028")),
                "available2029": parse_sap_number(row.get("Available--2029 ff")),
                "actOverall": parse_sap_number(row.get("Act in OC--Overall")),
            }
        )
    # print(project_frame.columns.tolist())

    actual_frame = pd.read_excel(SOURCE_DIR / "Capex" / "CJ74.XLSX")
    capex_actual = []
    for _, row in actual_frame.iterrows():
        capex_actual.append(
            {
                "project": clean_text(row.get("Project definition")),
                "wbs": clean_text(row.get("WBS Element")),
                "year": int(row["Fiscal Year"]) if pd.notna(row.get("Fiscal Year")) else None,
                "period": int(row["Period"]) if pd.notna(row.get("Period")) else None,
                "costElement": clean_text(row.get("Cost element descr.")),
                "purchaseOrder": clean_key(row.get("Purchasing Document")),
                "description": clean_text(row.get("Purchase order text")),
                "value": number(row.get("Vbl.Val./COCrcy")),
                "currency": clean_text(row.get("Object Currency")),
            }
        )

    def purchasing_file(filename):
        frame = pd.read_excel(SOURCE_DIR / "Capex" / filename)
        results = []
        for _, row in frame.iterrows():
            description = clean_text(row.get("Short Text"))
            currency = clean_text(row.get("Currency")).upper()
            open_delivery_value = parse_sap_number(
                row.get("Still to be delivered (value)")
            )
            rate = exchange_rates.get(currency)
            if open_delivery_value and (rate is None or rate == 0):
                raise ValueError(
                    f"{filename} has an open-delivery value in {currency or 'an unmapped currency'} "
                    "without an exchange rate."
                )
            document_date = pd.to_datetime(row.get("Document Date"), errors="coerce")
            forecast_gr_date = (
                document_date + pd.DateOffset(months=2)
                if pd.notna(document_date)
                else pd.NaT
            )
            results.append(
                {
                    "purchaseOrder": clean_key(row.get("Purchasing Document")),
                    "plant": clean_text(row.get("Plant")),
                    "vendor": clean_text(row.get("Vendor/supplying plant")),
                    "item": clean_key(row.get("Item")),
                    "description": description,
                    "wbs": description[:12],
                    "date": clean_text(document_date),
                    "fctGrMonth": clean_text(forecast_gr_date),
                    "currency": currency,
                    "orderValue": parse_sap_number(row.get("Net Order Value")),
                    "openDeliveryValue": open_delivery_value,
                    "netOrderValueCny": open_delivery_value / rate if rate else 0,
                    "openInvoiceValue": number(row.get("Still to be invoiced (val.)")),
                    "requisitioner": clean_text(row.get("Requisitioner")),
                }
            )
        return results

    requisitions_frame = pd.read_excel(SOURCE_DIR / "Capex" / "ME5A.XLSX")
    requisitions = []
    for _, row in requisitions_frame.iterrows():
        requisition_date = pd.to_datetime(row.get("Requisition Date"), errors="coerce")
        next_month_date = (
            requisition_date + pd.DateOffset(months=1)
            if pd.notna(requisition_date)
            else pd.NaT
        )
        requisitions.append(
            {
                "requisition": clean_key(row.get("Purchase Requisition")),
                "purchaseOrder": clean_key(row.get("Purchase order")),
                "description": clean_text(row.get("Short Text")),
                "vendor": clean_text(row.get("Name of Vendor")),
                "value": number(row.get("Total Value")),
                "currency": clean_text(row.get("Currency")),
                "deliveryDate": clean_text(row.get("Delivery Date")),
                "requisitionDate": (
                    requisition_date.strftime("%Y-%m-%d")
                    if pd.notna(requisition_date)
                    else ""
                ),
                "nextMonthDate": (
                    next_month_date.strftime("%Y-%m-%d")
                    if pd.notna(next_month_date)
                    else ""
                ),
                "requisitioner": clean_text(row.get("Requisitioner")),
            }
        )

    status_totals = pd.read_excel(status_file, sheet_name="SUMMARY")
    total_budget_rows = status_totals.loc[status_totals["WBS"] == "Total BU"]
    if total_budget_rows.empty:
        raise ValueError(f"{status_file.name} SUMMARY is missing the Total BU row.")
    total_budget = parse_sap_number(total_budget_rows.iloc[0].get("Budget Value CNY"))

    project_summary_frame = pd.read_excel(status_file, sheet_name="Overview CJE0")
    status_project_names = {
        clean_text(row.get("WBS")): clean_text(row.get("project name"))
        for _, row in project_summary_frame.iterrows()
        if clean_text(row.get("WBS"))
    }
    project_by_wbs = {
        project["project"][4:].strip(): project
        for project in projects
    }
    pr_value_by_year = {}
    project_pr_values = {}
    unmapped_requisitions = []
    for row in requisitions:
        if not row["value"]:
            continue
        match = re.search(r"E/CZ01-S\d+", row["description"], re.IGNORECASE)
        wbs = match.group(0).upper() if match else ""
        if wbs not in project_by_wbs:
            unmapped_requisitions.append(row["requisition"])
            continue
        project_pr_values[wbs] = project_pr_values.get(wbs, 0) + row["value"]
        req_date = pd.to_datetime(
            row["requisitionDate"],
            errors="coerce"
        )

        if pd.notna(req_date):
            year = str(req_date.year)

            pr_value_by_year[year] = (
                pr_value_by_year.get(year,0)
                + row["value"]
            )
    if unmapped_requisitions:
        raise ValueError(
            "Could not map CAPEX requisitions to a CJE0 project WBS: "
            + ", ".join(unmapped_requisitions)
        )

    project_summary = []
    for wbs, project in project_by_wbs.items():
        if wbs not in status_project_names:
            continue
        gr_value = project["actual2026"]
        ungr_value = project["committed2026"]
        pr_value = project_pr_values.get(wbs, 0)
        project_summary.append(
            {
                "wbs": wbs,
                "name": status_project_names.get(wbs) or project["name"],
                "budget2026": project["budget2026"],
                "budget2027": project["budget2027"],
                "budget2028": project["budget2028"],
                "budget2029": project["budget2029"],
                "grValue2026": project["actual2026"],
                "grValue2027": project["actual2027"],
                "grValue2028": project["actual2028"],
                "grValue2029": project["actual2029"],

                "ungrValue2026": project["committed2026"],
                "ungrValue2027": project["committed2027"],
                "ungrValue2028": project["committed2028"],
                "ungrValue2029": project["committed2029"],

                "prValue2026":
                    project_pr_values.get(wbs,0),

                "prValue2027": 0,
                "prValue2028": 0,
                "prValue2029": 0
            }
        )
    project_summary.sort(key=lambda project: project["wbs"])

    # approved_budget = sum(project["budget2026"] for project in project_summary)
    # gr_value = sum(project["actual2026"] for project in projects)
    # ungr_value = sum(project["committed2026"] for project in projects)
    # po_value = sum(project["assigned2026"] for project in projects)
    # pr_value = sum(row["value"] for row in requisitions)
    # scoped_projects = [
    #     project
    #     for wbs, project in project_by_wbs.items()
    #     if wbs in status_project_names
    # ]
    # scoped_pr_value = sum(project["prValue"] for project in project_summary)
    # not_yet_occupied = (
    #     sum(project["available2026"] for project in scoped_projects) - scoped_pr_value
    # )
    # print("project_pr_values")
    # print(project_pr_values)

    # print("scoped_pr_value")
    # print(scoped_pr_value)

    overview_by_year = {}

    for year in ["2026", "2027", "2028", "2029"]:

        budget_field = f"budget{year}"
        actual_field = f"actual{year}"
        committed_field = f"committed{year}"
        assigned_field = f"assigned{year}"
        available_field = f"available{year}"

        approved_budget = sum(
            project.get(budget_field, 0)
            for project in projects
            if project["project"] != "PRJ E/CZ01-S0130"
        )
        # print(project['project'])
        # print(f"approved_budget for {year}: {approved_budget}")

        gr_value = sum(
            project.get(actual_field, 0)
            for project in projects
            if project["project"] != "PRJ E/CZ01-S0130"
        )

        ungr_value = sum(
            project.get(committed_field, 0)
            for project in projects
            if project["project"] != "PRJ E/CZ01-S0130"
        )

        po_value = sum(
            project.get(assigned_field, 0)
            for project in projects
            if project["project"] != "PRJ E/CZ01-S0130"
        )

        not_yet_occupied = (
            sum(
                project.get(available_field, 0)
                for project in projects
                if project["project"] != "PRJ E/CZ01-S0130"
            )
            - pr_value_by_year.get(year,0)
        )

        overview_by_year[year] = {
            # "totalBudget": total_budget,
            "approvedBudget": approved_budget,
            "notYetOccupied": not_yet_occupied,
            "poValue": po_value,
            "prValue":
                pr_value_by_year.get(
                    year,
                    0
                ),
            "grValue": gr_value,
            "ungrValue": ungr_value,
            "occupied":
                gr_value
                + ungr_value
                + pr_value_by_year.get(
                    year,
                    0
                )
        }

    purchase_orders = purchasing_file("ME2N.xlsx")
    budget_2026 = sum(project["budget2026"] for project in projects)
    assigned_2026 = sum(project["assigned2026"] for project in projects)
    actual_by_month = {}
    plan_years = set()
    plan_months_by_year = {}

    for _, row in actual_frame.iterrows():
        if clean_text(row.get("Name of offsetting account")).casefold() != "gr / ir im&s".casefold():
            continue
        document_date = pd.to_datetime(row.get("Document Date"), errors="coerce")
        if pd.isna(document_date):
            continue
        year = int(document_date.year)
        month = int(document_date.month)
        plan_years.add(year)
        plan_months_by_year[year] = max(plan_months_by_year.get(year, 0), month)
        key = (year, month)
        actual_by_month[key] = actual_by_month.get(key, 0) + parse_sap_number(
            row.get("Vbl. value/Obj. curr")
        )

    order_value_by_month = {}
    for row in purchase_orders:
        document_date = pd.to_datetime(row["date"], errors="coerce")
        if pd.isna(document_date):
            continue
        year = int(document_date.year)
        month = int(document_date.month)
        plan_years.add(year)
        plan_months_by_year[year] = max(plan_months_by_year.get(year, 0), month)
        key = (year, month)
        order_value_by_month[key] = (
            order_value_by_month.get(key, 0) + row["netOrderValueCny"]
        )

    capex_plan_monthly = []
    for year in sorted(plan_years):
        actual_ytd = 0
        order_ytd = 0
        for month in range(1, plan_months_by_year[year] + 1):
            actual_ytd += actual_by_month.get((year, month), 0)
            order_ytd += order_value_by_month.get((year, month), 0)
            capex_plan_monthly.append(
                {
                    "year": year,
                    "month": month,
                    "actGR": number(actual_ytd),
                    "ytd": number(order_ytd),
                    "ytdGR": number(actual_ytd + order_ytd),
                    "budget": number(budget_2026),
                }
            )

    return {
        "projects": projects,
        "actual": capex_actual,
        "purchaseOrders": purchase_orders,
        "requisitions": requisitions,
        "plan": {
            "years": sorted(plan_years),
            "monthly": capex_plan_monthly,
            "budget2026": number(budget_2026),
            "assigned2026": number(assigned_2026),
            "ungrValue": number(sum(row["netOrderValueCny"] for row in purchase_orders)),
            "exchangeRates": exchange_rates,
        },
        # "overview": {
        #     "totalBudget": total_budget,
        #     "approvedBudget": approved_budget,
        #     "notYetOccupied": not_yet_occupied,
        #     "poValue": po_value,
        #     "prValue": pr_value,
        #     "grValue": gr_value,
        #     "ungrValue": ungr_value,
        #     "occupied": gr_value + ungr_value + pr_value,
        #     "projectSummary": project_summary,
        # },
        "overview": {
            "totalBudget": total_budget,
            "prValue": pr_value,
            "projectSummary": project_summary,
            "years": overview_by_year
        },
    }


def main():
    (
        actual_source,
        actual,
        cost_centers,
        relationships,
        summary_row_info,
        order_details,
    ) = read_actual_data()
    budget = read_budget(cost_centers, relationships)
    energy, production = read_energy_data()
    capex = read_capex_data()
    outsourcing_frame = pd.read_excel(
        SOURCE_DIR / "Relationship.XLSX", sheet_name="外协（26）"
    )
    outsourcing = records_from_frame(
        outsourcing_frame,
        [
            "Order",
            "Order Type",
            "Description",
            "Equipment",
            "Cost Center",
            "Value category",
            "Description.1",
            "Currency",
            "Posting Period",
            "Actual costs",
            "Planned costs",
        ],
        numeric=("Actual costs", "Planned costs"),
    )
    equipment = read_equipment(relationships)
    equipment_names = {
        row["equipment"]: row["description"]
        for row in equipment
        if row["description"]
    }
    for row in order_details:
        row["equipmentName"] = equipment_names.get(row["equipment"], "") or "设备未匹配"
    breakdowns = read_breakdown(equipment_names)

    data = {
        "currency": clean_key(actual_source["Currency"].dropna().iloc[0])
        if actual_source["Currency"].notna().any()
        else "CNY",
        "source": "Engineering Operations Center local Excel workbooks",
        "excludedSummaryRows": summary_row_info,
        "years": sorted(actual["year"].unique().tolist()),
        "months": list(range(1, 13)),
        "actual": [
            {
                "year": int(row.year),
                "month": int(row.month),
                "scope": clean_text(row.scope),
                "costCenter": clean_text(row.costCenter),
                "costCenterName": clean_text(row.costCenterName),
                "costType": clean_text(row.costType),
                "orderType": clean_text(row.orderType),
                "costElement": clean_text(row.costElement),
                "actual": number(row.actual),
                "planned": number(row.planned),
                "orders": int(row.orders),
            }
            for row in actual.itertuples(index=False)
        ],
        "budget": [
            {
                "year": int(row.year),
                "scope": clean_text(row.scope),
                "costCenter": clean_text(row.costCenter),
                "costCenterName": clean_text(row.costCenterName),
                "costElement": clean_text(row.costElement),
                "budget": number(row.budget),
            }
            for row in budget.itertuples(index=False)
        ],
        "contracts": read_contracts(relationships),
        "workOrders": order_details,
        "equipment": equipment,
        "workOrderStatus": read_work_order_status(),
        "workOrderSchedule": read_work_order_schedule_summary(),
        "breakdowns": breakdowns,
        "ungrOrders": read_work_order_purchases(),
        "energy": energy,
        "production": production,
        "capex": capex,
        "outsourcing": outsourcing,
    }

    serialized = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    serialized = serialized.replace("</", "<\\/")
    OUTPUT_FILE.write_text(
        f"window.MAINTENANCE_DATA = Object.freeze({serialized});\n",
        encoding="utf-8",
    )

    print(f"Generated {OUTPUT_FILE.name}")
    print(f"Actual aggregates: {len(data['actual']):,}")
    print(f"Budget aggregates: {len(data['budget']):,}")
    print(f"Contracts: {len(data['contracts']):,}")
    print(f"Work orders: {len(data['workOrders']):,}")
    print(f"Equipment: {len(data['equipment']):,}")
    print(f"Work order status records: {len(data['workOrderStatus']):,}")
    print(f"Breakdown records: {len(data['breakdowns']):,}")
    print(f"Energy months: {len(data['energy']):,}")
    print(f"CAPEX projects: {len(data['capex']['projects']):,}")
    print(f"Detailed actual total: {actual['actual'].sum():,.2f} {data['currency']}")
    print(
        f"Excluded rows without a posting period: {summary_row_info['count']:,} "
        f"({summary_row_info['actual']:,.2f} {data['currency']})"
    )
    print(f"Budget total: {budget['budget'].sum():,.2f} {data['currency']}")


if __name__ == "__main__":
    main()
