"use client";

import { useEffect, useState } from "react";

import demoData from "@/data/riskgraph-db.json";
import { createId } from "@/lib/id";
import { retrieveRelevantContext } from "@/lib/retrieval";
import type {
  AgentAskResponse,
  MemoryScope,
  MemoryType,
  RiskGraphDB,
  StructuredMemoryBundle
} from "@/types/riskgraph";

const STORAGE_KEY = "ogv-riskgraph-static-bundles";
const baseDB = demoData as RiskGraphDB;

function readStoredBundles(): StructuredMemoryBundle[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StructuredMemoryBundle[]) : [];
  } catch {
    return [];
  }
}

export function getDemoDB(): RiskGraphDB {
  const bundles = readStoredBundles();

  return {
    memories: [...bundles.map((bundle) => bundle.memory), ...baseDB.memories],
    entities: [...bundles.flatMap((bundle) => bundle.entities), ...baseDB.entities],
    relations: [...bundles.flatMap((bundle) => bundle.relations), ...baseDB.relations],
    qaLogs: baseDB.qaLogs
  };
}

export function useDemoDB(): RiskGraphDB {
  const [db, setDB] = useState<RiskGraphDB>(baseDB);

  useEffect(() => {
    setDB(getDemoDB());
  }, []);

  return db;
}

export function buildDemoStructure(
  rawText: string,
  memoryType: MemoryType,
  scope: MemoryScope
): StructuredMemoryBundle {
  const memoryId = createId("mem");
  const titleMatch = rawText.match(/【(?:规则|案例)?标题】\s*([^\n]+)/);
  const title = titleMatch?.[1]?.trim() || "OGV 评论评审规则演示记忆";

  return {
    memory: {
      id: memoryId,
      title,
      memoryType,
      scope,
      rawText,
      summary:
        "该演示记忆用于说明 OGV 评论评审中风险标签、触发信号、判定依据与人工复核动作的结构化沉淀方式。",
      riskType: memoryType === "risk_case" ? "评论评审案例风险" : "评论评审规则风险",
      scene: "OGV 评论区 / 弹幕抽检 / 人工复核",
      triggerSignal:
        "评论出现群体攻击、隐晦表达、平台机制攻击、盗版引流、广告拉群或极端负面内容。",
      rootCause:
        "评论文本短、语境依赖强，谐音和情绪化表达容易造成误判或漏判。",
      decisionBasis: [
        "结合稿件标题、简介、分区和评论上下文进行判断",
        "命中风险标签时保留对应文本证据",
        "多标签样本同时输出多个标签及理由",
        "低置信度和边界样本进入人工复核"
      ],
      solutionPath: [
        "读取稿件与评论上下文",
        "检查风险标签及隐晦表达",
        "判断表达强度和风险边界",
        "输出标签、证据和复核建议"
      ],
      preventionChecklist: [
        "评审前确认作品基调",
        "边界样本保留判定理由",
        "低置信度样本转人工复核",
        "误判样本回流规则记忆库"
      ],
      relatedModules: ["评论评审台", "标签规则库", "人工复核队列", "样本质检看板"],
      tags: ["评论评审", "标签判定", "风险标签", "人工复核"],
      createdBy: "静态演示用户",
      createdAt: new Date().toISOString(),
      confidenceScore: 88
    },
    entities: [
      {
        id: createId("ent"),
        memoryId,
        name: title,
        type: "rule"
      },
      {
        id: createId("ent"),
        memoryId,
        name: "风险标签",
        type: "risk_type"
      },
      {
        id: createId("ent"),
        memoryId,
        name: "上下文判定",
        type: "root_cause"
      },
      {
        id: createId("ent"),
        memoryId,
        name: "人工复核",
        type: "action"
      }
    ],
    relations: [
      {
        id: createId("rel"),
        memoryId,
        source: title,
        relation: "包含",
        target: "风险标签",
        evidenceText: "评论评审规则包含风险标签定义和命中边界。"
      },
      {
        id: createId("rel"),
        memoryId,
        source: "上下文判定",
        relation: "辅助",
        target: title,
        evidenceText: "评论风险需要结合稿件与上下文判断。"
      },
      {
        id: createId("rel"),
        memoryId,
        source: "边界样本",
        relation: "进入",
        target: "人工复核",
        evidenceText: "低置信度或争议样本进入人工复核。"
      }
    ],
    usedFallback: true
  };
}

export function saveDemoBundle(bundle: StructuredMemoryBundle, scope: MemoryScope): void {
  const stored = readStoredBundles();
  const nextBundle = {
    ...bundle,
    memory: {
      ...bundle.memory,
      scope
    }
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([nextBundle, ...stored].slice(0, 12)));
}

export function askDemoAgent(
  db: RiskGraphDB,
  question: string,
  agentType: "department" | "personal"
): AgentAskResponse {
  const context = retrieveRelevantContext(db, question, agentType);
  const citedMemories = context.memories.map((memory) => ({
    id: memory.id,
    title: memory.title,
    summary: memory.summary,
    riskType: memory.riskType,
    scope: memory.scope
  }));

  let answer =
    "建议先读取稿件标题、简介、分区和评论上下文，再检查风险标签定义、表达强度与判定边界。命中标签时需要保留证据，多标签样本逐项说明，低置信度或争议样本进入人工复核。";

  if (/谐音|隐晦|符号|缩写/.test(question)) {
    answer =
      "谐音和隐晦表达不能只按关键词判断。应先提取异常词、数字、符号和角色梗，再结合稿件内容、角色关系及前后评论确认语义；无法确认时标记低置信度并进入人工复核。";
  } else if (/内容负面|吐槽|负面/.test(question)) {
    answer =
      "内容负面需要区分普通观后感、强烈负面和攻击性表达。普通吐槽不直接判为高风险；出现持续贬损、群体攻击或明显破坏讨论氛围时，再结合上下文提高风险等级。";
  } else if (/平台|保护|评分|审核/.test(question)) {
    answer =
      "平台保护相关判断应关注对审核、评分、运营和会员机制的攻击性表达。正常的问题反馈与机制讨论不直接命中，带有煽动、恶意攻击或集中引战信号时进入风险候选。";
  }

  const basis = citedMemories.slice(0, 2).map((memory) => `《${memory.title}》`).join("、");

  return {
    answer: `${answer}${basis ? ` 本次回答参考了 ${basis}。` : ""}`,
    citedMemories,
    matchedRelations: context.relations.slice(0, 6),
    confidence: citedMemories.length >= 2 ? "high" : "medium",
    nextActions: ["核对评论上下文", "保留标签命中证据", "边界样本进入人工复核"],
    usedFallback: true
  };
}
