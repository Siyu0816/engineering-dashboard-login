# Supabase 登录与静态部署

## 部署

此版本的登录页面使用 Supabase JavaScript 客户端，静态托管即可运行，不需要 Node.js 或 npm。将项目文件发布到支持 HTTPS 的静态网站托管服务。不要通过 `file://` 直接打开 HTML 文件。

## Supabase 配置

1. 在 `supabase.js` 中设置 Supabase 项目 URL 和 publishable key。publishable key 可以放在浏览器代码中；不要使用 `service_role` 密钥。
2. 在 Supabase Dashboard 的 Authentication 设置中设置 Site URL 为部署后的网站地址。
3. 将实际登录页和重置密码页地址添加到允许的 Redirect URLs。当前回调地址为 `auth.html?mode=login` 和 `auth.html?mode=reset`。
4. 按需启用邮箱验证，并配置可用的 SMTP/邮件模板。注册和密码重置邮件由 Supabase 发送。
5. 确认 Supabase Auth 的密码策略允许至少 12 个字符。

登录页直接调用 Supabase Auth 的密码登录、注册、重置邮件及改密接口。注册时姓名和部门写入用户 metadata。新注册用户是否能立即登录取决于 Supabase 的邮箱验证设置。

## 数据访问限制

当前报表数据位于静态文件 `dashboard-data.js`。Supabase 登录只用于界面会话校验，无法保护已经公开部署的 HTML、脚本或报表数据文件。任何能访问网站的人都可以下载这些文件。

如报表包含敏感信息，请勿以当前纯静态方式公开部署。应将数据存入 Supabase 数据库并配置 Row Level Security（RLS），或通过服务端 API 在每次读取时验证用户身份和权限。浏览器中只能使用 publishable key；绝不能将 `service_role` 密钥放入前端。

## 常见问题

- 无法登录或注册：检查浏览器网络连接、Supabase 项目 URL/key，以及 Supabase Auth 是否启用了 Email 提供方。
- 验证或重置链接打开错误页面：检查 Supabase Site URL 和 Redirect URLs 是否包含实际的 HTTPS 域名及相应路径。
- 收不到邮件：检查 Auth 邮件提供方、SMTP 配置、垃圾邮件文件夹及邮件模板。
- 本地 `file://` 打开时无法登录：这是浏览器来源限制；请部署到 HTTPS 静态托管地址后使用。
