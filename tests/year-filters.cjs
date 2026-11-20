// Run with: node tests/year-filters.cjs
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const extract=name=>{
  const start=source.indexOf(`  function ${name}(`),end=source.indexOf('\n  function ',start+1);
  assert(start>=0&&end>start);return source.slice(start,end);
};
const context={state:{year:['2026'],month:[],selection:null,yearFilterTouched:false},viewYearFilters:new Map(),Date};
vm.createContext(context);
for(const name of ['selectCurrentWorkOrderMonth','selectDefaultEnergyPeriod','restoreViewYearFilter'])vm.runInContext(extract(name),context);
let active;
function visit(view){context.restoreViewYearFilter(active,view);active=view;}
function years(expected){assert.deepEqual(Array.from(context.state.year),expected);}
visit('overview');years(['2026']);
context.state.year=['2025'];context.state.yearFilterTouched=true;context.state.selection={field:'year',value:'2025'};
visit('area');years(['2026']);assert.equal(context.state.selection,null);
context.state.year=['2024'];
visit('energy');years(['2024','2025','2026']);assert.equal(context.state.month.length,0);
context.state.year=['2025'];
visit('overview');years(['2025']);
visit('area');years(['2024']);
visit('energy');years(['2025']);
context.state.year=[]; // All years must also be remembered, rather than replaced by defaults.
visit('breakdown');years(['2026']);
visit('energy');years([]);
visit('dailyWO');years(['2026']);
context.state.year=['2024','2025'];
visit('workOrder');years(['2026']);
visit('dailyWO');years(['2024','2025']);
visit('dailyWO');years(['2024','2025']); // Resize/language/currency rerenders cannot reset the year.
context.selectCurrentWorkOrderMonth();years(['2026']); // Reset affects this page only.
visit('area');years(['2024']);
visit('dailyWO');years(['2026']);
visit('energy');context.selectDefaultEnergyPeriod();years(['2024','2025','2026']);
visit('overview');years(['2025']);
visit('energy');years(['2024','2025','2026']);
for(const view of ['home','details','contracts','capex','capexPlan']){visit(view);years(['2026']);}
assert(source.includes('restoreViewYearFilter(previousView, state.view);'));
console.log('Passed: independent page defaults, remembered single/multiple/all-year selections, energy and daily defaults, stable rerenders, page-local resets and year selection-chip isolation.');
