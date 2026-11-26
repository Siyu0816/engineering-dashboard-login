(() => {
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const el=(tag,cls,html='')=>{const n=document.createElement(tag);n.className=cls;n.innerHTML=html;return n;};
  let lang=document.documentElement.lang==='en'?'en':'zh', view=document.body.dataset.view||'home', menu=null,mobileOpen=false;
  const L=(zh,en)=>lang==='en'?en:zh;
  const groups=[
    {id:'cost',name:['成本管理','Cost'],code:'FINANCIAL CLARITY',icon:'◈',desc:['让每一笔维护投入，都清晰可见。','See the purpose behind every maintenance investment.']},
    {id:'maintenance',name:['设备与维护','Maintenance'],code:'ASSET RELIABILITY',icon:'⌁',desc:['从设备故障到工单执行，连接现场与决策。','Connect equipment reliability, field execution and decisions.']},
    {id:'capex',name:['资本投资','Investment'],code:'INVESTMENT INTELLIGENCE',icon:'▥',desc:['贯穿项目预算、采购与收货的全周期视角。','A lifecycle perspective on budgets, purchasing and receipts.']},
    {id:'energy',name:['能源管理','Energy'],code:'RESOURCE EFFICIENCY',icon:'✳',desc:['看见能源流向，探索运营优化的可能。','Understand energy use and discover opportunities to improve.']}
  ];
  const reports=[
    {id:'overview',group:'cost',name:['维护成本总览','Cost overview'],code:'OVERVIEW',desc:['对比预算与实际成本，掌握年度支出表现。','Compare budget and actual cost to understand spending.'],guide:['先看预算差额，再按月份、成本要素与工单类型定位支出变化；点击图表可联动筛选。','Start with variance, then explore monthly costs, cost elements and work-order types. Click charts to filter.'],source:['月度工单成本 / BU 预算','Monthly order costs / BU budget'],related:['area','details','contracts']},
    {id:'area',group:'cost',name:['区域维护成本','Cost by area'],code:'AREA',desc:['深入区域与设备，发现成本的关键驱动。','Find cost drivers across areas and equipment.'],guide:['比较区域预算与实际，结合设备排名定位重点对象；可切换 Top 数量或查看设备信息。','Compare area budgets and actuals, then use equipment rankings. Adjust the Top count or inspect equipment details.'],source:['工单成本 / 设备关联表','Order costs / Equipment mapping'],related:['overview','details','breakdown']},
    {id:'details',group:'cost',name:['小额支出与改善','Small spending & improvement'],code:'OTHERS',desc:['区分小额支出与改善投入，逐层追溯明细。','Trace small spending and improvement investments.'],guide:['对照区域与成本要素的支出结构，点击信息按钮查看对应的工单明细。','Compare spending by area and cost element. Use the information button to inspect underlying orders.'],source:['月度工单成本明细','Monthly order cost details'],related:['overview','area','workOrder']},
    {id:'contracts',group:'cost',name:['维护合同','Maintenance contracts'],code:'CONTRACT',desc:['跟踪合同支出、有效期与执行情况。','Track contract spend, validity and execution.'],guide:['结合月度合同成本和合同清单阅读；搜索编号或名称，留意临期和已过期的状态标记。','Read monthly contract costs alongside the register. Search by ID or name and review expiry highlights.'],source:['合同台账 / 合同工单成本','Contract register / Order costs'],related:['overview','details','area']},
    {id:'breakdown',group:'maintenance',name:['设备故障','Equipment breakdown'],code:'BREAKDOWN',desc:['从停机趋势到故障明细，识别可靠性问题。','Connect downtime trends to equipment reliability.'],guide:['先观察月度停机趋势和参考线，再按设备定位主要停机来源，搜索明细核查故障记录。','Review monthly downtime and the reference line, then identify equipment drivers and search event details.'],source:['设备故障与停机记录','Breakdown and downtime records'],related:['workOrder','dailyWO','area']},
    {id:'workOrder',group:'maintenance',name:['工单执行','Work order performance'],code:'WORK ORDER',desc:['关注所有、关键与预防工单的按时完成情况。','Monitor on-time execution across work-order categories.'],guide:['对比所有、关键和预防工单的积压、延迟完成及按时完成率，判断维护执行的重点。','Compare backlog, late completion and on-time rates for all, critical and preventive orders.'],source:['月度工单执行汇总','Monthly work-order execution'],related:['dailyWO','breakdown','overview']},
    {id:'dailyWO',group:'maintenance',name:['每日工单','Daily work orders'],code:'DAILY WO',desc:['以每日进度，连接计划与执行。','Connect daily planning with work-order execution.'],guide:['按日期观察工单状态分布及完成率，并在汇总表核查对应日期的数据。','Inspect daily status distribution and completion rates, then verify the matching date in the summary table.'],source:['每日工单计划汇总表','Daily work-order schedule'],related:['workOrder','breakdown','overview']},
    {id:'capex',group:'capex',name:['CAPEX 投资总览','CAPEX overview'],code:'CAPEX OVERVIEW',desc:['连接预算、承诺与收货，掌握项目投资进度。','Connect budgets, commitments and goods receipts.'],guide:['先核对已批准预算与占用情况，再在项目图中比较 GR、UnGR、PR 和预算差额。','Review approved budgets and commitments, then compare GR, UnGR, PR and budget gaps across projects.'],source:['CAPEX 状态 / CJE0 / ME5A','CAPEX status / CJE0 / ME5A'],related:['capexPlan','overview','energy']},
    {id:'capexPlan',group:'capex',name:['CAPEX 收货计划','CAPEX receipt plan'],code:'CAPEX GR PLAN',desc:['把采购承诺转化为可追踪的收货计划。','Turn purchase commitments into a traceable receipt plan.'],guide:['使用报表内的年份选择器，联动查看累计收货、待交付金额与预计收货日期；本页使用独立年份筛选。','Use the year selector within this report to compare receipts, open deliveries and forecast receipt dates. This page uses its own year filter.'],source:['CJ74 / ME2N / CJE0','CJ74 / ME2N / CJE0'],related:['capex','overview','contracts']},
    {id:'energy',group:'energy',name:['能源使用','Energy intelligence'],code:'ENERGY',desc:['联动能源、产量与费用，理解运营效率。','Connect energy use, output and costs to operational efficiency.'],guide:['趋势图按指标自身区间归一化以便比较走势，悬停查看原值；结合生产量理解单位能耗变化。','Trend series use their own normalized ranges. Hover for source values, and compare intensity with production volume.'],source:['公用工程消耗 / CN18 生产量','Utility consumption / CN18 output'],related:['capex','overview','workOrder']}
  ];
  const label=a=>a[lang==='en'?1:0], report=id=>reports.find(r=>r.id===id);
  const storage={get(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}},set(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}};
  let favorites=storage.get('engineering:favorites',[]).filter(id=>report(id));
  let recent=storage.get('engineering:recent',[]).filter(id=>report(id));
  const header=el('header','portal-header');header.dataset.portal='';document.body.prepend(header);
  const rail=el('nav','portal-rail');rail.dataset.portal='';rail.setAttribute('aria-label','Report navigation');header.after(rail);
  const overlay=el('div','portal-menu-shade');overlay.hidden=true;overlay.dataset.portal='';rail.after(overlay);
  const mega=el('section','portal-mega');mega.id='portal-mega';mega.hidden=true;mega.dataset.portal='';header.append(mega);
  const headerMain=el('div','portal-header-main');header.prepend(headerMain);
  const mobileNav=el('nav','portal-mobile-nav');mobileNav.id='portal-mobile-nav';mobileNav.dataset.portal='';mobileNav.hidden=true;header.append(mobileNav);
  const toolbar=el('div','portal-report-toolbar');toolbar.dataset.portal='';$('.filter-bar').before(toolbar);
  const context=el('section','portal-context');context.dataset.portal='';$('.filter-bar').after(context);
  const guide=el('section','portal-guide');guide.dataset.portal='';context.after(guide);
  const related=el('section','portal-related');related.dataset.portal='';$('#detail-dialog').before(related);
  const searchDialog=el('dialog','portal-search');searchDialog.dataset.portal='';document.body.append(searchDialog);
  const focusDialog=el('dialog','portal-focus');focusDialog.dataset.portal='';document.body.append(focusDialog);
  const notice=el('div','portal-notice');notice.dataset.portal='';notice.setAttribute('role','status');document.body.append(notice);
  const oldSidebar=$('#sidebar');oldSidebar.hidden=true;oldSidebar.inert=true;
  const homeLang=$('#home-language-toggle');if(homeLang)homeLang.hidden=true;
  let noticeTimer;
  function toast(text){notice.textContent=text;notice.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.remove('show'),2400);}
  function route(id){closeMenu();if(searchDialog.open)searchDialog.close();document.dispatchEvent(new CustomEvent('engineering:navigate',{detail:{view:id}}));}
  function card(r,mode='normal'){return `<button type="button" class="portal-report-link ${view===r.id?'is-current':''}" data-route="${r.id}"><span class="portal-link-code">${r.code}</span><strong>${label(r.name)} <span aria-hidden="true">↗</span></strong>${mode==='compact'?'':`<small>${label(r.desc)}</small>`}</button>`;}
  function renderHeader(){
    const group=report(view)?.group;
    headerMain.innerHTML=`<button type="button" class="portal-brand" data-route="home" aria-label="${L('返回首页','Home')}"><img src="./img/Logomark%20black%20CMYK.png" alt=""><span>Givaudan<small>ENGINEERING INTELLIGENCE</small></span></button><nav class="portal-primary" aria-label="${L('主导航','Main navigation')}"><button type="button" data-route="home" class="${view==='home'?'selected':''}">${L('首页','Home')}</button>${groups.map(g=>`<button type="button" data-category="${g.id}" class="${group===g.id?'selected':''}" aria-expanded="${menu===g.id}" aria-controls="portal-mega">${label(g.name)}<i aria-hidden="true">⌄</i></button>`).join('')}</nav><div class="portal-utilities"><button type="button" class="portal-search-open" data-search><span class="portal-search-icon" aria-hidden="true"></span><span>${L('搜索报表','Find a report')}</span><kbd>/</kbd></button><button type="button" class="portal-lang" data-language>${L('EN','中文')}</button><span class="portal-avatar" title="${L('本地工作空间','Local workspace')}">E<span></span></span></div>`;
    headerMain.querySelector('[data-search]').setAttribute('aria-label',L('搜索报表','Find a report'));
    rail.hidden=view==='home';
    if(group)rail.innerHTML=`<span class="portal-rail-label">${groups.find(g=>g.id===group).code}</span><div>${reports.filter(r=>r.group===group).map(r=>`<button type="button" data-route="${r.id}" ${r.id===view?'aria-current="page"':''}>${label(r.name)}</button>`).join('')}</div>`;
    const toggle=el('button','portal-mobile-toggle','<i></i><i></i><i></i>');toggle.type='button';toggle.dataset.mobileMenu='';toggle.setAttribute('aria-label',L('打开导航菜单','Open navigation'));toggle.setAttribute('aria-expanded',String(mobileOpen));toggle.setAttribute('aria-controls',mobileNav.id);headerMain.querySelector('.portal-utilities').append(toggle);
    mobileNav.setAttribute('aria-label',L('移动端报表导航','Mobile report navigation'));
    mobileNav.innerHTML=`<button type="button" class="portal-mobile-home" data-route="home">${L('首页','Home')}<span>⌂</span></button>${groups.map(g=>`<details ${group===g.id?'open':''}><summary>${label(g.name)}<span>⌄</span></summary><div>${reports.filter(r=>r.group===g.id).map(r=>card(r,'compact')).join('')}</div></details>`).join('')}`;
    
  }
  function openMenu(id){
    if(menu===id){closeMenu();return;}menu=id;const g=groups.find(g=>g.id===id);
    const items=reports.filter(r=>r.group===id);
    mega.innerHTML=`<div class="portal-menu-heading"><div><span class="portal-overline">${g.code}</span><h2>${label(g.name)}<small>${String(items.length).padStart(2,'0')}</small></h2></div><button type="button" data-close-menu aria-label="${L('关闭菜单','Close navigation')}">×</button></div><div class="portal-mega-grid">${items.map(r=>card(r)).join('')}</div><div class="portal-menu-footer"><button type="button" data-search>${L('搜索全部报表','Search all reports')}<span>⌕</span></button><small>Esc ${L('关闭','to close')}</small></div>`;
    mega.hidden=false;overlay.hidden=false;renderHeader();positionMenu();
  }
  function positionMenu(){
    if(innerWidth>760&&mobileOpen)closeMenu();
    if(!menu)return;
    const trigger=headerMain.querySelector(`[data-category="${menu}"]`);
    const width=Math.min(420,innerWidth-32);
    const left=Math.max(16,Math.min((trigger?.getBoundingClientRect().left||16)-16,innerWidth-width-16));
    mega.style.setProperty('--menu-left',`${left}px`);
  }
  addEventListener('resize',positionMenu);
  function closeMenu(){menu=null;mega.hidden=true;overlay.hidden=true;mobileOpen=false;mobileNav.hidden=true;$$('[data-category]').forEach(b=>b.setAttribute('aria-expanded','false'));$('.portal-mobile-toggle')?.setAttribute('aria-expanded','false');}
  function renderWorkspace() { /* Home intentionally has only four domain entries. */ }
  function enhanceCards(){
    $$('[data-expand]').forEach(b=>{b.title=L('放大查看','Expand view');b.setAttribute('aria-label',b.title);});
    $$('[data-export]').forEach(b=>{b.title=L('导出图表或表格','Export chart or table');b.setAttribute('aria-label',b.title);});
    $$('.view-panel:not(#view-home) .chart-card').forEach((c,i)=>{
      if(c.querySelector('.portal-card-tools'))return;
      const tools=el('div','portal-card-tools');tools.dataset.portal='';
      tools.innerHTML=`<button type="button" data-expand aria-label="${L('放大查看','Expand view')}" title="${L('放大查看','Expand view')}">⤢</button><button type="button" data-export aria-label="${L('导出图表或表格','Export chart or table')}" title="${L('导出图表或表格','Export chart or table')}">↓</button>`;
      c.querySelector('.card-header')?.append(tools);
      c.style.setProperty('--card-index',String(i));
    });
  }
  function renderReport(){
    const r=report(view);const home=view==='home';
    [toolbar,context,guide,related].forEach(n=>n.hidden=home);if(!r)return;
    const g=groups.find(g=>g.id===r.group);document.body.dataset.domain=g.id;
    const panel=$(`#view-${view}`);
    $('.filter-bar').hidden = view==='capexPlan' || ![...$('.filter-bar').querySelectorAll('select')].some(select=>!select.disabled);
    $('#page-title').textContent=label(r.name);$('#page-description').textContent=label(r.desc);$('#page-description').hidden=false;
    toolbar.innerHTML=`<div class="portal-report-identity"><span>${g.icon}</span><strong>${r.code}</strong><i></i><small>${L('本地数据快照','LOCAL DATA SNAPSHOT')}</small></div><div class="portal-report-actions"><button type="button" data-guide aria-expanded="${!guide.hidden}">ⓘ ${L('阅读指引','Reading guide')}</button><button type="button" data-pin aria-pressed="${favorites.includes(view)}">${favorites.includes(view)?'★':'☆'} ${favorites.includes(view)?L('已收藏','Saved'):L('收藏报表','Save report')}</button><button type="button" data-search>⌕ ${L('切换报表','Switch report')}</button></div>`;
    const kpis=[...panel.querySelectorAll('.kpi-card')].slice(0,3);
    context.innerHTML=kpis.length?`<div class="portal-context-label"><span class="portal-overline">AT A GLANCE</span><strong>${L('关键指标速览','Your key indicators')}</strong><small>${L('与当前筛选同步','Synced with your filters')}</small></div>${kpis.map(k=>`<div class="portal-context-item"><span>${k.querySelector('.kpi-label')?.childNodes[0]?.textContent.trim()||''}</span><strong>${k.querySelector('.kpi-value')?.textContent||'—'}</strong></div>`).join('')}`:`<div class="portal-context-label"><span class="portal-overline">ANALYTICAL PERSPECTIVE</span><strong>${L('连接信息，聚焦执行','Connect insights to execution')}</strong></div><div class="portal-context-item"><span>${L('分析图表','Visualizations')}</span><strong>${panel.querySelectorAll('.chart').length.toString().padStart(2,'0')}</strong></div><div class="portal-context-item"><span>${L('明细视图','Detail views')}</span><strong>${panel.querySelectorAll('.table-wrap').length.toString().padStart(2,'0')}</strong></div><div class="portal-context-item"><span>${L('数据模式','Data mode')}</span><strong class="portal-text-value">${L('本地快照','Local snapshot')}</strong></div>`;
    // Keep the original KPI cards as the single numeric summary on reports.
    context.hidden=kpis.length>0;
    guide.innerHTML=`<span class="portal-guide-icon">↳</span><div><strong>${L('如何阅读这份报表','Make the most of this report')}</strong><p>${label(r.guide)}</p></div><span class="portal-source-pill">${label(r.source)}</span>`;
    guide.hidden=storage.get('engineering:guide-collapsed',true);
    toolbar.querySelector('[data-guide]').setAttribute('aria-expanded',String(!guide.hidden));
    related.innerHTML=`<div class="portal-related-heading"><span class="portal-overline">CONTINUE EXPLORING</span><h2>${L('让分析，向前一步。','Take your analysis one step further.')}</h2><p>${L('结合关联报表，从更多维度理解当前问题。','Connect related reports to understand the question from another perspective.')}</p></div><div class="portal-related-grid">${r.related.map(id=>card(report(id))).join('')}</div><div class="portal-report-foot"><span>GIVAUDAN · ENGINEERING INTELLIGENCE</span><span>${L('快照数据 · 筛选仅影响当前浏览会话','Snapshot data · Filters apply to this browser session')}</span></div>`;
    enhanceCards();
  }
  function refresh(){renderHeader();renderWorkspace();renderReport();}
  function openSearch(){
    closeMenu();searchDialog.innerHTML=`<div class="portal-search-title"><div><span class="portal-overline">FIND YOUR PERSPECTIVE</span><h2>${L('你想了解什么？','What would you like to explore?')}</h2></div><button type="button" data-close-search aria-label="${L('关闭搜索','Close search')}">×</button></div><label class="portal-search-field"><span class="portal-search-icon"></span><input type="search" placeholder="${L('搜索成本、工单、设备、投资、能源…','Search costs, work orders, equipment, investment…')}" aria-label="${L('搜索报表','Search reports')}"><kbd>ESC</kbd></label><div class="portal-search-meta">${L('全部报表','All reports')} <span>10</span></div><div class="portal-search-results"></div><div class="portal-search-foot">${L('使用 Tab 选择，Enter 打开，Esc 关闭','Tab to select · Enter to open · Esc to close')}</div>`;
    searchDialog.showModal();filterSearch('');searchDialog.querySelector('input').focus();
  }
  function filterSearch(query){
    query=query.trim().toLowerCase();const matches=reports.filter(r=>[...r.name,...r.desc,r.code,...groups.find(g=>g.id===r.group).name].join(' ').toLowerCase().includes(query)).sort((a,b)=>Number(favorites.includes(b.id))-Number(favorites.includes(a.id)));
    searchDialog.querySelector('.portal-search-results').innerHTML=matches.length?matches.map(r=>card(r,'compact')).join(''):`<div class="portal-search-empty">${L('没有找到相关报表，请尝试“成本”或“工单”。','No reports found. Try “cost” or “work order”.')}</div>`;
    searchDialog.querySelector('.portal-search-meta span').textContent=matches.length;
  }
  function saveFile(blob,name){const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function exportCard(c){
    const tables=[...c.querySelectorAll('table')];const title=c.querySelector('h2')?.textContent||view;
    if(tables.length){
      // Formula-leading cells are exported as text for spreadsheet safety.
      const csv=tables.map(table=>{const heading=table.caption?'"'+table.caption.textContent.replace(/"/g,'""')+'"\r\n':'';return heading+[...table.rows].map(row=>[...row.cells].map(cell=>{let s=cell.textContent.replace(/\r?\n/g,' ').trim();if(/^[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}).join(',')).join('\r\n');}).join('\r\n\r\n');
      saveFile(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}),title+'.csv');toast(L('已导出当前表格','Current table exported'));return;
    }
    const svgs=[...c.querySelectorAll('svg')];if(!svgs.length){toast(L('当前图表没有可导出的内容','No chart content available to export'));return;}
    const clone=document.createElementNS('http://www.w3.org/2000/svg','svg');let totalHeight=0,maxWidth=0;
    for(const svg of svgs){const copy=svg.cloneNode(true),originals=[svg,...svg.querySelectorAll('*')],copies=[copy,...copy.querySelectorAll('*')];originals.forEach((node,i)=>{const style=getComputedStyle(node);for(const key of ['fill','stroke','stroke-width','font-family','font-size','font-weight','text-anchor','opacity'])copies[i].style.setProperty(key,style.getPropertyValue(key));});const box=svg.getBoundingClientRect();copy.setAttribute('x','0');copy.setAttribute('y',totalHeight);copy.setAttribute('width',box.width);copy.setAttribute('height',box.height);copy.style.width='';copy.style.height='';clone.append(copy);totalHeight+=box.height+14;maxWidth=Math.max(maxWidth,box.width);}
    clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width',Math.round(maxWidth));clone.setAttribute('height',Math.round(totalHeight));clone.setAttribute('viewBox',`0 0 ${maxWidth} ${totalHeight}`);clone.style.background='#ffffff';
    saveFile(new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml;charset=utf-8'}),title+'.svg');toast(L('已导出 SVG 图表','SVG chart exported'));
  }
  function prepareFocusCopy(source, copy) {
    const width=source.getBoundingClientRect().width;
    copy.style.setProperty('--focus-content-width',`${Math.max(1,width)}px`);
    const originals=[...source.querySelectorAll('.chart')];
    copy.querySelectorAll('.chart').forEach((chart,index)=>{
      const original=originals[index],style=getComputedStyle(original);
      // Keep ID-dependent ring layouts after removing duplicate IDs from the copy.
      for(const property of ['display','align-items','justify-content','flex-direction','gap']) {
        chart.style.setProperty(property,style.getPropertyValue(property));
      }
      if(style.display==='grid') {
        const columns=style.gridTemplateColumns.split(/\s+/);
        if(columns.every(value=>/^\d+(\.\d+)?px$/.test(value))) {
          chart.style.gridTemplateColumns=columns.map(value=>`minmax(0,${parseFloat(value)}fr)`).join(' ');
        }
      }
      chart.style.setProperty('--focus-chart-width',`${Math.max(1,original.getBoundingClientRect().width)}px`);
    });
    copy.querySelectorAll('svg').forEach(svg=>{
      const values=(svg.getAttribute('viewBox')||'').trim().split(/[\s,]+/).map(Number);
      if(values.length===4&&values.every(Number.isFinite)&&values[2]>0&&values[3]>0) {
        svg.style.setProperty('--focus-svg-ratio',`${values[2]} / ${values[3]}`);
      }
      svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    });
    copy.querySelectorAll('.composition-item').forEach(n=>{
      const row=document.createElement('div');row.className=n.className;row.style.cssText=n.style.cssText;
      row.append(...n.childNodes);n.replaceWith(row);
    });
    // Collapsed daily months must remain readable in the static expanded copy.
    copy.querySelectorAll('.daily-month-toggle').forEach(n=>{
      const heading=document.createElement('span');heading.className='focus-month-heading';
      heading.textContent=n.textContent.replace('›','').trim();n.replaceWith(heading);
    });
    copy.querySelectorAll('tbody[hidden]').forEach(n=>n.hidden=false);
    copy.querySelectorAll('.cmp-mode,.daily-summary-actions,.project-pagination,.portal-card-tools').forEach(n=>n.remove());
    copy.querySelector('.card-header')?.remove();
    copy.querySelectorAll('[id]').forEach(n=>{n.dataset.focusSourceId=n.id;n.removeAttribute('id');});
    copy.querySelectorAll('[tabindex]').forEach(n=>n.removeAttribute('tabindex'));
    copy.querySelectorAll('button,input,select').forEach(n=>n.remove());
    copy.className='portal-focus-content';
    return copy;
  }
  let focusReturnTarget=null;
  function expandCard(c){
    focusReturnTarget=document.activeElement;
    const closeLabel=L('关闭放大视图（Esc）','Close expanded view (Esc)');
    focusDialog.innerHTML=`<div class="portal-focus-header"><div><span class="portal-overline">${L('图表查看','CHART VIEW')}</span><h2 id="portal-focus-title"></h2></div><button class="portal-focus-close" type="button" data-close-focus aria-label="${closeLabel}" title="${closeLabel}" autofocus><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div><p class="portal-focus-note">${L('按原始比例显示；按 Esc 或点击右上角关闭。','Original proportions. Press Esc or use the close button.')}</p>`;
    focusDialog.setAttribute('aria-labelledby','portal-focus-title');
    focusDialog.style.width=`${Math.min(1280,Math.max(520,c.getBoundingClientRect().width+48))}px`;
    focusDialog.querySelector('h2').textContent=c.querySelector('h2')?.textContent||label(report(view).name);
    const copy=prepareFocusCopy(c,c.cloneNode(true));
    focusDialog.append(copy);focusDialog.showModal();
    focusDialog.querySelector('[data-close-focus]').focus({preventScroll:true});
  }
  focusDialog.addEventListener('close',()=>{
    if(focusReturnTarget?.isConnected)focusReturnTarget.focus({preventScroll:true});
    focusReturnTarget=null;
  });
  document.addEventListener('click',e=>{
    const target=e.target.closest('button');
    if(e.target.closest('[data-mobile-menu]')){const open=!mobileOpen;closeMenu();mobileOpen=open;mobileNav.hidden=!open;overlay.hidden=!open;$('.portal-mobile-toggle').setAttribute('aria-expanded',String(open));return;}
    if(target?.dataset.route){route(target.dataset.route);return;}
    if(target?.dataset.category){openMenu(target.dataset.category);return;}
    if(e.target.closest('[data-close-menu]')||e.target===overlay){closeMenu();return;}
    if(e.target.closest('[data-search]')){openSearch();return;}
    if(e.target.closest('[data-language]')){$('#language-toggle').click();return;}
    if(e.target.closest('[data-close-search]')){searchDialog.close();return;}
    if(e.target.closest('[data-close-focus]')){focusDialog.close();return;}
    if(e.target.closest('[data-pin]')){favorites=favorites.includes(view)?favorites.filter(id=>id!==view):[...favorites,view];storage.set('engineering:favorites',favorites);renderReport();renderWorkspace();toast(favorites.includes(view)?L('已添加到常用报表','Added to your workspace'):L('已取消收藏','Removed from favorites'));return;}
    if(e.target.closest('[data-guide]')){guide.hidden=!guide.hidden;storage.set('engineering:guide-collapsed',guide.hidden);e.target.closest('[data-guide]').setAttribute('aria-expanded',String(!guide.hidden));return;}
    const expand=e.target.closest('[data-expand]');if(expand){expandCard(expand.closest('.chart-card'));return;}
    const download=e.target.closest('[data-export]');if(download){exportCard(download.closest('.chart-card'));return;}
    if(menu&&!header.contains(e.target))closeMenu();
  });
  searchDialog.addEventListener('input',e=>{if(e.target.matches('input'))filterSearch(e.target.value);});
  [searchDialog,focusDialog].forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const b=d.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)d.close();}}));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&mobileOpen){closeMenu();$('.portal-mobile-toggle')?.focus();}
    const editing=e.target.closest('input,textarea,select,[contenteditable="true"]');
    if((e.key==='/'&&!editing)||((e.ctrlKey||e.metaKey)&&e.key==='k')){e.preventDefault();if(!focusDialog.open&&!searchDialog.open)openSearch();}
    if(e.key==='Escape'&&menu){const id=menu;closeMenu();$(`[data-category="${id}"]`)?.focus();}
    if(e.target.matches('[data-category]')&&(e.key==='ArrowDown')){e.preventDefault();if(menu!==e.target.dataset.category)openMenu(e.target.dataset.category);mega.querySelector('[data-route]')?.focus();}
  });
  document.addEventListener('engineering:render',e=>{
    if(lang!==e.detail.language)closeMenu();
    const changed=view!==e.detail.view;lang=e.detail.language;view=e.detail.view;
    if(changed&&view!=='home'){recent=[view,...recent.filter(id=>id!==view)].slice(0,6);storage.set('engineering:recent',recent);}
    refresh();
  });
  refresh();
})();
