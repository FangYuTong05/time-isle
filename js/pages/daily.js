/* ========================================
   时屿 | Time Isle - 日课湾 · 日常中心页面
   ======================================== */

const DailyPage = {
  activeTab: 'accounting', // accounting | todo
  todoView: 'kanban', // kanban | calendar

  render(container) {
    container.innerHTML = `
      <div class="fade-in space-y-6">
        <!-- 页面标题 -->
        <div>
          <h1 class="font-serif text-2xl md:text-3xl font-medium">日课湾</h1>
          <p class="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">日常管理中心</p>
        </div>

        <!-- Tab 切换 -->
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button onclick="DailyPage.setTab('accounting')" 
            class="tab-btn ${this.activeTab === 'accounting' ? 'active' : ''}">
            💰 记账本
          </button>
          <button onclick="DailyPage.setTab('todo')" 
            class="tab-btn ${this.activeTab === 'todo' ? 'active' : ''}">
            ✅ 任务/待办
          </button>
        </div>

        <!-- Tab 内容 -->
        <div id="daily-tab-content">
          ${this.activeTab === 'accounting' ? this.renderAccounting() : this.renderTodo()}
        </div>
      </div>
    `;
  },

  // 切换 Tab
  setTab(tab) {
    this.activeTab = tab;
    this.render(document.getElementById('page-container'));
  },

  // ========== 记账本 ==========
  renderAccounting() {
    const transactions = Storage.get('transactions', []);
    const categories = Storage.get('transactionCategories', SampleData.transactionCategories);
    
    // 本月统计
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthTransactions = transactions.filter(t => t.date.startsWith(thisMonth));
    
    const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    // 按日期分组
    const grouped = {};
    [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(t => {
      if (!grouped[t.date]) grouped[t.date] = [];
      grouped[t.date].push(t);
    });

    // 支出分类统计
    const expenseByCategory = {};
    monthTransactions.filter(t => t.type === 'expense').forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });
    const categoryEntries = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
    const totalExpense = categoryEntries.reduce((sum, [_, v]) => sum + v, 0);

    return `
      <div class="space-y-6">
        <!-- 本月总览卡片 -->
        <div class="grid grid-cols-3 gap-4">
          <div class="card p-5">
            <p class="text-sm text-text-secondary dark:text-dark-text-secondary mb-1">本月收入</p>
            <p class="text-2xl font-serif font-semibold text-green-600">+¥${income.toFixed(2)}</p>
          </div>
          <div class="card p-5">
            <p class="text-sm text-text-secondary dark:text-dark-text-secondary mb-1">本月支出</p>
            <p class="text-2xl font-serif font-semibold text-red-500">-¥${expense.toFixed(2)}</p>
          </div>
          <div class="card p-5">
            <p class="text-sm text-text-secondary dark:text-dark-text-secondary mb-1">本月结余</p>
            <p class="text-2xl font-serif font-semibold ${balance >= 0 ? 'text-primary' : 'text-red-500'}">¥${balance.toFixed(2)}</p>
          </div>
        </div>

        <!-- 操作栏 -->
        <div class="flex items-center justify-between">
          <h3 class="font-serif text-lg font-medium">账单明细</h3>
          <button onclick="DailyPage.openAddTransactionModal()" class="btn-primary text-sm">
            + 记一笔
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 账单列表 -->
          <div class="lg:col-span-2 space-y-4">
            ${Object.keys(grouped).length > 0 ? Object.entries(grouped).map(([date, items]) => `
              <div class="card p-4">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-sm font-medium">${DateUtils.formatChinese(date)}</p>
                  <p class="text-xs text-text-secondary dark:text-dark-text-secondary">
                    ${items.filter(t => t.type === 'income').length} 笔收入 / ${items.filter(t => t.type === 'expense').length} 笔支出
                  </p>
                </div>
                <div class="space-y-2">
                  ${items.map(t => `
                    <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400'} flex items-center justify-center text-sm">
                          ${t.type === 'income' ? '↑' : '↓'}
                        </div>
                        <div>
                          <p class="text-sm font-medium">${t.category}</p>
                          ${t.note ? `<p class="text-xs text-text-secondary dark:text-dark-text-secondary">${t.note}</p>` : ''}
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-sm font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}">
                          ${t.type === 'income' ? '+' : '-'}¥${t.amount.toFixed(2)}
                        </p>
                        <button onclick="DailyPage.deleteTransaction('${t.id}')" class="text-xs text-text-secondary dark:text-dark-text-secondary hover:text-red-500 mt-1">
                          删除
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('') : `
              <div class="card p-12 text-center">
                <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-text-secondary dark:text-dark-text-secondary">还没有记账记录</p>
              </div>
            `}
          </div>

          <!-- 分类统计 -->
          <div class="space-y-4">
            <div class="card p-5">
              <h4 class="font-medium text-sm mb-4">支出分类</h4>
              ${categoryEntries.length > 0 ? `
                <div class="space-y-3">
                  ${categoryEntries.map(([cat, amount]) => {
                    const percent = totalExpense > 0 ? (amount / totalExpense * 100).toFixed(1) : 0;
                    return `
                      <div>
                        <div class="flex items-center justify-between text-sm mb-1">
                          <span>${cat}</span>
                          <span class="text-text-secondary dark:text-dark-text-secondary">¥${amount.toFixed(2)} · ${percent}%</span>
                        </div>
                        <div class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div class="h-full bg-primary rounded-full" style="width: ${percent}%"></div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : `
                <p class="text-sm text-text-secondary dark:text-dark-text-secondary">本月暂无支出</p>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 打开新增记账弹窗
  openAddTransactionModal() {
    const categories = Storage.get('transactionCategories', SampleData.transactionCategories);
    
    const content = `
      <div class="p-6">
        <h3 class="font-serif text-xl font-medium mb-4">记一笔</h3>
        <div class="space-y-4">
          <div class="flex gap-2">
            <button onclick="DailyPage.setTxType('expense')" id="tx-type-expense" class="flex-1 py-2 rounded-lg text-sm font-medium transition-all bg-red-50 text-red-500 dark:bg-red-900/20 border-2 border-red-500">
              支出
            </button>
            <button onclick="DailyPage.setTxType('income')" id="tx-type-income" class="flex-1 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-dark-text-secondary border-2 border-transparent">
              收入
            </button>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">金额</label>
            <input type="number" id="tx-amount" class="input-field text-lg font-medium" placeholder="0.00" step="0.01">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">分类</label>
            <select id="tx-category" class="input-field">
              ${categories.expense.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">日期</label>
            <input type="date" id="tx-date" class="input-field" value="${DateUtils.today()}">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">备注</label>
            <input type="text" id="tx-note" class="input-field" placeholder="补充说明...">
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">
            取消
          </button>
          <button onclick="DailyPage.saveTransaction()" class="btn-primary">
            保存
          </button>
        </div>
      </div>
    `;
    Modal.open(content, { onOpen: () => { this.currentTxType = 'expense'; } });
  },

  // 切换收支类型
  setTxType(type) {
    this.currentTxType = type;
    const categories = Storage.get('transactionCategories', SampleData.transactionCategories);
    const expenseBtn = document.getElementById('tx-type-expense');
    const incomeBtn = document.getElementById('tx-type-income');
    const categorySelect = document.getElementById('tx-category');

    if (type === 'expense') {
      expenseBtn.className = 'flex-1 py-2 rounded-lg text-sm font-medium transition-all bg-red-50 text-red-500 dark:bg-red-900/20 border-2 border-red-500';
      incomeBtn.className = 'flex-1 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-dark-text-secondary border-2 border-transparent';
      categorySelect.innerHTML = categories.expense.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    } else {
      incomeBtn.className = 'flex-1 py-2 rounded-lg text-sm font-medium transition-all bg-green-50 text-green-600 dark:bg-green-900/20 border-2 border-green-500';
      expenseBtn.className = 'flex-1 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-dark-text-secondary border-2 border-transparent';
      categorySelect.innerHTML = categories.income.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    }
  },

  // 保存记账
  saveTransaction() {
    const amount = parseFloat(document.getElementById('tx-amount')?.value);
    const category = document.getElementById('tx-category')?.value;
    const date = document.getElementById('tx-date')?.value;
    const note = document.getElementById('tx-note')?.value.trim();

    if (!amount || amount <= 0) {
      Toast.show('请输入有效金额', 'warning');
      return;
    }

    const transactions = Storage.get('transactions', []);
    const newTx = {
      id: generateId('tx'),
      type: this.currentTxType || 'expense',
      amount,
      category,
      date: date || DateUtils.today(),
      note
    };
    transactions.unshift(newTx);
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    Storage.set('transactions', transactions);

    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('已保存', 'success');
  },

  // 删除记账
  deleteTransaction(id) {
    if (!confirm('确定删除这条记录吗？')) return;
    let transactions = Storage.get('transactions', []);
    transactions = transactions.filter(t => t.id !== id);
    Storage.set('transactions', transactions);
    this.render(document.getElementById('page-container'));
    Toast.show('已删除', 'success');
  },

  // ========== 待办任务 ==========
  renderTodo() {
    const todos = Storage.get('todos', []);
    
    const todoItems = todos.filter(t => t.status === 'todo');
    const inProgressItems = todos.filter(t => t.status === 'in_progress');
    const completedItems = todos.filter(t => t.status === 'completed');

    if (this.todoView === 'calendar') {
      return this.renderTodoCalendar();
    }

    return `
      <div class="space-y-4">
        <!-- 操作栏 -->
        <div class="flex items-center justify-between">
          <div class="flex gap-2">
            <button onclick="DailyPage.setTodoView('kanban')" class="px-3 py-1.5 text-sm rounded-lg ${this.todoView === 'kanban' ? 'bg-primary/10 text-primary' : 'text-text-secondary dark:text-dark-text-secondary hover:bg-black/5 dark:hover:bg-white/5'}">
              看板视图
            </button>
            <button onclick="DailyPage.setTodoView('calendar')" class="px-3 py-1.5 text-sm rounded-lg ${this.todoView === 'calendar' ? 'bg-primary/10 text-primary' : 'text-text-secondary dark:text-dark-text-secondary hover:bg-black/5 dark:hover:bg-white/5'}">
              日历视图
            </button>
          </div>
          <button onclick="DailyPage.openAddTodoModal()" class="btn-primary text-sm">
            + 新增任务
          </button>
        </div>

        <!-- 看板三列 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 待办 -->
          <div class="kanban-column">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-sm">待办 <span class="text-text-secondary dark:text-dark-text-secondary">(${todoItems.length})</span></h4>
            </div>
            <div class="space-y-2">
              ${todoItems.length > 0 ? todoItems.map(todo => this.renderTodoCard(todo)).join('') : `
                <div class="text-center py-8 text-xs text-text-secondary dark:text-dark-text-secondary">暂无任务</div>
              `}
            </div>
          </div>

          <!-- 进行中 -->
          <div class="kanban-column">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-sm">进行中 <span class="text-text-secondary dark:text-dark-text-secondary">(${inProgressItems.length})</span></h4>
            </div>
            <div class="space-y-2">
              ${inProgressItems.length > 0 ? inProgressItems.map(todo => this.renderTodoCard(todo)).join('') : `
                <div class="text-center py-8 text-xs text-text-secondary dark:text-dark-text-secondary">暂无任务</div>
              `}
            </div>
          </div>

          <!-- 已完成 -->
          <div class="kanban-column">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-sm">已完成 <span class="text-text-secondary dark:text-dark-text-secondary">(${completedItems.length})</span></h4>
            </div>
            <div class="space-y-2">
              ${completedItems.length > 0 ? completedItems.map(todo => this.renderTodoCard(todo)).join('') : `
                <div class="text-center py-8 text-xs text-text-secondary dark:text-dark-text-secondary">暂无任务</div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 渲染待办卡片
  renderTodoCard(todo) {
    const priorityColors = {
      high: 'border-l-red-500',
      medium: 'border-l-secondary',
      low: 'border-l-gray-400'
    };
    const priorityLabels = { high: '高', medium: '中', low: '低' };

    return `
      <div class="bg-bg dark:bg-bg-dark rounded-lg p-3 border-l-4 ${priorityColors[todo.priority] || priorityColors.medium} shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onclick="DailyPage.editTodo('${todo.id}')">
        <div class="flex items-start gap-2">
          <input type="checkbox" ${todo.status === 'completed' ? 'checked' : ''} 
            onclick="event.stopPropagation(); DailyPage.toggleTodoStatus('${todo.id}')"
            class="custom-checkbox mt-0.5">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium ${todo.status === 'completed' ? 'line-through text-text-secondary dark:text-dark-text-secondary' : ''}">
              ${todo.title}
            </p>
            ${todo.description ? `<p class="text-xs text-text-secondary dark:text-dark-text-secondary mt-1 line-clamp-2">${todo.description}</p>` : ''}
            <div class="flex items-center gap-2 mt-2">
              <span class="text-xs text-text-secondary dark:text-dark-text-secondary">优先级: ${priorityLabels[todo.priority] || '中'}</span>
              ${todo.dueDate ? `<span class="text-xs text-secondary">${todo.dueDate}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="flex gap-1 mt-2">
          ${todo.status !== 'completed' ? `
            <button onclick="event.stopPropagation(); DailyPage.moveTodo('${todo.id}', 'todo')" class="text-xs px-2 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5">待办</button>
            <button onclick="event.stopPropagation(); DailyPage.moveTodo('${todo.id}', 'in_progress')" class="text-xs px-2 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5">进行中</button>
          ` : ''}
          <button onclick="event.stopPropagation(); DailyPage.deleteTodo('${todo.id}')" class="text-xs px-2 py-0.5 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 ml-auto">删除</button>
        </div>
      </div>
    `;
  },

  // 切换待办视图
  setTodoView(view) {
    this.todoView = view;
    this.render(document.getElementById('page-container'));
  },

  // 渲染日历视图
  renderTodoCalendar() {
    const todos = Storage.get('todos', []);
    const now = new Date();
    if (!this.todoCalendarMonth) this.todoCalendarMonth = new Date();
    const year = this.todoCalendarMonth.getFullYear();
    const month = this.todoCalendarMonth.getMonth();
    const days = DateUtils.getCalendarDays(year, month);

    // 按日期分组
    const todosByDate = {};
    todos.forEach(t => {
      if (t.dueDate) {
        if (!todosByDate[t.dueDate]) todosByDate[t.dueDate] = [];
        todosByDate[t.dueDate].push(t);
      }
    });

    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

    return `
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <button onclick="DailyPage.prevTodoMonth()" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h3 class="font-serif text-lg font-medium">${year}年 ${monthNames[month]}</h3>
          <button onclick="DailyPage.nextTodoMonth()" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-7 gap-1 mb-2">
          ${['日', '一', '二', '三', '四', '五', '六'].map(d => `
            <div class="text-center text-xs text-text-secondary dark:text-dark-text-secondary py-1">${d}</div>
          `).join('')}
        </div>
        
        <div class="calendar-grid">
          ${days.map(day => {
            const dayTodos = todosByDate[day.date] || [];
            const hasTodo = dayTodos.length > 0;
            const isToday = day.date === DateUtils.today();
            return `
              <div class="calendar-day ${day.currentMonth ? '' : 'opacity-30'} ${isToday ? 'today' : ''} ${hasTodo ? 'has-entry' : ''} relative">
                ${day.day}
                ${hasTodo ? `<span class="absolute bottom-1 right-1 text-xs bg-secondary/20 text-secondary rounded px-1">${dayTodos.length}</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  prevTodoMonth() {
    if (!this.todoCalendarMonth) this.todoCalendarMonth = new Date();
    this.todoCalendarMonth.setMonth(this.todoCalendarMonth.getMonth() - 1);
    this.render(document.getElementById('page-container'));
  },

  nextTodoMonth() {
    if (!this.todoCalendarMonth) this.todoCalendarMonth = new Date();
    this.todoCalendarMonth.setMonth(this.todoCalendarMonth.getMonth() + 1);
    this.render(document.getElementById('page-container'));
  },

  // 切换待办状态
  toggleTodoStatus(id) {
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
    }
  },

  // 移动待办
  moveTodo(id, status) {
    const todos = Storage.get('todos', []);
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.status = status;
      if (status === 'completed') {
        todo.completedAt = new Date().toISOString();
      } else {
        delete todo.completedAt;
      }
      Storage.set('todos', todos);
      this.render(document.getElementById('page-container'));
    }
  },

  // 新增待办弹窗
  openAddTodoModal() {
    const content = `
      <div class="p-6">
        <h3 class="font-serif text-xl font-medium mb-4">新增任务</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">任务标题</label>
            <input type="text" id="new-todo-title" class="input-field" placeholder="要做什么？">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">描述</label>
            <textarea id="new-todo-desc" class="input-field" rows="2" placeholder="详细描述..."></textarea>
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
          <button onclick="DailyPage.addTodo()" class="btn-primary">
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
    todos.unshift({
      id: generateId('todo'),
      title,
      description: desc || '',
      status: 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    });
    Storage.set('todos', todos);

    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('任务已添加', 'success');
  },

  // 编辑待办
  editTodo(id) {
    const todos = Storage.get('todos', []);
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const content = `
      <div class="p-6">
        <h3 class="font-serif text-xl font-medium mb-4">编辑任务</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">任务标题</label>
            <input type="text" id="edit-todo-title" class="input-field" value="${todo.title}">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">描述</label>
            <textarea id="edit-todo-desc" class="input-field" rows="2">${todo.description || ''}</textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">优先级</label>
              <select id="edit-todo-priority" class="input-field">
                <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>低</option>
                <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>中</option>
                <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>高</option>
              </select>
            </div>
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">截止日期</label>
              <input type="date" id="edit-todo-duedate" class="input-field" value="${todo.dueDate || ''}">
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">
            取消
          </button>
          <button onclick="DailyPage.saveTodoEdit('${todo.id}')" class="btn-primary">
            保存
          </button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  // 保存编辑
  saveTodoEdit(id) {
    const todos = Storage.get('todos', []);
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    todo.title = document.getElementById('edit-todo-title')?.value.trim() || todo.title;
    todo.description = document.getElementById('edit-todo-desc')?.value.trim() || '';
    todo.priority = document.getElementById('edit-todo-priority')?.value || 'medium';
    todo.dueDate = document.getElementById('edit-todo-duedate')?.value || null;

    Storage.set('todos', todos);
    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('已保存修改', 'success');
  },

  // 删除待办
  deleteTodo(id) {
    if (!confirm('确定删除这个任务吗？')) return;
    let todos = Storage.get('todos', []);
    todos = todos.filter(t => t.id !== id);
    Storage.set('todos', todos);
    this.render(document.getElementById('page-container'));
    Toast.show('已删除', 'success');
  }
};
