<p align="center">
  <a href="https://tailwindcss.com" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tailwindlabs/tailwindcss/HEAD/.github/logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tailwindlabs/tailwindcss/HEAD/.github/logo-light.svg">
      <img alt="Tailwind CSS" src="https://raw.githubusercontent.com/tailwindlabs/tailwindcss/HEAD/.github/logo-light.svg" width="350" height="70" style="max-width: 100%;">
    </picture>
  </a>
</p>

<p align="center">
  一个用于快速构建自定义用户界面的实用优先 CSS 框架。
</p>

<p align="center">
    <a href="https://github.com/tailwindlabs/tailwindcss/actions"><img src="https://img.shields.io/github/actions/workflow/status/tailwindlabs/tailwindcss/ci.yml?branch=main" alt="Build Status"></a>
    <a href="https://www.npmjs.com/package/tailwindcss"><img src="https://img.shields.io/npm/dt/tailwindcss.svg" alt="Total Downloads"></a>
    <a href="https://github.com/tailwindlabs/tailwindcss/releases"><img src="https://img.shields.io/npm/v/tailwindcss.svg" alt="Latest Release"></a>
    <a href="https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/tailwindcss.svg" alt="License"></a>
</p>

---

# Tailwind CSS

Tailwind CSS 是一个实用优先的 CSS 框架，用于快速构建自定义用户界面。

## 特性

- 🎨 **实用优先**：直接在 HTML 中使用实用类
- 🚀 **快速开发**：无需编写自定义 CSS
- 📱 **响应式设计**：内置响应式断点
- 🎭 **深色模式**：轻松实现深色模式
- 🔧 **可定制**：完全可定制的设计系统
- 📦 **Tree-shaking**：自动移除未使用的样式
- ⚡ **高性能**：优化的构建输出

## 安装

### 使用 npm

```bash
npm install -D tailwindcss
npx tailwindcss init
```

### 使用 CDN

```html
<script src="https://cdn.tailwindcss.com"></script>
```

## 快速开始

### 1. 创建配置文件

```bash
npx tailwindcss init
```

### 2. 配置模板路径

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. 添加 Tailwind 指令

```css
/* src/input.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. 构建 CSS

```bash
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

### 5. 在 HTML 中使用

```html
<!DOCTYPE html>
<html>
<head>
  <link href="/dist/output.css" rel="stylesheet">
</head>
<body>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</body>
</html>
```

## 基础用法

### 文本样式

```html
<!-- 字体大小 -->
<p class="text-sm">小号文本</p>
<p class="text-base">基础文本</p>
<p class="text-lg">大号文本</p>
<p class="text-xl">特大文本</p>

<!-- 字体粗细 -->
<p class="font-light">细体</p>
<p class="font-normal">常规</p>
<p class="font-bold">粗体</p>

<!-- 文本颜色 -->
<p class="text-red-500">红色文本</p>
<p class="text-blue-600">蓝色文本</p>
<p class="text-gray-800">灰色文本</p>
```

### 背景颜色

```html
<div class="bg-white">白色背景</div>
<div class="bg-gray-100">浅灰色背景</div>
<div class="bg-blue-500">蓝色背景</div>
<div class="bg-green-600">绿色背景</div>
```

### 间距

```html
<!-- 外边距 -->
<div class="m-4">四边外边距 1rem</div>
<div class="mt-8">顶部外边距 2rem</div>
<div class="mx-auto">水平居中</div>

<!-- 内边距 -->
<div class="p-4">四边内边距 1rem</div>
<div class="px-6">水平内边距 1.5rem</div>
<div class="py-2">垂直内边距 0.5rem</div>
```

### 布局

```html
<!-- Flexbox -->
<div class="flex">
  <div class="flex-1">弹性项 1</div>
  <div class="flex-1">弹性项 2</div>
</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">
  <div>列 1</div>
  <div>列 2</div>
  <div>列 3</div>
</div>

<!-- 定位 -->
<div class="relative">
  <div class="absolute top-0 left-0">绝对定位</div>
</div>
```

