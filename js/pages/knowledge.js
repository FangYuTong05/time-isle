/* ========================================
   时屿 | Time Isle - 万象阁 · 知识库页面
   ======================================== */

const KnowledgePage = {
  currentCategory: 'all',
  searchKeyword: '',
  selectedId: null,
  isEditing: false,

  render(container) {
    const categories = Storage.get('knowledgeCategories', SampleData.knowledgeCategories);
    const allKnowledge = Storage.get('knowledge', []);
    
    // 筛选
    let filtered = allKnowledge;
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(k => k.category === this.currentCategory);
    }
    if (this.searchKeyword) {
      const kw = this.searchKeyword.toLowerCase();
      filtered = filtered.filter(k => 
        k.title.toLowerCase().includes(kw) ||
        k.content.toLowerCase().includes(kw) ||
        (k.tags && k.tags.some(t => t.toLowerCase().includes(kw)))
      );
    }

    // 统计
    const categoryStats = {};
    categories.forEach(cat => {
      categoryStats[cat.id] = allKnowledge.filter(k => k.category === cat.id).length;
    });
    const totalCount = allKnowledge.length;

    // 标签云
    const allTags = {};
    allKnowledge.forEach(k => {
      (k.tags || []).forEach(tag => {
        allTags[tag] = (allTags[tag] || 0) + 1;
      });
    });
    const tagList = Object.entries(allTags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    // 选中的条目
    const selectedItem = this.selectedId ? allKnowledge.find(k => k.id === this.selectedId) : null;

    container.innerHTML = `
      <div class="fade-in space-y-6">
        <!-- 页面标题 -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="font-serif text-2xl md:text-3xl font-medium">万象阁</h1>
            <p class="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">共 ${totalCount} 条知识</p>
          </div>
          <button onclick="KnowledgePage.openNewModal()" class="btn-primary inline-flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            新建条目
          </button>
        </div>

        <!-- 搜索和分类 -->
        <div class="card p-4">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- 搜索框 -->
            <div class="flex-1 relative">
              <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" 
                id="knowledge-search" 
                value="${this.searchKeyword}"
                oninput="KnowledgePage.handleSearch(this.value)"
                placeholder="搜索知识条目、标签..." 
                class="input-field pl-10">
            </div>
          </div>
          <!-- 分类标签 -->
          <div class="flex flex-wrap gap-2 mt-4">
            <button onclick="KnowledgePage.setCategory('all')" 
              class="px-3 py-1.5 text-sm rounded-full transition-all ${this.currentCategory === 'all' ? 'bg-secondary/20 text-secondary' : 'bg-black/5 dark:bg-white/5 text-text-secondary dark:text-dark-text-secondary hover:bg-black/10 dark:hover:bg-white/10'}">
              全部 (${totalCount})
            </button>
            ${categories.map(cat => `
              <button onclick="KnowledgePage.setCategory('${cat.id}')" 
                class="px-3 py-1.5 text-sm rounded-full transition-all ${this.currentCategory === cat.id ? 'bg-secondary/20 text-secondary' : 'bg-black/5 dark:bg-white/5 text-text-secondary dark:text-dark-text-secondary hover:bg-black/10 dark:hover:bg-white/10'}">
                ${cat.icon} ${cat.name} (${categoryStats[cat.id] || 0})
              </button>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- 左侧：知识卡片列表 -->
          <div class="lg:col-span-3">
            ${filtered.length > 0 ? `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${filtered.map(item => {
                  const cat = categories.find(c => c.id === item.category);
                  return `
                    <div onclick="KnowledgePage.selectItem('${item.id}')" 
                      class="card p-5 cursor-pointer ${this.selectedId === item.id ? 'ring-2 ring-secondary/50' : ''}">
                      <div class="flex items-start justify-between mb-2">
                        <h3 class="font-medium text-base line-clamp-1">${item.title}</h3>
                        ${cat ? `<span class="text-xs text-text-secondary dark:text-dark-text-secondary whitespace-nowrap ml-2">${cat.icon}</span>` : ''}
                      </div>
                      <p class="text-sm text-text-secondary dark:text-dark-text-secondary line-clamp-2 mb-3">
                        ${item.summary || item.content.substring(0, 60)}
                      </p>
                      <div class="flex items-center justify-between">
                        <div class="flex flex-wrap gap-1">
                          ${(item.tags || []).slice(0, 3).map(tag => `
                            <span class="tag text-xs">${tag}</span>
                          `).join('')}
                        </div>
                        <span class="text-xs text-text-secondary dark:text-dark-text-secondary">
                          ${DateUtils.format(item.updatedAt || item.createdAt, 'MM-DD')}
                        </span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : `
              <div class="card p-12 text-center">
                <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <p class="text-text-secondary dark:text-dark-text-secondary">暂无知识条目</p>
              </div>
            `}
          </div>

          <!-- 右侧边栏 -->
          <div class="space-y-4">
            <!-- 分类统计 -->
            <div class="card p-5">
              <h4 class="font-medium text-sm mb-3">分类统计</h4>
              <div class="space-y-2">
                ${categories.map(cat => `
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-text-secondary dark:text-dark-text-secondary">${cat.icon} ${cat.name}</span>
                    <span class="font-medium">${categoryStats[cat.id] || 0}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 标签云 -->
            <div class="card p-5">
              <h4 class="font-medium text-sm mb-3">标签云</h4>
              <div class="flex flex-wrap gap-2">
                ${tagList.length > 0 ? tagList.map(([tag, count]) => `
                  <button onclick="KnowledgePage.searchByTag('${tag}')" 
                    class="tag hover:bg-primary/20 transition-colors cursor-pointer"
                    style="font-size: ${10 + Math.min(count, 5)}px;">
                    ${tag}
                  </button>
                `).join('') : '<p class="text-xs text-text-secondary dark:text-dark-text-secondary">暂无标签</p>'}
              </div>
            </div>

            <!-- 随机复习 -->
            <button onclick="KnowledgePage.randomReview()" class="card p-5 w-full text-left hover:border-secondary/50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-sm">随机复习</p>
                  <p class="text-xs text-text-secondary dark:text-dark-text-secondary">随机抽一条来回顾</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    `;

    // 如果有选中的条目，显示详情
    if (selectedItem) {
      this.showDetailModal(selectedItem);
    }
  },

  // 设置分类
  setCategory(catId) {
    this.currentCategory = catId;
    this.selectedId = null;
    this.render(document.getElementById('page-container'));
  },

  // 搜索处理
  handleSearch(keyword) {
    this.searchKeyword = keyword;
    this.selectedId = null;
    // 防抖
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.render(document.getElementById('page-container'));
    }, 300);
  },

  // 按标签搜索
  searchByTag(tag) {
    this.searchKeyword = tag;
    this.currentCategory = 'all';
    this.selectedId = null;
    this.render(document.getElementById('page-container'));
  },

  // 选中条目
  selectItem(id) {
    this.selectedId = id;
    const knowledge = Storage.get('knowledge', []);
    const item = knowledge.find(k => k.id === id);
    if (item) {
      this.showDetailModal(item);
    }
  },

  // 显示详情弹窗
  showDetailModal(item) {
    const categories = Storage.get('knowledgeCategories', SampleData.knowledgeCategories);
    const cat = categories.find(c => c.id === item.category);
    const renderedContent = Markdown.parse(item.content);

    const content = `
      <div class="max-w-2xl w-full">
        <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-start justify-between">
            <div>
              <h2 class="font-serif text-xl font-medium">${item.title}</h2>
              <div class="flex items-center gap-2 mt-2">
                ${cat ? `<span class="tag">${cat.icon} ${cat.name}</span>` : ''}
                <span class="text-xs text-text-secondary dark:text-dark-text-secondary">
                  ${DateUtils.format(item.updatedAt || item.createdAt, 'YYYY-MM-DD')}
                </span>
              </div>
            </div>
            <button onclick="Modal.close()" class="p-2 -mr-2 -mt-2 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          ${(item.tags && item.tags.length > 0) ? `
            <div class="flex flex-wrap gap-1.5 mt-3">
              ${item.tags.map(tag => `
                <span class="tag tag-gold">${tag}</span>
              `).join('')}
            </div>
          ` : ''}
          ${item.source ? `<p class="text-xs text-text-secondary dark:text-dark-text-secondary mt-2">来源：${item.source}</p>` : ''}
        </div>
        <div class="p-6 max-h-[50vh] overflow-y-auto markdown-preview">
          ${renderedContent}
        </div>
        <div class="p-4 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-end gap-2">
          <button onclick="KnowledgePage.deleteItem('${item.id}')" class="px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            删除
          </button>
          <button onclick="KnowledgePage.editItem('${item.id}')" class="btn-primary">
            编辑
          </button>
        </div>
      </div>
    `;

    Modal.open(content);
  },

  // 新建条目弹窗
  openNewModal() {
    const categories = Storage.get('knowledgeCategories', SampleData.knowledgeCategories);
    
    const content = `
      <div class="p-6 max-w-lg w-full">
        <h3 class="font-serif text-xl font-medium mb-4">新建知识条目</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">标题</label>
            <input type="text" id="k-title" class="input-field" placeholder="知识条目标题">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">分类</label>
              <select id="k-category" class="input-field">
                ${categories.map(cat => `
                  <option value="${cat.id}">${cat.icon} ${cat.name}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">来源</label>
              <input type="text" id="k-source" class="input-field" placeholder="如：书籍/文章">
            </div>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">标签（用逗号分隔）</label>
            <input type="text" id="k-tags" class="input-field" placeholder="标签1, 标签2">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">摘要</label>
            <input type="text" id="k-summary" class="input-field" placeholder="一句话概括">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">内容（支持 Markdown）</label>
            <textarea id="k-content" class="input-field" rows="8" placeholder="# 标题&#10;&#10;正文内容..."></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">
            取消
          </button>
          <button onclick="KnowledgePage.saveNew()" class="btn-primary">
            保存
          </button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  // 保存新条目
  saveNew() {
    const title = document.getElementById('k-title')?.value.trim();
    const category = document.getElementById('k-category')?.value;
    const source = document.getElementById('k-source')?.value.trim();
    const tagsStr = document.getElementById('k-tags')?.value.trim();
    const summary = document.getElementById('k-summary')?.value.trim();
    const content = document.getElementById('k-content')?.value.trim();

    if (!title) {
      Toast.show('请输入标题', 'warning');
      return;
    }

    const tags = tagsStr ? tagsStr.split(/[,，]/).map(t => t.trim()).filter(t => t) : [];
    const now = new Date().toISOString();

    const knowledge = Storage.get('knowledge', []);
    const newItem = {
      id: generateId('k'),
      title,
      category,
      summary: summary || content.substring(0, 80),
      content,
      tags,
      source: source || '',
      createdAt: now,
      updatedAt: now
    };
    knowledge.unshift(newItem);
    Storage.set('knowledge', knowledge);

    Modal.close();
    this.selectedId = newItem.id;
    this.render(document.getElementById('page-container'));
    Toast.show('已保存', 'success');
  },

  // 编辑条目
  editItem(id) {
    const knowledge = Storage.get('knowledge', []);
    const item = knowledge.find(k => k.id === id);
    if (!item) return;

    const categories = Storage.get('knowledgeCategories', SampleData.knowledgeCategories);
    
    const content = `
      <div class="p-6 max-w-lg w-full">
        <h3 class="font-serif text-xl font-medium mb-4">编辑知识条目</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">标题</label>
            <input type="text" id="k-edit-title" class="input-field" value="${item.title}">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">分类</label>
              <select id="k-edit-category" class="input-field">
                ${categories.map(cat => `
                  <option value="${cat.id}" ${item.category === cat.id ? 'selected' : ''}>${cat.icon} ${cat.name}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">来源</label>
              <input type="text" id="k-edit-source" class="input-field" value="${item.source || ''}">
            </div>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">标签（用逗号分隔）</label>
            <input type="text" id="k-edit-tags" class="input-field" value="${(item.tags || []).join(', ')}">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">摘要</label>
            <input type="text" id="k-edit-summary" class="input-field" value="${item.summary || ''}">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">内容（支持 Markdown）</label>
            <textarea id="k-edit-content" class="input-field" rows="10">${item.content}</textarea>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">
            取消
          </button>
          <button onclick="KnowledgePage.saveEdit('${item.id}')" class="btn-primary">
            保存
          </button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  // 保存编辑
  saveEdit(id) {
    const knowledge = Storage.get('knowledge', []);
    const item = knowledge.find(k => k.id === id);
    if (!item) return;

    item.title = document.getElementById('k-edit-title')?.value.trim() || item.title;
    item.category = document.getElementById('k-edit-category')?.value || item.category;
    item.source = document.getElementById('k-edit-source')?.value.trim() || '';
    const tagsStr = document.getElementById('k-edit-tags')?.value.trim();
    item.tags = tagsStr ? tagsStr.split(/[,，]/).map(t => t.trim()).filter(t => t) : [];
    item.summary = document.getElementById('k-edit-summary')?.value.trim() || '';
    item.content = document.getElementById('k-edit-content')?.value.trim() || '';
    item.updatedAt = new Date().toISOString();

    Storage.set('knowledge', knowledge);
    Modal.close();
    this.render(document.getElementById('page-container'));
    // 重新显示详情
    setTimeout(() => this.showDetailModal(item), 300);
    Toast.show('已保存修改', 'success');
  },

  // 删除条目
  deleteItem(id) {
    if (!confirm('确定要删除这条知识吗？')) return;
    
    let knowledge = Storage.get('knowledge', []);
    knowledge = knowledge.filter(k => k.id !== id);
    Storage.set('knowledge', knowledge);

    Modal.close();
    this.selectedId = null;
    this.render(document.getElementById('page-container'));
    Toast.show('已删除', 'success');
  },

  // 随机复习
  randomReview() {
    const knowledge = Storage.get('knowledge', []);
    if (knowledge.length === 0) {
      Toast.show('还没有知识条目', 'info');
      return;
    }
    const randomItem = knowledge[Math.floor(Math.random() * knowledge.length)];
    this.selectedId = randomItem.id;
    this.showDetailModal(randomItem);
  }
};
