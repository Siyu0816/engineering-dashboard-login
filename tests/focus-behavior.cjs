// Verify the production expanded-view preparation without browser dependencies.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const portal=fs.readFileSync(path.join(root,'portal.js'),'utf8');
const start=portal.indexOf('  function prepareFocusCopy('),end=portal.indexOf('\n  let focusReturnTarget',start);
assert(start>=0&&end>start);
function element(attributes={}) {
  return {attributes:{...attributes},dataset:{},style:{setProperty(k,v){this[k]=v;}},
    setAttribute(k,v){this.attributes[k]=v;},getAttribute(k){return this.attributes[k]??null;},
    removeAttribute(k){delete this.attributes[k];},getBoundingClientRect(){return {width:360,height:300};}};
}
const originals=[element(),element()];
const computed=[
  {display:'grid',gridTemplateColumns:'200px 140px',getPropertyValue:k=>({display:'grid',gap:'16px','align-items':'center'}[k]||'')},
  {display:'block',getPropertyValue:k=>k==='display'?'block':''}
];
const charts=[element(),element()];
const svgs=[element({viewBox:'0 0 240 240',preserveAspectRatio:'none'}),element({viewBox:'0 0 1200 400',preserveAspectRatio:'none'}),element({viewBox:'0 0 350 300'})];
const removed={id:'old-chart',...element({id:'old-chart'})},hidden={hidden:true};
const source={getBoundingClientRect:()=>({width:650,height:420}),querySelectorAll:()=>originals};
const copy={...element(),querySelector:()=>null,querySelectorAll:selector=>({'.chart':charts,'svg':svgs,'[id]':[removed],'tbody[hidden]':[hidden]}[selector]||[])};
const context={getComputedStyle:n=>computed[originals.indexOf(n)],document:{}};
vm.createContext(context);vm.runInContext(portal.slice(start,end),context);
const result=context.prepareFocusCopy(source,copy);
assert.equal(result,copy);
assert.equal(copy.className,'portal-focus-content');
assert.equal(copy.style['--focus-content-width'],'650px','preserve normal card width');
assert.equal(charts[0].style.gridTemplateColumns,'minmax(0,200fr) minmax(0,140fr)','preserve ring/data proportions without fixed columns');
assert.equal(charts[0].style['--focus-chart-width'],'360px');
for(const svg of svgs)assert.equal(svg.attributes.preserveAspectRatio,'xMidYMid meet');
assert.equal(svgs[0].style['--focus-svg-ratio'],'240 / 240','round ring stays square');
assert.equal(svgs[1].style['--focus-svg-ratio'],'1200 / 400','wide chart keeps native shape');
assert.equal(svgs[2].style['--focus-svg-ratio'],'350 / 300','gauge keeps original geometry');
assert.equal(removed.attributes.id,undefined);assert.equal(removed.dataset.focusSourceId,'old-chart');
assert.equal(hidden.hidden,false,'static daily summary exposes collapsed rows');
const css=fs.readFileSync(path.join(root,'focus-view.css'),'utf8');
assert(css.includes('height:auto!important')&&css.includes('aspect-ratio:var(--focus-svg-ratio,auto)'));
assert(css.includes('flex:0 0 44px')&&css.includes(':focus-visible'));
console.log('Passed: native chart dimensions, circle/wide/gauge aspect ratios, proportional layouts, duplicate-ID removal, expanded summary rows and accessible close-button styling.');