### 边框

```html
<div class="border">四边边框</div>
<div class="border-2 border-blue-500">蓝色粗边框</div>
<div class="rounded-lg">圆角边框</div>
<div class="shadow-md">阴影效果</div>
```

## 响应式设计

Tailwind 使用断点前缀实现响应式设计：

```html
<!-- 移动端优先 -->
<div class="text-sm md:text-base lg:text-xl">
  响应式文本
</div>

<!-- 响应式布局 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div>列 1</div>
  <div>列 2</div>
  <div>列 3</div>
</div>
```

### 断点

| 前缀 | 最小宽度 | 说明 |
|------|----------|------|
| `sm` | 640px | 小屏幕 |
| `md` | 768px | 中等屏幕 |
| `lg` | 1024px | 大屏幕 |
| `xl` | 1280px | 超大屏幕 |
| `2xl` | 1536px | 超超大屏幕 |

## 深色模式

```html
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-white">
    深色模式文本
  </p>
</div>
```

## 状态变体

```html
<!-- 悬停状态 -->
<button class="bg-blue-500 hover:bg-blue-700">
  悬停按钮
</button>

<!-- 焦点状态 -->
<input class="border focus:ring-2 focus:ring-blue-500">
  
<!-- 激活状态 -->
<button class="bg-blue-500 active:bg-blue-800">
  激活按钮
</button>

<!-- 禁用状态 -->
<button class="bg-gray-300 disabled:opacity-50">
  禁用按钮
</button>
```

## 自定义配置

### 扩展主题

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3490dc',
        secondary: '#ffed4a',
        danger: '#e3342f',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
}
```

### 自定义类

```css
@layer components {
  .btn-primary {
    @apply bg-blue-500 text-white font-bold py-2 px-4 rounded;
  }
  
  .btn-primary:hover {
    @apply bg-blue-700;
  }
}
```

## 插件

### 官方插件

- [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms) - 表单样式重置
- [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography) - 排版样式
- [@tailwindcss/aspect-ratio](https://github.com/tailwindlabs/tailwindcss-aspect-ratio) - 宽高比
- [@tailwindcss/line-clamp](https://github.com/tailwindlabs/tailwindcss-line-clamp) - 文本截断

### 使用插件

```bash
npm install -D @tailwindcss/typography
```

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

## 框架集成

### Next.js

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Vite

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Create React App

```bash
npm install -D tailwindcss
npx tailwindcss init
```

### Vue.js

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 最佳实践

### 1. 使用组件提取重复样式

```html
<!-- 不推荐 -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  按钮 1
</button>
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  按钮 2
</button>

<!-- 推荐 -->
<button class="btn-primary">按钮 1</button>
<button class="btn-primary">按钮 2</button>
```

### 2. 使用 @apply 提取组件类

```css
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
}
```

### 3. 使用配置文件扩展默认值

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3490dc',
      },
    },
  },
}
```

## 性能优化

### 1. 启用 JIT 模式

```javascript
// tailwind.config.js
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{html,js}'],
}
```

### 2. 清除未使用的样式

Tailwind 会自动移除未使用的样式，确保 `content` 配置正确：

```javascript
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './public/index.html',
  ],
}
```

### 3. 压缩输出

```bash
NODE_ENV=production npx tailwindcss -o output.css
```

## 文档

完整文档请访问 [tailwindcss.com](https://tailwindcss.com)。

## 社区

如需帮助、讨论最佳实践或功能建议：

[在 GitHub 上讨论 Tailwind CSS](https://github.com/tailwindlabs/tailwindcss/discussions)

## 贡献

如果您有兴趣为 Tailwind CSS 做出贡献，请在提交拉取请求之前阅读我们的[贡献文档](https://github.com/tailwindlabs/tailwindcss/blob/main/.github/CONTRIBUTING.md)。

## 许可证

MIT
