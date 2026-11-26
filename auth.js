(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const requestedMode = params.get('mode') || (location.pathname === '/register' ? 'register' : 'login');
  const mode = ['login', 'register', 'reset'].includes(requestedMode) ? requestedMode : 'login';
  const registration = mode === 'register';
  const form = $('auth-form');
  const message = $('auth-message');
  const client = window.sb;

  function show(text) {
    message.textContent = text;
    message.hidden = false;
  }

  function setVisible(id, visible) {
    $(id).hidden = !visible;
  }

  function showSuccess(title, description) {
    form.hidden = true;
    $('auth-success').hidden = false;
    $('auth-bottom-note').hidden = true;
    $('success-title').textContent = title;
    $('success-description').textContent = description;
  }

  if (!client) {
    show('Supabase 尚未初始化。请检查 Supabase 项目配置和网络连接。');
    $('submit-button').disabled = true;
    return;
  }

  setVisible('name-field', registration);
  setVisible('department-field', registration);
  setVisible('confirm-field', registration || mode === 'reset');
  setVisible('password-hint', registration);
  setVisible('login-options', mode === 'login');
  setVisible('registration-note', registration);
  setVisible('auth-tabs', mode !== 'reset');
  $('full-name').required = registration;
  $('confirm-password').required = registration || mode === 'reset';
  $('password').minLength = registration || mode === 'reset' ? 12 : 1;
  $('password').autocomplete = registration || mode === 'reset' ? 'new-password' : 'current-password';
  if (registration || mode === 'reset') $('password').placeholder = '设置 12–128 个字符的密码';

  const titles = {
    login: ['欢迎回来', '登录你的工作账户，继续查看运营报表。', '登录工作空间', 'WELCOME BACK'],
    register: ['加入企业工作空间', '创建账户以访问工程运营工作空间。', '创建账户', 'CREATE ACCOUNT'],
    reset: ['设置新密码', '请输入并确认你的新密码。', '更新密码', 'RESET PASSWORD']
  };
  const text = titles[mode];
  $('auth-title').textContent = text[0];
  $('auth-description').textContent = text[1];
  $('submit-button').textContent = text[2];
  $('auth-kicker').textContent = text[3];
  document.title = text[0] + ' · 工程部运营中心';

  if (mode !== 'reset') {
    $(registration ? 'register-tab' : 'login-tab').setAttribute('aria-current', 'page');
  }

  document.querySelectorAll('[data-toggle-password]').forEach(button => {
    button.addEventListener('click', () => {
      const input = $(button.dataset.togglePassword);
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      button.textContent = visible ? '隐藏' : '显示';
      button.setAttribute('aria-pressed', String(visible));
      button.setAttribute('aria-label', (visible ? '隐藏' : '显示') + (input.id === 'confirm-password' ? '确认密码' : '密码'));
    });
  });

  for (const id of ['password', 'confirm-password']) {
    $(id).addEventListener('input', () => $('confirm-password').setCustomValidity(''));
  }

  const help = $('help-dialog');
  $('access-help').addEventListener('click', () => help.showModal());
  $('close-help').addEventListener('click', () => help.close());
  help.addEventListener('click', event => {
    if (event.target === help) {
      const rect = help.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) help.close();
    }
  });

  $('password-help').addEventListener('click', async event => {
    const email = $('email');
    if (!email.checkValidity()) {
      email.reportValidity();
      return;
    }

    const button = event.currentTarget;
    button.disabled = true;
    button.textContent = '正在发送…';
    message.hidden = true;
    try {
      const redirectTo = new URL('./auth.html?mode=reset', location.href).href;
      const { error } = await client.auth.resetPasswordForEmail(email.value.trim(), { redirectTo });
      if (error) throw error;
      showSuccess('重置邮件已发送', '请查看邮箱中的密码重置链接，并按照页面提示设置新密码。');
    } catch (error) {
      show(error.message || '暂时无法发送重置邮件，请稍后重试。');
    } finally {
      button.disabled = false;
      button.textContent = '忘记密码？';
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    message.hidden = true;

    if ((registration || mode === 'reset') && $('password').value !== $('confirm-password').value) {
      $('confirm-password').setCustomValidity('两次输入的密码不一致。');
      $('confirm-password').reportValidity();
      return;
    }

    const button = $('submit-button');
    button.disabled = true;
    button.textContent = mode === 'login' ? '正在登录…' : mode === 'register' ? '正在创建账户…' : '正在更新…';

    try {
      if (mode === 'login') {
        const { error } = await client.auth.signInWithPassword({
          email: $('email').value.trim(),
          password: $('password').value
        });
        if (error) throw error;
        location.replace('./index.html');
        return;
      }

      if (registration) {
        const emailRedirectTo = new URL('./auth.html?mode=login', location.href).href;
        const { data, error } = await client.auth.signUp({
          email: $('email').value.trim(),
          password: $('password').value,
          options: {
            emailRedirectTo,
            data: {
              full_name: $('full-name').value.trim(),
              department: $('department').value.trim()
            }
          }
        });
        if (error) throw error;
        /* 新增开始 */

        if (data.user) {

          await client
            .from('users')
            .insert({
              id: data.user.id,
              email: $('email').value.trim(),
              full_name: $('full-name').value.trim(),
              department: $('department').value.trim(),
              role: 'member',
              status: 'pending'
            });

        }

        /* 新增结束 */
        if (data.session) {
          location.replace('./index.html');
          return;
        }
        showSuccess('账户已创建', '请查看注册邮箱并点击验证链接，完成验证后即可登录。');
        return;
      }

      const { error } = await client.auth.updateUser({ password: $('password').value });
      if (error) throw error;
      showSuccess('密码已更新', '现在可以使用新密码登录。');
    } catch (error) {
      show(error.message || '操作失败，请检查网络后重试。');
    } finally {
      button.disabled = false;
      button.textContent = text[2];
    }
  });

  if (mode === 'login') {
    client.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      if (data.session) location.replace('./index.html');
    }).catch(error => show(error.message || '无法读取登录状态，请刷新页面重试。'));
  }
})();
