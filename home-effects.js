(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const top=document.createElement('button');top.className='exp-back-top';top.type='button';top.textContent='↑';document.body.append(top);
  const translate=()=>{const en=document.documentElement.lang==='en';document.querySelectorAll('[data-zh][data-en]').forEach(el=>el.innerHTML=en?el.dataset.en:el.dataset.zh);top.setAttribute('aria-label',en?'Back to top':'返回顶部');};
  top.addEventListener('click',()=>scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
  document.addEventListener('click',event=>{const link=event.target.closest('a[href="#home-modules"]');if(link){event.preventDefault();document.getElementById('home-modules').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}});
  let frame=0,previous=document.body.dataset.view;
  function update(){frame=0;top.classList.toggle('visible',scrollY>450);const progress=document.querySelector('.exp-progress');if(progress)progress.style.transform=`scaleX(${Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))})`;}
  addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});
  new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  new MutationObserver(()=>{const next=document.body.dataset.view;if(next!==previous){previous=next;scrollTo({top:0,behavior:'instant'});update();}}).observe(document.body,{attributes:true,attributeFilter:['data-view']});
  translate();update();
})();
