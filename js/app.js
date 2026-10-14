/* ========================================
   时屿 | Time Isle - 主应用逻辑
   ======================================== */

// ========== 应用状态 ==========
const App = {
  currentPage: 'dashboard',
  isLoggedIn: false,
  passwordUnlocked: false,

  // 初始化
  init() {
    // 初始化主题
    Theme.init();

    // 初始化示例数据
    initSampleData();

    // 检查登录状态
    this.isLoggedIn = UserManager.isLoggedIn();

    // 绑定主题切换按钮
    this.bindThemeToggles();

    // 绑定登录/注册表单
    this.bindAuthForms();

    // 绑定移动端菜单
    this.bindMobileMenu();

    // 绑定导航
    this.bindNavigation();

    // 绑定弹窗背景
    this.bindModalBackdrop();

    // 绑定设置按钮
    this.bindSettings();

    // 绑定悬浮便签按钮
    this.bindFloatingNote();

    // 如果已登录，直接进入主应用；否则显示登录页
    if (this.isLoggedIn) {
      this.showMainApp();
    } else {
      this.showLoginPage();
    }
  },

  // 显示登录页
  showLoginPage() {
    const loginPage = document.getElementById('login-page');
    const mainApp = document.getElementById('main-app');
    if (mainApp) mainApp.classList.add('hidden');
    if (loginPage) {
      loginPage.style.display = 'flex';
      // 先重置动画状态
      loginPage.classList.remove('show');
      // 触发重绘后添加 show 类，启动入场动画
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          loginPage.style.opacity = '1';
          loginPage.classList.add('show');
        });
      });
    }
  },

  // 绑定主题切换
  bindThemeToggles() {
    const toggles = [
      document.getElementById('login-theme-toggle'),
      document.getElementById('sidebar-theme-toggle'),
      document.getElementById('mobile-theme-btn')
    ];

    toggles.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          Theme.toggle();
        });
      }
    });
  },

  // 绑定登录/注册表单
  bindAuthForms() {
    // Tab 切换
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (tabLogin && tabRegister) {
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active', 'border-secondary', 'text-secondary');
        tabLogin.classList.remove('border-transparent', 'text-text-secondary');
        tabRegister.classList.remove('active', 'border-secondary', 'text-secondary');
        tabRegister.classList.add('border-transparent', 'text-text-secondary');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        this.hideAuthError();
      });

      tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active', 'border-secondary', 'text-secondary');
        tabRegister.classList.remove('border-transparent', 'text-text-secondary');
        tabLogin.classList.remove('active', 'border-secondary', 'text-secondary');
        tabLogin.classList.add('border-transparent', 'text-text-secondary');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        this.hideAuthError();
      });
    }

    // 头像上传预览
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPreview = document.getElementById('avatar-preview');
    if (avatarUpload && avatarPreview) {
      avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          // 限制大小 2MB
          if (file.size > 2 * 1024 * 1024) {
            Toast.show('头像不能超过 2MB', 'error');
            return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => {
            const imgData = ev.target.result;
            // 压缩图片
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = 128;
              canvas.height = 128;
              ctx.drawImage(img, 0, 0, 128, 128);
              const compressed = canvas.toDataURL('image/jpeg', 0.8);
              avatarPreview.innerHTML = `<img src="${compressed}" class="w-full h-full object-cover" alt="avatar">`;
              avatarPreview.dataset.avatar = compressed;
            };
            img.src = imgData;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // 登录表单提交
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // 注册表单提交
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister();
      });
    }

    // 如果已注册过用户，默认显示登录 Tab
    const users = UserManager.getAllUsers();
    if (users.length > 0 && tabLogin) {
      tabLogin.click();
    }
  },

  // 显示认证错误
  showAuthError(message, isRegister = false) {
    const errorEl = document.getElementById(isRegister ? 'register-error' : 'login-error');
    const successEl = document.getElementById('register-success');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
    if (successEl && isRegister) {
      successEl.classList.add('hidden');
    }
  },

  // 隐藏认证错误
  hideAuthError() {
    ['login-error', 'register-error', 'register-success'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  },

  // 处理登录
  handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
      this.showAuthError('请输入账号和密码');
      return;
    }

    const result = UserManager.login(username, password);
    if (result.success) {
      this.hideAuthError();
      this.isLoggedIn = true;
      this.enterIsle(result.user);
    } else {
      this.showAuthError(result.message);
    }
  },

  // 处理注册
  handleRegister() {
    const nickname = document.getElementById('reg-nickname').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;
    const avatarPreview = document.getElementById('avatar-preview');
    const avatar = avatarPreview?.dataset?.avatar || '';

    if (!nickname || !username || !password || !password2) {
      this.showAuthError('请填写完整信息', true);
      return;
    }
    if (password !== password2) {
      this.showAuthError('两次输入的密码不一致', true);
      return;
    }

    const result = UserManager.register(username, password, nickname, avatar);
    if (result.success) {
      // 显示成功信息，自动切换到登录
      const successEl = document.getElementById('register-success');
      const errorEl = document.getElementById('register-error');
      if (successEl) {
        successEl.textContent = '注册成功！正在为你准备岛屿...';
        successEl.classList.remove('hidden');
      }
      if (errorEl) errorEl.classList.add('hidden');

      // 自动登录
      setTimeout(() => {
        UserManager.login(username, password);
        this.isLoggedIn = true;
        this.enterIsle(result.user);
      }, 1000);
    } else {
      this.showAuthError(result.message, true);
    }
  },

  // 进入岛屿
  enterIsle(user) {
    const loginPage = document.getElementById('login-page');
    if (loginPage) {
      loginPage.style.opacity = '0';
      setTimeout(() => {
        loginPage.style.display = 'none';
        this.showMainApp();
        // 更新侧边栏用户信息
        this.updateUserInfo();
      }, 600);
    }
  },

  // 退出登录
  logout() {
    if (!confirm('确定要退出登录吗？')) return;
    UserManager.logout();
    this.isLoggedIn = false;
    const mainApp = document.getElementById('main-app');
    const loginPage = document.getElementById('login-page');
    if (mainApp) mainApp.classList.add('hidden');
    if (loginPage) {
      loginPage.style.display = 'flex';
      loginPage.style.opacity = '0';
      setTimeout(() => {
        loginPage.style.opacity = '1';
      }, 50);
    }
    // 清空登录表单
    const loginPwd = document.getElementById('login-password');
    if (loginPwd) loginPwd.value = '';
  },

  // 更新用户信息显示
  updateUserInfo() {
    const user = UserManager.getCurrentUser();
    if (!user) return;

    // 更新侧边栏用户头像和昵称
    const userAvatarEls = document.querySelectorAll('.user-avatar');
    userAvatarEls.forEach(el => {
      if (user.avatar) {
        el.innerHTML = `<img src="${user.avatar}" class="w-full h-full object-cover rounded-full" alt="avatar">`;
      } else {
        el.innerHTML = `<span class="text-sm font-medium">${user.nickname.charAt(0)}</span>`;
      }
    });

    const userNicknameEls = document.querySelectorAll('.user-nickname');
    userNicknameEls.forEach(el => {
      el.textContent = user.nickname;
    });
  },

  // 显示主应用
  showMainApp() {
    const mainApp = document.getElementById('main-app');
    const pageContainer = document.getElementById('page-container');

    if (mainApp) {
      mainApp.classList.remove('hidden');
      // 触发首页渲染
      this.navigateTo('dashboard');
    }
  },

  // 绑定移动端菜单
  bindMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');

    if (menuBtn && sidebar && overlay) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.remove('hidden');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
      });
    }
  },

  // 关闭移动端菜单
  closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.add('hidden');
  },

  // 绑定导航
  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        if (page) {
          this.navigateTo(page);
          // 移动端点击后关闭菜单
          if (window.innerWidth < 768) {
            this.closeMobileMenu();
          }
        }
      });
    });
  },

  // 导航到指定页面
  navigateTo(pageName) {
    this.currentPage = pageName;

    // 记录页面访问
    VisitLogger.recordPageView(pageName);

    // 更新导航激活状态
    document.querySelectorAll('.nav-item').forEach(item => {
      const page = item.getAttribute('data-page');
      if (page === pageName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 渲染页面内容（带淡入动画）
    const container = document.getElementById('page-container');
    if (container) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(10px)';

      setTimeout(() => {
        // 调用对应页面的渲染函数
        const pageRenderer = {
          dashboard: DashboardPage,
          knowledge: KnowledgePage,
          daily: DailyPage,
          assets: AssetsPage,
          diary: DiaryPage,
          thinking: ThinkingPage,
          tools: ToolsPage
        };

        if (pageRenderer[pageName] && pageRenderer[pageName].render) {
          pageRenderer[pageName].render(container);
        } else {
          container.innerHTML = `
            <div class="text-center py-20">
              <h2 class="font-serif text-2xl mb-4">页面建设中</h2>
              <p class="text-text-secondary dark:text-dark-text-secondary">这个功能正在开发中，敬请期待。</p>
            </div>
          `;
        }

        // 淡入动画
        requestAnimationFrame(() => {
          container.style.opacity = '1';
          container.style.transform = 'translateY(0)';
        });
      }, 200);
    }
  },

  // 绑定弹窗背景点击
  bindModalBackdrop() {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => Modal.close());
    }
  },

  // 绑定设置按钮
  bindSettings() {
    const settingsBtns = document.querySelectorAll('[data-action="settings"]');
    settingsBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => this.openSettings());
      }
    });
    // 侧边栏设置按钮
    const sidebarSettingsBtn = document.querySelector('.sidebar button:has(svg + span), .sidebar button:nth-child(1)');
    // 直接通过文字查找
    const allBtns = document.querySelectorAll('.sidebar button');
    allBtns.forEach(btn => {
      if (btn.textContent.trim() === '设置') {
        btn.addEventListener('click', () => this.openSettings());
      }
    });
  },

  // 打开设置面板
  openSettings(tab = 'account') {
    const user = UserManager.getCurrentUser();
    const visitRecords = VisitLogger.getRecords().slice(0, 20);
    const todayCount = VisitLogger.getTodayCount();

    const content = `
      <div class="p-6 max-w-lg w-full">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-serif text-xl font-medium">设置</h3>
          <button onclick="Modal.close()" class="p-2 -mr-2 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Tab 切换 -->
        <div class="flex space-x-6 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button onclick="App.switchSettingsTab('account')" id="st-account" class="settings-tab pb-2 px-1 text-sm font-medium border-b-2 ${tab === 'account' ? 'border-secondary text-secondary' : 'border-transparent text-text-secondary dark:text-dark-text-secondary'}">账号管理</button>
          <button onclick="App.switchSettingsTab('data')" id="st-data" class="settings-tab pb-2 px-1 text-sm font-medium border-b-2 ${tab === 'data' ? 'border-secondary text-secondary' : 'border-transparent text-text-secondary dark:text-dark-text-secondary'}">数据管理</button>
          <button onclick="App.switchSettingsTab('records')" id="st-records" class="settings-tab pb-2 px-1 text-sm font-medium border-b-2 ${tab === 'records' ? 'border-secondary text-secondary' : 'border-transparent text-text-secondary dark:text-dark-text-secondary'}">访问记录</button>
          <button onclick="App.switchSettingsTab('about')" id="st-about" class="settings-tab pb-2 px-1 text-sm font-medium border-b-2 ${tab === 'about' ? 'border-secondary text-secondary' : 'border-transparent text-text-secondary dark:text-dark-text-secondary'}">关于</button>
        </div>

        <!-- 账号管理 Tab -->
        <div id="stab-account" class="settings-panel ${tab === 'account' ? '' : 'hidden'}">
          <div class="space-y-5">
            <!-- 用户信息展示 -->
            <div class="flex items-center space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary text-2xl font-serif overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                ${user && user.avatar ? `<img src="${user.avatar}" class="w-full h-full object-cover" alt="avatar">` : (user ? user.nickname.charAt(0) : '岛')}
              </div>
              <div>
                <p class="font-medium text-lg">${user ? user.nickname : '岛主'}</p>
                <p class="text-sm text-text-secondary dark:text-dark-text-secondary">账号：${user ? user.username : ''}</p>
                <p class="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
                  登录次数：${user ? (user.loginCount || 1) : 0} 次
                </p>
              </div>
            </div>

            <!-- 修改昵称 -->
            <div>
              <label class="block text-sm font-medium mb-2">修改昵称</label>
              <div class="flex space-x-2">
                <input type="text" id="settings-nickname" value="${user ? user.nickname : ''}" class="flex-1 px-3 py-2 bg-white/70 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-secondary">
                <button onclick="App.updateNickname()" class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">保存</button>
              </div>
            </div>

            <!-- 修改头像 -->
            <div>
              <label class="block text-sm font-medium mb-2">修改头像</label>
              <div class="flex items-center space-x-4">
                <div id="settings-avatar-preview" class="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary overflow-hidden border border-gray-200 dark:border-gray-700">
                  ${user && user.avatar ? `<img src="${user.avatar}" class="w-full h-full object-cover" alt="avatar">` : (user ? user.nickname.charAt(0) : '岛')}
                </div>
                <label class="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  选择图片
                  <input type="file" accept="image/*" onchange="App.handleSettingsAvatar(this)" class="hidden">
                </label>
                <button onclick="App.saveSettingsAvatar()" class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">保存</button>
              </div>
            </div>

            <!-- 修改密码 -->
            <div>
              <label class="block text-sm font-medium mb-2">修改密码</label>
              <div class="space-y-2">
                <input type="password" id="settings-old-pwd" placeholder="当前密码" class="w-full px-3 py-2 bg-white/70 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-secondary">
                <input type="password" id="settings-new-pwd" placeholder="新密码（至少6位）" class="w-full px-3 py-2 bg-white/70 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-secondary">
                <input type="password" id="settings-new-pwd2" placeholder="确认新密码" class="w-full px-3 py-2 bg-white/70 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-secondary">
                <button onclick="App.updatePassword()" class="w-full py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">修改密码</button>
              </div>
            </div>

            <div class="divider"></div>

            <!-- 退出登录 -->
            <div class="space-y-2">
              <button onclick="App.logout(); Modal.close();" class="w-full py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                退出登录
              </button>
              <button onclick="App.deleteAccount()" class="w-full py-2.5 text-red-500 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                注销账号（清除所有数据）
              </button>
            </div>
          </div>
        </div>

        <!-- 数据管理 Tab -->
        <div id="stab-data" class="settings-panel ${tab === 'data' ? '' : 'hidden'}">
          <div class="space-y-4">
            <div>
              <p class="text-sm font-medium mb-3">数据导入导出</p>
              <div class="space-y-2">
                <button onclick="DataManager.downloadExport()" class="w-full flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                  <span class="text-sm">📤 导出数据</span>
                  <span class="text-xs text-text-secondary dark:text-dark-text-secondary">JSON 备份</span>
                </button>
                <label class="w-full flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer">
                  <span class="text-sm">📥 导入数据</span>
                  <span class="text-xs text-text-secondary dark:text-dark-text-secondary">恢复备份</span>
                  <input type="file" accept=".json" onchange="App.importData(this)" class="hidden">
                </label>
              </div>
            </div>

            <div class="divider"></div>

            <!-- 主题设置 -->
            <div class="flex items-center justify-between py-2">
              <div>
                <p class="text-sm font-medium">深色模式</p>
                <p class="text-xs text-text-secondary dark:text-dark-text-secondary mt-0.5">切换浅色/深色主题</p>
              </div>
              <button onclick="Theme.toggle(); App.updateSettingsThemeBtn()" id="settings-theme-toggle" class="relative w-12 h-6 rounded-full transition-colors ${document.documentElement.classList.contains('dark') ? 'bg-primary' : 'bg-gray-300'}">
                <span class="absolute top-0.5 ${document.documentElement.classList.contains('dark') ? 'right-0.5' : 'left-0.5'} w-5 h-5 rounded-full bg-white shadow transition-all"></span>
              </button>
            </div>

            <div class="divider"></div>

            <!-- 危险操作 -->
            <div>
              <button onclick="App.resetAllData()" class="w-full text-sm text-red-500 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                清空所有数据
              </button>
            </div>
          </div>
        </div>

        <!-- 访问记录 Tab -->
        <div id="stab-records" class="settings-panel ${tab === 'records' ? '' : 'hidden'}">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium">今日访问 <span class="text-secondary">${todayCount}</span> 次</p>
              <button onclick="VisitLogger.clear(); App.openSettings('records');" class="text-xs text-text-secondary dark:text-dark-text-secondary hover:text-red-500 transition-colors">清空记录</button>
            </div>
            <div class="max-h-80 overflow-y-auto space-y-1.5">
              ${visitRecords.length === 0 ? `
                <p class="text-sm text-text-secondary dark:text-dark-text-secondary text-center py-8">暂无访问记录</p>
              ` : visitRecords.map(r => `
                <div class="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div class="flex items-center space-x-3">
                    <span class="text-lg">${this.getRecordIcon(r.action)}</span>
                    <div>
                      <p class="text-sm">${r.description}</p>
                      <p class="text-xs text-text-secondary dark:text-dark-text-secondary">${DateUtils.format(r.timestamp, 'MM-DD HH:mm')}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 关于 Tab -->
        <div id="stab-about" class="settings-panel ${tab === 'about' ? '' : 'hidden'}">
          <div class="text-center py-6 space-y-3">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <svg class="w-10 h-10 text-primary" viewBox="0 0 40 40" fill="none">
                <path d="M5,28 Q12,20 20,18 Q28,20 35,28 Q28,30 20,29 Q12,30 5,28 Z" fill="none" stroke="currentColor" stroke-width="1.5"></path>
                <ellipse cx="20" cy="16" rx="4" ry="1.5" fill="none" stroke="#C9A227" stroke-width="1"></ellipse>
                <line x1="20" y1="16" x2="20" y2="12" stroke="#C9A227" stroke-width="1.5"></line>
                <path d="M8,34 Q15,30 20,34" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.5"></path>
                <path d="M20,34 Q25,30 32,34" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.5"></path>
              </svg>
            </div>
            <h4 class="font-serif text-lg font-medium">时屿 Time Isle</h4>
            <p class="text-sm text-text-secondary dark:text-dark-text-secondary">v1.1</p>
            <p class="text-xs text-text-secondary dark:text-dark-text-secondary max-w-xs mx-auto">
              一个人的数字岛屿<br>
              在时间里，有一座自己的岛。
            </p>
            <div class="pt-4 text-xs text-text-secondary dark:text-dark-text-secondary opacity-60">
              ${user ? '岛主：' + user.nickname : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  // 切换设置 Tab
  switchSettingsTab(tab) {
    document.querySelectorAll('.settings-tab').forEach(t => {
      t.classList.remove('border-secondary', 'text-secondary');
      t.classList.add('border-transparent', 'text-text-secondary');
    });
    const activeTab = document.getElementById('st-' + tab);
    if (activeTab) {
      activeTab.classList.add('border-secondary', 'text-secondary');
      activeTab.classList.remove('border-transparent', 'text-text-secondary');
    }
    document.querySelectorAll('.settings-panel').forEach(p => {
      p.classList.add('hidden');
    });
    const panel = document.getElementById('stab-' + tab);
    if (panel) panel.classList.remove('hidden');
  },

  // 获取记录图标
  getRecordIcon(action) {
    const icons = {
      'login': '🚪',
      'logout': '👋',
      'page_view': '📄',
      'create': '✨',
      'update': '✏️',
      'delete': '🗑️'
    };
    return icons[action] || '📌';
  },

  // 修改昵称
  updateNickname() {
    const nickname = document.getElementById('settings-nickname').value.trim();
    if (!nickname) {
      Toast.show('昵称不能为空', 'error');
      return;
    }
    const result = UserManager.updateProfile({ nickname: nickname });
    if (result.success) {
      Toast.show('昵称修改成功', 'success');
      this.updateUserInfo();
      // 重新打开设置以更新显示
      this.openSettings('account');
    } else {
      Toast.show(result.message, 'error');
    }
  },

  // 设置页头像预览处理
  handleSettingsAvatar(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      Toast.show('头像不能超过 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;
        ctx.drawImage(img, 0, 0, 128, 128);
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        const preview = document.getElementById('settings-avatar-preview');
        if (preview) {
          preview.innerHTML = `<img src="${compressed}" class="w-full h-full object-cover" alt="avatar">`;
          preview.dataset.avatar = compressed;
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  // 保存设置页头像
  saveSettingsAvatar() {
    const preview = document.getElementById('settings-avatar-preview');
    const avatar = preview?.dataset?.avatar;
    if (!avatar) {
      Toast.show('请先选择图片', 'error');
      return;
    }
    const result = UserManager.updateProfile({ avatar: avatar });
    if (result.success) {
      Toast.show('头像更新成功', 'success');
      this.updateUserInfo();
      this.openSettings('account');
    }
  },

  // 修改密码
  updatePassword() {
    const oldPwd = document.getElementById('settings-old-pwd').value;
    const newPwd = document.getElementById('settings-new-pwd').value;
    const newPwd2 = document.getElementById('settings-new-pwd2').value;

    if (!oldPwd || !newPwd || !newPwd2) {
      Toast.show('请填写完整信息', 'error');
      return;
    }
    if (newPwd.length < 6) {
      Toast.show('新密码至少6位', 'error');
      return;
    }
    if (newPwd !== newPwd2) {
      Toast.show('两次输入的新密码不一致', 'error');
      return;
    }
    if (!UserManager.verifyPassword(oldPwd)) {
      Toast.show('当前密码错误', 'error');
      return;
    }

    const result = UserManager.updateProfile({ newPassword: newPwd });
    if (result.success) {
      Toast.show('密码修改成功', 'success');
      document.getElementById('settings-old-pwd').value = '';
      document.getElementById('settings-new-pwd').value = '';
      document.getElementById('settings-new-pwd2').value = '';
    } else {
      Toast.show(result.message, 'error');
    }
  },

  // 注销账号
  deleteAccount() {
    if (!confirm('确定要注销账号吗？所有数据将被清除，且无法恢复！')) return;
    if (!confirm('请再次确认：注销后所有日记、知识、记账等数据都将丢失！')) return;
    UserManager.deleteAccount();
    Modal.close();
    this.isLoggedIn = false;
    // 刷新页面回到登录状态
    location.reload();
  },

  // 更新设置面板主题按钮状态
  updateSettingsThemeBtn() {
    const btn = document.getElementById('settings-theme-toggle');
    if (!btn) return;
    const isDark = document.documentElement.classList.contains('dark');
    btn.className = `relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-gray-300'}`;
    const handle = btn.querySelector('span');
    if (handle) {
      handle.className = `absolute top-0.5 ${isDark ? 'right-0.5' : 'left-0.5'} w-5 h-5 rounded-full bg-white shadow transition-all`;
    }
  },

  // 导入数据
  importData(input) {
    const file = input.files[0];
    if (!file) return;

    if (!confirm('导入数据将覆盖现有数据，确定继续吗？')) {
      input.value = '';
      return;
    }

    DataManager.importFromFile(file).then(() => {
      Modal.close();
      Toast.show('数据导入成功', 'success');
      // 重新渲染当前页面
      this.navigateTo(this.currentPage);
    }).catch(err => {
      Toast.show('导入失败：文件格式错误', 'error');
      console.error(err);
    });
    input.value = '';
  },

  // 重置所有数据
  resetAllData() {
    if (!confirm('确定要清空所有数据吗？此操作不可恢复！')) return;
    if (!confirm('真的确定吗？所有日记、知识、记账都将消失！')) return;

    Storage.clear();
    // 重新初始化示例数据
    initSampleData();
    Storage.set('isLoggedIn', true);
    App.passwordUnlocked = false;
    App._masterPassword = null;
    Theme.set('light');

    Modal.close();
    Toast.show('已重置所有数据', 'success');
    this.navigateTo('dashboard');
  },

  // 绑定悬浮便签按钮
  bindFloatingNote() {
    const btn = document.getElementById('floating-note-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        DashboardPage.openQuickNote();
      });
    }
  }
};

// ========== 页面加载完成后初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
