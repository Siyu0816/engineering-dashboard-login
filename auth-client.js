(() => {
  'use strict';

  let current = null;
  let lastChecked = 0;
  let inflight = null;

  function redirect() {
    document.body.style.visibility = 'hidden';
    location.replace('./auth.html?mode=login');
  }

  async function check() {
    if (inflight) return inflight;
    inflight = (async () => {
      if (!window.sb) throw new Error('Supabase 尚未初始化，请检查项目配置。');
      const { data, error } = await window.sb.auth.getUser();
      if (error) throw error;
      if (!data.user) {
        redirect();
        throw new Error('请先登录。');
      }
      const { data: profile } = await window.sb
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!profile) {

          await window.sb.auth.signOut();

          redirect();

          throw new Error('用户信息不存在');
        }

        if (profile.status !== 'approved') {

          await window.sb.auth.signOut();

          alert(
            '账号尚未通过管理员审批。'
          );

          redirect();

          throw new Error('等待审批');
        }

      const metadata = data.user.user_metadata || {};
      current = {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: metadata.full_name || metadata.name || data.user.email || '用户',
          role: metadata.role || 'member'
        }
      };
      lastChecked = Date.now();
      return current;
    })().finally(() => {
      inflight = null;
    });
    return inflight;
  }

  async function request(url, input) {
    if (!current) await check();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Enterprise-Request': '1',
        'X-CSRF-Token': current.csrf
      },
      body: JSON.stringify(input || {})
    });
    if (response.status === 401) {
      redirect();
      throw new Error('请重新登录。');
    }
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || '操作未完成，请重试。');
    return result;
  }

  async function logout(button) {
    if (button) button.disabled = true;
    try {
      const { error } = await window.sb.auth.signOut();
      if (error) throw error;
      redirect();
    } catch (error) {
      if (button) {
        button.disabled = false;
        button.textContent = error.message || '退出失败，请重试';
      }
    }
  }

  async function mount(container) {
    if (!container) return;
    const existing = container.querySelector('.enterprise-account');
    if (existing) existing.remove();

    const details = document.createElement('details');
    details.className = 'enterprise-account';
    const summary = document.createElement('summary');
    summary.className = 'enterprise-account-trigger';
    summary.setAttribute('aria-label', '账户菜单');
    const avatar = document.createElement('span');
    avatar.className = 'enterprise-account-avatar';
    avatar.textContent = '…';
    const name = document.createElement('span');
    name.className = 'enterprise-account-name';
    name.textContent = '账户';
    summary.append(avatar, name);

    const panel = document.createElement('div');
    panel.className = 'enterprise-account-panel';
    details.append(summary, panel);
    container.append(details);

    try {
      const { user } = current || await check();
      if (!details.isConnected) return;

      avatar.textContent = Array.from(user.name)[0] || 'U';
      name.textContent = user.name;
      const identity = document.createElement('div');
      identity.className = 'enterprise-account-identity';
      const strong = document.createElement('strong');
      const email = document.createElement('small');
      strong.textContent = user.name;
      email.textContent = user.email;
      identity.append(strong, email);
      panel.append(identity);

      const account = document.createElement('a');
      account.href = './account.html';
      account.textContent = '个人账户';
      panel.append(account);

      const exit = document.createElement('button');
      exit.type = 'button';
      exit.textContent = '退出登录';
      exit.addEventListener('click', () => logout(exit));
      panel.append(exit);
    } catch (error) {
      name.textContent = '重试验证';
      summary.addEventListener('click', () => location.reload(), { once: true });
    }

    details.addEventListener('toggle', () => {
      if (details.open) {
        document.querySelectorAll('.enterprise-account').forEach(other => {
          if (other !== details) other.open = false;
        });
      }
    });
  }

  window.EnterpriseAuth = { check, request, mount, logout };

  if (location.protocol === 'file:') {
    const overlay = document.createElement('section');
    overlay.className = 'launch-required';
    const card = document.createElement('div');
    const heading = document.createElement('h1');
    const explanation = document.createElement('p');
    heading.textContent = '请通过网站地址打开';
    explanation.textContent = 'Supabase 登录需要通过 HTTPS 网站访问。请将此静态网站部署到支持 HTTPS 的托管服务后再登录；无需安装 Node.js。';
    card.append(heading, explanation);
    overlay.append(card);
    document.body.append(overlay);
    return;
  }

  check().catch(() => {});
  addEventListener('pageshow', event => {
    if (event.persisted) check().catch(() => {});
  });
  addEventListener('focus', () => {
    if (Date.now() - lastChecked > 10000) check().catch(() => {});
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.enterprise-account')) {
      document.querySelectorAll('.enterprise-account[open]').forEach(menu => menu.open = false);
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.enterprise-account[open]').forEach(menu => {
        menu.open = false;
        menu.querySelector('summary').focus();
      });
    }
  });
})();
