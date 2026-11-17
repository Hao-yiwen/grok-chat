# Grok Chat

浏览器里的 Grok 聊天页面。用 Create React App 搭的单页应用，把对话发给 [xAI Chat Completions](https://api.x.ai/v1/chat/completions)（模型写死为 `grok-beta`），多个会话保存在本机 `localStorage`。没有自建后端。

当前根目录说明原先只有一行标题「Gork chat」，与包名 `grok-chat` 和界面文案不一致。本文按仓库里的代码重写。

![React](https://img.shields.io/badge/React-18.3.1-149ECA?logo=react&logoColor=white)
![Create React App](https://img.shields.io/badge/Create%20React%20App-5.0.1-09D3AC?logo=createreactapp&logoColor=white)
![npm package](https://img.shields.io/badge/package-grok--chat%400.1.0-CB3837?logo=npm&logoColor=white)

## 已实现的功能

- 左侧会话列表：新建、按时间戳切换、删除。没有会话时显示「欢迎使用 Grok 聊天」。
- 发送用户消息，请求返回后把助手回复追加到当前会话。请求进行中输入框和发送按钮不可用，并显示「正在加载...」。
- 请求失败时在对话里写入「与Grok通信时出错，请重试。」，同时在控制台打印错误。
- `conversations` 随状态写回 `localStorage`，刷新后恢复，并自动打开列表中的第一条。
- 助手和用户消息都用 Markdown 渲染（含 GFM），围栏代码块按语言做语法高亮。HTML 经 `rehype-sanitize` 过滤。

请求体在 `src/components/ChatWindow.js` 中写死：

| 字段 | 值 |
| --- | --- |
| 地址 | `POST https://api.x.ai/v1/chat/completions` |
| 鉴权 | `Authorization: Bearer <REACT_APP_API_KEY>` |
| `model` | `grok-beta` |
| `stream` | `false`（整段返回，没有流式输出） |
| `temperature` | `0` |
| 系统提示 | `You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy.` |

界面里用户消息的 `role` 为 `user`，助手消息存成 `bot`，发给接口时改回 `assistant`。会话 `id` 使用 `Date.now()`，列表标题是该时间的本地化字符串，不能重命名。

## 技术栈

版本取自 `package-lock.json` 中实际安装的版本。

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| React / React DOM | 18.3.1 | 界面 |
| react-scripts | 5.0.1 | Create React App 开发、构建与测试 |
| axios | 1.7.7 | 调用 xAI 接口 |
| react-markdown | 9.0.1 | Markdown 渲染 |
| remark-gfm | 4.0.0 | 表格、任务列表等 GFM 语法 |
| rehype-sanitize | 6.0.0 | 过滤 Markdown 中的 HTML |
| react-syntax-highlighter | 15.6.1 | Prism `oneDark` 代码高亮 |
| web-vitals | 2.1.4 | 已引入；`reportWebVitals()` 没有传入回调，页面上不会采集指标 |
| @testing-library/react | 13.4.0 | 测试库（见下方测试现状） |
| @testing-library/jest-dom | 5.17.0 | DOM 断言 |
| @testing-library/user-event | 13.5.0 | 已安装，测试文件未使用 |

`package.json` 的脚本：`start`、`build`、`test`、`eject`。

## 目录结构

```text
.
├── public
│   ├── index.html          # 文档标题仍是 Create React App 的 “React App”
│   ├── favicon.ico
│   ├── logo192.png         # Create React App 默认图标
│   ├── logo512.png
│   ├── manifest.json       # name 仍为 “Create React App Sample”
│   └── robots.txt
├── src
│   ├── index.js            # 挂载 <App />，并调用 reportWebVitals()
│   ├── index.css
│   ├── App.js              # 会话列表状态，以及 localStorage 读写
│   ├── App.css             # 布局、气泡、会话列表样式
│   ├── App.test.js         # 仍是脚手架默认用例，当前无法跑过
│   ├── setupTests.js
│   ├── reportWebVitals.js
│   ├── logo.svg            # 脚手架图标，组件中未引用
│   └── components
│       ├── ConversationList.js
│       ├── ChatWindow.js   # 调用 xAI 接口
│       ├── MessageList.js  # Markdown 与代码高亮
│       └── MessageInput.js
├── .env                    # REACT_APP_API_KEY=${XAI_API_KEY}
├── .gitignore
├── package.json
└── package-lock.json
```

仓库里没有应用界面截图。`public/` 与 `src/logo.svg` 是 Create React App 自带资源，页面组件没有使用 `logo.svg`。

## 环境要求

- Node.js 与 npm。本仓库在 **Node.js 22.23.4**、**npm 10.9.9** 上完成了 `npm ci`、`npm start` 和 `npm run build`。
- 现代桌面浏览器。布局是横向的会话栏加聊天区，高度为 `100vh`，没有单独的移动端布局。
- 一个可用的 xAI API 密钥。密钥只存在于前端环境变量中，打包后会出现在浏览器可下载的脚本里，请只在自己的环境使用，不要把真实密钥提交进仓库。

仓库已提交的 `.env` 是：

```bash
REACT_APP_API_KEY=${XAI_API_KEY}
```

Create React App 在启动和构建时展开 `${XAI_API_KEY}`。本次在未设置 `XAI_API_KEY` 的情况下启动开发服务器，打包结果里的 `REACT_APP_API_KEY` 为空字符串。空密钥发出的请求会失败，界面显示通信错误。

## 安装与运行

```bash
npm ci
```

在启动前提供密钥。任选一种写法：

```bash
# 沿用现有 .env 的变量展开
export XAI_API_KEY=你的密钥
npm start
```

```bash
# 或把 .env 改成字面量（该文件已被 Git 跟踪，不要提交真实密钥）
# REACT_APP_API_KEY=你的密钥
npm start
```

开发服务器默认地址是 [http://localhost:3000](http://localhost:3000)。浏览器打开后点击「开始新会话」或「+ 新会话」，输入内容并发送。

生产构建：

```bash
npm run build
```

产物在 `build/`。Create React App 假定站点挂在 `/`。本次只确认了构建成功，没有再用静态服务器把 `build/` 托管起来。

修改 `.env` 后需要重新执行 `npm start` 或 `npm run build`，环境变量才会进入前端包。

### 本次在本机核对过的命令

| 命令 | 结果 |
| --- | --- |
| `npm ci` | 成功 |
| `npm start` | 成功，`http://localhost:3000` 返回 200，页面标题为 React App |
| `npm run build` | 成功。构建日志里有 `caniuse-lite` 数据过期，以及 `babel-preset-react-app` 未声明 `@babel/plugin-proposal-private-property-in-object` 的警告，编译仍然完成 |
| `CI=true npm test -- --watchAll=false` | 失败，见下一节 |
| 真实调用 xAI 并收到模型回复 | 未验证（环境中没有 API 密钥） |

## 测试现状

`src/App.test.js` 仍是 Create React App 的默认用例，查找文本 `learn react`。当前界面没有这段文字。测试在断言之前就会中断：Jest 加载 `axios` 时遇到 ESM 的 `import`，报 `Cannot use import statement outside a module`。因此 `npm test` 目前不能用来确认聊天功能。

## 备注

- 会话存在浏览器 `localStorage` 的 `conversations` 键中。清除站点数据会丢掉历史记录。换浏览器或换机器不会同步。
- `public/index.html` 的标题、描述，以及 `manifest.json` 的名称，仍是脚手架原文。
- 模型名、温度、系统提示和接口地址都写在 `ChatWindow.js` 里。若 xAI 不再接受 `grok-beta`，需要改这个文件后重新构建。本仓库没有覆盖接口变更的适配层。
- 仓库没有许可证文件。
