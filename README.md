# 牟盛昊 · 个人主页

Web 前端技术课程作业 —— 静态个人主页。
配色走**多色渐变炫彩风**，纯手写 HTML5 + CSS3 + 原生 JavaScript，**不使用任何框架、CDN 或外部资源**。

---

## 目录结构

```
mou-portfolio/
├── index.html          页面结构（内容都在这，改文字来这里）
├── css/
│   └── style.css       全部样式（配色、布局、动画）
├── js/
│   └── main.js         全部交互（导航、打字机、数字滚动等）
└── README.md           本说明
```

三个文件职责分离：**HTML 管内容，CSS 管外观，JS 管行为**。

---

## 怎么在 VS Code 里打开

1. 打开 VS Code
2. 菜单 **文件 → 打开文件夹**，选择 `D:\DSH Program\mou-portfolio` 这个文件夹
3. 左侧资源管理器里就能同时看到三个文件，点开随时改

### 想边改边看效果

装一个免费插件 **Live Server**（扩展面板搜 `Live Server`，作者 Ritwick Dey）：

1. 在 `index.html` 上右键 → **Open with Live Server**
2. 浏览器自动打开，之后每按一次 `Ctrl+S` 保存，页面自动刷新

不装插件也行：直接双击 `index.html` 用浏览器打开，改完代码按 `F5` 刷新即可。

### 推荐装的插件（可选）

| 插件 | 作用 |
|---|---|
| Live Server | 保存自动刷新预览 |
| Prettier | `Shift+Alt+F` 一键格式化代码，交作业更整齐 |
| Chinese (Simplified) | VS Code 界面汉化 |

---

## 需要你替换的地方（一共 4 处）

| # | 位置 | 现在的内容 | 怎么改 |
|---|---|---|---|
| 1 | `index.html` 联系我板块 | `moushenghao@example.com` | 换成你的真实邮箱（`href="mailto:..."` 也要一起改） |
| 2 | `index.html` 联系我板块 | `GitHub` / `微信：请替换` / `QQ：请替换` | 文字和 `href="#"` 都换成你的真实账号链接 |
| 3 | `index.html` 关于我 → 在读大学生 | `计算机 / 信息技术相关方向` | 改成你的真实专业 |
| 4 | `index.html` 首屏统计条 + 技能条 | `1000+ / 15+ / 8 门 / 99%` 和各项技能百分比 | 按实际情况改，别写太夸张 |

> 小技巧：VS Code 里按 `Ctrl+H` 可以全局查找替换，改"牟盛昊"这类出现多次的词很方便。

---

## 想换配色？只改一个地方

打开 `css/style.css`，最上面的 `:root` 就是**整个网站的颜色总控台**：

```css
:root{
  --c-violet:#7c3aed;    /* 紫 */
  --c-fuchsia:#d946ef;   /* 品红 */
  --c-pink:#f43f5e;      /* 玫红 */
  ...
  --bg-0:#080a1c;        /* 页面底色（想改浅色主题就动这个） */
  --rainbow:linear-gradient(90deg, ...);  /* 全站通用的彩虹色带 */
}
```

- **改 `--rainbow`** → 所有渐变文字、进度条、彩色线条一起变
- **改 `--c-*` 色值** → 对应颜色的光斑、卡片、标签跟着变
- 每段样式前都有 `/* 0. ~ 10. */` 编号注释，`Ctrl+F` 搜编号能快速定位

---

## 页面包含的板块

1. **首屏** — 旋转彩虹头像环、渐变姓名、打字机自我介绍、数字滚动统计
2. **关于我** — 自我介绍正文 + 4 张信息卡
3. **技能地图** — 6 条彩色进度条 + 6 张能力卡片（悬停有聚光效果）
4. **学习历程** — 竖向渐变时间线
5. **联系我** — 彩色圆点联系方式按钮
6. **页脚** — 版权信息 + 右下角返回顶部

## 用到的技术点（答辩/报告可以写这些）

- **HTML**：语义化标签（`header` / `main` / `section` / `footer` / `nav`）、`aria-*` 无障碍属性、`data-*` 自定义数据属性
- **CSS**：自定义属性（CSS 变量）、Flexbox 与 Grid 布局、`clamp()` 流式尺寸、`@keyframes` 关键帧动画、`conic-gradient` / `radial-gradient` / `linear-gradient`、`backdrop-filter` 玻璃拟态、`background-clip:text` 渐变文字、媒体查询响应式、`prefers-reduced-motion` 无障碍适配
- **JavaScript**：`IntersectionObserver` 滚动监听（进场动画 / 数字滚动 / 导航高亮）、`requestAnimationFrame` 缓动动画、DOM 事件处理、`matchMedia` 媒体查询检测
- **工程**：结构与样式与行为三分离、零依赖、单页锚点导航

## 响应式断点

| 断点 | 变化 |
|---|---|
| `> 900px` | 完整双栏布局 |
| `≤ 900px` | 「关于我」变成单栏 |
| `≤ 720px` | 导航变汉堡菜单、统计条两列、关闭鼠标光晕（省性能） |
