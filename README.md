

## 简介

`vue-element-admin` 是一个后台集成解决方案，它基于 [Vue.js](https://github.com/vuejs/vue) 和 [element](https://github.com/ElemeFE/element)。它使用了最新的前端技术栈，内置了i18国际化解决方案，动态路由，权限验证等很多功能特性，相信不管你的需求是什么，本项目都能帮助到你。

菜单初始化数据服务端提供 本地不配置，增加安全性 与1.0区别支持auth回调提供数据

## 功能
```
- 登录/注销
- 权限验证
- 多环境发布
- 动态侧边栏（支持多级路由）
- 动态面包屑
- 国际化多语言
- 多种动态换肤
- 快捷导航(标签页)
- 富文本编辑器
- Markdown编辑器
- JSON编辑器
- Screenfull全屏
- 列表拖拽
- Svg Sprite 图标
- Dashboard
- 本地mock数据
- Echarts 图表
- Clipboard(剪贴复制)
- 401/404错误页面
- 错误日志
- 导出excel
- 导出zip
- 前端可视化excel
- 树形table
- Table example
- 动态table example
- 拖拽table example
- 内联编辑table example
- Form example
- 二步登录
- SplitPane
- Dropzone
- Sticky
- CountTo
- Markdown2html
```

## 开发
```bash
# 克隆项目
git clone https://github.com/yin53719/admin.git

# 安装依赖
npm install 或者 yarn install
   
# 启动服务
npm run dev
```
浏览器访问 http://localhost:4000

## 发布
```bash
# 构建测试环境
npm run build:sit

# 构建生成环境
npm run build:prod
```

## 其它
```bash
# --report to build with bundle size analytics
npm run build:prod --report

# --preview to start a server in local to preview
npm run build:prod --preview


