"use client";

import { Network, Plus } from "lucide-react";
import nextDynamic from "next/dynamic";
import Link from "next/link";

import { StatusBadge } from "@/components/ui";
import { useDemoDB } from "@/lib/static-store";

const GraphExplorer = nextDynamic(
  () => import("@/components/GraphExplorer").then((module) => module.GraphExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="frosted-card grid min-h-[640px] place-items-center rounded-2xl p-8 text-sm text-slate-500">
        正在加载图谱画布...
      </div>
    )
  }
);

export default function GraphPage() {
  const db = useDemoDB();

  return (
    <div className="space-y-6">
      <section className="frosted-card rounded-[28px] p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <StatusBadge tone="green">图谱已接入</StatusBadge>
            <h1 className="mt-5 text-4xl font-bold text-slate-950">风险知识图谱</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              基于本地记忆库生成关系图谱。当前已接入 OGV 评论评审演示语料，可展示风险标签、判定依据和处置动作之间的关系。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/agent"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:border-blue-200 hover:text-blue-600"
            >
              <Network className="h-4 w-4" />
              询问 Agent
            </Link>
            <Link
              href="/memory/new"
              className="blue-gradient inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-card"
            >
              <Plus className="h-4 w-4" />
              写入新记忆
            </Link>
          </div>
        </div>
      </section>

      <GraphExplorer memories={db.memories} relations={db.relations} />
    </div>
  );
}
