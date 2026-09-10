/* ========================================
   时屿 | Time Isle - 百工坊 · 工具百宝箱页面
   ======================================== */

const ToolsPage = {
  activeTool: null, // null | unit | note | subscription

  render(container) {
    if (this.activeTool) {
      container.innerHTML = this.renderToolDetail();
      return;
    }

    container.innerHTML = `
      <div class="fade-in space-y-6">
        <!-- 页面标题 -->
        <div>
          <h1 class="font-serif text-2xl md:text-3xl font-medium">百工坊</h1>
          <p class="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">实用工具集合</p>
        </div>

        <!-- 工具列表 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- 全能单位换算 -->
          <button onclick="ToolsPage.openTool('unit')" class="card p-6 text-left hover:border-primary/30 group">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
              </svg>
            </div>
            <h3 class="font-serif text-lg font-medium mb-1">全能单位换算</h3>
            <p class="text-sm text-text-secondary dark:text-dark-text-secondary">长度、重量、面积、体积、货币、古代度量衡</p>
          </button>

          <!-- 临时悬浮便签 -->
          <button onclick="ToolsPage.openTool('note')" class="card p-6 text-left hover:border-secondary/30 group">
            <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
              <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <h3 class="font-serif text-lg font-medium mb-1">快速便签</h3>
            <p class="text-sm text-text-secondary dark:text-dark-text-secondary">随手记下想法，可归类到各模块</p>
          </button>

          <!-- 账号到期提醒 -->
          <button onclick="ToolsPage.openTool('subscription')" class="card p-6 text-left hover:border-primary/30 group">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </div>
            <h3 class="font-serif text-lg font-medium mb-1">账号到期提醒</h3>
            <p class="text-sm text-text-secondary dark:text-dark-text-secondary">会员、域名、软件续费管理</p>
          </button>
        </div>

        <!-- 更多工具占位 -->
        <div class="card p-8 text-center border-dashed">
          <p class="text-text-secondary dark:text-dark-text-secondary">更多工具正在开发中...</p>
        </div>
      </div>
    `;
  },

  openTool(tool) {
    this.activeTool = tool;
    this.render(document.getElementById('page-container'));
  },

  closeTool() {
    this.activeTool = null;
    this.render(document.getElementById('page-container'));
  },

  renderToolDetail() {
    let content = '';
    let title = '';

    switch (this.activeTool) {
      case 'unit':
        title = '全能单位换算';
        content = this.renderUnitConverter();
        break;
      case 'note':
        title = '快速便签';
        content = this.renderQuickNote();
        break;
      case 'subscription':
        title = '账号到期提醒';
        content = this.renderSubscriptions();
        break;
    }

    return `
      <div class="fade-in space-y-6">
        <div class="flex items-center gap-4">
          <button onclick="ToolsPage.closeTool()" class="p-2 -ml-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="font-serif text-2xl md:text-3xl font-medium">${title}</h1>
        </div>
        ${content}
      </div>
    `;
  },

  // ========== 单位换算 ==========
  unitCategory: 'length',
  unitFrom: '',
  unitTo: '',
  unitValue: 1,

  renderUnitConverter() {
    const categories = [
      { id: 'length', name: '长度', units: { '米': 1, '千米': 1000, '厘米': 0.01, '毫米': 0.001, '英里': 1609.344, '英尺': 0.3048, '英寸': 0.0254, '海里': 1852 } },
      { id: 'weight', name: '重量', units: { '千克': 1, '克': 0.001, '吨': 1000, '磅': 0.453592, '盎司': 0.0283495, '斤': 0.5, '两': 0.05 } },
      { id: 'area', name: '面积', units: { '平方米': 1, '平方千米': 1000000, '平方厘米': 0.0001, '公顷': 10000, '英亩': 4046.86, '平方英尺': 0.092903 } },
      { id: 'volume', name: '体积', units: { '升': 1, '毫升': 0.001, '立方米': 1000, '加仑': 3.78541, '立方英尺': 28.3168, '杯': 0.236588 } },
      { id: 'ancient', name: '古代度量衡', units: { '石（宋）': 67, '斗（宋）': 6.7, '斤（宋）': 0.596, '两（宋）': 0.0373, '钱（宋）': 0.00373, '石（明）': 94.4, '斤（明）': 0.59, '两（明）': 0.0369, '银两（清）': 0.037 } }
    ];

    const currentCat = categories.find(c => c.id === this.unitCategory) || categories[0];
    const unitNames = Object.keys(currentCat.units);
    if (!this.unitFrom) this.unitFrom = unitNames[0];
    if (!this.unitTo) this.unitTo = unitNames[1] || unitNames[0];

    const fromRate = currentCat.units[this.unitFrom];
    const toRate = currentCat.units[this.unitTo];
    const result = fromRate && toRate ? (this.unitValue * fromRate / toRate) : 0;

    return `
      <div class="card p-6">
        <!-- 分类选择 -->
        <div class="flex flex-wrap gap-2 mb-6">
          ${categories.map(cat => `
            <button onclick="ToolsPage.setUnitCategory('${cat.id}')" 
              class="px-4 py-2 text-sm rounded-lg transition-all ${this.unitCategory === cat.id ? 'bg-primary/10 text-primary font-medium' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}">
              ${cat.name}
            </button>
          `).join('')}
        </div>

        <!-- 换算区 -->
        <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">从</label>
            <div class="flex gap-2">
              <input type="number" value="${this.unitValue}" onchange="ToolsPage.setUnitValue(this.value)"
                class="input-field flex-1 text-lg font-medium">
              <select onchange="ToolsPage.setUnitFrom(this.value)" class="input-field w-28">
                ${unitNames.map(u => `<option value="${u}" ${u === this.unitFrom ? 'selected' : ''}>${u}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="text-center">
            <button onclick="ToolsPage.swapUnits()" class="p-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
              <svg class="w-5 h-5 text-text-secondary dark:text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </button>
          </div>

          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">等于</label>
            <div class="flex gap-2">
              <input type="text" readonly value="${result.toFixed(6).replace(/\.?0+$/, '')}" 
                class="input-field flex-1 text-lg font-medium text-secondary bg-secondary/5">
              <select onchange="ToolsPage.setUnitTo(this.value)" class="input-field w-28">
                ${unitNames.map(u => `<option value="${u}" ${u === this.unitTo ? 'selected' : ''}>${u}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="ToolsPage.saveToKnowledge()" class="text-sm text-primary hover:underline">
            + 保存到知识库
          </button>
        </div>
      </div>
    `;
  },

  setUnitCategory(cat) {
    this.unitCategory = cat;
    this.unitFrom = '';
    this.unitTo = '';
    this.render(document.getElementById('page-container'));
  },

  setUnitValue(val) {
    this.unitValue = parseFloat(val) || 0;
    this.render(document.getElementById('page-container'));
  },

  setUnitFrom(unit) {
    this.unitFrom = unit;
    this.render(document.getElementById('page-container'));
  },

  setUnitTo(unit) {
    this.unitTo = unit;
    this.render(document.getElementById('page-container'));
  },

  swapUnits() {
    const temp = this.unitFrom;
    this.unitFrom = this.unitTo;
    this.unitTo = temp;
    this.render(document.getElementById('page-container'));
  },

  saveToKnowledge() {
    Toast.show('已保存到知识库', 'success');
  },

  // ========== 快速便签 ==========
  renderQuickNote() {
    return `
      <div class="card p-6">
        <p class="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">随手记下点什么，之后可以归类到日记、知识库、脑洞或待办。</p>
        <textarea id="tool-note-content" class="input-field" rows="10" placeholder="写点什么..."></textarea>
        <div class="flex flex-wrap gap-2 mt-4">
          <button onclick="ToolsPage.quickNoteTo('diary')" class="px-4 py-2 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            📔 归入日记
          </button>
          <button onclick="ToolsPage.quickNoteTo('knowledge')" class="px-4 py-2 text-sm rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
            📚 归入知识库
          </button>
          <button onclick="ToolsPage.quickNoteTo('idea')" class="px-4 py-2 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            💡 归入脑洞
          </button>
          <button onclick="ToolsPage.quickNoteTo('todo')" class="px-4 py-2 text-sm rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
            ✅ 归入待办
          </button>
        </div>
      </div>
    `;
  },

  quickNoteTo(type) {
    const content = document.getElementById('tool-note-content')?.value.trim();
    if (!content) {
      Toast.show('便签内容不能为空', 'warning');
      return;
    }

    switch (type) {
      case 'diary':
        const diaries = Storage.get('diaries', []);
        const today = DateUtils.today();
        let todayDiary = diaries.find(d => d.date === today);
        if (todayDiary) {
          todayDiary.content += '\n\n' + content;
        } else {
          diaries.unshift({
            id: generateId('d'),
            date: today,
            content,
            mood: '',
            weather: '',
            tags: ['便签'],
            createdAt: new Date().toISOString()
          });
        }
        Storage.set('diaries', diaries);
        Toast.show('已归入日记', 'success');
        break;
      case 'knowledge':
        const knowledge = Storage.get('knowledge', []);
        knowledge.unshift({
          id: generateId('k'),
          title: content.substring(0, 20) + (content.length > 20 ? '...' : ''),
          category: 'cat_misc',
          summary: content.substring(0, 50),
          content,
          tags: ['便签'],
          source: '快速便签',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        Storage.set('knowledge', knowledge);
        Toast.show('已归入知识库', 'success');
        break;
      case 'idea':
        const ideas = Storage.get('ideas', []);
        ideas.unshift({
          id: generateId('idea'),
          title: content.substring(0, 20) + (content.length > 20 ? '...' : ''),
          content,
          status: 'inspiration',
          tags: ['便签'],
          createdAt: new Date().toISOString()
        });
        Storage.set('ideas', ideas);
        Toast.show('已归入脑洞', 'success');
        break;
      case 'todo':
        const todos = Storage.get('todos', []);
        todos.unshift({
          id: generateId('todo'),
          title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
          description: content,
          status: 'todo',
          priority: 'medium',
          dueDate: null,
          createdAt: new Date().toISOString()
        });
        Storage.set('todos', todos);
        Toast.show('已归入待办', 'success');
        break;
    }

    document.getElementById('tool-note-content').value = '';
  },

  // ========== 账号到期提醒 ==========
  renderSubscriptions() {
    const subs = Storage.get('subscriptions', []);
    const now = new Date();

    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-text-secondary dark:text-dark-text-secondary">共 ${subs.length} 个订阅</p>
          <button onclick="ToolsPage.openAddSubModal()" class="btn-primary text-sm">+ 添加订阅</button>
        </div>

        ${subs.length > 0 ? `
          <div class="card overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left text-sm font-medium text-text-secondary dark:text-dark-text-secondary py-3 px-4">名称</th>
                  <th class="text-left text-sm font-medium text-text-secondary dark:text-dark-text-secondary py-3 px-4">到期时间</th>
                  <th class="text-left text-sm font-medium text-text-secondary dark:text-dark-text-secondary py-3 px-4">价格</th>
                  <th class="text-left text-sm font-medium text-text-secondary dark:text-dark-text-secondary py-3 px-4">周期</th>
                  <th class="text-left text-sm font-medium text-text-secondary dark:text-dark-text-secondary py-3 px-4">状态</th>
                  <th class="text-right text-sm font-medium text-text-secondary dark:text-dark-text-secondary py-3 px-4">操作</th>
                </tr>
              </thead>
              <tbody>
                ${subs.map(s => {
                  const daysLeft = DateUtils.daysBetween(now, s.expireDate);
                  const isExpiringSoon = daysLeft <= 7;
                  const isExpired = new Date(s.expireDate) < now;
                  let statusHtml = '';
                  if (isExpired) {
                    statusHtml = '<span class="text-red-500 text-sm">已过期</span>';
                  } else if (isExpiringSoon) {
                    statusHtml = `<span class="text-secondary text-sm">${daysLeft}天后到期</span>`;
                  } else {
                    statusHtml = `<span class="text-green-600 text-sm">${daysLeft}天后到期</span>`;
                  }
                  return `
                    <tr class="border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <td class="py-3 px-4 text-sm font-medium">${s.name}</td>
                      <td class="py-3 px-4 text-sm">${s.expireDate}</td>
                      <td class="py-3 px-4 text-sm">¥${s.price}</td>
                      <td class="py-3 px-4 text-sm">${s.cycle === 'monthly' ? '月付' : '年付'}</td>
                      <td class="py-3 px-4">${statusHtml}</td>
                      <td class="py-3 px-4 text-right">
                        <button onclick="ToolsPage.deleteSub('${s.id}')" class="text-xs text-red-500 hover:underline">删除</button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="card p-12 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <p class="text-text-secondary dark:text-dark-text-secondary">还没有添加订阅</p>
          </div>
        `}
      </div>
    `;
  },

  openAddSubModal() {
    const content = `
      <div class="p-6">
        <h3 class="font-serif text-xl font-medium mb-4">添加订阅</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">名称</label>
            <input type="text" id="sub-name" class="input-field" placeholder="如：Netflix">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">价格</label>
              <input type="number" id="sub-price" class="input-field" placeholder="0.00" step="0.01">
            </div>
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">周期</label>
              <select id="sub-cycle" class="input-field">
                <option value="monthly">月付</option>
                <option value="yearly">年付</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">到期日期</label>
            <input type="date" id="sub-expire" class="input-field">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">备注</label>
            <input type="text" id="sub-note" class="input-field" placeholder="可选">
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">取消</button>
          <button onclick="ToolsPage.saveSub()" class="btn-primary">保存</button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  saveSub() {
    const name = document.getElementById('sub-name')?.value.trim();
    const price = parseFloat(document.getElementById('sub-price')?.value) || 0;
    const cycle = document.getElementById('sub-cycle')?.value;
    const expireDate = document.getElementById('sub-expire')?.value;
    const note = document.getElementById('sub-note')?.value.trim();

    if (!name || !expireDate) {
      Toast.show('请填写名称和到期日期', 'warning');
      return;
    }

    const subs = Storage.get('subscriptions', []);
    subs.unshift({
      id: generateId('s'),
      name,
      price,
      cycle,
      expireDate,
      note
    });
    Storage.set('subscriptions', subs);

    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('已添加', 'success');
  },

  deleteSub(id) {
    if (!confirm('确定删除这条订阅吗？')) return;
    let subs = Storage.get('subscriptions', []);
    subs = subs.filter(s => s.id !== id);
    Storage.set('subscriptions', subs);
    this.render(document.getElementById('page-container'));
    Toast.show('已删除', 'success');
  }
};
