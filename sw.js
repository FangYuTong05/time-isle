/* ========================================
   时屿 | Time Isle - Service Worker
   实现离线缓存和 PWA 功能
   ======================================== */

const CACHE_NAME = 'time-isle-v1';
const OFFLINE_URL = './index.html';

// 需要预缓存的核心资源
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/utils.js',
  './js/data.js',
  './js/app.js',
  './js/pages/dashboard.js',
  './js/pages/knowledge.js',
  './js/pages/daily.js',
  './js/pages/assets.js',
  './js/pages/diary.js',
  './js/pages/thinking.js',
  './js/pages/tools.js',
  './assets/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

// 安装阶段：预缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Time Isle] Pre-caching app shell');
        // 使用 addAll，但忽略失败的请求（确保 SW 能正常安装）
        return Promise.all(
          PRECACHE_URLS.map(url => 
            cache.add(url).catch(err => {
              console.warn('[Time Isle] Failed to cache:', url, err);
            })
          )
        );
      })
      .then(() => {
        console.log('[Time Isle] App shell cached');
        return self.skipWaiting();
      })
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[Time Isle] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[Time Isle] Service Worker activated');
        return self.clients.claim();
      })
  );
});

// 拦截请求：缓存优先策略
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 只缓存 GET 请求
  if (request.method !== 'GET') {
    return;
  }

  // 跳过跨域请求（如 CDN 资源）
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // HTML 页面：网络优先，失败则回退到缓存
  if (request.mode === 'navigate' || 
      request.destination === 'document' ||
      request.url.endsWith('.html') ||
      request.url === self.location.origin + '/' ||
      request.url.endsWith('/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 成功则更新缓存
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // 网络失败，从缓存取
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached;
            }
            // 都没有则返回离线页面
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // 静态资源：缓存优先，后台更新
  event.respondWith(
    caches.match(request)
      .then((cached) => {
        if (cached) {
          // 缓存命中，返回缓存并在后台更新
          fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
            })
            .catch(() => {
              // 更新失败没关系，继续用缓存
            });
          return cached;
        }
        
        // 缓存未命中，从网络获取并缓存
        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            
            return response;
          })
          .catch(() => {
            // 网络失败
            return cached;
          });
      })
  );
});

// 监听来自客户端的消息
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data === 'getVersion') {
    event.source.postMessage({
      type: 'version',
      version: CACHE_NAME,
      timestamp: new Date().toISOString()
    });
  }
});
