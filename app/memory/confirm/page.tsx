"use client";

import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Box,
  CheckCircle2,
  CloudUpload,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { StatusBadge } from "@/components/ui";
import { saveDemoBundle } from "@/lib/static-store";
import type { MemoryScope, StructuredMemoryBundle } from "@/types/riskgraph";

const storageKey = "ogv-riskgraph-structured";

export default function ConfirmMemoryPage() {
  const router = useRouter();
  const [bundle, setBundle] = useState<StructuredMemoryBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem(storageKey);

    if (!raw) {
      return;
    }

    try {
      setBundle(JSON.parse(raw) as StructuredMemoryBundle);
    } catch {
      sessionStorage.removeItem(storageKey);
    }
  }, []);

  async function handleSave(scope: MemoryScope) {
    if (!bundle) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      saveDemoBundle(bundle, scope);
      sessionStorage.removeItem(storageKey);
      router.push("/graph");
    } catch (err) {
      const message = err instanceof Error ? err.message : "保存失败";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!bundle) {
    return (
      <div className="frosted-card mx-auto mt-24 max-w-2xl rounded-3xl p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-slate-950">暂无结构化结果</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          请先在记忆写入中心输入案例并生成结构化演示，再回到确认页保存。
        </p>
        <Link
          href="/memory/new"
          className="blue-gradient mt-8 inline-flex rounded-xl px-6 py-3 text-sm font-bold text-white shadow-card"
        >
          返回记忆写入
        </Link>
      </div>
    );
  }

  const memory = bundle.memory;
  const filledFields = [memory.title, memory.summary, memory.riskType, memory.scene, memory.triggerSignal, memory.rootCause, memory.decisionBasis.length, memory.solutionPath.length, memory.preventionChecklist.length, memory.tags.length].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/memory/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          返回记忆列表
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <h1 className="text-4xl font-bold text-slate-950">结构化结果确认</h1>
          <StatusBadge tone="green">已完成解析</StatusBadge>
          {bundle.usedFallback ? <StatusBadge tone="purple">规则模拟</StatusBadge> : null}
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          请核对模板生成的演示字段。保存只发生在当前浏览器，可返回修改原文后重新生成，不会提交给团队。
        </p>
      </div>

      <section className="grid gap-5 xl:grid-cols-[1fr_220px_260px]">
        <div className="frosted-card rounded-2xl p-6">
          <div className="flex items-center gap-5">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-violet-50 text-violet-600">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">
                {memory.memoryType === "risk_case"
                  ? "风险案例"
                  : memory.memoryType === "rule"
                    ? "处置规则"
                    : "个人经验"}
              </div>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">{memory.title}</h2>
            </div>
          </div>
          <div className="mt-7 grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-4">
            {[
              ["记忆编号", memory.id.slice(0, 18)],
              ["提交时间", new Date(memory.createdAt).toLocaleString("zh-CN")],
              ["来源", bundle.usedFallback ? "本地结构化模板" : "AI 结构化"],
              ["提交人", memory.createdBy]
            ].map(([key, value]) => (
              <div key={key}>
                <div className="text-xs font-semibold text-slate-400">{key}</div>
                <div className="mt-2 text-sm font-bold text-slate-700">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="frosted-card rounded-2xl p-6">
          <div className="text-sm font-semibold text-slate-500">结构字段覆盖</div>
          <div className="mt-4 flex items-end gap-1">
            <span className="text-4xl font-bold text-slate-950">{filledFields}</span>
            <span className="pb-1 text-sm text-slate-500">/10</span>
          </div>
          <div className="mt-4 h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-500"
              style={{ width: `${filledFields * 10}%` }}
            />
          </div>
          <div className="mt-4 text-sm text-slate-500">已填字段数量，不代表内容准确性</div>
        </div>

        <div className="frosted-card rounded-2xl p-6">
          <div className="text-sm font-semibold text-slate-500">生成方式</div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-4xl font-bold text-slate-950">模板</div>
            <ShieldCheck className="h-14 w-14 text-emerald-500" />
          </div>
          <div className="mt-5 text-sm text-slate-500">固定规则模拟，需人工核对</div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr_480px]">
        <div className="grid gap-5">
          <InfoCard
            icon={<AlertTriangle className="h-6 w-6" />}
            title="风险类型"
            tone="violet"
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {[memory.riskType, ...memory.tags.slice(0, 2)].map((tag) => (
                <StatusBadge key={tag} tone="purple">
                  {tag}
                </StatusBadge>
              ))}
            </div>
            <p>{memory.summary}</p>
          </InfoCard>

          <InfoCard icon={<BookOpen className="h-6 w-6" />} title="判断依据" tone="blue">
            <BulletList items={memory.decisionBasis} />
          </InfoCard>

          <InfoCard icon={<CheckCircle2 className="h-6 w-6" />} title="预防 Checklist" tone="green">
            <BulletList items={memory.preventionChecklist} checked />
          </InfoCard>
        </div>

        <div className="grid gap-5">
          <InfoCard icon={<Target className="h-6 w-6" />} title="触发信号" tone="pink">
            <BulletList items={memory.triggerSignal.split("、").filter(Boolean)} />
          </InfoCard>

          <InfoCard icon={<Sparkles className="h-6 w-6" />} title="根因" tone="pink">
            <BulletList items={memory.rootCause.split("，").filter(Boolean)} />
          </InfoCard>

          <InfoCard icon={<Box className="h-6 w-6" />} title="关联模块" tone="violet">
            <div className="flex flex-wrap gap-2">
              {memory.relatedModules.map((moduleName) => (
                <span
                  key={moduleName}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  {moduleName}
                </span>
              ))}
            </div>
          </InfoCard>
        </div>

        <div className="space-y-5">
          <div className="frosted-card rounded-2xl p-6">
            <h2 className="mb-5 text-lg font-bold text-slate-950">处置路径</h2>
            <div className="space-y-4">
              {memory.solutionPath.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    {index < memory.solutionPath.length - 1 ? (
                      <span className="h-10 w-px bg-blue-200" />
                    ) : null}
                  </div>
                  <div className="flex-1 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="frosted-card rounded-2xl p-6">
            <h2 className="mb-5 text-lg font-bold text-slate-950">建议图谱关系</h2>
            <div className="space-y-3">
              {bundle.relations.slice(0, 6).map((relation) => (
                <div
                  key={relation.id}
                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-slate-100 bg-white/75 p-3 text-xs"
                >
                  <span className="truncate rounded-lg bg-blue-50 px-2 py-1 font-semibold text-blue-600">
                    {relation.source}
                  </span>
                  <span className="font-bold text-slate-400">{relation.relation}</span>
                  <span className="truncate rounded-lg bg-pink-50 px-2 py-1 font-semibold text-pink-500">
                    {relation.target}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm text-pink-600">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSave("personal")}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:border-blue-200 hover:text-blue-600 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
          保存到个人经验层
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSave("department")}
          className="blue-gradient inline-flex h-14 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
          保存到部门知识层
        </button>
        <Link
          href="/memory/new"
          className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:border-blue-200 hover:text-blue-600"
        >
          <RefreshCw className="h-4 w-4" />
          重新生成
        </Link>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  tone,
  children
}: {
  icon: React.ReactNode;
  title: string;
  tone: "blue" | "green" | "pink" | "violet";
  children: React.ReactNode;
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    pink: "bg-pink-50 text-pink-500",
    violet: "bg-violet-50 text-violet-600"
  };

  return (
    <div className="frosted-card rounded-2xl p-6">
      <div className="mb-5 flex items-center gap-4">
        <div className={`grid h-12 w-12 place-items-center rounded-full ${tones[tone]}`}>{icon}</div>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>
      <div className="text-sm leading-7 text-slate-600">{children}</div>
    </div>
  );
}

function BulletList({ items, checked = false }: { items: string[]; checked?: boolean }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          {checked ? (
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
          ) : (
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
