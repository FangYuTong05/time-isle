/* ========================================
   时屿 | Time Isle - 工具函数库
   ======================================== */

// ========== 存储工具 ==========
const Storage = {
  // 获取数据
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(`timeisle_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  },

  // 保存数据
  set(key, value) {
    try {
      localStorage.setItem(`timeisle_${key}`, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },

  // 删除数据
  remove(key) {
    localStorage.removeItem(`timeisle_${key}`);
  },

  // 清空所有数据
  clear() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('timeisle_'));
    keys.forEach(k => localStorage.removeItem(k));
  }
};

// ========== AES 简易加密（用于密码保险箱） ==========
// 注意：这是简化版 AES 实现，用于本地演示，生产环境建议使用专业库
const Crypto = {
  // 生成密钥（从密码派生）
  deriveKey(password, salt = 'timeisle_salt') {
    let hash = 0;
    const keyStr = password + salt;
    for (let i = 0; i < keyStr.length; i++) {
      const char = keyStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    // 扩展为 16 字节密钥
    const key = [];
    for (let i = 0; i < 16; i++) {
      key.push(Math.abs((hash * (i + 1)) % 256));
    }
    return key;
  },

  // XOR 加密（简化版，演示用）
  encrypt(text, password) {
    if (!text || !password) return text;
    const key = this.deriveKey(password);
    const textBytes = [];
    for (let i = 0; i < text.length; i++) {
      textBytes.push(text.charCodeAt(i));
    }
    const encrypted = textBytes.map((byte, i) => byte ^ key[i % key.length]);
    // 转为 Base64
    return btoa(String.fromCharCode.apply(null, encrypted));
  },

  // XOR 解密
  decrypt(encryptedText, password) {
    if (!encryptedText || !password) return encryptedText;
    try {
      const key = this.deriveKey(password);
      const encrypted = atob(encryptedText).split('').map(c => c.charCodeAt(0));
      const decrypted = encrypted.map((byte, i) => byte ^ key[i % key.length]);
      return String.fromCharCode.apply(null, decrypted);
    } catch (e) {
      console.error('Decrypt error:', e);
      return null;
    }
  },

  // 生成随机强密码
  generatePassword(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    const array = new Uint32Array(length);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
      }
    } else {
      for (let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    return password;
  },

  // 简单哈希（用于验证主密码）
  hash(text) {
    let hash = 0;
    if (text.length === 0) return hash.toString();
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
};

// ========== 日期工具 ==========
const DateUtils = {
  // 格式化日期
  format(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },

  // 中文日期格式
  formatChinese(date) {
    const d = new Date(date);
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${weekDays[d.getDay()]}`;
  },

  // 获取今天日期字符串
  today() {
    return this.format(new Date(), 'YYYY-MM-DD');
  },

  // 获取本月第一天
  firstDayOfMonth(date = new Date()) {
    const d = new Date(date);
    d.setDate(1);
    return this.format(d, 'YYYY-MM-DD');
  },

  // 获取本月最后一天
  lastDayOfMonth(date = new Date()) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return this.format(d, 'YYYY-MM-DD');
  },

  // 计算两个日期相差天数
  daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // 获取某年某月的日历数据
  getCalendarDays(year, month) {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();

    // 上个月的填充
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startWeekday - 1; i >= 0; i--) {
      days.push({
        date: this.format(new Date(year, month - 1, prevMonthLastDay - i), 'YYYY-MM-DD'),
        day: prevMonthLastDay - i,
        currentMonth: false
      });
    }

    // 当月
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: this.format(new Date(year, month, i), 'YYYY-MM-DD'),
        day: i,
        currentMonth: true
      });
    }

    // 下个月填充
    const remaining = 42 - days.length; // 6 行
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: this.format(new Date(year, month + 1, i), 'YYYY-MM-DD'),
        day: i,
        currentMonth: false
      });
    }

    return days;
  },

  // 相对时间描述
  timeAgo(date) {
    const now = new Date();
    const d = new Date(date);
    const diff = now - d;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    return this.format(d, 'YYYY-MM-DD');
  }
};

