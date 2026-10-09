/* ==========================================================================
   牟盛昊 · 个人主页 —— 交互脚本
   原生 JavaScript（ES5 语法，兼容性更好），不依赖任何库
   --------------------------------------------------------------------------
   模块索引：
     1. 页脚年份
     2. 导航滚动变色 + 顶部彩虹进度条 + 返回顶部按钮
     3. 移动端汉堡菜单
     4. 鼠标彩色光晕（缓动跟随）
     5. 技能卡片聚光跟随
     6. 滚动进场动画 + 技能条填充
     7. 统计数字滚动
     8. 首屏打字机
     9. 导航高亮当前板块
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. 页脚年份：自动取当前年份
     --------------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();


  /* ---------------------------------------------------------------
     2. 滚动相关：导航变色、进度条宽度、返回顶部显隐
     --------------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('progress');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;

    nav.classList.toggle('scrolled', y > 30);
    toTop.classList.toggle('show', y > 480);

    // 已滚动距离 / 可滚动总距离 = 进度百分比
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 首屏先执行一次，处理刷新时已滚动的情况

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------------------------------------------------------------
     3. 移动端汉堡菜单：点击展开/收起
     --------------------------------------------------------------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('menu');

  toggle.addEventListener('click', function (e) {
    e.stopPropagation(); // 阻止冒泡，否则会被下面的 document 点击立刻关掉
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // 点击菜单里的链接后自动收起
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // 点击页面空白处收起
  document.addEventListener('click', function () {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });


  /* ---------------------------------------------------------------
     4. 鼠标彩色光晕：用缓动插值让光晕"追"着指针跑
     --------------------------------------------------------------- */
  var glow = document.getElementById('glow');
  var targetX = window.innerWidth / 2;
  var targetY = window.innerHeight / 2;
  var curX = targetX;
  var curY = targetY;

  window.addEventListener('mousemove', function (e) {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  (function follow() {
    // 每次靠近目标 9%，产生柔和的拖尾感
    curX += (targetX - curX) * 0.09;
    curY += (targetY - curY) * 0.09;
    glow.style.transform = 'translate(' + curX + 'px,' + curY + 'px) translate(-50%,-50%)';
    requestAnimationFrame(follow);
  })();


  /* ---------------------------------------------------------------
     5. 技能卡片聚光跟随：把鼠标坐标写进 CSS 变量 --mx / --my
     --------------------------------------------------------------- */
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });


  /* ---------------------------------------------------------------
     6. 滚动进场动画：元素进入视口时加 .in，顺便触技能条填充
     --------------------------------------------------------------- */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target); // 只播一次，节省性能
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    // 老浏览器兜底：直接全部显示
    revealItems.forEach(function (el) { el.classList.add('in'); });
  }


  /* ---------------------------------------------------------------
     7. 统计数字滚动：从 0 缓动到 data-count，并追加 data-suffix
     --------------------------------------------------------------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1500;
    var startTime = null;

    function step(ts) {
      if (startTime === null) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count]');

  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { io2.observe(el); });
  } else {
    counters.forEach(countUp);
  }


  /* ---------------------------------------------------------------
     8. 首屏打字机：逐字打出 → 停顿 → 逐字删除 → 换下一句
        想改文案，直接改下面这个数组即可
     --------------------------------------------------------------- */
  var phrases = [
    '一个热爱 Web 前端的大学生。',
    '正在完成前端技术课程作业。',
    '喜欢渐变、动画和干净的布局。',
    '把想法写进浏览器里。'
  ];

  var typedEl = document.getElementById('typedText');
  var phraseIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function type() {
    var text = phrases[phraseIndex];
    typedEl.textContent = deleting ? text.slice(0, --charIndex) : text.slice(0, ++charIndex);

    var delay = deleting ? 55 : 105;

    if (!deleting && charIndex === text.length) {
      deleting = true;
      delay = 1500;                       // 打完整句后停顿
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length; // 循环下一句
      delay = 420;
    }

    setTimeout(type, delay);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    type();
  } else {
    typedEl.textContent = phrases[0]; // 用户关闭动画时直接显示第一句
  }


  /* ---------------------------------------------------------------
     9. 导航高亮：滚动到哪个板块，菜单对应项就点亮
     --------------------------------------------------------------- */
  var sections = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('nav.menu a');

  if ('IntersectionObserver' in window) {
    var io3 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { threshold: 0.35, rootMargin: '-12% 0px -50% 0px' });

    sections.forEach(function (s) { io3.observe(s); });
  }

})();
