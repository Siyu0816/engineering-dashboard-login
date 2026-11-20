(() => {
  'use strict';const $=id=>document.getElementById(id),auth=window.EnterpriseAuth;let users=[];
  function show(text,success=false){const box=$('account-message');box.textContent=text;box.classList.toggle('success',success);box.hidden=false;}
  const statuses={active:'已启用',pending:'待审核',disabled:'已停用'};
  function renderMembers(){
    const query=$('member-search').value.trim().toLowerCase(),rows=users.filter(user=>[user.name,user.email,user.department].some(value=>value.toLowerCase().includes(query)));
    $('member-summary').textContent=`${users.length} 位成员 · ${users.filter(user=>user.status==='pending').length} 位待审核`;
    const tbody=$('member-list');tbody.replaceChildren();
    if(!rows.length){const row=document.createElement('tr'),cell=document.createElement('td');cell.colSpan=5;cell.className='member-empty';cell.textContent='没有符合条件的成员';row.append(cell);tbody.append(row);return;}
    for(const user of rows){
      const row=document.createElement('tr'),person=document.createElement('td'),identity=document.createElement('div'),name=document.createElement('span'),email=document.createElement('small');identity.className='member-person';name.textContent=user.name;email.textContent=user.email;identity.append(name,email);person.append(identity);row.append(person);
      for(const value of [user.department||'未填写',user.role==='admin'?'管理员':'成员']){const cell=document.createElement('td');cell.textContent=value;row.append(cell);}
      const statusCell=document.createElement('td'),status=document.createElement('span');status.className='member-status '+user.status;status.textContent=statuses[user.status];statusCell.append(status);row.append(statusCell);
      const actions=document.createElement('td');
      if(user.role==='admin')actions.textContent='管理员';
      else for(const [value,label]of(user.status==='active'?[['disabled','停用']]:user.status==='pending'?[['active','审核通过'],['disabled','拒绝申请']]:[['active','重新启用']])){
        const button=document.createElement('button');button.type='button';button.className='member-action';button.textContent=label;
        button.addEventListener('click',async()=>{button.disabled=true;try{const result=await auth.request('/api/admin/users',{id:user.id,status:value});await loadMembers();show(result.message,true);}catch(error){show(error.message);button.disabled=false;}});actions.append(button);
      }
      row.append(actions);tbody.append(row);
    }
  }
  async function loadMembers(){const response=await fetch('/api/admin/users',{cache:'no-store'});if(!response.ok){if(response.status===401)await auth.check();throw new Error('无法加载成员列表，请重试。');}users=(await response.json()).users;renderMembers();}
  auth.mount($('account-menu'));
  auth.check().then(async({user})=>{
    $('profile-name').textContent=user.name;$('profile-email').textContent=user.email;$('profile-department').textContent=user.department||'未填写';$('profile-role').textContent=user.role==='admin'?'管理员':'成员';$('profile-status').textContent=statuses[user.status];$('profile-created').textContent=new Intl.DateTimeFormat('zh-CN',{dateStyle:'medium'}).format(new Date(user.createdAt));
    if(user.role==='admin'){$('admin-section').hidden=false;await loadMembers();if(location.pathname==='/admin'){$('account-heading').textContent='成员与账户管理';$('account-intro').textContent='审核团队成员，管理工作空间访问权限。';document.title='成员与账户管理 · 工程部运营中心';}}
  }).catch(error=>show(error.message));
  $('member-search').addEventListener('input',renderMembers);$('refresh-members').addEventListener('click',()=>loadMembers().catch(error=>show(error.message)));
  for(const id of ['new-password','repeat-password'])$(id).addEventListener('input',()=>$('repeat-password').setCustomValidity(''));
  $('password-form').addEventListener('submit',async event=>{event.preventDefault();if($('new-password').value!==$('repeat-password').value){$('repeat-password').setCustomValidity('两次输入的新密码不一致。');$('repeat-password').reportValidity();return;}const button=$('password-submit');button.disabled=true;button.textContent='正在更新…';try{await auth.request('/api/auth/password',{currentPassword:$('current-password').value,password:$('new-password').value});location.replace('/login?passwordChanged=1');}catch(error){show(error.message);button.disabled=false;button.textContent='更新密码';}});
})();