// ========== ID 生成器 ==========
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ========== Toast 提示 ==========
const Toast = {
  show(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColors = {
      info: 'bg-primary',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600'
    };
    toast.className = `toast ${bgColors[type]} text-white px-4 py-2 rounded-lg shadow-lg text-sm`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// ========== 弹窗工具 ==========
const Modal = {
  open(contentHtml, options = {}) {
    const container = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    const backdrop = document.getElementById('modal-backdrop');

    if (!container || !content) return;

    content.innerHTML = contentHtml;
    container.classList.remove('hidden');

    // 动画
    requestAnimationFrame(() => {
      content.style.transform = 'scale(1)';
      content.style.opacity = '1';
    });

    // 点击背景关闭
    if (options.closeOnBackdrop !== false) {
      backdrop.onclick = () => Modal.close();
    }

    // ESC 关闭
    if (options.closeOnEsc !== false) {
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          Modal.close();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    }

    // 执行 onOpen 回调
    if (options.onOpen) {
      setTimeout(options.onOpen, 50);
    }
  },

  close() {
    const container = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');

    if (!container || !content) return;

    content.style.transform = 'scale(0.95)';
    content.style.opacity = '0';

    setTimeout(() => {
      container.classList.add('hidden');
      content.innerHTML = '';
    }, 300);
  }
};

// ========== Markdown 简易解析器 ==========
const Markdown = {
  parse(text) {
    if (!text) return '';
    let html = text;

    // 转义 HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // 标题
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // 粗体
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // 斜体
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // 行内代码
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // 引用
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // 无序列表
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // 有序列表
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
      if (match.includes('<ul>')) return match;
      return `<ol>${match}</ol>`;
    });

    // 链接
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // 双向链接 [[关键词]]
    html = html.replace(/\[\[(.+?)\]\]/g, '<span class="inline-link text-primary cursor-pointer hover:underline" data-link="$1">[[$1]]</span>');

    // 段落
    html = html.split('\n\n').map(p => {
      if (p.startsWith('<') && p.endsWith('>')) return p;
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
  }
};

// ========== 数据导入导出 ==========
const DataManager = {
  // 导出所有数据
  exportAll() {
    const data = {};
    const keys = Object.keys(localStorage).filter(k => k.startsWith('timeisle_'));
    keys.forEach(k => {
      const realKey = k.replace('timeisle_', '');
      data[realKey] = Storage.get(realKey);
    });
    return JSON.stringify(data, null, 2);
  },

  // 下载导出文件
  downloadExport() {
    const data = this.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeisle_backup_${DateUtils.today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    Toast.show('数据导出成功', 'success');
  },

  // 导入数据
  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          Object.keys(data).forEach(key => {
            Storage.set(key, data[key]);
          });
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};

// ========== 主题管理 ==========
const Theme = {
  // 初始化主题
  init() {
    const savedTheme = Storage.get('theme', 'light');
    this.set(savedTheme);
  },

  // 设置主题
  set(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    Storage.set('theme', theme);
  },

  // 切换主题
  toggle() {
    const isDark = document.documentElement.classList.contains('dark');
    this.set(isDark ? 'light' : 'dark');
    return !isDark;
  },

  // 获取当前主题
  get() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
};

// ========== 全局搜索 ==========
const GlobalSearch = {
  search(keyword) {
    if (!keyword.trim()) return [];
    const kw = keyword.toLowerCase();
    const results = [];

    // 搜索知识库
    const knowledge = Storage.get('knowledge', []);
    knowledge.forEach(item => {
      if (item.title.toLowerCase().includes(kw) ||
          item.content.toLowerCase().includes(kw) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(kw)))) {
        results.push({
          type: 'knowledge',
          typeName: '知识库',
          id: item.id,
          title: item.title,
          summary: item.content.substring(0, 80)
        });
      }
    });

    // 搜索日记
    const diaries = Storage.get('diaries', []);
    diaries.forEach(item => {
      if (item.content.toLowerCase().includes(kw) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(kw)))) {
        results.push({
          type: 'diary',
          typeName: '日记',
          id: item.id,
          title: DateUtils.formatChinese(item.date),
          summary: item.content.substring(0, 80)
        });
      }
    });

    // 搜索待办
    const todos = Storage.get('todos', []);
    todos.forEach(item => {
      if (item.title.toLowerCase().includes(kw) ||
          (item.description && item.description.toLowerCase().includes(kw))) {
        results.push({
          type: 'todo',
          typeName: '待办',
          id: item.id,
          title: item.title,
          summary: item.description || ''
        });
      }
    });

    // 搜索脑洞
    const ideas = Storage.get('ideas', []);
    ideas.forEach(item => {
      if (item.title.toLowerCase().includes(kw) ||
          item.content.toLowerCase().includes(kw)) {
        results.push({
          type: 'idea',
          typeName: '脑洞',
          id: item.id,
          title: item.title,
          summary: item.content.substring(0, 80)
        });
      }
    });

    return results;
  }
};
