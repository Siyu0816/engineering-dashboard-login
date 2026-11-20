// Run with: node tests/report-behavior.cjs
// Exercise report rendering and interactions without external dependencies.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
class Node {
  constructor(tag='div'){this.tag=tag;this.children=[];this.attributes={};this.dataset={};this.events={};this.style={setProperty(k,v){this[k]=v;}};this.clientWidth=1300;this.clientHeight=450;this.className='';this.classList={add:(...names)=>{this.className+=' '+names.join(' ');}};}
  setAttribute(k,v){this.attributes[k]=String(v);}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  addEventListener(k,v){this.events[k]=v;}
  closest(){return new Node();}
}
const document={createElement:tag=>new Node(tag),createElementNS:(_,tag)=>new Node(tag),createTextNode:text=>Object.assign(new Node('#text'),{textContent:text})};
const context={window:{},document,Intl,Map,Date,console};vm.createContext(context);
vm.runInContext(read('dashboard-data.js'),context);
vm.runInContext(read('report-refinements.js'),context);
const views=context.window.EngineeringReportViews;
const walk=node=>[node,...(node.children||[]).flatMap(walk)];
const find=(node,test)=>walk(node).filter(test);
const now=new Date(),year=now.getFullYear(),month=now.getMonth()+1;
const sample=[{year,month,state:'Total',day1:8},{year,month,state:'Done',day1:6},{year,month:month===12?11:month+1,state:'Total',day1:4}];
const daily=new Node();
const options={language:'zh',translate:s=>s,percentage:n=>n+'%',number:new Intl.NumberFormat('en')};
views.dailySummary(daily,sample,options);
const bodies=find(daily,n=>n.dataset?.month);
assert.equal(bodies.length,2);
const key=`${year}-${String(month).padStart(2,'0')}`;
assert.equal(bodies.find(n=>n.dataset.month===key).hidden,false,'current month opens');
assert.equal(bodies.find(n=>n.dataset.month!==key).hidden,true,'other months close');
assert.equal(bodies.find(n=>n.dataset.month===key).children.length,new Date(year,month,0).getDate());
const collapse=find(daily,n=>n.tag==='button'&&n.textContent==='全部收起')[0];collapse.events.click();
views.dailySummary(daily,sample,options);
assert.equal(find(daily,n=>n.dataset?.month===key)[0].hidden,true,'manual collapse survives rerender');
const composition=new Node(),selected=[];
views.composition(composition,[{label:'Service',value:30,color:'#123'},{label:'Material',value:70,color:'#456'}],{label:'Composition',totalLabel:'Total',translate:s=>s,money:n=>String(n),exact:n=>String(n),percentage:n=>n+'%',onSelect:row=>selected.push(row.label)});
const items=find(composition,n=>n.className==='composition-item');
assert.equal(items.length,2);assert.match(items[0].dataset.tooltip,/30%/);assert.match(items[1].dataset.tooltip,/70%/);
items[1].events.click();assert.deepEqual(selected,['Material']);
assert.equal(find(composition,n=>n.attributes?.class==='distribution-total')[0].textContent,'100');
const app=read('app.js');
const extract=name=>{const start=app.indexOf(`  function ${name}(`);assert(start>=0);const end=app.indexOf('\n  function ',start+1);return app.slice(start,end<0?undefined:end);};
const container=new Node();
const svgElement=(tag,attrs={},text)=>{const n=new Node(tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;return n;};
Object.assign(context,{data:context.window.MAINTENANCE_DATA,state:{language:'zh'},document:{...document,getElementById:()=>container},svgElement,element:svgElement,translateText:s=>s,fullMoney:n=>String(n),capexOverviewAxisMoney:n=>String(n),capexChartMoney:n=>String(n),addTooltip:(n,l,v)=>n.setAttribute('data-tooltip',l+': '+v),hideChartTooltip:()=>{},drawEmpty:()=>{},appendDataLabel:()=>{},addGrid:()=>{},createSvg:(c,w,h)=>{const n=svgElement('svg',{viewBox:`0 0 ${w} ${h}`});c.replaceChildren(n);return n;}});
vm.runInContext('let capexProjectPage=0;\n'+extract('renderCapexProjectChart'),context);
const projects=context.data.capex.overview.projectSummary;
for(const [width,count] of [[1360,16],[800,8],[390,4]]){
  container.clientWidth=width;vm.runInContext('renderCapexProjectChart()',context);
  const hits=find(container,n=>n.attributes?.class==='capex-project-hit');assert.equal(hits.length,count);
  const row=projects[0],tip=hits[0].attributes['data-tooltip'];
  for(const [label,value] of [['未收货',row.ungrValue],['已收货',row.grValue],['采购申请',row.prValue],['已占用',row.ungrValue+row.grValue+row.prValue],['未占用',row.budget2026-row.ungrValue-row.grValue-row.prValue]])assert(tip.includes(`${label}: ${value}`),label);
}
let next=find(container,n=>n.tag==='button'&&n.textContent==='下一组')[0];next.events.click();
assert.match(find(container,n=>n.attributes?.class==='capex-project-hit')[0].attributes['data-tooltip'],new RegExp(projects[4].wbs.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
context.state.language='en';vm.runInContext('renderCapexProjectChart()',context);
const englishTip=find(container,n=>n.attributes?.class==='capex-project-hit')[0].attributes['data-tooltip'];
for(const label of ['Unreceived','Received','Purchase requisitions','Occupied','Unoccupied'])assert(englishTip.includes(label+':'));
vm.runInContext(extract('selectCurrentWorkOrderMonth'),context);vm.runInContext('selectCurrentWorkOrderMonth()',context);
assert.equal(context.state.year[0],'2026');assert.equal(context.state.month[0],String(month));
vm.runInContext(extract('selectDefaultEnergyPeriod'),context);
vm.runInContext('selectDefaultEnergyPeriod()',context);
assert.deepEqual(Array.from(context.state.year),['2024','2025','2026']);
assert.deepEqual(Array.from(context.state.month),[]);
const energyCharts=[],energyKpis={};
Object.assign(context,{
  matchesSelection:(selection,value)=>!selection.length||selection.includes(String(value)),
  numberFormat:new Intl.NumberFormat('en'),
  sum:(rows,key)=>rows.reduce((total,row)=>total+(Number(row[key])||0),0),
  setKpiText:(id,value)=>{energyKpis[id]=value;},
  renderEnergyUtilityChart:(id,rows)=>{energyCharts.push({id,rows});}
});
vm.runInContext(extract('getEnergyRows')+'\n'+extract('renderEnergy'),context);
vm.runInContext('renderEnergy()',context);
assert.equal(energyCharts.length,7);
assert.deepEqual([...new Set(energyCharts[0].rows.map(row=>Number(row.year)))].sort(),[2024,2025,2026]);
assert.equal(energyKpis['energy-power'],new Intl.NumberFormat('en').format(Math.round(context.sum(energyCharts[0].rows,'power'))));
context.state.year=['2025'];context.state.month=['2'];energyCharts.length=0;
vm.runInContext('renderEnergy()',context);
assert(energyCharts.every(chart=>chart.rows.length>0&&chart.rows.every(row=>Number(row.year)===2025&&Number(row.month)===2)),'manual energy year/month selection applies to every chart');
const energyHtml=read('index.html').match(/<section id="view-energy"[\s\S]*?<\/section>/)[0];
assert.deepEqual([...energyHtml.matchAll(/id="(energy-[^"]+-chart)"/g)].map(match=>match[1]),[
  'energy-power-chart','energy-gas-chart','energy-steam-chart','energy-nitrogen-chart',
  'energy-city-water-chart','energy-domestic-wastewater-chart','energy-industry-wastewater-chart'
]);
assert(energyHtml.indexOf('energy-section-divider')>energyHtml.indexOf('energy-nitrogen-chart'));
assert(energyHtml.indexOf('energy-section-divider')<energyHtml.indexOf('energy-city-water-chart'));
console.log('Passed: daily month/calendar/collapse, composition amounts/shares/filtering, CAPEX five-value bilingual tooltips and pagination, energy default years/all months, manual energy filtering, KPI/chart consistency and chart order/divider.');
