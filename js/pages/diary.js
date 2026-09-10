/* ========================================
   时屿 | Time Isle - 光阴簿 · 潮汐日志页面
   ======================================== */

const DiaryPage = {
  currentMonth: new Date(),
  selectedDate: DateUtils.today(),
  isEditing: false,
  viewMode: 'calendar', // calendar | timeline

  render(container) {
    const diaries = Storage.get('diaries', []);
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const calendarDays = DateUtils.getCalendarDays(year, month);
    
    // 标记有日记的日期
    const diaryDates = new Set(diaries.map(d => d.date));
    
    // 获取选中日期的日记
    const selectedDiary = diaries.find(d => d.date === this.selectedDate);
    
    // 一年前的今天
    const oneYearAgo = `${year - 1}-${String(month + 1).padStart(2, '0')}-${String(this.currentMonth.getDate()).padStart(2, '0')}`;
    const oneYearAgoDiary = diaries.find(d => d.date === oneYearAgo);

    // 当日关联的待办
    const todos = Storage.get('todos', []);
    const dayTodos = todos.filter(t => t.dueDate === this.selectedDate);

    // 当日关联的记账
    const transactions = Storage.get('transactions', []);
    const dayTransactions = transactions.filter(t => t.date === this.selectedDate);

    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

    container.innerHTML = `
      <div class="fade-in space-y-6">
        <!-- 页面标题 -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="font-serif text-2xl md:text-3xl font-medium">光阴簿</h1>
            <p class="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">共 ${diaries.length} 篇日记</p>
          </div>
          <div class="flex gap-2">
            <button onclick="DiaryPage.toggleView()" class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              ${this.viewMode === 'calendar' ? '时间线视图' : '日历视图'}
            </button>
            <button onclick="DiaryPage.newDiary()" class="btn-primary inline-flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              写日记
            </button>
          </div>
        </div>

        ${this.viewMode === 'calendar' ? `
        <!-- 日历 + 编辑区 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左侧：日历 -->
          <div class="card p-5">
            <div class="flex items-center justify-between mb-4">
              <button onclick="DiaryPage.prevMonth()" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <h3 class="font-serif text-lg font-medium">${year}年 ${monthNames[month]}</h3>
              <button onclick="DiaryPage.nextMonth()" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            <!-- 星期标题 -->
            <div class="grid grid-cols-7 gap-1 mb-2">
              ${['日', '一', '二', '三', '四', '五', '六'].map(d => `
                <div class="text-center text-xs text-text-secondary dark:text-dark-text-secondary py-1">${d}</div>
              `).join('')}
            </div>
            
            <!-- 日历格子 -->
            <div class="calendar-grid">
              ${calendarDays.map(day => {
                const hasEntry = diaryDates.has(day.date);
                const isToday = day.date === DateUtils.today();
                const isSelected = day.date === this.selectedDate;
                return `
                  <div onclick="DiaryPage.selectDate('${day.date}')" 
                    class="calendar-day ${day.currentMonth ? '' : 'opacity-30'} ${hasEntry ? 'has-entry' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}">
                    ${day.day}
                  </div>
                `;
              }).join('')}
            </div>

            <div class="divider my-4"></div>

            <!-- 一年前的今天 -->
            <div class="text-sm">
              <h4 class="font-medium mb-2 text-secondary">一年前的今天</h4>
              ${oneYearAgoDiary ? `
                <div class="p-3 bg-secondary/5 rounded-lg cursor-pointer hover:bg-secondary/10 transition-colors" onclick="DiaryPage.selectDate('${oneYearAgo}')">
                  <p class="text-xs text-text-secondary dark:text-dark-text-secondary line-clamp-3">
                    ${oneYearAgoDiary.content.replace(/[#*`>\-]/g, '').substring(0, 80)}...
                  </p>
                </div>
              ` : `
                <p class="text-xs text-text-secondary dark:text-dark-text-secondary italic">去年的今天没有写日记</p>
              `}
            </div>
          </div>

          <!-- 右侧：日记编辑/展示区 -->
          <div class="lg:col-span-2">
            <div class="card p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h2 class="font-serif text-xl font-medium">${DateUtils.formatChinese(this.selectedDate)}</h2>
                  ${selectedDiary ? `
                    <div class="flex items-center gap-2 mt-2">
                      ${selectedDiary.weather ? `<span class="tag">${selectedDiary.weather}</span>` : ''}
                      ${selectedDiary.mood ? `<span class="tag tag-gold">${selectedDiary.mood}</span>` : ''}
                    </div>
                  ` : ''}
                </div>
                ${selectedDiary ? `
                  <button onclick="DiaryPage.editDiary()" class="text-sm text-primary hover:underline">
                    编辑
                  </button>
                ` : ''}
              </div>

              ${selectedDiary ? `
                <div class="markdown-preview" id="diary-display">
                  ${Markdown.parse(selectedDiary.content)}
                </div>
                ${selectedDiary.tags && selectedDiary.tags.length > 0 ? `
                  <div class="divider my-4"></div>
                  <div class="flex flex-wrap gap-1.5">
                    ${selectedDiary.tags.map(tag => `<span class="tag tag-gold">${tag}</span>`).join('')}
                  </div>
                ` : ''}
              ` : `
                <div class="text-center py-16">
                  <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  <p class="text-text-secondary dark:text-dark-text-secondary mb-4">今天还没有写日记</p>
                  <button onclick="DiaryPage.newDiary()" class="btn-primary">
                    开始写
                  </button>
                </div>
              `}
            </div>

            <!-- 当日关联 -->
            ${selectedDiary ? `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <!-- 关联待办 -->
                <div class="card p-4">
                  <h4 class="font-medium text-sm mb-3">当日待办 (${dayTodos.length})</h4>
                  ${dayTodos.length > 0 ? `
                    <div class="space-y-2">
                      ${dayTodos.map(todo => `
                        <div class="flex items-center gap-2 text-sm">
                          <input type="checkbox" ${todo.status === 'completed' ? 'checked' : ''} class="custom-checkbox" disabled>
                          <span class="${todo.status === 'completed' ? 'line-through text-text-secondary dark:text-dark-text-secondary' : ''}">${todo.title}</span>
                        </div>
                      `).join('')}
                    </div>
                  ` : `<p class="text-xs text-text-secondary dark:text-dark-text-secondary">今天没有待办</p>`}
                </div>

                <!-- 关联记账 -->
                <div class="card p-4">
                  <h4 class="font-medium text-sm mb-3">当日账单 (${dayTransactions.length})</h4>
                  ${dayTransactions.length > 0 ? `
                    <div class="space-y-2">
                      ${dayTransactions.map(tx => `
                        <div class="flex items-center justify-between text-sm">
                          <span>${tx.category}</span>
                          <span class="${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}">
                            ${tx.type === 'income' ? '+' : '-'}¥${tx.amount}
                          </span>
                        </div>
                      `).join('')}
                    </div>
                  ` : `<p class="text-xs text-text-secondary dark:text-dark-text-secondary">今天没有记账</p>`}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
        ` : `
        <!-- 时间线视图 -->
        <div class="card p-6">
          ${diaries.length > 0 ? `
            <div class="space-y-6">
              ${diaries.sort((a, b) => new Date(b.date) - new Date(a.date)).map(diary => `
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-20 text-right">
                    <p class="font-serif text-lg font-medium">${new Date(diary.date).getDate()}</p>
                    <p class="text-xs text-text-secondary dark:text-dark-text-secondary">
                      ${DateUtils.format(diary.date, 'YYYY-MM')}
                    </p>
                  </div>
                  <div class="flex-1 pb-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4 relative">
                    <div class="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-secondary"></div>
                    <div class="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-3 -m-3 transition-colors"
                      onclick="DiaryPage.viewDiaryFromTimeline('${diary.date}')">
                      <div class="flex items-center gap-2 mb-2">
                        ${diary.weather ? `<span class="tag text-xs">${diary.weather}</span>` : ''}
                        ${diary.mood ? `<span class="tag tag-gold text-xs">${diary.mood}</span>` : ''}
                      </div>
                      <p class="text-sm line-clamp-3 text-text-secondary dark:text-dark-text-secondary">
                        ${diary.content.replace(/[#*`>\-]/g, '').substring(0, 120)}...
                      </p>
                      ${diary.tags && diary.tags.length > 0 ? `
                        <div class="flex flex-wrap gap-1 mt-2">
                          ${diary.tags.slice(0, 3).map(tag => `<span class="tag text-xs">${tag}</span>`).join('')}
                        </div>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="empty-state">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p>还没有日记，开始记录吧</p>
            </div>
          `}
        </div>
        `}
      </div>
    `;
  },

  // 上一个月
  prevMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.render(document.getElementById('page-container'));
  },

  // 下一个月
  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.render(document.getElementById('page-container'));
  },

  // 选择日期
  selectDate(date) {
    this.selectedDate = date;
    this.isEditing = false;
    this.render(document.getElementById('page-container'));
  },

  // 从时间线查看日记
  viewDiaryFromTimeline(date) {
    this.selectedDate = date;
    this.viewMode = 'calendar';
    this.currentMonth = new Date(date);
    this.render(document.getElementById('page-container'));
  },

  // 切换视图
  toggleView() {
    this.viewMode = this.viewMode === 'calendar' ? 'timeline' : 'calendar';
    this.render(document.getElementById('page-container'));
  },

  // 新建日记
  newDiary() {
    const today = DateUtils.today();
    const diaries = Storage.get('diaries', []);
    const existing = diaries.find(d => d.date === this.selectedDate);
    
    if (existing) {
      this.editDiary();
      return;
    }

    const content = `
      <div class="p-6 max-w-2xl w-full">
        <h3 class="font-serif text-xl font-medium mb-4">写日记 · ${DateUtils.formatChinese(this.selectedDate)}</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">天气</label>
              <select id="diary-weather" class="input-field">
                <option value="">未记录</option>
                <option value="晴">晴</option>
                <option value="多云">多云</option>
                <option value="阴">阴</option>
                <option value="小雨">小雨</option>
                <option value="大雨">大雨</option>
                <option value="雪">雪</option>
                <option value="雾">雾</option>
              </select>
            </div>
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">心情</label>
              <select id="diary-mood" class="input-field">
                <option value="">未记录</option>
                <option value="开心">开心</option>
                <option value="平静">平静</option>
                <option value="愉悦">愉悦</option>
                <option value="沉思">沉思</option>
                <option value="期待">期待</option>
                <option value="焦虑">焦虑</option>
                <option value="难过">难过</option>
                <option value="愤怒">愤怒</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">标签（用逗号分隔）</label>
            <input type="text" id="diary-tags" class="input-field" placeholder="标签1, 标签2">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">内容（支持 Markdown）</label>
            <textarea id="diary-content" class="input-field" rows="12" placeholder="# 标题&#10;&#10;今天发生了什么..."></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">
            取消
          </button>
          <button onclick="DiaryPage.saveNew()" class="btn-primary">
            保存
          </button>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  // 保存新日记
  saveNew() {
    const content = document.getElementById('diary-content')?.value.trim();
    const weather = document.getElementById('diary-weather')?.value;
    const mood = document.getElementById('diary-mood')?.value;
    const tagsStr = document.getElementById('diary-tags')?.value.trim();

    if (!content) {
      Toast.show('日记内容不能为空', 'warning');
      return;
    }

    const tags = tagsStr ? tagsStr.split(/[,，]/).map(t => t.trim()).filter(t => t) : [];
    const diaries = Storage.get('diaries', []);
    
    const newDiary = {
      id: generateId('d'),
      date: this.selectedDate,
      content,
      weather: weather || '',
      mood: mood || '',
      tags,
      createdAt: new Date().toISOString()
    };
    
    diaries.unshift(newDiary);
    diaries.sort((a, b) => new Date(b.date) - new Date(a.date));
    Storage.set('diaries', diaries);

    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('日记已保存', 'success');
  },

  // 编辑日记
  editDiary() {
    const diaries = Storage.get('diaries', []);
    const diary = diaries.find(d => d.date === this.selectedDate);
    if (!diary) return;

    const content = `
      <div class="p-6 max-w-2xl w-full">
        <h3 class="font-serif text-xl font-medium mb-4">编辑日记 · ${DateUtils.formatChinese(this.selectedDate)}</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">天气</label>
              <select id="diary-edit-weather" class="input-field">
                <option value="">未记录</option>
                <option value="晴" ${diary.weather === '晴' ? 'selected' : ''}>晴</option>
                <option value="多云" ${diary.weather === '多云' ? 'selected' : ''}>多云</option>
                <option value="阴" ${diary.weather === '阴' ? 'selected' : ''}>阴</option>
                <option value="小雨" ${diary.weather === '小雨' ? 'selected' : ''}>小雨</option>
                <option value="大雨" ${diary.weather === '大雨' ? 'selected' : ''}>大雨</option>
                <option value="雪" ${diary.weather === '雪' ? 'selected' : ''}>雪</option>
                <option value="雾" ${diary.weather === '雾' ? 'selected' : ''}>雾</option>
              </select>
            </div>
            <div>
              <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">心情</label>
              <select id="diary-edit-mood" class="input-field">
                <option value="">未记录</option>
                <option value="开心" ${diary.mood === '开心' ? 'selected' : ''}>开心</option>
                <option value="平静" ${diary.mood === '平静' ? 'selected' : ''}>平静</option>
                <option value="愉悦" ${diary.mood === '愉悦' ? 'selected' : ''}>愉悦</option>
                <option value="沉思" ${diary.mood === '沉思' ? 'selected' : ''}>沉思</option>
                <option value="期待" ${diary.mood === '期待' ? 'selected' : ''}>期待</option>
                <option value="焦虑" ${diary.mood === '焦虑' ? 'selected' : ''}>焦虑</option>
                <option value="难过" ${diary.mood === '难过' ? 'selected' : ''}>难过</option>
                <option value="愤怒" ${diary.mood === '愤怒' ? 'selected' : ''}>愤怒</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">标签（用逗号分隔）</label>
            <input type="text" id="diary-edit-tags" class="input-field" value="${(diary.tags || []).join(', ')}">
          </div>
          <div>
            <label class="block text-sm mb-1.5 text-text-secondary dark:text-dark-text-secondary">内容（支持 Markdown）</label>
            <textarea id="diary-edit-content" class="input-field" rows="14">${diary.content}</textarea>
          </div>
        </div>
        <div class="flex justify-between mt-6">
          <button onclick="DiaryPage.deleteDiary('${diary.id}')" class="px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            删除日记
          </button>
          <div class="flex gap-3">
            <button onclick="Modal.close()" class="px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">
              取消
            </button>
            <button onclick="DiaryPage.saveEdit('${diary.id}')" class="btn-primary">
              保存
            </button>
          </div>
        </div>
      </div>
    `;
    Modal.open(content);
  },

  // 保存编辑
  saveEdit(id) {
    const diaries = Storage.get('diaries', []);
    const diary = diaries.find(d => d.id === id);
    if (!diary) return;

    diary.content = document.getElementById('diary-edit-content')?.value.trim() || diary.content;
    diary.weather = document.getElementById('diary-edit-weather')?.value || '';
    diary.mood = document.getElementById('diary-edit-mood')?.value || '';
    const tagsStr = document.getElementById('diary-edit-tags')?.value.trim();
    diary.tags = tagsStr ? tagsStr.split(/[,，]/).map(t => t.trim()).filter(t => t) : [];

    Storage.set('diaries', diaries);
    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('已保存修改', 'success');
  },

  // 删除日记
  deleteDiary(id) {
    if (!confirm('确定要删除这篇日记吗？')) return;
    
    let diaries = Storage.get('diaries', []);
    diaries = diaries.filter(d => d.id !== id);
    Storage.set('diaries', diaries);

    Modal.close();
    this.render(document.getElementById('page-container'));
    Toast.show('已删除', 'success');
  }
};
