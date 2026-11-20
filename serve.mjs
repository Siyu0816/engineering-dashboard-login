import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createEnterpriseServer} from './auth-server.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||8765),host=process.env.HOST||'127.0.0.1';
const publicOrigin=process.env.PUBLIC_ORIGIN||'';
if(!['127.0.0.1','localhost','::1'].includes(host)&&!publicOrigin.startsWith('https://'))throw new Error('对外提供服务前，请配置 HTTPS 的 PUBLIC_ORIGIN。');
const app=createEnterpriseServer({root,publicOrigin,secureCookies:publicOrigin.startsWith('https://')});
app.server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`端口 ${port} 已被占用。请关闭之前运行的网站窗口，或设置 PORT 使用其他端口。`:'网站启动失败：'+error.message);process.exitCode=1;});
app.server.listen(port,host,()=>{
  console.log(`\n工程部运营中心\n请打开：${publicOrigin||`http://127.0.0.1:${port}`}\n保持此窗口开启，按 Ctrl+C 停止网站。`);
  if(app.needsSetup())console.log(`\n首次使用：请在初始化页面输入以下一次性口令，创建管理员账户。\n${app.setupToken}\n`);
});
