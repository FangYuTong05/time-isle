/* ========================================
   时屿 | Time Isle - 示例数据
   ======================================== */

// 初始化示例数据
const SampleData = {
  // 知识库分类
  knowledgeCategories: [
    { id: 'cat_humanities', name: '人文社科', icon: '📚' },
    { id: 'cat_science', name: '自然科学', icon: '🔬' },
    { id: 'cat_art', name: '艺术文化', icon: '🎨' },
    { id: 'cat_skill', name: '实用技能', icon: '🛠️' },
    { id: 'cat_misc', name: '杂学冷知识', icon: '💡' }
  ],

  // 知识库条目
  knowledge: [
    {
      id: 'k1',
      title: '费曼学习法',
      category: 'cat_skill',
      summary: '一种通过向他人讲解来检验和深化自己理解的学习方法。',
      content: `# 费曼学习法

费曼学习法（Feynman Technique）是由诺贝尔物理学奖得主理查德·费曼提出的一种学习方法。

## 四个步骤

1. **选择一个概念**：选择你想要学习的主题
2. **向小白解释**：假装你正在向一个完全不懂的人解释这个概念
3. **发现知识缺口**：当你解释不下去的时候，就是你的知识缺口
4. **简化和类比**：用更简单的语言和类比来重新组织解释

## 核心思想

> 如果你不能简单地解释一件事，你就还没有真正理解它。

这种方法特别适合学习[[深度学习]]和复杂的理论概念。`,
      tags: ['学习方法', '效率', '思维模型'],
      source: '书籍 · 《费曼学习法》',
      createdAt: '2026-08-15T10:30:00',
      updatedAt: '2026-09-01T14:20:00'
    },
    {
      id: 'k2',
      title: '帕金森定律',
      category: 'cat_humanities',
      summary: '工作会自动膨胀，占满一个人所有可用的时间。',
      content: `# 帕金森定律

帕金森定律（Parkinson's Law）是官僚主义或官僚主义现象的一种别称。

## 主要内容

- 工作会自动膨胀，占满一个人所有可用的时间
- 机构人员膨胀的原因及后果：一个不称职的官员，可能有三条出路
- 行政管理体制中，行政机构会像金字塔一样不断增多

## 启示

在时间管理中，要给自己设定严格的截止日期，否则任务会无限拖延。

相关概念：[[二八定律]]`,
      tags: ['管理学', '心理学', '时间管理'],
      source: '自悟',
      createdAt: '2026-07-20T09:00:00',
      updatedAt: '2026-08-10T16:45:00'
    },
    {
      id: 'k3',
      title: '二八定律（帕累托法则）',
      category: 'cat_humanities',
      summary: '80%的结果来自20%的原因。',
      content: `# 二八定律

帕累托法则（Pareto principle），又称二八定律，是指在许多情况下，大约80%的结果来自20%的原因。

## 应用领域

- **商业**：80%的利润来自20%的客户
- **时间管理**：20%的工作产生80%的价值
- **编程**：20%的bug导致80%的崩溃
- **学习**：20%的核心知识覆盖80%的场景

## 实践建议

1. 找出那20%的关键因素
2. 把精力集中在高价值的事情上
3. 学会取舍，不要追求完美

关联：[[费曼学习法]] 可以帮助你更快掌握那20%的核心。`,
      tags: ['管理学', '经济学', '思维模型'],
      source: '文章 · 维基百科',
      createdAt: '2026-06-10T11:20:00',
      updatedAt: '2026-09-05T08:30:00'
    },
    {
      id: 'k4',
      title: '莫比乌斯环',
      category: 'cat_science',
      summary: '一种只有一个面和一条边界的拓扑学结构。',
      content: `# 莫比乌斯环

莫比乌斯环（Möbius strip）是一种非常有趣的拓扑学结构。

## 特性

- 只有一个面（单侧曲面）
- 只有一条边界
- 从环上任意一点出发，不跨越边界就能走完整个环

## 制作方法

拿一张纸条，扭转180度，再把两端粘起来，就得到了一个莫比乌斯环。

## 应用

- 传送带设计（磨损更均匀）
- 打字机色带
- 艺术创作`,
      tags: ['数学', '拓扑学', '有趣'],
      source: '视频 · 3Blue1Brown',
      createdAt: '2026-08-05T15:00:00',
      updatedAt: '2026-08-05T15:00:00'
    },
    {
      id: 'k5',
      title: '宋代美学',
      category: 'cat_art',
      summary: '极简、素雅、追求意境的东方美学巅峰。',
      content: `# 宋代美学

宋代被认为是中国古代美学的巅峰时期，其审美追求对后世影响深远。

## 核心特点

- **极简主义**：汝窑天青色，单色釉
- **文人气息**：山水画、书法、诗词
- **生活美学**：点茶、焚香、插花、挂画

## 代表作品

- 清明上河图
- 千里江山图
- 汝窑天青釉洗

> 宋人的审美，领先世界一千年。`,
      tags: ['中国历史', '美学', '艺术史'],
      source: '书籍 · 《宋：现代的拂晓时辰》',
      createdAt: '2026-07-12T20:15:00',
      updatedAt: '2026-08-22T11:30:00'
    },
    {
      id: 'k6',
      title: '为什么天空是蓝色的？',
      category: 'cat_misc',
      summary: '瑞利散射让我们看到了蓝色的天空。',
      content: `# 为什么天空是蓝色的？

天空呈现蓝色是因为一种叫做"瑞利散射"的物理现象。

## 原理

太阳光包含各种颜色的光，每种颜色的光波长不同：
- 红光：波长最长
- 蓝光：波长较短

当太阳光进入大气层时，波长较短的蓝光更容易被空气中的分子散射开来，所以我们看到的天空就是蓝色的。

## 为什么日落是红色的？

日落时，太阳光需要穿过更厚的大气层，蓝光被散射掉了，只剩下波长较长的红光能够到达我们的眼睛。`,
      tags: ['物理', '科普', '冷知识'],
      source: '自悟',
      createdAt: '2026-09-01T19:40:00',
      updatedAt: '2026-09-01T19:40:00'
    }
  ],

  // 日记
  diaries: [
    {
      id: 'd1',
      date: '2026-09-09',
      content: `# 晴

今天读完了《深度工作》，有不少启发。

> 专注的能力是这个时代最稀缺的资源。

## 今日感悟

1. 深度工作需要刻意练习，不是想专注就能专注的
2. 减少浅层工作的时间，把精力留给真正重要的事
3. 给自己设定固定的深度工作时段，形成习惯

明天开始试试每天早上 9-11 点作为深度工作时间。`,
      mood: '平静',
      weather: '晴',
      tags: ['读书', '效率', '反思'],
      createdAt: '2026-09-09T22:30:00'
    },
    {
      id: 'd2',
      date: '2026-09-08',
      content: `# 多云

今天整理了一下知识库，发现已经积累了不少东西。

知识不是用来囤积的，是用来使用的。以后要多做输出，把学到的东西真正内化。

下午去公园散步，看到一只很可爱的猫，拍了照。`,
      mood: '愉悦',
      weather: '多云',
      tags: ['日常', '反思'],
      createdAt: '2026-09-08T20:15:00'
    },
    {
      id: 'd3',
      date: '2026-09-05',
      content: `# 雨

下雨了，适合思考。

今天想了很多关于长期主义的事情。我们总是高估短期能做的事，低估长期能做的事。

每天进步一点点，一年后就是天翻地覆的变化。

> 复利是世界第八大奇迹。`,
      mood: '沉思',
      weather: '小雨',
      tags: ['思考', '长期主义'],
      createdAt: '2026-09-05T16:40:00'
    },
    {
      id: 'd4',
      date: '2026-09-01',
      content: `# 晴

九月的第一天，给自己定了几个小目标：

- [ ] 读完 3 本书
- [ ] 每周写 2 篇日记
- [ ] 坚持每天运动 30 分钟
- [ ] 知识库新增 20 条

希望月底回头看的时候，能有成就感。`,
      mood: '期待',
      weather: '晴',
      tags: ['月度计划', '目标'],
      createdAt: '2026-09-01T08:00:00'
    }
  ],

  // 待办事项
  todos: [
    {
      id: 't1',
      title: '读完《深度工作》',
      description: '进度：80%，还差最后两章',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2026-09-15',
      createdAt: '2026-09-01T08:00:00'
    },
    {
      id: 't2',
      title: '整理九月读书笔记',
      description: '把这个月读的书整理成知识库条目',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-09-30',
      createdAt: '2026-09-03T10:00:00'
    },
    {
      id: 't3',
      title: '买新的咖啡豆',
      description: '挂耳快喝完了，这次试试云南豆',
      status: 'todo',
      priority: 'low',
      dueDate: null,
      createdAt: '2026-09-08T14:30:00'
    },
    {
      id: 't4',
      title: '完成季度复盘',
      description: 'Q3 结束了，写一份复盘',
      status: 'completed',
      priority: 'high',
      dueDate: '2026-09-01',
      createdAt: '2026-08-25T09:00:00',
      completedAt: '2026-08-31T23:00:00'
    },
    {
      id: 't5',
      title: '学习费曼学习法',
      description: '并实践到日常学习中',
      status: 'completed',
      priority: 'medium',
      dueDate: '2026-08-20',
      createdAt: '2026-08-10T11:00:00',
      completedAt: '2026-08-18T16:00:00'
    }
  ],

  // 记账
  transactions: [
    { id: 'tx1', type: 'expense', amount: 32.5, category: '餐饮', note: '午餐 · 牛肉面', date: '2026-09-09' },
    { id: 'tx2', type: 'expense', amount: 128, category: '购物', note: '挂耳咖啡', date: '2026-09-08' },
    { id: 'tx3', type: 'income', amount: 15000, category: '工资', note: '9月工资', date: '2026-09-05' },
    { id: 'tx4', type: 'expense', amount: 2500, category: '住房', note: '房租', date: '2026-09-01' },
    { id: 'tx5', type: 'expense', amount: 68, category: '娱乐', note: '电影票', date: '2026-09-07' },
    { id: 'tx6', type: 'expense', amount: 156, category: '餐饮', note: '和朋友聚餐', date: '2026-09-06' },
    { id: 'tx7', type: 'expense', amount: 45, category: '交通', note: '打车', date: '2026-09-04' },
    { id: 'tx8', type: 'income', amount: 500, category: '其他', note: '稿费', date: '2026-09-03' },
    { id: 'tx9', type: 'expense', amount: 299, category: '学习', note: '在线课程', date: '2026-09-02' },
    { id: 'tx10', type: 'expense', amount: 88, category: '生活', note: '水电费', date: '2026-09-01' }
  ],

  // 记账分类
  transactionCategories: {
    expense: ['餐饮', '交通', '购物', '娱乐', '住房', '生活', '学习', '医疗', '其他'],
    income: ['工资', '奖金', '投资', '稿费', '其他']
  },

  // 物品清单
  items: [
    {
      id: 'i1',
      name: 'Kindle Paperwhite',
      category: '数码',
      purchaseDate: '2025-06-15',
      price: 998,
      feeling: '非常实用，通勤路上看书很方便',
      image: null,
      createdAt: '2025-06-15T00:00:00'
    },
    {
      id: 'i2',
      name: '人类简史',
      category: '书籍',
      purchaseDate: '2026-03-10',
      price: 68,
      feeling: '视角宏大，值得反复读',
      image: null,
      createdAt: '2026-03-10T00:00:00'
    },
    {
      id: 'i3',
      name: '手冲咖啡壶',
      category: '日用品',
      purchaseDate: '2026-01-20',
      price: 199,
      feeling: '每天早上的仪式感',
      image: null,
      createdAt: '2026-01-20T00:00:00'
    }
  ],

  // 密码保险箱（加密存储，这里是明文示例）
  passwords: [
    { id: 'p1', name: 'GitHub', category: '工作', account: 'shihuaixu', password: '', email: 'shi@example.com', note: '开启了两步验证', createdAt: '2026-01-01' },
    { id: 'p2', name: '某邮箱', category: '社交', account: 'shihuaixu', password: '', email: '', note: '主邮箱', createdAt: '2026-01-01' }
  ],

  // 资源链接
  links: [
    { id: 'l1', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: '前端开发必备文档', category: '开发工具', tags: ['前端', '文档'], usageCount: 42 },
    { id: 'l2', title: 'Figma', url: 'https://figma.com', description: '在线设计工具', category: '设计资源', tags: ['设计', '协作'], usageCount: 28 },
    { id: 'l3', title: '豆瓣读书', url: 'https://book.douban.com', description: '找书、看书评', category: '资讯阅读', tags: ['读书'], usageCount: 15 }
  ],

  // 碎片收藏
  fragments: [
    { id: 'f1', content: '在时间里，有一座自己的岛。', source: '时屿 Slogan', tags: ['文案', '岛屿'], createdAt: '2026-09-01' },
    { id: 'f2', content: '我们总是高估短期能做的事，低估长期能做的事。', source: '某本书', tags: ['长期主义', '感悟'], createdAt: '2026-08-15' },
    { id: 'f3', content: '如果你不能简单地解释一件事，你就还没有真正理解它。', source: '费曼', tags: ['学习', '名言'], createdAt: '2026-07-20' }
  ],

  // 脑洞
  ideas: [
    {
      id: 'idea1',
      title: '如果时间可以存储',
      content: '如果我们能把空闲时间存起来，在忙碌的时候取出来用，世界会变成什么样？',
      status: 'inspiration',
      tags: ['科幻', '时间'],
      createdAt: '2026-09-05T14:30:00'
    },
    {
      id: 'idea2',
      title: '知识的复利效应',
      content: '知识会不会像金钱一样有复利效应？每天学一点，长期来看是不是指数级增长？',
      status: 'thinking',
      tags: ['学习', '成长'],
      createdAt: '2026-08-28T20:15:00'
    },
    {
      id: 'idea3',
      title: '数字岛屿概念',
      content: '每个人都需要一个属于自己的数字空间，不是社交网络，而是真正属于自己的地方。',
      status: 'concluded',
      tags: ['产品', '想法'],
      createdAt: '2026-07-10T09:00:00'
    }
  ],

  // 账号到期提醒
  subscriptions: [
    { id: 's1', name: 'Netflix', expireDate: '2026-09-25', price: 45, cycle: 'monthly', note: '' },
    { id: 's2', name: '某云服务器', expireDate: '2026-10-15', price: 99, cycle: 'monthly', note: '博客用' },
    { id: 's3', name: '域名续费', expireDate: '2026-12-01', price: 65, cycle: 'yearly', note: '.com 域名' }
  ],

  // 冷知识库（用于首页随机展示）
  coldFacts: [
    '蜂蜜是永不变质的食物，考古学家在埃及金字塔中发现了3000年前的蜂蜜，仍然可以食用。',
    '章鱼有三颗心脏，两颗负责给鳃供血，一颗负责给全身供血。',
    '你体内的细菌数量比细胞数量还要多，我们其实是"行走的生态系统"。',
    '光速大约是每秒30万公里，光从太阳到地球需要8分20秒。',
    '人类DNA有大约30亿个碱基对，如果全部打印出来，大约需要200本电话簿。',
    '世界上最长的河流是尼罗河，全长约6650公里。',
    '一只蚂蚁可以举起自身体重50倍的物体。',
    '地球上的水，大部分比太阳还要古老。'
  ],

  // 天气文案
  weatherTexts: [
    '岛上天气晴，适合记录。',
    '海风轻拂，适合写作。',
    '多云转晴，适合思考。',
    '微雨蒙蒙，适合读书。',
    '晚霞满天，适合回忆。'
  ]
};

// 初始化示例数据到 localStorage（仅首次加载时）
function initSampleData() {
  // 检查是否已经初始化过
  if (Storage.get('initialized')) return;

  Storage.set('knowledge', SampleData.knowledge);
  Storage.set('knowledgeCategories', SampleData.knowledgeCategories);
  Storage.set('diaries', SampleData.diaries);
  Storage.set('todos', SampleData.todos);
  Storage.set('transactions', SampleData.transactions);
  Storage.set('transactionCategories', SampleData.transactionCategories);
  Storage.set('items', SampleData.items);
  Storage.set('passwords', SampleData.passwords);
  Storage.set('links', SampleData.links);
  Storage.set('fragments', SampleData.fragments);
  Storage.set('ideas', SampleData.ideas);
  Storage.set('subscriptions', SampleData.subscriptions);
  Storage.set('coldFacts', SampleData.coldFacts);
  Storage.set('weatherTexts', SampleData.weatherTexts);
  Storage.set('initialized', true);

  console.log('时屿 | 示例数据初始化完成');
}
