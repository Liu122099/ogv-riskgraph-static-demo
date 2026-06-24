"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Layers,
  Network,
  PenLine,
  Plus,
  Search,
  ShieldCheck,
  Target
} from "lucide-react";
import Link from "next/link";

import { SectionTitle, StatusBadge } from "@/components/ui";
import { useDemoDB } from "@/lib/static-store";
import type { RiskMemory } from "@/types/riskgraph";

const defaultRecent = [
  {
    title: "评论标签判定规则总览",
    date: "2026-06-23 14:30",
    owner: "演示语料导入"
  },
  {
    title: "谐音与隐晦表达识别规则",
    date: "2026-06-23 14:31",
    owner: "演示语料导入"
  },
  {
    title: "OGV 专题权益口径风险案例",
    date: "2026-06-23 14:32",
    owner: "风控复盘"
  }
];

function countByType(memories: RiskMemory[], type: RiskMemory["memoryType"]) {
  return memories.filter((memory) => memory.memoryType === type).length;
}

function formatMemoryDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "刚刚";
  }

  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function DashboardPage() {
  const db = useDemoDB();
  const hasData = db.memories.length > 0;
  const totalMemories = hasData ? db.memories.length : 36;
  const rules = hasData ? countByType(db.memories, "rule") : 18;
  const personal = hasData ? countByType(db.memories, "personal_experience") : 12;
  const hitRate = hasData ? Math.min(96, 82 + db.memories.length) : 82;
  const recent = hasData
    ? db.memories.slice(0, 3).map((memory) => ({
        title: memory.title,
        date: formatMemoryDate(memory.createdAt),
        owner: memory.createdBy
      }))
    : defaultRecent;

  const stats = [
    {
      label: "已沉淀风险记忆",
      value: totalMemories,
      unit: "条",
      delta: hasData ? `+${totalMemories}` : "+8",
      icon: FileText,
      tone: "blue"
    },
    {
      label: "处置规则记忆",
      value: rules,
      unit: "条",
      delta: hasData ? `+${rules}` : "+3",
      icon: BookOpen,
      tone: "purple"
    },
    {
      label: "个人经验记忆",
      value: personal,
      unit: "条",
      delta: hasData ? `+${personal}` : "+2",
      icon: Search,
      tone: "pink"
    },
    {
      label: "相似案例命中率",
      value: hitRate,
      unit: "%",
      delta: hasData ? "+实时" : "+6%",
      icon: Target,
      tone: "blue"
    }
  ];

  return (
    <div className="space-y-6">
      <section className="frosted-card relative overflow-hidden rounded-[28px] p-11">
        <div className="absolute inset-y-0 right-0 w-[48%] bg-gradient-to-br from-blue-50 via-violet-50 to-pink-100" />
        <div className="absolute right-24 top-12 h-80 w-80 rounded-full border border-blue-200/60" />
        <div className="absolute right-12 top-20 h-96 w-96 rounded-full border border-violet-200/70" />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <SectionTitle
              eyebrow="双层记忆驱动的风控智能体"
              title="OGV 风控专属记忆智能体"
              description="将分散的经验转化为可复用的组织智能。通过双层记忆与图谱组织，让风控团队的每一次处置都有迹可循，每一次判断都有据可依。"
            />

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/memory/new"
                className="blue-gradient inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                写入新记忆
              </Link>
              <Link
                href="/agent"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
              >
                <Layers className="h-4 w-4" />
                进入部门 Agent
              </Link>
              <Link
                href="/graph"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
              >
                <Network className="h-4 w-4" />
                查看风险图谱
              </Link>
            </div>
          </div>

          <div className="relative hidden min-h-64 items-center justify-center lg:flex">
            <div className="absolute h-48 w-72 rounded-full bg-pink-200/30 blur-3xl" />
            <div className="absolute h-48 w-48 rounded-full bg-blue-300/30 blur-3xl" />
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="absolute h-24 w-36 rounded-3xl border border-white/60 bg-gradient-to-br from-blue-200/90 to-violet-400/80 shadow-soft"
                style={{
                  transform: `translateY(${index * 34 - 30}px) rotateX(58deg) rotateZ(-36deg)`,
                  opacity: 1 - index * 0.12
                }}
              />
            ))}
            <div className="absolute left-10 top-20 h-3 w-3 rounded-full bg-blue-400" />
            <div className="absolute bottom-16 right-16 h-3 w-3 rounded-full bg-violet-500" />
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const ring =
            stat.tone === "purple"
              ? "bg-violet-100 text-violet-600"
              : stat.tone === "pink"
                ? "bg-pink-100 text-pink-500"
                : "bg-blue-100 text-blue-600";

          return (
            <div key={stat.label} className="frosted-card rounded-2xl p-6">
              <div className="flex items-center gap-5">
                <div className={`grid h-16 w-16 place-items-center rounded-full ${ring}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-500">{stat.label}</div>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-4xl font-bold text-slate-950">{stat.value}</span>
                    <span className="pb-1 text-sm text-slate-500">{stat.unit}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    较上周 <span className="font-semibold text-blue-600">{stat.delta}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_1.4fr_1.1fr]">
        <div className="frosted-card rounded-2xl p-5">
          <div className="mb-5 text-base font-bold text-slate-950">核心能力</div>
          {[
            {
              title: "记忆写入",
              desc: "结构化沉淀风险案例、处置过程与经验要点。",
              icon: PenLine,
              tone: "from-blue-600 to-sky-400",
              href: "/memory/new"
            },
            {
              title: "图谱组织",
              desc: "以风险事件、根因、规则与处置策略构建可视知识图谱。",
              icon: Network,
              tone: "from-violet-600 to-purple-400",
              href: "/graph"
            },
            {
              title: "带引用问答",
              desc: "基于双层记忆回答问题，并给出引用案例和关系证据。",
              icon: ShieldCheck,
              tone: "from-pink-500 to-rose-400",
              href: "/agent"
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="mb-3 flex items-center gap-4 rounded-xl border border-slate-200 bg-white/80 p-4 transition hover:border-blue-200 hover:shadow-card"
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${item.tone} text-white shadow-card`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-950">{item.title}</div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            );
          })}
        </div>

        <div className="frosted-card rounded-2xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-base font-bold text-slate-950">知识图谱预览</div>
              <div className="mt-1 text-xs text-slate-400">规则、标签、证据与处置动作的关联</div>
            </div>
            <StatusBadge>规则关系</StatusBadge>
          </div>
          <div className="relative h-80 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-blue-50/45 to-violet-50/70">
            <div className="absolute inset-5 rounded-[28px] border border-dashed border-blue-200/80" />
            <div className="absolute -left-12 -top-16 h-44 w-44 rounded-full bg-blue-200/35 blur-3xl" />
            <div className="absolute -bottom-14 right-0 h-44 w-44 rounded-full bg-pink-200/35 blur-3xl" />

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 320" aria-hidden="true">
              <defs>
                <marker id="dashboard-graph-arrow" markerHeight="7" markerWidth="7" orient="auto" refX="5.5" refY="3.5">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#60a5fa" />
                </marker>
                <linearGradient id="dashboard-graph-line" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              {[
                { path: "M188 143 C150 104 118 80 82 62", label: "命中标签", x: 122, y: 88 },
                { path: "M232 143 C270 104 304 80 344 66", label: "保护对象", x: 300, y: 88 },
                { path: "M184 166 C136 174 96 198 62 226", label: "识别信号", x: 112, y: 194 },
                { path: "M236 166 C282 176 322 198 354 226", label: "判定边界", x: 306, y: 194 },
                { path: "M210 177 C210 194 210 204 210 213", label: "", x: 210, y: 204 }
              ].map((edge) => (
                <g key={edge.path}>
                  <path
                    d={edge.path}
                    fill="none"
                    markerEnd="url(#dashboard-graph-arrow)"
                    stroke="url(#dashboard-graph-line)"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                  {edge.label ? (
                    <>
                      <rect x={edge.x - 30} y={edge.y - 11} width="60" height="22" rx="11" fill="white" opacity="0.94" />
                      <text fill="#64748b" fontSize="10" fontWeight="600" textAnchor="middle" x={edge.x} y={edge.y + 4}>
                        {edge.label}
                      </text>
                    </>
                  ) : null}
                </g>
              ))}
            </svg>

            <div className="absolute left-1/2 top-[45%] grid h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-blue-600 to-violet-600 text-center text-xs font-bold leading-5 text-white shadow-soft">
              评论评审
              <br />
              规则记忆
            </div>
            {[
              {
                label: "风险标签",
                value: "引战对立",
                klass: "left-12 top-8 bg-pink-50 text-pink-600 border-pink-100"
              },
              {
                label: "保护对象",
                value: "平台机制",
                klass: "right-8 top-10 bg-blue-50 text-blue-600 border-blue-100"
              },
              {
                label: "触发信号",
                value: "谐音隐晦",
                klass: "left-6 bottom-[72px] bg-sky-50 text-sky-600 border-sky-100"
              },
              {
                label: "判定边界",
                value: "内容负面",
                klass: "right-8 bottom-[72px] bg-violet-50 text-violet-600 border-violet-100"
              },
              {
                label: "处置动作",
                value: "人工复核",
                klass: "left-1/2 bottom-[58px] -translate-x-1/2 bg-emerald-50 text-emerald-600 border-emerald-100"
              }
            ].map((node) => (
              <div
                key={node.value}
                className={`absolute min-w-[84px] rounded-2xl border bg-white/95 px-3 py-2 text-center shadow-sm backdrop-blur ${node.klass}`}
              >
                <div className="text-[10px] font-semibold opacity-60">{node.label}</div>
                <div className="mt-0.5 text-xs font-bold">{node.value}</div>
              </div>
            ))}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between rounded-full border border-white/80 bg-white/75 px-4 py-2 text-[10px] font-semibold text-slate-500 shadow-sm backdrop-blur">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                规则记忆
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-pink-500" />
                风险标签
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                处置动作
              </span>
            </div>
          </div>
        </div>

        <div className="frosted-card rounded-2xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <div className="text-base font-bold text-slate-950">Agent 答案预览</div>
            <Link href="/agent" className="text-sm font-semibold text-blue-600">
              查看全部
            </Link>
          </div>
          <div className="rounded-xl border border-slate-200 bg-blue-50/40 p-4">
            <div className="mb-3 inline-flex rounded-lg bg-blue-100 px-2 py-1 text-xs font-bold text-blue-600">
              Q
            </div>
            <p className="text-sm font-semibold text-slate-700">
              评论标签判定时，应该先检查哪些风险？
            </p>
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 inline-flex rounded-lg bg-violet-100 px-2 py-1 text-xs font-bold text-violet-600">
              A
            </div>
            <p className="text-sm leading-6 text-slate-600">
              建议先读取稿件标题、简介、分类和评论上下文，再检查引战对立、平台保护、色情低俗、盗版侵权、广告引流和内容负面等标签。
            </p>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="text-xs font-bold text-slate-500">引用来源（共 3 条）</div>
              <div className="mt-2 space-y-2 text-xs text-slate-500">
                <div>评论标签判定规则总览</div>
                <div>谐音与隐晦表达识别规则</div>
                <div>评论标注 SOP 与典型案例</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="frosted-card rounded-2xl p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="text-base font-bold text-slate-950">最近写入</div>
          <Link href="/memory/new" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
            继续写入 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {recent.map((item, index) => (
            <div key={item.title} className="flex items-center gap-4 rounded-xl bg-white/75 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-50 text-pink-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-800">{item.title}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {item.date} · {item.owner || `记录人 ${index + 1}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
