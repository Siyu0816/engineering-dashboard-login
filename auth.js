(() => {
  'use strict';
  const $=id=>document.getElementById(id),mode=location.pathname==='/setup'?'setup':location.pathname==='/register'?'register':'login';
  const registration=mode!=='login',form=$('auth-form'),message=$('auth-message');
  function show(text){message.textContent=text;message.hidden=false;}
  function setVisible(id,visible){$(id).hidden=!visible;}
  for(const id of ['name-field','department-field','confirm-field','password-hint'])setVisible(id,registration);
  setVisible('setup-field',mode==='setup');setVisible('login-options',!registration);setVisible('registration-note',mode==='register');setVisible('auth-tabs',mode!=='setup');
  $('full-name').required=registration;$('confirm-password').required=registration;$('setup-code').required=mode==='setup';
  if(registration){$('password').minLength=12;$('password').autocomplete='new-password';$('password').placeholder='设置 12–128 个字符的密码';}
  $(mode==='register'?'register-tab':'login-tab').setAttribute('aria-current','page');
  const titles={login:['欢迎回来','登录你的工作账户，继续查看运营报表。','登录工作空间','WELCOME BACK'],register:['加入企业工作空间','填写账户信息，提交企业成员访问申请。','提交注册申请','JOIN YOUR TEAM'],setup:['创建管理员账户','首次使用：请由网站负责人完成初始化。','创建管理员账户','SET UP YOUR WORKSPACE']};
  const text=titles[mode];$('auth-title').textContent=text[0];$('auth-description').textContent=text[1];$('submit-button').textContent=text[2];$('auth-kicker').textContent=text[3];document.title=text[0]+' · 工程部运营中心';
  document.querySelectorAll('[data-toggle-password]').forEach(button=>button.addEventListener('click',()=>{const input=$(button.dataset.togglePassword),visible=input.type==='password';input.type=visible?'text':'password';button.textContent=visible?'隐藏':'显示';button.setAttribute('aria-pressed',String(visible));button.setAttribute('aria-label',(visible?'隐藏':'显示')+(input.id==='confirm-password'?'确认密码':'密码'));}));
  for(const id of ['password','confirm-password'])$(id).addEventListener('input',()=>{$('confirm-password').setCustomValidity('');});
  const help=$('help-dialog');for(const id of ['access-help','password-help'])$(id).addEventListener('click',()=>help.showModal());$('close-help').addEventListener('click',()=>help.close());
  help.addEventListener('click',event=>{if(event.target===help){const r=help.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)help.close();}});
  form.addEventListener('submit',async event=>{
    event.preventDefault();message.hidden=true;
    if(registration&&$('password').value!==$('confirm-password').value){$('confirm-password').setCustomValidity('两次输入的密码不一致。');$('confirm-password').reportValidity();return;}
    const button=$('submit-button');button.disabled=true;button.textContent=mode==='login'?'正在登录…':'正在提交…';
    try{
      const response=await fetch('/api/auth/'+mode,{method:'POST',headers:{'Content-Type':'application/json','X-Enterprise-Request':'1'},body:JSON.stringify({name:$('full-name').value.trim(),email:$('email').value.trim(),department:$('department').value.trim(),password:$('password').value,setupCode:$('setup-code').value.trim(),remember:$('remember').checked})});
      const result=await response.json();if(!response.ok)throw new Error(result.message||'暂时无法提交，请稍后重试。');
      if(mode==='login'){location.replace('/');return;}
      form.reset();form.hidden=true;$('auth-success').hidden=false;$('auth-bottom-note').hidden=true;
      if(mode==='setup'){$('success-title').textContent='工作空间已准备就绪';$('success-description').textContent='管理员账户已创建。现在可以登录并审核团队成员的注册申请。';}
    }catch(error){show(error.message==='Failed to fetch'?'无法连接网站服务，请确认启动窗口仍在运行。':error.message);}finally{button.disabled=false;button.textContent=text[2];}
  });
  fetch('/api/auth/status').then(r=>r.json()).then(data=>{if(data.needsSetup&&mode!=='setup')location.replace('/setup');else if(!data.needsSetup&&mode==='setup')location.replace('/login');}).catch(()=>show('无法连接网站服务，请确认启动窗口仍在运行。'));
  if(new URLSearchParams(location.search).has('passwordChanged'))show('密码已更新，请使用新密码登录。');
})();
