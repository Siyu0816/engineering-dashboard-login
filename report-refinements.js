(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const svgNode=(tag,attrs={},text)=>{const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));if(text!==undefined)n.textContent=text;return n;};
  function monthly(container,rows,o){
    const L=(zh,en)=>o.language==='en'?en:zh;
    container.replaceChildren();container.className='chart monthly-line-chart';container.dataset.portal='';
    const legend=document.createElement('div');legend.className='monthly-legend';
    for(const [label,color,cls] of [[L('实际成本','Actual cost'),'#11117a','actual'],[L('预算','Budget'),'#a86613','budget']]){const item=document.createElement('span'),swatch=document.createElement('i');swatch.style.borderColor=color;swatch.className=cls;item.append(swatch,document.createTextNode(label));legend.append(item);}container.append(legend);
    const w=Math.max(240,container.clientWidth-36),h=320,left=w<500?49:70,right=20,top=30,bottom=275,plot=w-left-right;
    const maxRaw=Math.max(1,...rows.flatMap(r=>[r.actual,r.budget??0]))*1.18,min=Math.min(0,...rows.flatMap(r=>[r.actual,r.budget??0]));
    const magnitude=10**Math.floor(Math.log10(maxRaw/5)),step=Math.ceil(maxRaw/5/magnitude)*magnitude,max=Math.ceil(maxRaw/step)*step;
    const y=v=>bottom-(v-min)/(max-min)*(bottom-top),x=i=>left+(rows.length===1?plot/2:i*plot/(rows.length-1));
    const svg=svgNode('svg',{viewBox:`0 0 ${w} ${h}`,width:w,height:h,class:'monthly-cost-svg',role:'img','aria-label':L('月度预算与实际成本折线图','Monthly budget and actual cost line chart')});container.append(svg);
    for(let i=0;i<=5;i++){const v=min+(max-min)*i/5,py=y(v);svg.append(svgNode('line',{x1:left,y1:py,x2:w-right,y2:py,stroke:'#e9eaf2','stroke-dasharray':'3 5'}));svg.append(svgNode('text',{x:left-8,y:py+4,'text-anchor':'end',class:'monthly-axis'},o.axis(v)));}
    const actualPath=rows.map((r,i)=>(i?'L':'M')+x(i)+','+y(r.actual)).join(' ');
    svg.append(svgNode('path',{d:actualPath+` L${x(rows.length-1)},${y(0)} L${x(0)},${y(0)} Z`,fill:'#11117a',opacity:.07}));
    const budgets=rows.map((r,i)=>r.budget===null?null:[x(i),y(r.budget)]).filter(Boolean);if(budgets.length)svg.append(svgNode('path',{class:'monthly-budget-line',d:budgets.map((p,i)=>(i?'L':'M')+p.join(',')).join(' '),fill:'none',stroke:'#a86613','stroke-width':2.5,'stroke-dasharray':'6 5'}));
    svg.append(svgNode('path',{class:'monthly-actual-line',d:actualPath,fill:'none',stroke:'#11117a','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'}));
    rows.forEach((r,i)=>{const tip=`${r.label}\n${L('预算','Budget')}: ${r.budget===null?'—':o.money(r.budget)}\n${L('实际成本','Actual cost')}: ${o.money(r.actual)}`;
      const g=svgNode('g',{tabindex:0,role:'button','data-tooltip':tip,'aria-label':tip,class:'monthly-point'});g.append(svgNode('circle',{cx:x(i),cy:y(r.actual),r:w<500?3.8:4.5,fill:r.budget!==null&&r.actual>r.budget?'#df4658':'#11117a',stroke:'#fff','stroke-width':2}));g.append(svgNode('rect',{x:x(i)-10,y:top,width:20,height:bottom-top,fill:'transparent'}));
      g.addEventListener('click',()=>o.onSelect(r.key));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.onSelect(r.key);}});svg.append(g);
      if(w>=650)svg.append(svgNode('text',{x:x(i),y:y(r.actual)-13,'text-anchor':'middle',class:'monthly-value'},o.compact(r.actual)));
      svg.append(svgNode('text',{x:x(i),y:bottom+26,'text-anchor':'middle',class:'monthly-axis'},r.label));
    });
  }
  function approval(container,total,approved,o){
    const L=(zh,en)=>o.language==='en'?en:zh,ratio=total>0?approved/total:null;
    container.replaceChildren();container.classList.add('approval-comparison');container.dataset.portal='';
    const visual=document.createElement('div');visual.className='approval-visual';
    const svg=svgNode('svg',{viewBox:'0 0 240 240',role:'img','aria-label':L('已批准预算占总预算的比例','Approved budget as a share of total budget')});
    const ring=(r,stroke,width)=>svgNode('circle',{cx:120,cy:120,r,fill:'none',stroke,'stroke-width':width});
    svg.append(ring(91,'#e3e6ef',13));
    const circle=ring(91,'#11117a',13),circumference=2*Math.PI*91;
    circle.setAttribute('stroke-dasharray',`${Math.min(1,Math.max(0,ratio??0))*circumference} ${circumference}`);circle.setAttribute('transform','rotate(-90 120 120)');circle.setAttribute('stroke-linecap','round');circle.setAttribute('data-tooltip',L('已批准预算','Approved budget')+': '+o.money(approved));svg.append(circle);
    if(ratio>1){const extra=ring(107,'#df4658',5),length=Math.min(1,ratio-1)*2*Math.PI*107;extra.setAttribute('stroke-dasharray',`${length} ${2*Math.PI*107}`);extra.setAttribute('transform','rotate(-90 120 120)');extra.setAttribute('stroke-linecap','round');extra.setAttribute('data-tooltip',L('超出总预算 ','Above total budget ')+o.money(approved-total));svg.append(extra);}
    svg.append(svgNode('text',{x:120,y:119,'text-anchor':'middle',class:'approval-percent'},ratio===null?'—':(ratio*100).toFixed(1)+'%'));
    svg.append(svgNode('text',{x:120,y:144,'text-anchor':'middle',class:'approval-caption'},L('批准 / 总预算','Approved / Total')));visual.append(svg);
    const details=document.createElement('div');details.className='approval-details';
    for(const [label,value,cls] of [[L('总预算','Total budget'),total,'total'],[L('已批准预算','Approved budget'),approved,'approved'],[approved>total?L('超出总预算','Above total budget'):L('尚未批准额度','Unapproved allocation'),Math.abs(total-approved),approved>total?'over':'remaining']]){const row=document.createElement('div');row.className='approval-amount '+cls;const name=document.createElement('span'),amount=document.createElement('strong');name.textContent=label;amount.textContent=o.money(value);row.append(name,amount);details.append(row);}
    const note=document.createElement('p');note.className='approval-note';note.textContent=L('比例以总预算为基准；超过 100% 的部分单独标示。','Ratio is measured against total budget. The part above 100% is marked separately.');details.append(note);container.append(visual,details);
  }
  function distribution(container,rows,o){
    const L=(zh,en)=>o.language==='en'?en:zh;
    const total=rows.reduce((sum,row)=>sum+row.value,0);
    container.replaceChildren();container.classList.add('capex-distribution-expanded');container.dataset.portal='';
    const visual=document.createElement('div');visual.className='distribution-visual';
    const svg=svgNode('svg',{viewBox:'0 0 240 240',role:'img','aria-label':L('未收货、采购申请和已收货金额构成','Unreceived, purchase requisitions and received amounts')});
    const radius=91,circumference=2*Math.PI*radius;
    svg.append(svgNode('circle',{cx:120,cy:120,r:radius,fill:'none',stroke:'#e3e6ef','stroke-width':24}));
    let offset=0;
    for(const row of rows){const length=total>0?row.value/total*circumference:0;if(length>0){const tip=row.label+': '+o.money(row.value)+' · '+o.percentage(row.value/total*100);svg.append(svgNode('circle',{cx:120,cy:120,r:radius,fill:'none',stroke:row.color,'stroke-width':24,'stroke-dasharray':`${Math.max(0,length-4)} ${circumference}`,'stroke-dashoffset':-offset,transform:'rotate(-90 120 120)',tabindex:0,'data-tooltip':tip,'aria-label':tip}));}offset+=length;}
    svg.append(svgNode('text',{x:120,y:117,'text-anchor':'middle',class:'distribution-total'},o.money(total)));
    svg.append(svgNode('text',{x:120,y:143,'text-anchor':'middle',class:'distribution-caption'},L('合计占用','Total committed')));visual.append(svg);
    const details=document.createElement('div');details.className='distribution-details';
    for(const row of rows){const item=document.createElement('div');item.className='distribution-item';const dot=document.createElement('i');dot.style.background=row.color;const body=document.createElement('div'),label=document.createElement('span'),values=document.createElement('div'),amount=document.createElement('strong'),percent=document.createElement('small');label.className='distribution-label';label.textContent=row.label;values.className='distribution-values';amount.textContent=o.money(row.value);percent.textContent=total>0?o.percentage(row.value/total*100):'—';values.append(amount,percent);body.append(label,values);item.append(dot,body);details.append(item);}
    container.append(visual,details);
  }
  function composition(container, rows, o) {
    container.replaceChildren();
    container.classList.add('spending-composition');
    container.dataset.portal='';
    const total=rows.reduce((sum,row)=>sum+row.value,0);
    const visual=document.createElement('div');visual.className='composition-visual';
    const svg=svgNode('svg',{viewBox:'0 0 240 240',role:'img','aria-label':o.label});
    const radius=90,circumference=2*Math.PI*radius;
    svg.append(svgNode('circle',{cx:120,cy:120,r:radius,fill:'none',stroke:'#eef0f7','stroke-width':26}));
    let offset=0;
    const details=document.createElement('div');details.className='composition-details';
    rows.forEach(row=>{
      const share=row.value/total, length=share*circumference;
      const tip=`${o.translate(row.label)}\n${o.exact(row.value)} · ${o.percentage(share*100)}`;
      const segment=svgNode('circle',{cx:120,cy:120,r:radius,fill:'none',stroke:row.color,'stroke-width':26,'stroke-dasharray':`${Math.max(0,length-3)} ${circumference}`,'stroke-dashoffset':-offset,transform:'rotate(-90 120 120)','data-tooltip':tip,'aria-label':tip});
      svg.append(segment);offset+=length;
      const button=document.createElement('button');button.type='button';button.className='composition-item';button.dataset.tooltip=tip;button.setAttribute('aria-label',tip);button.style.setProperty('--slice',row.color);
      const label=document.createElement('span');label.className='composition-label';label.textContent=o.translate(row.label);
      const values=document.createElement('span');values.className='composition-values';
      const amount=document.createElement('strong');amount.textContent=o.money(row.value);
      const percent=document.createElement('span');percent.textContent=o.percentage(share*100);values.append(amount,percent);
      const track=document.createElement('span');track.className='composition-track';const bar=document.createElement('i');bar.style.width=`${share*100}%`;track.append(bar);
      button.append(label,values,track);button.addEventListener('click',()=>o.onSelect(row));segment.addEventListener('click',()=>o.onSelect(row));details.append(button);
    });
    svg.append(svgNode('text',{x:120,y:117,'text-anchor':'middle',class:'distribution-total'},o.money(total)));
    svg.append(svgNode('text',{x:120,y:143,'text-anchor':'middle',class:'distribution-caption'},o.totalLabel));
    visual.append(svg);container.append(visual,details);
  }
  const monthExpansion=new Map();
  function dailySummary(container,rows,o){
    const L=(zh,en)=>o.language==='en'?en:zh;
    const now=new Date(),currentMonth=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const groups=new Map();for(const row of rows){const key=`${row.year}-${String(row.month).padStart(2,'0')}`;if(!groups.has(key))groups.set(key,{year:row.year,month:row.month,states:new Map()});groups.get(key).states.set(row.state,row);}
    const order=['Unplanned','Not started','Ongoing','Done','Total','Completed Rate'];
    container.replaceChildren();container.classList.add('daily-summary-expanded');container.dataset.portal='';container.closest('.chart-card')?.classList.add('daily-summary-card');
    if(rows.length){
      const actions=document.createElement('div');actions.className='daily-summary-actions';
      const monthToggles=[];
      for(const [label,open] of [[L('全部展开','Expand all'),true],[L('全部收起','Collapse all'),false]]){const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>monthToggles.forEach(toggle=>toggle(open)));actions.append(b);}container.append(actions);
      const table=document.createElement('table');table.className='data-table daily-summary-single';
      const caption=document.createElement('caption');caption.className='sr-only';caption.textContent=L('每日工单完整汇总','Complete daily work-order summary');table.append(caption);
      const head=document.createElement('thead'),header=document.createElement('tr');
      for(const label of [L('日期','Date'),...order.map(o.translate)]){const th=document.createElement('th');th.scope='col';th.textContent=label;header.append(th);}head.append(header);table.append(head);
      for(const [key,group] of [...groups].sort(([a],[b])=>a.localeCompare(b))){
        const body=document.createElement('tbody');body.dataset.month=key;body.id='daily-month-'+key;
        const heading=document.createElement('tbody'),band=document.createElement('tr');band.className='daily-month-band';const title=document.createElement('th');title.colSpan=7;title.scope='rowgroup';
        const trigger=document.createElement('button');trigger.type='button';trigger.className='daily-month-toggle';trigger.setAttribute('aria-controls',body.id);
        const arrow=document.createElement('span');arrow.className='daily-month-arrow';arrow.textContent='›';arrow.setAttribute('aria-hidden','true');const name=document.createElement('span');name.textContent=new Intl.DateTimeFormat(o.language==='en'?'en':'zh-CN',{year:'numeric',month:'long'}).format(new Date(group.year,group.month-1,1));trigger.append(arrow,name);title.append(trigger);band.append(title);heading.append(band);table.append(heading);
        const setOpen=open=>{body.hidden=!open;trigger.setAttribute('aria-expanded',String(open));monthExpansion.set(key,open);};setOpen(monthExpansion.get(key)??(key===currentMonth));trigger.addEventListener('click',()=>setOpen(body.hidden));monthToggles.push(setOpen);
        const days=new Date(group.year,group.month,0).getDate();
        for(let day=1;day<=days;day++){
          const tr=document.createElement('tr');tr.dataset.date=key+'-'+String(day).padStart(2,'0');
          const date=document.createElement('th');date.scope='row';const time=document.createElement('time');time.dateTime=tr.dataset.date;time.textContent=String(group.month).padStart(2,'0')+'/'+String(day).padStart(2,'0');date.append(time);tr.append(date);
          for(const state of order){const td=document.createElement('td'),v=group.states.get(state)?.[`day${day}`];td.dataset.state=state;td.textContent=v==null?'—':state==='Completed Rate'?o.percentage(Number(v)*100):o.number.format(Number(v));if(state==='Total')td.className='daily-total-cell';if(state==='Completed Rate')td.className='daily-rate-cell';tr.append(td);}body.append(tr);
        }table.append(body);
      }container.append(table);
    }
    if(!rows.length){const p=document.createElement('p');p.className='empty-state';p.textContent=L('当前筛选条件下没有数据','No data for this selection');container.append(p);}
  }
  window.EngineeringReportViews={monthly,approval,distribution,composition,dailySummary};
})();
