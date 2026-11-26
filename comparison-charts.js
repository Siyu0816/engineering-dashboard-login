/* Responsive vertical comparisons: budget underneath actual, with an annual cost/kg line. */
(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg',modes=new Map();
  const node=(tag,attrs={},text)=>{const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));if(text!==undefined)n.textContent=text;return n;};
  const valid=value=>value!=null&&!/^(?:\s*|unmapped|unknown|unassigned|not mapped|未映射|未匹配|未分配|设备未匹配|\(blank\)|source text)$/i.test(String(value).trim());
  function render(container,input,o){
    const rows=input.filter(r=>valid(r.key)&&valid(r.label));
    const L=(zh,en)=>o.language==='en'?en:zh,money=o.formatMoney,exact=o.formatExact||money;
    const C={budget:'#e7e9f4',outline:'#c5cce9',actual:'#11117a',over:'#df4658',text:'#252640',muted:'#697087',line:'#e9eaf2',rate:'#e3ad00'};
    let mode=modes.get(container.id)||'amount';container.classList.add('comparison-chart');container.dataset.portal='';
    const delta=r=>r.budget===null?null:r.actual-r.budget,ratio=r=>r.budget>0?r.actual/r.budget*100:null;
    const signed=(v,format=money)=>(v>0?'+':v<0?'−':'')+format(Math.abs(v));
    function draw(){
      container.replaceChildren();
      if(!rows.length){const empty=document.createElement('p');empty.className='empty-state';empty.textContent=L('当前筛选条件下没有数据','No data for this selection');container.append(empty);return;}
      const budget=rows.some(r=>r.budget===null)?null:rows.reduce((s,r)=>s+r.budget,0),actual=rows.reduce((s,r)=>s+r.actual,0),d=budget===null?null:actual-budget;
      const controls=document.createElement('div');controls.className='cmp-topline';const summary=document.createElement('span');summary.className='cmp-summary';
      summary.textContent=d===null?L('无可比预算','No comparable budget'):d===0?L('实际成本与预算一致','Actual matches budget'):(d>0?L('超出预算 ','Over budget '):L('低于预算 ','Under budget '))+exact(Math.abs(d));if(o.kind==='annual')summary.textContent=L('跨年合计 · ','All years · ')+summary.textContent;summary.classList.toggle('is-over',d>0);
      const toggle=document.createElement('div');toggle.className='cmp-mode';toggle.setAttribute('role','group');toggle.setAttribute('aria-label',L('比较方式','Comparison mode'));
      [['amount',L('金额对比','Amount')],['ratio',L('预算执行率','Utilization')]].forEach(([id,label])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.cmpMode=id;b.setAttribute('aria-pressed',String(mode===id));b.addEventListener('click',()=>{mode=id;modes.set(container.id,id);draw();container.querySelector(`[data-cmp-mode="${id}"]`).focus({preventScroll:true});});toggle.append(b);});controls.append(summary,toggle);container.append(controls);
      const legend=document.createElement('div');legend.className='cmp-legend';const legends=[[L('预算 · 底柱','Budget · background'),'budget'],[L('实际成本 · 前柱','Actual · foreground'),'actual'],[L('超预算','Over budget'),'over']];if(o.kind==='annual')legends.push([L('实际成本 / kg','Actual cost / kg'),'rate']);
      legends.forEach(([label,cls])=>{const item=document.createElement('span'),swatch=document.createElement('i');swatch.className=cls;item.append(swatch,document.createTextNode(label));legend.append(item);});container.append(legend);
      const plot=document.createElement('div');plot.className='cmp-scroll';container.append(plot);
      const w=Math.max(220,plot.clientWidth),left=w<500?48:70,right=o.kind==='annual'&&w>=500?68:16;
      const compact=w<500;
      container.classList.toggle('cmp-compact',compact);
      // A report always has one plot, including on mobile.
      const chunks=[rows];
      const seriesValues=rows.flatMap(r=>mode==='ratio'?[100,ratio(r)??0]:[r.budget??0,r.actual]);
      let min=Math.min(0,...seriesValues),max=Math.max(1,...seriesValues)*1.16;
      const raw=(max-min)/5,power=10**Math.floor(Math.log10(raw)),norm=raw/power,step=[1,2,2.5,5,10].reduce((b,n)=>Math.abs(n-norm)<Math.abs(b-norm)?n:b,1)*power;max=Math.ceil(max/step)*step;min=Math.floor(min/step)*step;
      const rates=rows.map(r=>r.extra).filter(v=>Number.isFinite(v));const rateMax=Math.max(.1,...rates)*1.25;
      for(const chunk of chunks){
        const annual=o.kind==='annual',h=annual?390:320,top=annual?160:90,bottom=h-(compact&&rows.length>4?100:65),plotWidth=w-left-right,slot=plotWidth/chunk.length;
        const svg=node('svg',{class:'cmp-svg',viewBox:`0 0 ${w} ${h}`,width:w,height:h,role:'img','aria-label':L('预算与实际成本对比','Budget and actual cost comparison')});plot.append(svg);
        const y=v=>bottom-(v-min)/(max-min)*(bottom-top);
        for(let i=0;i<=5;i++){const v=min+(max-min)*i/5,py=y(v);svg.append(node('line',{x1:left,y1:py,x2:w-right,y2:py,stroke:C.line,'stroke-dasharray':'3 5'}));svg.append(node('text',{x:left-8,y:py+4,class:'cmp-tick','text-anchor':'end'},mode==='ratio'?Math.round(v)+'%':o.formatAxis(v)));}
        if(mode==='ratio')svg.append(node('line',{x1:left,y1:y(100),x2:w-right,y2:y(100),stroke:C.outline,'stroke-width':1.5,'stroke-dasharray':'6 4'}));
        if(annual){
          svg.append(node('text',{x:left,y:17,class:'cmp-rate-heading'},L('实际成本 / kg','Actual cost / kg')));
          const rateY=v=>82-v/rateMax*48;
          const points=chunk.map((r,i)=>Number.isFinite(r.extra)?{x:left+(i+.5)*slot,y:rateY(r.extra),r}:null).filter(Boolean);
          for(let i=0;i<=2;i++){const v=rateMax*i/2,py=rateY(v);svg.append(node('line',{x1:left,y1:py,x2:w-right,y2:py,stroke:'#ece6dc'}));if(w>=500)svg.append(node('text',{x:w-right+9,y:py+4,class:'cmp-tick'},o.extraFormat(v)));}
          if(points.length)svg.append(node('path',{class:'cmp-costkg-line',d:points.map((p,i)=>(i?'L':'M')+p.x+','+p.y).join(' '),fill:'none',stroke:C.rate,'stroke-width':2.5}));
          for(const p of points){const tip=p.r.label+' · '+L('实际成本 / kg','Actual cost / kg')+': '+o.extraFormat(p.r.extra);svg.append(node('circle',{cx:p.x,cy:p.y,r:4,fill:C.rate,stroke:'#fff','stroke-width':2,tabindex:0,'data-tooltip':tip,'aria-label':tip}));svg.append(node('text',{x:p.x,y:p.y-11,'text-anchor':'middle',class:'cmp-rate-value'},o.extraFormat(p.r.extra)));}
        }
        chunk.forEach((r,i)=>{
          const cx=left+(i+.5)*slot,over=r.budget!==null&&r.actual>r.budget;
          const tip=`${r.label}\n${L('预算','Budget')}: ${r.budget===null?'—':exact(r.budget)}\n${L('实际成本','Actual cost')}: ${exact(r.actual)}\n${L('差额（实际 − 预算）','Δ (Actual − Budget)')}: ${delta(r)===null?'—':signed(delta(r),exact)}\n${L('执行率','Utilization')}: ${ratio(r)===null?'—':ratio(r).toFixed(1)+'%'}`;
          const g=node('g',{class:'cmp-interactive','data-tooltip':tip,'aria-label':tip,tabindex:0,role:'button'});g.addEventListener('click',()=>o.onSelect?.(r.key));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.onSelect?.(r.key);}});svg.append(g);
          const labelTop=annual?110:26,format=slot>=70?exact:money;
          [[(compact&&slot<70?'B ':L('预算 ','B '))+(r.budget===null?'—':money(r.budget)),C.muted],[(compact&&slot<70?'A ':L('实际 ','A '))+money(r.actual),over?C.over:C.actual],[(compact&&slot<70?'Δ ':L('差额 ','Δ '))+(delta(r)===null?'—':signed(delta(r),format)),over?C.over:C.muted]].forEach(([s,color],j)=>{const attrs={x:cx,y:labelTop+j*18,class:j===2?'cmp-delta':'cmp-bar-value',fill:color,'text-anchor':'middle'};if(compact){attrs.textLength=Math.min(s.length*5.2,slot-4);attrs.lengthAdjust='spacingAndGlyphs';}g.append(node('text',attrs,s));});
          const budgetWidth=Math.min(74,slot*.62),actualWidth=budgetWidth*.46;
          const bars=mode==='ratio'?[[r.budget>0?100:null,'budget',budgetWidth,C.budget],[ratio(r),'actual',actualWidth,over?C.over:C.actual]]:[[r.budget,'budget',budgetWidth,C.budget],[r.actual,'actual',actualWidth,over?C.over:C.actual]];
          for(const [v,series,width,color] of bars){if(v===null)continue;g.append(node('rect',{'data-series':series,'data-value':v,x:cx-width/2,y:Math.min(y(v),y(0)),width,height:Math.abs(y(v)-y(0)),rx:4,fill:color,stroke:series==='budget'?C.outline:'none','stroke-width':1.1}));}
          if(mode==='ratio')g.append(node('text',{x:cx,y:bottom+16,'text-anchor':'middle',class:'cmp-delta',fill:over?C.over:C.actual},ratio(r)===null?'—':ratio(r).toFixed(1)+'%'));
          let lines=[''];const maxChars=Math.max(2,Math.floor(slot/(compact?8:7.5)));
          const words=[];for(const word of r.label.split(/\s+/)){if(word.length>maxChars){for(let k=0;k<word.length;k+=maxChars)words.push(word.slice(k,k+maxChars));}else words.push(word);}
          for(const word of words){const current=lines[lines.length-1],separator=current&&/\s/.test(r.label)?' ':'';if(current.length+word.length+separator.length>maxChars&&current)lines.push(word);else lines[lines.length-1]+=separator+word;}
          const label=node('text',{x:cx,y:bottom+(mode==='ratio'?35:26),class:'cmp-category','text-anchor':'middle'});lines.forEach((s,j)=>label.append(node('tspan',{x:cx,dy:j?15:0},s)));g.append(label);
        });
      }
      const hint=document.createElement('p');hint.className='cmp-hint';hint.textContent=L('预算为浅色底柱，实际成本为前景窄柱；差额 = 实际 − 预算。','Budget: light background. Actual: narrow foreground. Δ = actual − budget.')+(mode==='ratio'?L(' 虚线为 100% 预算基准。',' Dashed line: 100% budget.'):L(' 点击类别可联动筛选。',' Select a category to filter.'));container.append(hint);
    }
    draw();
  }
  window.EngineeringComparison={render};
})();
