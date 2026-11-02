"use client";

import { ArrowRightLeft, ExternalLink, LayoutDashboard, Layers, Menu, Network, PenLine, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/components/ui";

const navItems = [
  { href: "/", label: "项目总览", icon: LayoutDashboard },
  { href: "/memory/new", label: "记忆写入", icon: PenLine },
  { href: "/graph", label: "风险图谱", icon: Network },
  { href: "/agent", label: "双层 Agent", icon: Layers },
  { href: "/migrate", label: "拓展方向", icon: ArrowRightLeft }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-4">跳至主要内容</a>
      {menuOpen ? <button type="button" aria-label="关闭导航菜单" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" /> : null}
      <aside id="project-navigation" className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl transition-transform lg:translate-x-0", menuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-28 items-center justify-between px-6">
          <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
            <div className="blue-gradient grid h-11 w-11 place-items-center rounded-2xl shadow-card"><Network className="h-6 w-6 text-white" /></div>
            <div><div className="text-lg font-bold text-slate-950">OGV RiskGraph</div><div className="mt-1 text-xs text-slate-400">Risk Memory · 交互原型</div></div>
          </Link>
          <button type="button" aria-label="关闭导航菜单" onClick={() => setMenuOpen(false)} className="rounded-lg p-1 text-slate-500 lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav aria-label="项目导航" className="flex-1 space-y-3 px-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition", active ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-card" : "text-slate-600 hover:bg-blue-50 hover:text-blue-600")}><Icon className="h-5 w-5" />{item.label}</Link>;
          })}
        </nav>
        <div className="m-5 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-500"><div className="font-semibold text-slate-700">主要创作者 · Haoran</div>AI 产品应用作品 · 静态演示</div>
      </aside>
      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between gap-3 bg-[#f8fbff]/90 px-4 py-4 backdrop-blur-xl sm:px-8">
          <button type="button" aria-label="打开导航菜单" aria-expanded={menuOpen} aria-controls="project-navigation" onClick={() => setMenuOpen(true)} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 lg:hidden"><Menu className="h-5 w-5" /></button>
          <span className="text-xs font-semibold text-slate-500 sm:text-sm">产品原型 · 记忆与证据问答</span>
          <a href="https://github.com/Liu122099/ogv-riskgraph-static-demo" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">项目源码<ExternalLink className="h-3.5 w-3.5" /></a>
        </header>
        <main id="main-content" className="min-w-0 px-4 pb-10 sm:px-8">
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-xs leading-6 text-blue-800">交互演示：使用虚构语料，结构化与回答由本地规则模拟，不调用大模型。新增内容仅保存在当前浏览器。</div>
          {children}
        </main>
      </div>
    </div>
  );
}
