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
    this.isLoggedIn = Storage.get('isLoggedIn', false);

    // 绑定主题切换按钮
    this.bindThemeToggles();

    // 绑定登录按钮
    this.bindLogin();

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

    // 如果已登录，直接进入主应用
    if (this.isLoggedIn) {
      this.showMainApp();
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

  // 绑定登录
  bindLogin() {
    const enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        this.enterIsle();
      });
    }
  },

  // 进入岛屿
  enterIsle() {
    const loginPage = document.getElementById('login-page');
    if (loginPage) {
      loginPage.style.opacity = '0';
      setTimeout(() => {
        loginPage.style.display = 'none';
        this.showMainApp();
        Storage.set('isLoggedIn', true);
        this.isLoggedIn = true;
      }, 600);
    }
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
  openSettings() {
    const content = `
      <div class="p-6 max-w-md w-full">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-serif text-xl font-medium">设置</h3>
          <button onclick="Modal.close()" class="p-2 -mr-2 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- 主题设置 -->
          <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p class="text-sm font-medium">深色模式</p>
              <p class="text-xs text-text-secondary dark:text-dark-text-secondary mt-0.5">切换浅色/深色主题</p>
            </div>
            <button onclick="Theme.toggle(); App.updateSettingsThemeBtn()" id="settings-theme-toggle" class="relative w-12 h-6 rounded-full transition-colors ${document.documentElement.classList.contains('dark') ? 'bg-primary' : 'bg-gray-300'}">
              <span class="absolute top-0.5 ${document.documentElement.classList.contains('dark') ? 'right-0.5' : 'left-0.5'} w-5 h-5 rounded-full bg-white shadow transition-all"></span>
            </button>
          </div>

          <div class="divider"></div>

          <!-- 数据管理 -->
          <div>
            <p class="text-sm font-medium mb-3">数据管理</p>
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

          <!-- 关于 -->
          <div>
            <p class="text-sm font-medium mb-2">关于</p>
            <p class="text-xs text-text-secondary dark:text-dark-text-secondary">
              时屿 Time Isle v1.0<br>
              一个人的数字岛屿<br>
              岛主：时淮序
            </p>
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
    `;
    Modal.open(content);
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
