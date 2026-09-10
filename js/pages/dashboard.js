/* ========================================
   时屿 | Time Isle - 屿中 · 仪表盘页面
   ======================================== */

const DashboardPage = {
  // 渲染页面
  render(container) {
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    const weatherTexts = Storage.get('weatherTexts', SampleData.weatherTexts);
    const weather = weatherTexts[Math.floor(Math.random() * weatherTexts.length)];
    const coldFacts = Storage.get('coldFacts', SampleData.coldFacts);
    const coldFact = coldFacts[Math.floor(Math.random() * coldFacts.length)];

    // 获取统计数据
    const todos = Storage.get('todos', []);
    const todoCount = todos.filter(t => t.status !== 'completed').length;
    const diaries = Storage.get('diaries', []);
    const diaryStreak = this.calculateStreak(diaries);
    const knowledge = Storage.get('knowledge', []);
    const knowledgeCount = knowledge.length;
    const ideas = Storage.get('ideas', []);
    const ideaCount = ideas.length;

    // 获取今日待办
    const todayStr = DateUtils.today();
    const todayTodos = todos.filter(t => t.status !== 'completed').slice(0, 5);

    // 获取最近记录
    const recentActivities = this.getRecentActivities();

    container.innerHTML = `
      <div class="fade-in space-y-6">
        <!-- 顶部问候区 -->
        <div class="card p-6 md:p-8">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 class="font-serif text-2xl md:text-3xl font-medium mb-2">
                时淮序，今天是 ${dateStr}。
              </h1>
              <p class="text-secondary font-medium">${weather}</p>
            </div>
          </div>
          <div class="divider my-4"></div>
          <p class="text-sm text-text-secondary dark:text-dark-text-secondary">
            <span class="tag tag-gold mr-2">今日冷知识</span>
            ${coldFact}
          </p>
        </div>

        <!-- 数据卡片行 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 stats-grid">
          <div class="card p-5">
            <div class="text-3xl font-serif font-semibold text-primary mb-1">${todoCount}</div>
            <div class="text-sm text-text-secondary dark:text-dark-text-secondary">待办任务</div>
          </div>
          <div class="card p-5">
            <div class="text-3xl font-serif font-semibold text-secondary mb-1">${diaryStreak}</div>
            <div class="text-sm text-text-secondary dark:text-dark-text-secondary">连续日记天数</div>
          </div>
          <div class="card p-5">
            <div class="text-3xl font-serif font-semibold text-primary mb-1">${knowledgeCount}</div>
            <div class="text-sm text-text-secondary dark:text-dark-text-secondary">知识库条目</div>
          </div>
          <div class="card p-5">
            <div class="text-3xl font-serif font-semibold text-secondary mb-1">${ideaCount}</div>
            <div class="text-sm text-text-secondary dark:text-dark-text-secondary">脑洞数量</div>
          </div>
        </div>

        <!-- 中部：今日待办 + 最近记录 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 今日待办 -->
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-serif text-lg font-medium">今日待办</h3>
              <button onclick="DashboardPage.openAddTodoModal()" class="text-sm text-primary hover:underline">
                + 新增
              </button>
            </div>
            <div class="space-y-3">
              ${todayTodos.length > 0 ? todayTodos.map(todo => `
                <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <input type="checkbox" 
                    ${todo.status === 'completed' ? 'checked' : ''} 
                    onchange="DashboardPage.toggleTodo('${todo.id}')"
                    class="custom-checkbox mt-0.5">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm ${todo.status === 'completed' ? 'line-through text-text-secondary dark:text-dark-text-secondary' : ''}">
                      ${todo.title}
                    </p>
                    ${todo.description ? `<p class="text-xs text-text-secondary dark:text-dark-text-secondary mt-1 truncate">${todo.description}</p>` : ''}
                    ${todo.dueDate ? `<span class="text-xs text-secondary mt-1 inline-block">截止：${todo.dueDate}</span>` : ''}
                  </div>
                </div>
              `).join('') : `
                <div class="empty-state py-8">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <p>今天没有待办任务</p>
                </div>
              `}
            </div>
          </div>

          <!-- 最近记录时间线 -->
          <div class="card p-6">
            <h3 class="font-serif text-lg font-medium mb-4">最近记录</h3>
            <div class="space-y-1">
              ${recentActivities.map(item => `
                <div class="timeline-item">
                  <div class="flex items-start gap-2">
                    <span class="tag tag-gold text-xs whitespace-nowrap">${item.typeName}</span>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate">${item.title}</p>
                      <p class="text-xs text-text-secondary dark:text-dark-text-secondary mt-0.5">
                        ${DateUtils.timeAgo(item.time)}
                      </p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 底部：快捷入口 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onclick="App.navigateTo('diary')" class="card p-5 text-left hover:border-primary/30 group">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <p class="font-medium">写日记</p>
            <p class="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">记录今天的心情</p>
          </button>

          <button onclick="App.navigateTo('daily')" class="card p-5 text-left hover:border-primary/30 group">
            <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors">
              <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="font-medium">记一笔账</p>
            <p class="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">记录收支明细</p>
          </button>

          <button onclick="App.navigateTo('thinking')" class="card p-5 text-left hover:border-primary/30 group">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <p class="font-medium">记脑洞</p>
            <p class="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">捕捉灵感瞬间</p>
          </button>

          <button onclick="DashboardPage.openQuickNote()" class="card p-5 text-left hover:border-primary/30 group">
            <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors">
              <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
              </svg>
            </div>
            <p class="font-medium">开便签</p>
            <p class="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">随手记下想法</p>
          </button>
        </div>
      </div>
    `;
  },

  // 计算连续日记天数
  calculateStreak(diaries) {
    if (!diaries || diaries.length === 0) return 0;
    
    const dates = diaries.map(d => d.date).sort().reverse();
    const today = DateUtils.today();
    const yesterday = DateUtils.format(new Date(Date.now() - 86400000), 'YYYY-MM-DD');
    
    // 检查今天或昨天是否有日记
    if (dates[0] !== today && dates[0] !== yesterday) return 0;
    
    let streak = 1;
    let currentDate = new Date(dates[0]);
    
    for (let i = 1; i < dates.length; i++) {
      currentDate.setDate(currentDate.getDate() - 1);
      const expectedDate = DateUtils.format(currentDate, 'YYYY-MM-DD');
      if (dates[i] === expectedDate) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  },

  // 获取最近活动
  getRecentActivities() {
    const activities = [];
    
    // 日记
    const diaries = Storage.get('diaries', []);
    diaries.forEach(d => {
      activities.push({
        type: 'diary',
        typeName: '日记',
        title: DateUtils.formatChinese(d.date),
        time: d.createdAt || d.date,
        date: d.date
      });
    });
    
    // 知识库
    const knowledge = Storage.get('knowledge', []);
    knowledge.forEach(k => {
      activities.push({
        type: 'knowledge',
        typeName: '知识',
        title: k.title,
        time: k.updatedAt || k.createdAt
      });
    });
    
    // 记账
    const transactions = Storage.get('transactions', []);
    transactions.forEach(t => {
      activities.push({
        type: 'transaction',
        typeName: '记账',
        title: `${t.type === 'income' ? '收入' : '支出'} ¥${t.amount} · ${t.category}`,
        time: t.date
      });
    });
    
    // 按时间排序，取最近8条
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    return activities.slice(0, 8);
  },

  // 切换待办状态
  toggleTodo(id) {
    const todos = Storage.get('todos', []);
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.status = todo.status === 'completed' ? 'todo' : 'completed';
      if (todo.status === 'completed') {
        todo.completedAt = new Date().toISOString();
      } else {
        delete todo.completedAt;
      }
      Storage.set('todos', todos);
      this.render(document.getElementById('page-container'));
      Toast.show(todo.status === 'completed' ? '任务已完成' : '已恢复任务', 'success');
    }
  },

  // 打开新增待办弹窗
  openAddTodoModal() {
    const content = `
      <div class="p-6">
        <h3 class="font-serif text-xl font-medium mb-4">新增待办</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">任务标题</label>
            <input type="text" id="new-todo-title" class="input-field" placeholder="要做什么？">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">描述（可选）</label>
            <textarea id="new-todo-desc" class="input-field" rows="2" placeholder="补充说明..."></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">优先级</label>
              <select id="new-todo-priority" class="input-field">
                <option value="low">低</option>
                <option value="medium" selected>中</option>
                <option value="high">高</option>
              </select>
            </div>
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">截止日期</label>
              <input type="date" id="new-todo-duedate" class="input-field">
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">
            取消
          </button>
          <button onclick="DashboardPage.addTodo()" class="btn-primary">
            添加
          </button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  // 添加待办
  addTodo() {
    const title = document.getElementById('new-todo-title')?.value.trim();
    const desc = document.getElementById('new-todo-desc')?.value.trim();
    const priority = document.getElementById('new-todo-priority')?.value;
    const dueDate = document.getElementById('new-todo-duedate')?.value;

    if (!title) {
      Toast.show('请输入任务标题', 'warning');
      return;
    }

    const todos = Storage.get('todos', []);
    const newTodo = {
      id: generateId('todo'),
      title,
      description: desc || '',
      status: 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    };
    todos.unshift(newTodo);
    Storage.set('todos', todos);

    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('待办已添加', 'success');
  },

  // 打开快捷便签
  openQuickNote() {
    const content = `
      <div class="p-6">
        <h3 class="font-serif text-xl font-medium mb-4">快速便签</h3>
        <textarea id="quick-note-content" class="input-field" rows="6" placeholder="随手记下点什么..."></textarea>
        <div class="flex justify-between items-center mt-4">
          <div class="flex gap-2">
            <button onclick="DashboardPage.quickNoteTo('diary')" class="text-xs px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              归入日记
            </button>
            <button onclick="DashboardPage.quickNoteTo('knowledge')" class="text-xs px-3 py-1.5 rounded-md bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
              归入知识库
            </button>
            <button onclick="DashboardPage.quickNoteTo('idea')" class="text-xs px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              归入脑洞
            </button>
            <button onclick="DashboardPage.quickNoteTo('todo')" class="text-xs px-3 py-1.5 rounded-md bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
              归入待办
            </button>
          </div>
          <button onclick="Modal.close()" class="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">
            关闭
          </button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  // 快速便签归类
  quickNoteTo(type) {
    const content = document.getElementById('quick-note-content')?.value.trim();
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
            content: content,
            mood: '',
            weather: '',
            tags: [],
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
          content: content,
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
          content: content,
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

    Modal.close();
    this.render(document.getElementById('page-container'));
  }
};
