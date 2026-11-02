"use client";

import { BookOpen, CheckCircle2, Database, Loader2, MessageSquare, Send, Sparkles } from "lucide-react";
import { useState } from "react";

import { cn, StatusBadge } from "@/components/ui";
import { askDemoAgent } from "@/lib/static-store";
import type { AgentAskResponse, RiskGraphDB } from "@/types/riskgraph";

const presetQuestions = [
  "评论标签判定时，应该先检查哪些风险？",
  "如果评论里出现谐音或隐晦表达，应该怎么判断？",
  "内容负面和轻度吐槽怎么区分？",
  "平台保护相关评论有哪些命中信号？"
];

const defaultAnswer: AgentAskResponse = {
  answer:
    "当前已接入本地 OGV 评论评审演示语料。你可以直接提问标签判定、谐音识别、内容负面边界或平台保护规则，系统会检索本地记忆并返回引用和命中关系。",
  citedMemories: [],
  matchedRelations: [],
  confidence: "medium",
  nextActions: ["选择一个预设问题", "或输入评论评审相关问题", "查看引用案例和命中关系"],
  usedFallback: true
};

function confidenceLabel(confidence: AgentAskResponse["confidence"]) {
  if (confidence === "high") return "引用较多";
  if (confidence === "low") return "引用较少";
  return "引用有限";
}

export function AgentWorkspace({ db }: { db: RiskGraphDB }) {
  const memories = db.memories;
  const [agentType, setAgentType] = useState<"department" | "personal">("department");
  const [question, setQuestion] = useState(presetQuestions[0]);
  const [answer, setAnswer] = useState<AgentAskResponse>(defaultAnswer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(nextQuestion = question) {
    const trimmed = nextQuestion.trim();
    if (!trimmed) return;

    setQuestion(trimmed);
    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      setAnswer(askDemoAgent(db, trimmed, agentType));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Agent 问答失败";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)] 2xl:grid-cols-[220px_minmax(0,1fr)_300px]">
      <aside className="space-y-5">
        <div className="frosted-card rounded-2xl p-4">
          {[
            ["department", "部门知识库 Agent", "共享规则与案例"],
            ["personal", "我的个人经验 Agent", "个人沉淀优先"]
          ].map(([value, title, desc]) => {
            const active = agentType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setAgentType(value as "department" | "personal")}
                className={cn(
                  "mb-3 w-full rounded-xl px-4 py-3 text-left text-sm transition last:mb-0",
                  active
                    ? "blue-gradient text-white shadow-card"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
                )}
              >
                <div className="font-bold">{title}</div>
                <div className={cn("mt-1 text-xs", active ? "text-blue-50" : "text-slate-400")}>{desc}</div>
              </button>
            );
          })}
        </div>

        <div className="frosted-card rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-950">可检索记忆</h2>
            <StatusBadge>{memories.length} 条</StatusBadge>
          </div>
          <div className="space-y-3">
            {memories.slice(0, 5).map((memory) => (
              <div key={memory.id} className="rounded-xl border border-slate-100 bg-white/80 p-3">
                <div className="truncate text-sm font-bold text-slate-800">{memory.title}</div>
                <div className="mt-1 text-xs text-slate-500">{memory.riskType}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="frosted-card rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">双层记忆问答</h2>
            <p className="mt-1 text-sm text-slate-500">检索演示记忆并展示规则模拟回答与引用依据</p>
          </div>
          {answer.usedFallback ? <StatusBadge tone="purple">规则模拟回答</StatusBadge> : <StatusBadge tone="green">模型增强</StatusBadge>}
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-500">
            <MessageSquare className="h-4 w-4" />
            预设问题
          </div>
          <div className="flex flex-wrap gap-2">
            {presetQuestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => ask(item)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-2 text-sm font-bold text-slate-500">问题</div>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="输入评论评审、标签判定、谐音识别、边界样本等问题..."
          />
          <button
            type="button"
            disabled={loading || !question.trim()}
            onClick={() => ask()}
            className="blue-gradient mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white shadow-card disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            询问 Agent
          </button>
        </div>

        {error ? <div className="mt-4 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm text-pink-600">{error}</div> : null}

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3 text-sm font-bold text-violet-600">
            <Sparkles className="h-5 w-5" />
            Agent 回答
            <StatusBadge tone={answer.confidence === "high" ? "green" : answer.confidence === "low" ? "pink" : "blue"}>
              {confidenceLabel(answer.confidence)}
            </StatusBadge>
          </div>
          <p className="text-sm leading-7 text-slate-700">{answer.answer}</p>
        </div>
      </main>

      <aside className="space-y-5 xl:col-span-2 xl:grid xl:grid-cols-2 xl:gap-5 xl:space-y-0 2xl:col-span-1 2xl:block 2xl:space-y-5">
        <div className="frosted-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-950">引用记忆</h2>
          </div>
          <div className="space-y-3">
            {answer.citedMemories.length > 0 ? (
              answer.citedMemories.map((memory) => (
                <div key={memory.id} className="rounded-xl border border-slate-100 bg-white/80 p-3">
                  <div className="text-sm font-bold text-slate-800">{memory.title}</div>
                  <div className="mt-1 text-xs font-semibold text-blue-600">{memory.riskType}</div>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">{memory.summary}</p>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">暂无引用，提问后显示。</div>
            )}
          </div>
        </div>

        <div className="frosted-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-950">命中关系</h2>
          </div>
          <div className="space-y-3">
            {answer.matchedRelations.slice(0, 5).map((relation) => (
              <div key={relation.id} className="rounded-xl border border-slate-100 bg-white/80 p-3 text-xs">
                <div className="font-bold text-slate-800">{relation.source}</div>
                <div className="my-2 inline-flex rounded-lg bg-violet-50 px-2 py-1 font-bold text-violet-600">{relation.relation}</div>
                <div className="font-semibold text-slate-600">{relation.target}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="frosted-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h2 className="font-bold text-slate-950">下一步动作</h2>
          </div>
          <div className="space-y-2">
            {answer.nextActions.map((action) => (
              <div key={action} className="flex gap-2 text-sm text-slate-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
