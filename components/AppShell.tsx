"use client";

import {
  ArrowRightLeft,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Layers,
  Network,
  PanelLeftClose,
  PenLine
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/components/ui";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/memory/new", label: "记忆写入", icon: PenLine },
  { href: "/graph", label: "风险图谱", icon: Network },
  { href: "/agent", label: "双层 Agent", icon: Layers },
  { href: "/migrate", label: "迁移能力", icon: ArrowRightLeft }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-transparent">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200/80 bg-white/88 backdrop-blur-xl">
        <Link href="/" className="flex h-28 items-center gap-4 px-7">
          <div className="blue-gradient grid h-11 w-11 place-items-center rounded-2xl shadow-card">
            <Network className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-950">OGV RiskGraph</div>
            <div className="mt-1 text-xs text-slate-400">Risk Memory Agent</div>
          </div>
        </Link>

        <nav className="flex-1 space-y-3 px-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition",
                  active
                    ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-card"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button className="mb-8 ml-7 flex items-center gap-3 text-sm text-slate-500">
          <PanelLeftClose className="h-5 w-5" />
          收起菜单
        </button>
      </aside>

      <main className="min-h-screen pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-end gap-5 bg-[#f8fbff]/82 px-8 backdrop-blur-xl">
          <div className="relative">
            <Bell className="h-5 w-5 text-slate-700" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-white" />
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/86 px-3 py-2 shadow-sm">
            <div className="blue-gradient grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold text-white">
              OGV
            </div>
            <span className="text-sm font-semibold text-slate-700">OGV 风控 / Demo Mode</span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
        </header>

        <div className="px-8 pb-10">{children}</div>
      </main>
    </div>
  );
}
