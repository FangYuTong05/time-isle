/* ========================================
   时屿 | Time Isle - 归藏库 · 资产中心页面
   ======================================== */

const AssetsPage = {
  activeTab: 'items', // items | passwords | links | fragments

  render(container) {
    container.innerHTML = `
      <div class="fade-in space-y-6">
        <!-- 页面标题 -->
        <div>
          <h1 class="font-serif text-2xl md:text-3xl font-medium">归藏库</h1>
          <p class="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">资产管理中心</p>
        </div>

        <!-- Tab 切换 -->
        <div class="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          <button onclick="AssetsPage.setTab('items')" 
            class="tab-btn ${this.activeTab === 'items' ? 'active' : ''}">
            📦 物品清单
          </button>
          <button onclick="AssetsPage.setTab('passwords')" 
            class="tab-btn ${this.activeTab === 'passwords' ? 'active' : ''}">
            🔐 密码保险箱
          </button>
          <button onclick="AssetsPage.setTab('links')" 
            class="tab-btn ${this.activeTab === 'links' ? 'active' : ''}">
            🔗 资源链接
          </button>
          <button onclick="AssetsPage.setTab('fragments')" 
            class="tab-btn ${this.activeTab === 'fragments' ? 'active' : ''}">
            💬 碎片收藏
          </button>
        </div>

        <!-- Tab 内容 -->
        <div id="assets-tab-content">
          ${this.renderTabContent()}
        </div>
      </div>
    `;
  },

  setTab(tab) {
    this.activeTab = tab;
    this.render(document.getElementById('page-container'));
  },

  renderTabContent() {
    switch (this.activeTab) {
      case 'items': return this.renderItems();
      case 'passwords': return this.renderPasswords();
      case 'links': return this.renderLinks();
      case 'fragments': return this.renderFragments();
      default: return '';
    }
  },

  // ========== 物品清单 ==========
  renderItems() {
    const items = Storage.get('items', []);
    const categories = ['数码', '书籍', '收藏', '日用品', '其他'];

    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex gap-2 flex-wrap">
            ${categories.map(cat => `
              <button class="px-3 py-1.5 text-sm rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                ${cat}
              </button>
            `).join('')}
          </div>
          <button onclick="AssetsPage.openAddItemModal()" class="btn-primary text-sm">+ 添加物品</button>
        </div>

        ${items.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${items.map(item => `
              <div class="card p-5">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="font-medium">${item.name}</h3>
                  <span class="tag">${item.category}</span>
                </div>
                ${item.feeling ? `<p class="text-sm text-text-secondary dark:text-dark-text-secondary line-clamp-2 mb-3">${item.feeling}</p>` : ''}
                <div class="flex items-center justify-between text-xs text-text-secondary dark:text-dark-text-secondary">
                  <span>¥${item.price}</span>
                  <span>${item.purchaseDate}</span>
                </div>
                <div class="flex justify-end mt-3">
                  <button onclick="AssetsPage.deleteItem('${item.id}')" class="text-xs text-red-500 hover:underline">删除</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="card p-12 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <p class="text-text-secondary dark:text-dark-text-secondary">还没有添加物品</p>
          </div>
        `}
      </div>
    `;
  },

  openAddItemModal() {
    const categories = ['数码', '书籍', '收藏', '日用品', '其他'];
    const content = `
      <div class="p-6">
        <h3 class="font-serif text-xl font-medium mb-4">添加物品</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">名称</label>
            <input type="text" id="item-name" class="input-field" placeholder="物品名称">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">分类</label>
              <select id="item-category" class="input-field">
                ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">价格</label>
              <input type="number" id="item-price" class="input-field" placeholder="0.00" step="0.01">
            </div>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">购买日期</label>
            <input type="date" id="item-date" class="input-field" value="${DateUtils.today()}">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">使用感受</label>
            <textarea id="item-feeling" class="input-field" rows="2" placeholder="用起来怎么样？"></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">取消</button>
          <button onclick="AssetsPage.saveItem()" class="btn-primary">保存</button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  saveItem() {
    const name = document.getElementById('item-name')?.value.trim();
    const category = document.getElementById('item-category')?.value;
    const price = parseFloat(document.getElementById('item-price')?.value) || 0;
    const purchaseDate = document.getElementById('item-date')?.value;
    const feeling = document.getElementById('item-feeling')?.value.trim();

    if (!name) {
      Toast.show('请输入物品名称', 'warning');
      return;
    }

    const items = Storage.get('items', []);
    items.unshift({
      id: generateId('i'),
      name,
      category,
      price,
      purchaseDate,
      feeling,
      image: null,
      createdAt: new Date().toISOString()
    });
    Storage.set('items', items);

    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('已添加', 'success');
  },

  deleteItem(id) {
    if (!confirm('确定删除这个物品吗？')) return;
    let items = Storage.get('items', []);
    items = items.filter(i => i.id !== id);
    Storage.set('items', items);
    this.render(document.getElementById('page-container'));
    Toast.show('已删除', 'success');
  },

  // ========== 密码保险箱 ==========
  renderPasswords() {
    // 检查是否设置了主密码
    const masterHash = Storage.get('masterPasswordHash', '');
    
    if (!masterHash) {
      return `
        <div class="card p-12 text-center max-w-md mx-auto">
          <svg class="w-16 h-16 mx-auto mb-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <h3 class="font-serif text-xl font-medium mb-2">设置主密码</h3>
          <p class="text-sm text-text-secondary dark:text-dark-text-secondary mb-6">首次使用密码保险箱需要设置主密码，用于加密所有密码数据。<br>请务必牢记，忘记只能重置清空。</p>
          <div class="space-y-3 text-left">
            <input type="password" id="new-master-pwd" class="input-field" placeholder="输入主密码">
            <input type="password" id="new-master-pwd2" class="input-field" placeholder="再次输入主密码">
            <button onclick="AssetsPage.setMasterPassword()" class="btn-primary w-full">设置主密码</button>
          </div>
        </div>
      `;
    }

    if (!App.passwordUnlocked) {
      return `
        <div class="card p-12 text-center max-w-md mx-auto">
          <svg class="w-16 h-16 mx-auto mb-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <h3 class="font-serif text-xl font-medium mb-2">密码保险箱已锁定</h3>
          <p class="text-sm text-text-secondary dark:text-dark-text-secondary mb-6">请输入主密码解锁</p>
          <div class="space-y-3 text-left">
            <input type="password" id="unlock-pwd" class="input-field" placeholder="输入主密码" onkeypress="if(event.key==='Enter')AssetsPage.unlockPasswords()">
            <button onclick="AssetsPage.unlockPasswords()" class="btn-primary w-full">解锁</button>
            <button onclick="AssetsPage.resetPasswords()" class="text-xs text-red-500 hover:underline w-full text-center">忘记密码？重置保险箱</button>
          </div>
        </div>
      `;
    }

    const passwords = Storage.get('passwords', []);
    const categories = ['工作', '社交', '金融', '工具', '其他'];

    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex gap-2 flex-wrap">
            ${categories.map(cat => `
              <button class="px-3 py-1.5 text-sm rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                ${cat}
              </button>
            `).join('')}
          </div>
          <div class="flex gap-2">
            <button onclick="AssetsPage.generateAndCopy()" class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              生成强密码
            </button>
            <button onclick="AssetsPage.openAddPasswordModal()" class="btn-primary text-sm">+ 添加密码</button>
          </div>
        </div>

        ${passwords.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${passwords.map(p => `
              <div class="card p-5">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <h3 class="font-medium">${p.name}</h3>
                    <p class="text-sm text-text-secondary dark:text-dark-text-secondary">${p.account}</p>
                  </div>
                  <span class="tag">${p.category}</span>
                </div>
                <div class="flex items-center gap-2 mt-3">
                  <span class="text-sm font-mono tracking-wider">••••••••</span>
                  <button onclick="AssetsPage.copyPassword('${p.id}')" class="text-xs text-primary hover:underline">复制</button>
                </div>
                ${p.note ? `<p class="text-xs text-text-secondary dark:text-dark-text-secondary mt-2">${p.note}</p>` : ''}
                <div class="flex justify-end mt-3">
                  <button onclick="AssetsPage.deletePassword('${p.id}')" class="text-xs text-red-500 hover:underline">删除</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="card p-12 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <p class="text-text-secondary dark:text-dark-text-secondary">还没有保存密码</p>
          </div>
        `}
      </div>
    `;
  },

  setMasterPassword() {
    const pwd1 = document.getElementById('new-master-pwd')?.value;
    const pwd2 = document.getElementById('new-master-pwd2')?.value;

    if (!pwd1 || pwd1.length < 4) {
      Toast.show('密码长度至少4位', 'warning');
      return;
    }
    if (pwd1 !== pwd2) {
      Toast.show('两次输入不一致', 'warning');
      return;
    }

    Storage.set('masterPasswordHash', Crypto.hash(pwd1));
    App.passwordUnlocked = true;
    this.render(document.getElementById('page-container'));
    Toast.show('主密码设置成功', 'success');
  },

  unlockPasswords() {
    const pwd = document.getElementById('unlock-pwd')?.value;
    const savedHash = Storage.get('masterPasswordHash', '');

    if (Crypto.hash(pwd) === savedHash) {
      App.passwordUnlocked = true;
      App._masterPassword = pwd; // 临时存储在内存中
      this.render(document.getElementById('page-container'));
      Toast.show('已解锁', 'success');
    } else {
      Toast.show('密码错误', 'error');
    }
  },

  resetPasswords() {
    if (!confirm('确定要重置密码保险箱吗？所有保存的密码将被清空，此操作不可恢复。')) return;
    Storage.remove('masterPasswordHash');
    Storage.set('passwords', []);
    App.passwordUnlocked = false;
    App._masterPassword = null;
    this.render(document.getElementById('page-container'));
    Toast.show('已重置', 'success');
  },

  generateAndCopy() {
    const pwd = Crypto.generatePassword(16);
    navigator.clipboard.writeText(pwd).then(() => {
      Toast.show('已生成并复制到剪贴板', 'success');
    }).catch(() => {
      Toast.show('生成的密码: ' + pwd, 'info');
    });
  },

  openAddPasswordModal() {
    const categories = ['工作', '社交', '金融', '工具', '其他'];
    const content = `
      <div class="p-6">
        <h3 class="font-serif text-xl font-medium mb-4">添加密码</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">名称</label>
            <input type="text" id="pwd-name" class="input-field" placeholder="如：GitHub">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">分类</label>
              <select id="pwd-category" class="input-field">
                ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">账号</label>
              <input type="text" id="pwd-account" class="input-field" placeholder="用户名/邮箱">
            </div>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">密码</label>
            <div class="flex gap-2">
              <input type="text" id="pwd-password" class="input-field flex-1" placeholder="密码">
              <button onclick="document.getElementById('pwd-password').value = Crypto.generatePassword(16)" class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                生成
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">绑定邮箱</label>
            <input type="text" id="pwd-email" class="input-field" placeholder="可选">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">备注</label>
            <input type="text" id="pwd-note" class="input-field" placeholder="可选">
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">取消</button>
          <button onclick="AssetsPage.savePassword()" class="btn-primary">保存</button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  savePassword() {
    const name = document.getElementById('pwd-name')?.value.trim();
    const category = document.getElementById('pwd-category')?.value;
    const account = document.getElementById('pwd-account')?.value.trim();
    const password = document.getElementById('pwd-password')?.value;
    const email = document.getElementById('pwd-email')?.value.trim();
    const note = document.getElementById('pwd-note')?.value.trim();

    if (!name) {
      Toast.show('请输入名称', 'warning');
      return;
    }

    // 加密密码
    const masterPwd = App._masterPassword || '';
    const encryptedPassword = masterPwd ? Crypto.encrypt(password, masterPwd) : password;

    const passwords = Storage.get('passwords', []);
    passwords.unshift({
      id: generateId('p'),
      name,
      category,
      account,
      password: encryptedPassword,
      email,
      note,
      createdAt: new Date().toISOString()
    });
    Storage.set('passwords', passwords);

    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('已保存', 'success');
  },

  copyPassword(id) {
    const passwords = Storage.get('passwords', []);
    const pwd = passwords.find(p => p.id === id);
    if (!pwd) return;

    const masterPwd = App._masterPassword || '';
    const decrypted = masterPwd ? Crypto.decrypt(pwd.password, masterPwd) : pwd.password;
    
    if (decrypted === null) {
      Toast.show('解密失败', 'error');
      return;
    }

    navigator.clipboard.writeText(decrypted).then(() => {
      Toast.show('密码已复制', 'success');
    }).catch(() => {
      Toast.show('复制失败', 'error');
    });
  },

  deletePassword(id) {
    if (!confirm('确定删除这条密码吗？')) return;
    let passwords = Storage.get('passwords', []);
    passwords = passwords.filter(p => p.id !== id);
    Storage.set('passwords', passwords);
    this.render(document.getElementById('page-container'));
    Toast.show('已删除', 'success');
  },

  // ========== 资源链接 ==========
  renderLinks() {
    const links = Storage.get('links', []);
    const categories = ['开发工具', '设计资源', '资讯阅读', '学习教程', '娱乐休闲', '其他'];

    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex gap-2 flex-wrap">
            ${categories.map(cat => `
              <button class="px-3 py-1.5 text-sm rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                ${cat}
              </button>
            `).join('')}
          </div>
          <button onclick="AssetsPage.openAddLinkModal()" class="btn-primary text-sm">+ 添加链接</button>
        </div>

        ${links.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${links.map(link => `
              <a href="${link.url}" target="_blank" class="card p-5 hover:border-primary/30 block">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="font-medium text-primary">${link.title}</h3>
                  <svg class="w-4 h-4 text-text-secondary dark:text-dark-text-secondary flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </div>
                <p class="text-sm text-text-secondary dark:text-dark-text-secondary line-clamp-2 mb-3">${link.description || ''}</p>
                <div class="flex items-center justify-between">
                  <div class="flex flex-wrap gap-1">
                    ${(link.tags || []).slice(0, 2).map(tag => `<span class="tag text-xs">${tag}</span>`).join('')}
                  </div>
                  <span class="text-xs text-text-secondary dark:text-dark-text-secondary">使用 ${link.usageCount || 0} 次</span>
                </div>
              </a>
            `).join('')}
          </div>
        ` : `
          <div class="card p-12 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
            <p class="text-text-secondary dark:text-dark-text-secondary">还没有收藏链接</p>
          </div>
        `}
      </div>
    `;
  },

  openAddLinkModal() {
    const categories = ['开发工具', '设计资源', '资讯阅读', '学习教程', '娱乐休闲', '其他'];
    const content = `
      <div class="p-6">
        <h3 class="font-serif text-xl font-medium mb-4">添加链接</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">标题</label>
            <input type="text" id="link-title" class="input-field" placeholder="网站名称">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">URL</label>
            <input type="url" id="link-url" class="input-field" placeholder="https://...">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">分类</label>
            <select id="link-category" class="input-field">
              ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">描述</label>
            <input type="text" id="link-desc" class="input-field" placeholder="简短描述">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">标签（用逗号分隔）</label>
            <input type="text" id="link-tags" class="input-field" placeholder="标签1, 标签2">
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">取消</button>
          <button onclick="AssetsPage.saveLink()" class="btn-primary">保存</button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  saveLink() {
    const title = document.getElementById('link-title')?.value.trim();
    const url = document.getElementById('link-url')?.value.trim();
    const category = document.getElementById('link-category')?.value;
    const description = document.getElementById('link-desc')?.value.trim();
    const tagsStr = document.getElementById('link-tags')?.value.trim();

    if (!title || !url) {
      Toast.show('请填写标题和URL', 'warning');
      return;
    }

    const tags = tagsStr ? tagsStr.split(/[,，]/).map(t => t.trim()).filter(t => t) : [];
    const links = Storage.get('links', []);
    links.unshift({
      id: generateId('l'),
      title,
      url,
      category,
      description,
      tags,
      usageCount: 0
    });
    Storage.set('links', links);

    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('已添加', 'success');
  },

  // ========== 碎片收藏 ==========
  renderFragments() {
    const fragments = Storage.get('fragments', []);

    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-text-secondary dark:text-dark-text-secondary">共 ${fragments.length} 条碎片</p>
          <div class="flex gap-2">
            <button onclick="AssetsPage.randomFragment()" class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              🎲 随机一条
            </button>
            <button onclick="AssetsPage.openAddFragmentModal()" class="btn-primary text-sm">+ 添加碎片</button>
          </div>
        </div>

        ${fragments.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${fragments.map(f => `
              <div class="card p-5">
                <p class="font-serif text-base leading-relaxed mb-3">"${f.content}"</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-text-secondary dark:text-dark-text-secondary">—— ${f.source || '佚名'}</span>
                  </div>
                  <div class="flex gap-2">
                    ${(f.tags || []).slice(0, 2).map(tag => `<span class="tag text-xs">${tag}</span>`).join('')}
                    <button onclick="AssetsPage.deleteFragment('${f.id}')" class="text-xs text-red-500 hover:underline">删除</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="card p-12 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
            </svg>
            <p class="text-text-secondary dark:text-dark-text-secondary">还没有收藏碎片</p>
          </div>
        `}
      </div>
    `;
  },

  randomFragment() {
    const fragments = Storage.get('fragments', []);
    if (fragments.length === 0) {
      Toast.show('还没有碎片', 'info');
      return;
    }
    const f = fragments[Math.floor(Math.random() * fragments.length)];
    const content = `
      <div class="p-8 text-center max-w-md">
        <svg class="w-10 h-10 mx-auto mb-4 text-secondary opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
        <p class="font-serif text-lg leading-relaxed mb-4">"${f.content}"</p>
        <p class="text-sm text-text-secondary dark:text-dark-text-secondary">—— ${f.source || '佚名'}</p>
        <button onclick="Modal.close()" class="mt-6 px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">关闭</button>
      </div>
    `;
    Modal.open(content);
  },

  openAddFragmentModal() {
    const content = `
      <div class="p-6">
        <h3 class="font-serif text-xl font-medium mb-4">添加碎片</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">内容</label>
            <textarea id="frag-content" class="input-field" rows="3" placeholder="金句、台词、神评..."></textarea>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">来源</label>
            <input type="text" id="frag-source" class="input-field" placeholder="如：某本书、某部电影">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">标签（用逗号分隔）</label>
            <input type="text" id="frag-tags" class="input-field" placeholder="标签1, 标签2">
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">取消</button>
          <button onclick="AssetsPage.saveFragment()" class="btn-primary">保存</button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  saveFragment() {
    const content = document.getElementById('frag-content')?.value.trim();
    const source = document.getElementById('frag-source')?.value.trim();
    const tagsStr = document.getElementById('frag-tags')?.value.trim();

    if (!content) {
      Toast.show('请输入内容', 'warning');
      return;
    }

    const tags = tagsStr ? tagsStr.split(/[,，]/).map(t => t.trim()).filter(t => t) : [];
    const fragments = Storage.get('fragments', []);
    fragments.unshift({
      id: generateId('f'),
      content,
      source,
      tags,
      createdAt: DateUtils.today()
    });
    Storage.set('fragments', fragments);

    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('已保存', 'success');
  },

  deleteFragment(id) {
    if (!confirm('确定删除这条碎片吗？')) return;
    let fragments = Storage.get('fragments', []);
    fragments = fragments.filter(f => f.id !== id);
    Storage.set('fragments', fragments);
    this.render(document.getElementById('page-container'));
    Toast.show('已删除', 'success');
  }
};
