# Yideng SPA

一个基于 React 19 + TypeScript 的现代化单页应用（SPA）框架，集成了 Web3、状态管理、测试工具和完整的工程化配置。

## 技术栈

### 核心框架
- **React 19.2.0** - UI 框架
- **React Router 7.9.6** - 路由管理
- **TypeScript** - 类型安全
- **Tailwind CSS 4.1.17** - 原子化 CSS 框架

### 状态管理
- **Jotai 2.15.2** - 原子化状态管理
- **Jotai-Immer 0.4.1** - 不可变状态更新
- **Immer 11.0.1** - 简化不可变数据操作

### Web3 集成
- **Ethers.js 6.16.0** - 以太坊区块链交互
- 智能合约 ABI 支持（ERC20, MetaCoin 等）

### 构建工具
- **Webpack 5.103.0** - 模块打包
- **SWC 1.15.3** - 高性能 TypeScript/JSX 编译器（比 Babel 快 20 倍）
- **PostCSS** - CSS 处理

### 代码质量
- **Biome 2.3.8** - 代码检查和格式化（Lint + Format）
- **Husky 9.0.11** - Git Hooks 管理
- **EditorConfig** - 统一编辑器配置

### 测试工具
- **Jest 30.2.0** - 单元测试（目标覆盖率：95%）
- **Cypress 15.7.0** - E2E 端到端测试
- **Jest-Stare** - 测试报告可视化

### 开发调试
- **Why-Did-You-Render** - React 性能监控
- **Webpack Dev Server** - 开发服务器（HMR）

## 项目结构

```
yideng-spa/
├── src/                        # 源代码目录
│   ├── abis/                   # 智能合约 ABI 文件
│   ├── components/             # React 组件
│   │   ├── common/            # 通用组件（Header, Loading, 404）
│   │   ├── dapp/              # DApp 相关组件
│   │   └── demo/              # 演示组件
│   ├── hooks/                  # 自定义 Hooks
│   ├── layouts/                # 布局组件
│   ├── pages/                  # 页面组件
│   ├── routes/                 # 路由配置
│   ├── stores/                 # 全局状态管理
│   ├── types/                  # TypeScript 类型定义
│   ├── utils/                  # 工具函数
│   ├── index.tsx              # 应用入口
│   └── style.css              # 全局样式
├── config/                     # Webpack 配置
│   ├── webpack.development.js  # 开发环境配置
│   └── webpack.production.js   # 生产环境配置
├── cypress/                    # E2E 测试
├── tests/                      # 单元测试
├── public/                     # 静态资源
└── docs/                       # 文档和报告

```

## 路径别名

项目配置了便捷的路径别名，可直接导入：

```typescript
import Header from "@components/common/Header";
import { useImmer } from "@hooks/useImmer";
import { productAtom } from "@stores/index";
import MainLayout from "@layouts/Layout";
import Home from "@pages/Home";
```

