"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

import { AgentWorkspace } from "@/components/AgentWorkspace";
import { StatusBadge } from "@/components/ui";
import { useDemoDB } from "@/lib/static-store";

export default function AgentPage() {
  const db = useDemoDB();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <StatusBadge tone="green">Agent 已接入</StatusBadge>
          <h1 className="mt-5 text-4xl font-bold text-slate-950">双层 Agent</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
            由部门知识库与个人经验双层记忆驱动。当前使用 OGV 评论评审演示语料跑通“检索证据 → 生成回答 → 返回引用”的演示闭环。
          </p>
        </div>
        <Link
          href="/memory/new"
          className="blue-gradient inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-card"
        >
          <Plus className="h-4 w-4" />
          写入可问答记忆
        </Link>
      </div>

      <AgentWorkspace db={db} />
    </div>
  );
}
