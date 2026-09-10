/* ========================================
   时屿 | Time Isle - 观星台 · 思维实验室页面
   ======================================== */

const ThinkingPage = {
  activeTab: 'ideas', // ideas | experiment | debate | question

  render(container) {
    container.innerHTML = `
      <div class="fade-in space-y-6">
        <!-- 页面标题 -->
        <div>
          <h1 class="font-serif text-2xl md:text-3xl font-medium">观星台</h1>
          <p class="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">思维实验室</p>
        </div>

        <!-- Tab 切换 -->
        <div class="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          <button onclick="ThinkingPage.setTab('ideas')" 
            class="tab-btn ${this.activeTab === 'ideas' ? 'active' : ''}">
            💡 脑洞收集
          </button>
          <button onclick="ThinkingPage.setTab('experiment')" 
            class="tab-btn ${this.activeTab === 'experiment' ? 'active' : ''}">
            🧪 思想实验
          </button>
          <button onclick="ThinkingPage.setTab('debate')" 
            class="tab-btn ${this.activeTab === 'debate' ? 'active' : ''}">
            ⚖️ 正反辩论
          </button>
          <button onclick="ThinkingPage.setTab('question')" 
            class="tab-btn ${this.activeTab === 'question' ? 'active' : ''}">
            ❓ 问题孵化
          </button>
        </div>

        <!-- Tab 内容 -->
        <div id="thinking-tab-content">
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
      case 'ideas': return this.renderIdeas();
      case 'experiment': return this.renderExperiment();
      case 'debate': return this.renderDebate();
      case 'question': return this.renderQuestion();
      default: return '';
    }
  },

  // ========== 脑洞收集 ==========
  renderIdeas() {
    const ideas = Storage.get('ideas', []);
    const statusLabels = {
      inspiration: '💡 灵感',
      verifying: '🔍 待验证',
      thinking: '🤔 推演中',
      concluded: '✅ 已结论',
      archived: '📦 归档'
    };
    const statusOrder = ['inspiration', 'verifying', 'thinking', 'concluded', 'archived'];

    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex gap-2 flex-wrap">
            ${statusOrder.map(status => `
              <button class="px-3 py-1.5 text-sm rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                ${statusLabels[status]}
              </button>
            `).join('')}
          </div>
          <button onclick="ThinkingPage.openAddIdeaModal()" class="btn-primary text-sm">+ 新脑洞</button>
        </div>

        ${ideas.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${ideas.map(idea => `
              <div class="card p-5 cursor-pointer hover:border-primary/30" onclick="ThinkingPage.viewIdea('${idea.id}')">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="font-medium line-clamp-1">${idea.title}</h3>
                </div>
                <p class="text-sm text-text-secondary dark:text-dark-text-secondary line-clamp-3 mb-3">
                  ${idea.content}
                </p>
                <div class="flex items-center justify-between">
                  <div class="flex flex-wrap gap-1">
                    ${(idea.tags || []).slice(0, 2).map(tag => `<span class="tag text-xs">${tag}</span>`).join('')}
                  </div>
                  <span class="text-xs">${statusLabels[idea.status] || '灵感'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="card p-12 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            <p class="text-text-secondary dark:text-dark-text-secondary">还没有脑洞，来一个？</p>
          </div>
        `}
      </div>
    `;
  },

  openAddIdeaModal() {
    const content = `
      <div class="p-6">
        <h3 class="font-serif text-xl font-medium mb-4">记录脑洞</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">标题</label>
            <input type="text" id="idea-title" class="input-field" placeholder="一句话概括">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">内容</label>
            <textarea id="idea-content" class="input-field" rows="5" placeholder="详细描述你的想法..."></textarea>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">标签（用逗号分隔）</label>
            <input type="text" id="idea-tags" class="input-field" placeholder="标签1, 标签2">
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">取消</button>
          <button onclick="ThinkingPage.saveIdea()" class="btn-primary">保存</button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  saveIdea() {
    const title = document.getElementById('idea-title')?.value.trim();
    const content = document.getElementById('idea-content')?.value.trim();
    const tagsStr = document.getElementById('idea-tags')?.value.trim();

    if (!title) {
      Toast.show('请输入标题', 'warning');
      return;
    }

    const tags = tagsStr ? tagsStr.split(/[,，]/).map(t => t.trim()).filter(t => t) : [];
    const ideas = Storage.get('ideas', []);
    ideas.unshift({
      id: generateId('idea'),
      title,
      content,
      status: 'inspiration',
      tags,
      createdAt: new Date().toISOString()
    });
    Storage.set('ideas', ideas);

    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('脑洞已记录', 'success');
  },

  viewIdea(id) {
    const ideas = Storage.get('ideas', []);
    const idea = ideas.find(i => i.id === id);
    if (!idea) return;

    const statusLabels = {
      inspiration: '💡 灵感',
      verifying: '🔍 待验证',
      thinking: '🤔 推演中',
      concluded: '✅ 已结论',
      archived: '📦 归档'
    };
    const statusOptions = ['inspiration', 'verifying', 'thinking', 'concluded', 'archived'];

    const content = `
      <div class="p-6 max-w-lg w-full">
        <div class="flex items-start justify-between mb-4">
          <h3 class="font-serif text-xl font-medium">${idea.title}</h3>
          <button onclick="Modal.close()" class="p-2 -mr-2 -mt-2 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="flex items-center gap-2 mb-4">
          <span class="text-sm text-text-secondary dark:text-dark-text-secondary">状态：</span>
          <select onchange="ThinkingPage.updateIdeaStatus('${idea.id}', this.value)" class="input-field text-sm py-1 px-2 w-auto">
            ${statusOptions.map(s => `<option value="${s}" ${idea.status === s ? 'selected' : ''}>${statusLabels[s]}</option>`).join('')}
          </select>
        </div>

        ${idea.tags && idea.tags.length > 0 ? `
          <div class="flex flex-wrap gap-1 mb-4">
            ${idea.tags.map(tag => `<span class="tag tag-gold">${tag}</span>`).join('')}
          </div>
        ` : ''}

        <div class="markdown-preview text-sm leading-relaxed whitespace-pre-wrap">${idea.content}</div>

        <div class="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button onclick="ThinkingPage.linkToKnowledge('${idea.id}')" class="text-sm text-primary hover:underline">
            + 关联到知识库
          </button>
          <button onclick="ThinkingPage.deleteIdea('${idea.id}')" class="text-sm text-red-500 hover:underline">
            删除
          </button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  updateIdeaStatus(id, status) {
    const ideas = Storage.get('ideas', []);
    const idea = ideas.find(i => i.id === id);
    if (idea) {
      idea.status = status;
      Storage.set('ideas', ideas);
      Toast.show('状态已更新', 'success');
    }
  },

  linkToKnowledge(id) {
    Toast.show('已关联到知识库', 'success');
  },

  deleteIdea(id) {
    if (!confirm('确定删除这个脑洞吗？')) return;
    let ideas = Storage.get('ideas', []);
    ideas = ideas.filter(i => i.id !== id);
    Storage.set('ideas', ideas);
    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('已删除', 'success');
  },

  // ========== 思想实验（占位） ==========
  renderExperiment() {
    return `
      <div class="card p-12 text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
        </svg>
        <h3 class="font-serif text-lg font-medium mb-2">思想实验</h3>
        <p class="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">树状分支结构的思想推演工具</p>
        <p class="text-xs text-text-secondary dark:text-dark-text-secondary">此功能正在开发中...</p>
      </div>
    `;
  },

  // ========== 正反辩论（占位） ==========
  renderDebate() {
    return `
      <div class="card p-12 text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
        </svg>
        <h3 class="font-serif text-lg font-medium mb-2">正反辩论</h3>
        <p class="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">左右分栏记录正反论据和最终判断</p>
        <p class="text-xs text-text-secondary dark:text-dark-text-secondary">此功能正在开发中...</p>
      </div>
    `;
  },

  // ========== 问题孵化（占位） ==========
  renderQuestion() {
    return `
      <div class="card p-12 text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="font-serif text-lg font-medium mb-2">问题孵化</h3>
        <p class="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">存放长期问题，定期复想</p>
        <p class="text-xs text-text-secondary dark:text-dark-text-secondary">此功能正在开发中...</p>
      </div>
    `;
  }
};
