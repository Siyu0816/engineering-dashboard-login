import assert from 'node:assert/strict';
import {once} from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {createEnterpriseServer} from '../auth-server.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'engineering-auth-test-')),dbPath=path.join(temporary,'accounts.sqlite');
const setupToken=randomBytes(24).toString('hex'),password=randomBytes(20).toString('hex'),newPassword=randomBytes(20).toString('hex');
let app,base;
async function start(){app=createEnterpriseServer({root,dbPath,setupToken});app.server.listen(0,'127.0.0.1');await once(app.server,'listening');base=`http://127.0.0.1:${app.server.address().port}`;}
async function stop(){app.server.closeAllConnections();await new Promise(resolve=>app.server.close(resolve));}
async function call(route,{input,cookie,csrf,origin=base,marker=true,method=input?'POST':'GET'}={}){
  const headers={};if(cookie)headers.Cookie=cookie;
  if(input){headers['Content-Type']='application/json';headers.Origin=origin;if(marker)headers['X-Enterprise-Request']='1';if(csrf)headers['X-CSRF-Token']=csrf;}
  const res=await fetch(base+route,{method,headers,body:input?JSON.stringify(input):undefined,redirect:'manual'});
  const text=await res.text();return {status:res.status,headers:res.headers,text,json:res.headers.get('Content-Type')?.includes('application/json')?JSON.parse(text):null};
}
const admin={name:'测试管理员',email:'admin@example.test',department:'工程',password};
const member={name:'测试成员',email:'member@example.test',department:'工程',password};
try{
  await start();
  assert.equal((await call('/')).status,303);assert.equal((await call('/dashboard-data.js')).status,401);
  for(const route of ['/data/accounts.sqlite','/auth-server.mjs','/serve.mjs','/package.json','/engineering-dashboard-complete-v13.zip','/%2e%2e/auth-server.mjs'])assert.equal((await call(route)).status,404,route);
  for(const route of ['/login','/register','/setup','/auth.js','/auth.css','/img/Logomark%20white%20CMYK.png'])assert.equal((await call(route)).status,200,route);
  assert.equal((await call('/api/auth/status')).json.needsSetup,true);
  assert.equal((await call('/api/auth/setup',{input:{...admin,setupCode:'wrong-code'}})).status,403);
  assert.equal((await call('/api/auth/setup',{input:{...admin,setupCode:setupToken},origin:'https://foreign.example'})).status,403);
  assert.equal((await call('/api/auth/setup',{input:{...admin,setupCode:setupToken},marker:false})).status,403);
  assert.equal((await call('/api/auth/setup',{input:{...admin,setupCode:setupToken}})).status,201);
  assert.equal((await call('/api/auth/status')).json.needsSetup,false);
  assert.equal((await call('/api/auth/setup',{input:{...admin,setupCode:setupToken}})).status,403);
  assert.equal((await call('/api/auth/register',{input:member})).status,201);
  assert.equal((await call('/api/auth/register',{input:member})).status,409);
  assert.equal((await call('/api/auth/register',{input:{...member,email:'weak@example.test',password:'short'}})).status,400);
  assert.equal((await call('/api/auth/login',{input:member})).status,403,'pending account cannot log in');
  assert.equal((await call('/api/auth/login',{input:{...admin,password:'wrong'}})).status,401);
  const login=await call('/api/auth/login',{input:admin});assert.equal(login.status,200);
  const adminCookie=login.headers.get('set-cookie').split(';')[0],adminCsrf=login.json.csrf;
  assert.equal((await call('/api/auth/session',{cookie:adminCookie.slice(0,-4)+'abcd'})).status,401,'modified session tokens cannot authenticate');
  for(const text of ['HttpOnly','SameSite=Strict','Path=/'])assert(login.headers.get('set-cookie').includes(text));
  assert(!JSON.stringify(login.json).includes(password));
  assert.equal((await call('/',{cookie:adminCookie})).status,200);
  assert.equal((await call('/dashboard-data.js',{cookie:adminCookie})).status,200);
  assert.equal((await call('/api/auth/session',{cookie:adminCookie})).json.user.role,'admin');
  const members=await call('/api/admin/users',{cookie:adminCookie});assert.equal(members.status,200);
  assert(!members.text.includes('scrypt$'));const memberId=members.json.users.find(u=>u.email===member.email).id;
  assert.equal((await call('/api/admin/users',{cookie:adminCookie,input:{id:memberId,status:'active'}})).status,403,'CSRF required');
  assert.equal((await call('/api/admin/users',{cookie:adminCookie,csrf:adminCsrf,input:{id:memberId,status:'active'}})).status,200);
  const memberLogin=await call('/api/auth/login',{input:{...member,remember:true}});assert.equal(memberLogin.status,200);assert(memberLogin.headers.get('set-cookie').includes('Max-Age=604800'));
  const memberCookie=memberLogin.headers.get('set-cookie').split(';')[0],memberCsrf=memberLogin.json.csrf;
  assert.equal((await call('/api/admin/users',{cookie:memberCookie})).status,403);
  assert.equal((await call('/admin',{cookie:memberCookie})).status,403);
  assert.equal((await call('/api/admin/users',{cookie:memberCookie,csrf:memberCsrf,input:{id:memberId,status:'disabled'}})).status,403);
  assert.equal((await call('/api/auth/password',{cookie:memberCookie,csrf:memberCsrf,input:{currentPassword:'wrong',password:newPassword}})).status,400);
  assert.equal((await call('/api/auth/password',{cookie:memberCookie,csrf:memberCsrf,input:{currentPassword:password,password:newPassword}})).status,200);
  assert.equal((await call('/api/auth/session',{cookie:memberCookie})).status,401,'password change invalidates sessions');
  assert.equal((await call('/api/auth/login',{input:member})).status,401);
  const updated=await call('/api/auth/login',{input:{...member,password:newPassword}});assert.equal(updated.status,200);
  const updatedCookie=updated.headers.get('set-cookie').split(';')[0];
  assert.equal((await call('/api/admin/users',{cookie:adminCookie,csrf:adminCsrf,input:{id:memberId,status:'disabled'}})).status,200);
  assert.equal((await call('/api/auth/session',{cookie:updatedCookie})).status,401,'disable immediately revokes access');
  assert.equal((await call('/api/admin/users',{cookie:adminCookie,csrf:adminCsrf,input:{id:login.json.user.id,status:'disabled'}})).status,403);
  assert.equal((await call('/api/auth/logout',{cookie:adminCookie,csrf:adminCsrf,input:{}})).status,200);
  assert.equal((await call('/api/auth/session',{cookie:adminCookie})).status,401);
  await stop();
  const inspect=new DatabaseSync(dbPath),stored=inspect.prepare('SELECT password FROM users').all();assert(stored.every(row=>row.password.startsWith('scrypt$')&&!row.password.includes(password)));inspect.close();
  await start();assert.equal(app.needsSetup(),false);assert.equal((await call('/api/auth/login',{input:admin})).status,200,'accounts survive server restart');
  for(let attempt=0;attempt<10;attempt++)assert.equal((await call('/api/auth/login',{input:{email:'missing@example.test',password:'invalid'}})).status,401);
  assert.equal((await call('/api/auth/login',{input:{email:'missing@example.test',password:'invalid'}})).status,429,'repeated login failures are throttled');
  console.log('Passed: protected reports/assets, setup token, origin/CSRF, registration approval, persistent password hashes, login/cookies, member/admin authorization, password change, session revocation, disable and logout.');
}finally{
  if(app?.server.listening)await stop();
  for(const file of fs.readdirSync(temporary)){const full=path.resolve(temporary,file);if(path.dirname(full)!==temporary||!/^accounts\.sqlite(?:-wal|-shm)?$/.test(file))throw new Error('Unexpected test file');fs.unlinkSync(full);}
  fs.rmdirSync(temporary);
}