完整别名列表：
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@hooks/*` → `src/hooks/*`
- `@layouts/*` → `src/layouts/*`
- `@pages/*` → `src/pages/*`
- `@routes/*` → `src/routes/*`
- `@stores/*` → `src/stores/*`
- `@utils/*` → `src/utils/*`
- `@abis/*` → `src/abis/*`
- `@connections/*` → `src/connections/*`

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run client:server
# 或
yarn client:server
```

访问 [http://localhost:3000](http://localhost:3000)

### 生产构建

```bash
npm run client:prod
# 或
yarn client:prod
```

构建文件输出到 `dist/` 目录。

## 可用脚本

### 开发和构建
- `client:dev` - 自定义开发脚本
- `client:server` - 启动开发服务器（端口 3000，支持 HMR）
- `client:prod` - 生产环境构建

### 测试
- `test` - 运行 Jest 单元测试并生成覆盖率报告
- `test:e2e` - 打开 Cypress E2E 测试界面

### 代码质量
- `lint` - 检查代码质量问题
- `lint:fix` - 自动修复 Lint 问题
- `format` - 检查代码格式
- `format:fix` - 自动格式化代码
- `check` - 完整检查（Lint + Format）
- `check:fix` - 自动修复所有问题

## 核心特性

### 1. 原子化状态管理（Jotai + Immer）

```typescript
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

// 定义状态
export const productAtomWithImmer = atomWithImmer({
  id: 12,
  name: "商品名称",
  tags: ["tag1"]
});

// 使用状态
const [data, setData] = useAtom(productAtomWithImmer);

// 不可变更新（使用 Immer 草稿语法）
setData((draft) => {
  draft.name = "新名称";
  draft.tags.push("新标签");
});
```

### 2. 路由配置（React Router v7）

```typescript
const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "demo", element: <Demo /> }
    ]
  },
  { path: "*", element: <PageNotFoundView /> }
];
```

特性：
- 代码分割（Lazy Loading）
- Suspense 加载状态
- 404 处理

### 3. Tailwind CSS 自定义配置

```javascript
// 自定义颜色系统
primary: { 50-900 },  // 11 个色阶
secondary: { 50-900 }

// 自定义动画
'fade-in', 'slide-up', 'bounce-slow'

// 自定义间距
'128': '32rem', '144': '36rem'
```

### 4. Web3 集成

```typescript
import { ethers } from "ethers";
import InfoContractABI from "@abis/InfoContract.json";

// 连接合约
const contract = new ethers.Contract(address, InfoContractABI, provider);
```

支持的合约类型：
- ERC20 标准代币
- MetaCoin 自定义代币
- InfoContract 信息合约

### 5. 性能监控（Why-Did-You-Render）

开发模式下自动追踪组件重渲染：

```typescript
// 自动追踪所有纯组件
trackAllPureComponents: true
// 追踪 Hooks
trackHooks: true
```

## 测试

### 单元测试（Jest）

```bash
yarn test
```

覆盖率要求：
- 函数覆盖：95%
- 行覆盖：95%
- 语句覆盖：95%
- 分支覆盖：50%

测试报告：
- HTML 报告：`docs/jest-stare/index.html`
- 覆盖率报告：`docs/jest-coverage/lcov-report/index.html`

### E2E 测试（Cypress）

```bash
yarn test:e2e
```

包含 22 个高级示例测试：
- 导航测试
- 网络请求
- 本地存储
- Viewport 测试
- 断言验证

## 构建优化

### 开发环境
- SWC 高速编译
- 热模块替换（HMR）
- 友好的错误提示
- 系统通知

### 生产环境
- 代码分割
- CSS 提取和压缩
- JS 压缩（Terser）
- 文件哈希（内容指纹）
- 性能预算（最大 250KB）

## 代码规范

项目使用 **Biome** 作为统一的代码质量工具：

- **缩进**：Tab
- **引号**：双引号
- **自动组织导入**：开启
- **Git 集成**：自动读取 .gitignore

### Git Hooks

提交前自动运行 Lint 检查：

```bash
# .husky/pre-commit
yarn lint
```

## 浏览器支持

- 现代浏览器（Chrome, Firefox, Safari, Edge）
- 编译目标：ES5
- Polyfill：根据需要手动添加

## 性能指标

- **开发服务器启动**：< 2 秒（SWC 编译）
- **热更新速度**：< 500ms
- **生产构建**：~10 秒（取决于项目大小）
- **包大小限制**：250KB（入口点）

## 环境要求

- Node.js >= 16.x
- npm >= 8.x 或 yarn >= 1.22.x

## 贡献指南

1. Fork 项目
2. 创建功能分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 打开 Pull Request

确保代码通过所有检查：
```bash
yarn check:fix  # 修复代码质量问题
yarn test       # 运行测试
```

## 许可证

ISC

## 相关资源

- [React 文档](https://react.dev/)
- [Jotai 文档](https://jotai.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Ethers.js 文档](https://docs.ethers.org/)
- [Biome 文档](https://biomejs.dev/)
- [SWC 文档](https://swc.rs/)
