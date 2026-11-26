(async ()=>{

const {
  data:{session}
}=await window.sb.auth.getSession();

if(!session){

  location.replace('./auth.html?mode=login');
  return;
}

const user=session.user;

const {data:profile}=await window.sb
.from('users')
.select('*')
.eq('id',user.id)
.single();

if(!profile){

  location.replace('./auth.html');
  return;
}

if(profile.role!=='admin'){

  alert('No permission');

  location.replace('./index.html');
  return;
}

loadUsers();

})();

async function loadUsers(){

const {data}=await window.sb
.from('users')
.select('*')
.order('email');

const tbody=
document.getElementById('user-list');

tbody.innerHTML='';

data.forEach(user=>{

const tr=document.createElement('tr');

tr.innerHTML=`
<td>${user.full_name||''}</td>
<td>${user.email}</td>
<td>${user.department||''}</td>
<td>${user.status}</td>
<td>${user.role}</td>

<td>

<button
class="approve"
onclick="approveUser('${user.id}')">
Approve
</button>

<button
class="reject"
onclick="rejectUser('${user.id}')">
Reject
</button>

<button
class="disable"
onclick="disableUser('${user.id}')">
Disable
</button>

</td>
`;

tbody.appendChild(tr);

});

}

window.approveUser=
async(id)=>{

await window.sb
.from('users')
.update({
  status:'approved'
})
.eq('id',id);

loadUsers();

};
window.rejectUser=
async(id)=>{

await window.sb
.from('users')
.update({
 status:'rejected'
})
.eq('id',id);

loadUsers();

};
window.disableUser=
async(id)=>{

await window.sb
.from('users')
.update({
 status:'disabled'
})
.eq('id',id);

loadUsers();

};