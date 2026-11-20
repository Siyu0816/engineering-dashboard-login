(() => {
  'use strict';
  let current=null,lastChecked=0,inflight=null;
  function redirect(){document.body.style.visibility='hidden';location.replace('/login');}
  async function check(){
    if(inflight)return inflight;
    inflight=(async()=>{const response=await fetch('/api/auth/session',{cache:'no-store'});if(response.status===401){redirect();throw new Error('请重新登录。');}if(!response.ok)throw new Error('暂时无法验证账户，请刷新页面。');current=await response.json();lastChecked=Date.now();return current;})().finally(()=>inflight=null);
    return inflight;
  }
  async function request(url,input){
    if(!current)await check();
    const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','X-Enterprise-Request':'1','X-CSRF-Token':current.csrf},body:JSON.stringify(input||{})});
    if(response.status===401){redirect();throw new Error('请重新登录。');}
    const result=await response.json();if(!response.ok)throw new Error(result.message||'操作未完成，请重试。');return result;
  }
  async function logout(button){
    if(button)button.disabled=true;
    try{await request('/api/auth/logout');redirect();}catch(error){if(button){button.disabled=false;button.textContent=error.message;}}
  }
  async function mount(container){
    if(!container)return;
    const existing=container.querySelector('.enterprise-account');if(existing)existing.remove();
    const details=document.createElement('details');details.className='enterprise-account';
    const summary=document.createElement('summary');summary.className='enterprise-account-trigger';summary.setAttribute('aria-label','账户菜单');
    const avatar=document.createElement('span');avatar.className='enterprise-account-avatar';avatar.textContent='…';
    const name=document.createElement('span');name.className='enterprise-account-name';name.textContent='账户';summary.append(avatar,name);
    const panel=document.createElement('div');panel.className='enterprise-account-panel';details.append(summary,panel);container.append(details);
    try{
      const {user}=current||await check();if(!details.isConnected)return;
      avatar.textContent=Array.from(user.name)[0];name.textContent=user.name;
      const identity=document.createElement('div');identity.className='enterprise-account-identity';const strong=document.createElement('strong'),email=document.createElement('small');strong.textContent=user.name;email.textContent=user.email;identity.append(strong,email);panel.append(identity);
      const account=document.createElement('a');account.href='/account';account.textContent='个人账户';panel.append(account);
      if(user.role==='admin'){const admin=document.createElement('a');admin.href='/admin';admin.textContent='成员与注册审核';panel.append(admin);}
      const exit=document.createElement('button');exit.type='button';exit.textContent='退出登录';exit.addEventListener('click',()=>logout(exit));panel.append(exit);
    }catch(error){name.textContent='重试验证';summary.addEventListener('click',()=>location.reload(),{once:true});}
    details.addEventListener('toggle',()=>{if(details.open)document.querySelectorAll('.enterprise-account').forEach(other=>{if(other!==details)other.open=false;});});
  }
  window.EnterpriseAuth={check,request,mount,logout};
  if(location.protocol==='file:'){
    const overlay=document.createElement('section');overlay.className='launch-required';overlay.innerHTML='<div><h1>请通过网站服务打开</h1><p>网站已启用企业账户。请双击文件夹中的“启动企业网站.cmd”，然后打开启动窗口显示的网址。</p><p>首次使用需要创建管理员账户。</p></div>';document.body.append(overlay);return;
  }
  check().catch(()=>{});
  addEventListener('pageshow',event=>{if(event.persisted)check().catch(()=>{});});
  addEventListener('focus',()=>{if(Date.now()-lastChecked>10000)check().catch(()=>{});});
  document.addEventListener('click',event=>{if(!event.target.closest('.enterprise-account'))document.querySelectorAll('.enterprise-account[open]').forEach(menu=>menu.open=false);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.enterprise-account[open]').forEach(menu=>{menu.open=false;menu.querySelector('summary').focus();});});
})();
