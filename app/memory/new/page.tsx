"use client";

import {
  BookOpen,
  CheckCircle2,
  Circle,
  Eye,
  FileText,
  Loader2,
  PenLine,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { cn, StatusBadge } from "@/components/ui";
import { buildDemoStructure } from "@/lib/static-store";
import type { MemoryScope, MemoryType, StructuredMemoryBundle } from "@/types/riskgraph";

const sampleText = `【规则标题】OGV 评论评审风险标签判定规则

【规则背景】
本语料为演示数据。OGV 评论区评审需要识别引战对立、平台保护、色情低俗、盗版侵权、广告引流、大会员负面和内容负面等风险标签，避免高风险评论影响社区氛围与内容口碑。

【适用范围】
适用于 OGV 稿件评论、短评、弹幕抽检和人工复核场景。评审时需结合稿件标题、简介、分区、作品基调和评论上下文，不仅依赖关键词。

【触发信号】
1. 评论中出现地域/性别攻击、粉丝对立、涉政影射或群体攻击；
2. 出现谐音、拆字、数字、符号等隐晦表达，可能指向低俗或引战含义；
3. 评论攻击平台机制、评分、审核、运营或大会员权益；
4. 评论包含盗版资源引流、外部广告、兼职拉群等信息。

【判定依据】
1. 命中任一风险标签定义即可进入风险候选；
2. 多标签评论需同时输出多个标签及证据；
3. 内容负面需区分极端攻击和普通吐槽，普通观后感不应误判；
4. 低置信度样本进入人工复核，不直接作为最终规则沉淀。

【处置措施】
高置信度风险评论进入拦截或复核队列；边界样本进入人工复核；误判样本回流到规则记忆库，定期更新谐音表达、标签边界和典型案例。`;

const memoryTypes: Array<{
  value: MemoryType;
  title: string;
  desc: string;
  icon: React.ElementType;
}> = [
  {
    value: "risk_case",
    title: "风险案例",
    desc: "记录真实发生的风险事件",
    icon: ShieldCheck
  },
  {
    value: "rule",
    title: "处置规则",
    desc: "记录可复用的处置方法",
    icon: BookOpen
  },
  {
    value: "personal_experience",
    title: "个人经验",
    desc: "记录个人经验与心得体会",
    icon: FileText
  }
];

const tagOptions = ["评论评审", "标签判定", "谐音隐晦", "人工复核", "添加标签"];

export default function NewMemoryPage() {
  const router = useRouter();
  const [memoryType, setMemoryType] = useState<MemoryType>("rule");
  const [scope, setScope] = useState<MemoryScope>("department");
  const [rawText, setRawText] = useState(sampleText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requiredProgress = useMemo(() => {
    const hasBackground = rawText.includes("背景") || rawText.includes("场景");
    const hasScope = rawText.includes("适用") || rawText.includes("范围");
    const hasSignal = rawText.includes("触发") || rawText.includes("信号");
    const hasBasis = rawText.includes("判定") || rawText.includes("依据");
    const hasAction = rawText.includes("处置") || rawText.includes("复核");
    const count = [hasBackground, hasScope, hasSignal, hasBasis, hasAction].filter(Boolean).length;

    return {
      count,
      items: [
        ["规则背景", hasBackground],
        ["适用范围", hasScope],
        ["触发信号", hasSignal],
        ["判定依据", hasBasis],
        ["处置复核", hasAction]
      ] as Array<[string, boolean]>
    };
  }, [rawText]);

  async function handleStructure() {
    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 550));
      const data: StructuredMemoryBundle = buildDemoStructure(rawText, memoryType, scope);
      sessionStorage.setItem("ogv-riskgraph-structured", JSON.stringify(data));
      router.push("/memory/confirm");
    } catch (err) {
      const message = err instanceof Error ? err.message : "结构化失败";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-5">
        <div className="blue-gradient grid h-16 w-16 place-items-center rounded-2xl text-white shadow-card">
          <PenLine className="h-8 w-8" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-400">记忆写入 / 记忆写入中心</div>
          <h1 className="mt-5 text-4xl font-bold text-slate-950">记忆写入中心</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
            记录风险案例、处置规则与个人经验，构建结构化风控记忆，驱动更精准的识别与决策。
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="frosted-card rounded-2xl p-6">
          <div className="space-y-7">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-xs text-white">
                  1
                </span>
                记忆类型
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {memoryTypes.map((item) => {
                  const Icon = item.icon;
                  const active = memoryType === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setMemoryType(item.value)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border p-4 text-left transition",
                        active
                          ? "border-blue-500 bg-blue-50/70 shadow-card"
                          : "border-slate-200 bg-white hover:border-blue-200"
                      )}
                    >
                      <div
                        className={cn(
                          "grid h-10 w-10 place-items-center rounded-full",
                          active ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{item.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-xs text-white">
                  2
                </span>
                保存范围
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    value: "personal" as const,
                    title: "仅保存到个人 Agent",
                    desc: "仅自己可见，助力个人决策"
                  },
                  {
                    value: "department" as const,
                    title: "贡献到部门知识库",
                    desc: "审核通过后，团队共享复用"
                  }
                ].map((item) => {
                  const active = scope === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setScope(item.value)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border p-5 text-left transition",
                        active
                          ? "border-blue-500 bg-blue-50/70 shadow-card"
                          : "border-slate-200 bg-white hover:border-blue-200"
                      )}
                    >
                      {active ? (
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300" />
                      )}
                      <div>
                        <div className="font-bold text-slate-800">{item.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-xs text-white">
                    3
                  </span>
                  内容输入
                </div>
                <button
                  type="button"
                  onClick={() => setRawText("")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-pink-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  清空内容
                </button>
              </div>
              <textarea
                value={rawText}
                onChange={(event) => setRawText(event.target.value)}
                className="h-[360px] w-full resize-none rounded-xl border border-blue-200 bg-white/85 p-5 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="输入评论评审规则背景、适用范围、触发信号、判定依据与处置复核流程..."
              />
              <div className="mt-2 text-right text-xs text-slate-400">{rawText.length} / 3000</div>
            </div>

            <div>
              <div className="mb-3 text-xs font-semibold text-slate-500">快速添加标签（可多选）</div>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      tag === "添加标签"
                        ? undefined
                        : setRawText((current) =>
                            current.includes(tag) ? current : `${current}\n\n#${tag}`
                          )
                    }
                    className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:border-blue-300"
                  >
                    {tag === "添加标签" ? <Plus className="inline h-3.5 w-3.5" /> : null}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm text-pink-600">
                {error}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-3">
              <button
                type="button"
                disabled={loading || rawText.trim().length === 0}
                onClick={handleStructure}
                className="blue-gradient inline-flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                AI 结构化记忆
              </button>
              <button
                type="button"
                onClick={() => setRawText(sampleText)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600"
              >
                <RefreshCw className="h-4 w-4" />
                填充示例
              </button>
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600"
              >
                <Eye className="h-4 w-4" />
                预览结构化结果
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="frosted-card rounded-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">写作指引</h2>
              <button className="text-sm font-semibold text-blue-600">收起</button>
            </div>
            {[
              ["客观真实", "基于真实发生的事件，避免主观猜测。"],
              ["结构清晰", "包含事件背景、影响范围、根因、处置与复盘。"],
              ["可复用", "提炼可复用的经验或规则，便于后续检索与触发。"],
              ["合规安全", "避免敏感信息，遵守公司数据安全规范。"]
            ].map(([title, desc]) => (
              <div key={title} className="mb-6 flex gap-4">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">{title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">{desc}</div>
                </div>
              </div>
            ))}
          </section>

          <section className="frosted-card rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">必填要素</h2>
              <StatusBadge tone={requiredProgress.count >= 4 ? "green" : "blue"}>
                {requiredProgress.count}/5
              </StatusBadge>
            </div>
            <div className="space-y-3">
              {requiredProgress.items.map(([label, done]) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className={cn("h-5 w-5", done ? "text-emerald-500" : "text-slate-300")} />
                  <span className={done ? "font-semibold text-slate-700" : "text-slate-500"}>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="frosted-card rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">智能识别 · 预览</h2>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                <RefreshCw className="h-4 w-4" />
                刷新识别
              </span>
            </div>
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white/75 p-5">
              {[
                ["风险类型", "评论评审规则风险"],
                ["业务场景", "OGV 评论区 / 弹幕抽检"],
                ["影响程度", "中"],
                ["涉及系统", "评论审核台、标签规则库"],
                ["触发原因", "隐晦表达、边界样本、上下文缺失"],
                ["处置动作", "拦截、复核、样本回流"]
              ].map(([key, value]) => (
                <div key={key} className="grid grid-cols-[92px_1fr] gap-3 text-sm">
                  <span className="text-slate-400">{key}</span>
                  <span className="font-semibold text-slate-700">{value}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
