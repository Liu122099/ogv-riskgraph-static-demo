# OGV RiskGraph Static Demo

OGV RiskGraph 的纯前端静态演示版，用于通过 GitHub Pages 展示风险记忆写入、结构化确认、知识图谱和双层 Agent 问答流程。

在线演示：

```text
https://liu122099.github.io/ogv-riskgraph-static-demo/
```

## 演示能力

- Dashboard 风险记忆统计与关系预览
- 评论评审演示规则和案例
- 记忆写入与本地结构化确认
- 可交互风险知识图谱
- 基于本地证据的 Agent 问答
- 新写入内容保存到浏览器 `localStorage`

## 静态版说明

本仓库不包含服务端 API、数据库和模型密钥。所有数据均为编造的演示语料，Agent 回答和结构化结果由浏览器端演示逻辑生成。

浏览器本地新增的数据不会上传到服务器。清理站点数据或更换浏览器后，本地新增内容会消失。

完整动态版本与本静态仓库相互独立。

## 本地运行

环境要求：

- Node.js 20+
- pnpm 11.x

```bash
pnpm install
pnpm dev
```

访问：

```text
http://127.0.0.1:3000
```

## 静态构建

```bash
pnpm lint
pnpm build
```

构建产物位于 `out/`。推送到 `main` 后，GitHub Actions 会自动构建并部署到 GitHub Pages。
