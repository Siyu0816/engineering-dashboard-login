import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {randomBytes, randomUUID, scrypt, timingSafeEqual, createHash} from 'node:crypto';
import {promisify} from 'node:util';
const derive=promisify(scrypt),hash=value=>createHash('sha256').update(value).digest('hex');
const safe=(a,b)=>typeof a==='string'&&typeof b==='string'&&Buffer.byteLength(a)===Buffer.byteLength(b)&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
const publicUser=u=>({id:u.id,name:u.name,email:u.email,department:u.department,role:u.role,status:u.status,createdAt:u.created_at});
const emailOf=value=>String(value||'').trim().toLowerCase();
const validPassword=value=>typeof value==='string'&&value.length>=12&&value.length<=128;
const publicFiles=new Set(['auth.html','auth.css','auth.js']);
const privateFiles=new Set(['index.html','account.html','account.js','auth-client.js','account.css','app.js','dashboard-data.js','comparison-charts.js','report-refinements.js','portal.js','home-effects.js','styles.css','experience.css','portal.css','refinement.css','report-layout.css','revision-v7.css','original-palette.css','responsive-layout.css','focus-view.css']);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg'};

export function createEnterpriseServer({root,dbPath=path.join(root,'data','accounts.sqlite'),setupToken=randomBytes(24).toString('hex'),publicOrigin='',secureCookies=false}={}) {
  if(dbPath!==':memory:')fs.mkdirSync(path.dirname(dbPath),{recursive:true,mode:0o700});
  const db=new DatabaseSync(dbPath);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,department TEXT NOT NULL DEFAULT '',password TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('admin','member')),status TEXT NOT NULL CHECK(status IN ('active','pending','disabled')),created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),csrf TEXT NOT NULL,expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,actor TEXT,action TEXT NOT NULL,target TEXT,created_at INTEGER NOT NULL);`);
  const cookieName=secureCookies?'__Host-engineering_session':'engineering_session';
  const limits=new Map();let kdfActive=0;
  const audit=(actor,action,target)=>db.prepare('INSERT INTO audit(actor,action,target,created_at) VALUES(?,?,?,?)').run(actor,action,target,Date.now());
  const needsSetup=()=>!db.prepare("SELECT id FROM users WHERE role='admin'").get();
  const failure=(status,message)=>Object.assign(new Error(message),{status});
  const limit=(key,max,ms)=>{
    const now=Date.now(),old=limits.get(key),entry=old&&old.until>now?old:{count:0,until:now+ms};
    if(entry.count>=max)throw failure(429,'操作频繁，请稍后再试。');
    entry.count++;limits.set(key,entry);
    if(limits.size>5000)for(const [k,v]of limits)if(v.until<=now)limits.delete(k);
    if(limits.size>10000)throw failure(429,'服务繁忙，请稍后再试。');
  };
  async function passwordHash(password,salt=randomBytes(16).toString('hex')){
    if(kdfActive>=2)throw failure(429,'服务繁忙，请稍后再试。');
    kdfActive++;
    try {const key=await derive(password,salt,64,{N:131072,r:8,p:1,maxmem:192*1024*1024});return `scrypt$${salt}$${key.toString('hex')}`;} finally{kdfActive--;}
  }
  async function verify(password,stored){
    const [,salt,expected]=stored.split('$');
    const actual=await passwordHash(password,salt);return safe(actual,`scrypt$${salt}$${expected}`);
  }
  const dummy='scrypt$'+randomBytes(16).toString('hex')+'$'+randomBytes(64).toString('hex');
  function session(req){
    const raw=(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(cookieName+'='))?.slice(cookieName.length+1);
    if(!raw||!/^[a-f0-9]{64}$/.test(raw))return null;
    return db.prepare("SELECT u.*,s.csrf,s.token FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires_at>? AND u.status='active'").get(hash(raw),Date.now())||null;
  }
  const cookie=(token,seconds)=>`${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${seconds}${secureCookies?'; Secure':''}`;
  const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
  async function body(req){
    if(!String(req.headers['content-type']||'').startsWith('application/json'))throw failure(415,'请求格式不正确。');
    let size=0;const chunks=[];
    for await(const chunk of req){size+=chunk.length;if(size>8192)throw failure(413,'提交内容过长。');chunks.push(chunk);}
    try{const result=JSON.parse(Buffer.concat(chunks).toString());if(!result||Array.isArray(result)||typeof result!=='object')throw 0;return result;}catch{throw failure(400,'提交内容格式不正确。');}
  }
  function profile(input){
    const email=emailOf(input.email),name=String(input.name||'').trim(),department=String(input.department||'').trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)throw failure(400,'请输入有效的工作邮箱。');
    if(name.length<2||name.length>60||department.length>60)throw failure(400,'姓名需为 2–60 个字符，部门最多 60 个字符。');
    if(!validPassword(input.password))throw failure(400,'密码需为 12–128 个字符。');
    return {email,name,department};
  }
  const server=http.createServer(async(req,res)=>{
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');
    res.setHeader('X-Frame-Options','DENY');res.setHeader('Cross-Origin-Resource-Policy','same-origin');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    if(secureCookies)res.setHeader('Strict-Transport-Security','max-age=31536000');
    try{
      const addr=server.address(),localHosts=new Set([`localhost:${addr?.port}`,`127.0.0.1:${addr?.port}`,`[::1]:${addr?.port}`]);
      const configured=publicOrigin?new URL(publicOrigin):null;
      if(!localHosts.has(req.headers.host)&&req.headers.host!==configured?.host)throw failure(421,'访问地址未配置。');
      const url=new URL(req.url,'http://'+req.headers.host),name=decodeURIComponent(url.pathname),user=session(req);
      const ip=req.socket.remoteAddress||'unknown';
      limit('requests:'+ip,600,60000);
      if(!['GET','HEAD','POST'].includes(req.method))throw failure(405,'不支持此操作。');
      if(req.method==='POST'){
        const origin=configured?.origin||`http://${req.headers.host}`;
        if(req.headers.origin!==origin||req.headers['x-enterprise-request']!=='1')throw failure(403,'请求来源验证失败，请刷新页面。');
        if(user&&name!=='/api/auth/login'&&!safe(req.headers['x-csrf-token'],user.csrf))throw failure(403,'登录验证已更新，请刷新后重试。');
      }
      if(name.startsWith('/api/')){
        if(name==='/api/auth/status'&&req.method==='GET')return json(res,200,{needsSetup:needsSetup()});
        if(name==='/api/auth/session'&&req.method==='GET'){
          if(!user)throw failure(401,'请先登录。');
          return json(res,200,{user:publicUser(user),csrf:user.csrf});
        }
        if(['/api/auth/setup','/api/auth/register'].includes(name)&&req.method==='POST'){
          limit('register:'+ip,8,15*60000);const input=await body(req),info=profile(input),setup=name.endsWith('/setup');
          if(setup){if(!needsSetup()||!safe(input.setupCode,setupToken))throw failure(403,'初始化口令不正确或初始化已完成。');}
          else if(needsSetup())throw failure(409,'请先由管理员完成网站初始化。');
          const password=await passwordHash(input.password),id=randomUUID();
          if(setup&&!needsSetup())throw failure(409,'网站已完成初始化，请登录。');
          try {db.prepare('INSERT INTO users VALUES(?,?,?,?,?,?,?,?)').run(id,info.email,info.name,info.department,password,setup?'admin':'member',setup?'active':'pending',Date.now());}
          catch(error){if(String(error.code).includes('SQLITE')||String(error.message).includes('UNIQUE'))throw failure(409,'此邮箱已提交申请，请登录或联系管理员。');throw error;}
          audit(id,setup?'setup':'register',id);
          return json(res,201,{message:setup?'管理员账户已创建，请登录。':'注册申请已提交，请等待管理员审核后登录。'});
        }
        if(name==='/api/auth/login'&&req.method==='POST'){
          limit('login-ip:'+ip,30,15*60000);const input=await body(req),email=emailOf(input.email);
          limit('login-account:'+hash(email),10,15*60000);
          if(typeof input.password!=='string'||input.password.length>128)throw failure(401,'邮箱或密码不正确。');
          const found=db.prepare('SELECT * FROM users WHERE email=?').get(email),ok=await verify(input.password,found?.password||dummy);
          if(!found||!ok)throw failure(401,'邮箱或密码不正确。');
          if(found.status!=='active')throw failure(403,found.status==='pending'?'账户正在审核中，请联系管理员。':'此账户已停用，请联系管理员。');
          if(user)db.prepare('DELETE FROM sessions WHERE token=?').run(user.token);
          db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(Date.now());
          const token=randomBytes(32).toString('hex'),csrf=randomBytes(24).toString('hex'),seconds=input.remember===true?7*86400:8*3600;
          db.prepare('INSERT INTO sessions VALUES(?,?,?,?)').run(hash(token),found.id,csrf,Date.now()+seconds*1000);
          res.setHeader('Set-Cookie',cookie(token,seconds));audit(found.id,'login',found.id);
          return json(res,200,{user:publicUser(found),csrf});
        }
        if(!user)throw failure(401,'登录已失效，请重新登录。');
        if(name==='/api/auth/logout'&&req.method==='POST'){
          db.prepare('DELETE FROM sessions WHERE token=?').run(user.token);res.setHeader('Set-Cookie',cookie('',0));return json(res,200,{message:'已安全退出。'});
        }
        if(name==='/api/auth/password'&&req.method==='POST'){
          limit('password:'+user.id,10,15*60000);const input=await body(req);
          if(!validPassword(input.password)||typeof input.currentPassword!=='string'||input.currentPassword.length>128)throw failure(400,'新密码需为 12–128 个字符。');
          if(!await verify(input.currentPassword,user.password))throw failure(400,'当前密码不正确。');
          const password=await passwordHash(input.password);
          db.exec('BEGIN IMMEDIATE');try{db.prepare('UPDATE users SET password=? WHERE id=?').run(password,user.id);db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);audit(user.id,'password-change',user.id);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
          res.setHeader('Set-Cookie',cookie('',0));return json(res,200,{message:'密码已更新，请重新登录。'});
        }
        if(name.startsWith('/api/admin/')){
          if(user.role!=='admin')throw failure(403,'此操作需要管理员权限。');
          if(name==='/api/admin/users'&&req.method==='GET')return json(res,200,{users:db.prepare('SELECT id,email,name,department,role,status,created_at FROM users ORDER BY created_at DESC').all().map(publicUser)});
          if(name==='/api/admin/users'&&req.method==='POST'){
            const input=await body(req);
            if(!['active','disabled'].includes(input.status)||typeof input.id!=='string')throw failure(400,'账户状态不正确。');
            const target=db.prepare('SELECT * FROM users WHERE id=?').get(input.id);
            if(!target)throw failure(404,'账户不存在。');
            if(target.role==='admin')throw failure(403,'管理员账户不能在此停用。');
            db.exec('BEGIN IMMEDIATE');try{db.prepare('UPDATE users SET status=? WHERE id=?').run(input.status,input.id);db.prepare('DELETE FROM sessions WHERE user_id=?').run(input.id);audit(user.id,'user-'+input.status,input.id);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
            return json(res,200,{message:input.status==='active'?'账户已启用。':'账户已停用。'});
          }
        }
        throw failure(404,'接口不存在。');
      }
      if(req.method==='POST')throw failure(404,'页面不存在。');
      let file=name==='/'?'index.html':name.slice(1);
      if(['/login','/register','/setup'].includes(name)){
        if(user){res.writeHead(303,{Location:'/'});return res.end();}file='auth.html';
      }
      if(['/account','/admin'].includes(name))file='account.html';
      const image=/^img\/[^/]+\.(?:png|jpg)$/.test(file);
      if(!publicFiles.has(file)&&!privateFiles.has(file)&&!image)throw failure(404,'页面不存在。');
      if(!publicFiles.has(file)&&!image&&!user){
        if(file.endsWith('.html')){res.writeHead(303,{Location:needsSetup()?'/setup':'/login'});return res.end();}
        throw failure(401,'请先登录。');
      }
      if(name==='/admin'&&user?.role!=='admin')throw failure(403,'此页面需要管理员权限。');
      const full=path.join(root,file);const stat=await fs.promises.stat(full).catch(()=>null);
      if(!stat?.isFile())throw failure(404,'页面不存在。');
      res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':stat.size});
      if(req.method==='HEAD')res.end();else fs.createReadStream(full).on('error',()=>res.destroy()).pipe(res);
    } catch(error){
      if(!res.headersSent)json(res,error.status||500,{message:error.status?error.message:'服务暂时不可用，请稍后重试。'});else res.destroy();
    }
  });
  server.requestTimeout=15000;server.headersTimeout=10000;server.on('close',()=>db.close());
  return {server,needsSetup,setupToken};
}
