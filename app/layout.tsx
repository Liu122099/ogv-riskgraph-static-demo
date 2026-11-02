import type { Metadata } from "next";

import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "OGV RiskGraph · 风险记忆交互原型",
  description: "Haoran 的 AI 产品应用作品：体验记忆写入、知识图谱与证据问答。虚构数据，浏览器规则模拟，无模型调用。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
