import type { GraphRelation, RiskGraphDB, RiskMemory } from "@/types/riskgraph";

const keywordGroups = [
  ["权益", "口径", "会员", "优惠券", "积分", "礼包", "领取", "发放"],
  ["评论", "标签", "标注", "审核", "判定", "稿件", "弹幕"],
  ["引战", "涉政", "键政", "地域", "粉丝", "对立"],
  ["低俗", "色情", "谐音", "隐晦", "符号"],
  ["平台", "锁分", "评分", "删改", "推送", "封面", "大会员"],
  ["缓存", "客服", "FAQ", "投诉", "工单"],
  ["盗版", "侵权", "广告", "引流", "兼职"]
];

const fallbackKeywords = keywordGroups.flat();

export interface RetrievedContext {
  memories: RiskMemory[];
  relations: GraphRelation[];
}

function memoryText(memory: RiskMemory): string {
  return [
    memory.title,
    memory.summary,
    memory.riskType,
    memory.scene,
    memory.triggerSignal,
    memory.rootCause,
    memory.rawText,
    ...memory.tags,
    ...memory.decisionBasis,
    ...memory.solutionPath,
    ...memory.preventionChecklist,
    ...memory.relatedModules
  ]
    .join(" ")
    .toLowerCase();
}

function extractKeywords(question: string): string[] {
  const normalized = question.toLowerCase();
  const matched = fallbackKeywords.filter((keyword) => normalized.includes(keyword.toLowerCase()));

  if (matched.length > 0) {
    return matched;
  }

  return question
    .split(/[\s,，。？?、；;：:（）()]+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2);
}

function scoreMemory(memory: RiskMemory, keywords: string[], question: string): number {
  const text = memoryText(memory);
  const normalizedQuestion = question.toLowerCase();
  let score = 0;

  for (const keyword of keywords) {
    const normalizedKeyword = keyword.toLowerCase();
    if (text.includes(normalizedKeyword)) score += 3;
    if (memory.title.toLowerCase().includes(normalizedKeyword)) score += 2;
    if (memory.riskType.toLowerCase().includes(normalizedKeyword)) score += 2;
    if (memory.tags.some((tag) => tag.toLowerCase().includes(normalizedKeyword))) score += 2;
  }

  if ((normalizedQuestion.includes("评论") || normalizedQuestion.includes("标签")) && text.includes("评论")) score += 5;
  if ((normalizedQuestion.includes("权益") || normalizedQuestion.includes("口径")) && text.includes("权益")) score += 5;
  if ((normalizedQuestion.includes("谐音") || normalizedQuestion.includes("隐晦")) && text.includes("谐音")) score += 5;
  if ((normalizedQuestion.includes("平台") || normalizedQuestion.includes("删改")) && text.includes("平台")) score += 4;

  return score;
}

export function retrieveRelevantContext(
  db: RiskGraphDB,
  question: string,
  agentType: "department" | "personal"
): RetrievedContext {
  const scoped = db.memories.filter((memory) =>
    agentType === "personal" ? memory.scope === "personal" : memory.scope === "department"
  );
  const candidates = scoped.length > 0 ? scoped : db.memories;
  const keywords = extractKeywords(question);
  const ranked = candidates
    .map((memory) => ({ memory, score: scoreMemory(memory, keywords, question) }))
    .sort((left, right) => right.score - left.score);

  const memories = ranked.some((item) => item.score > 0)
    ? ranked.filter((item) => item.score > 0).slice(0, 3).map((item) => item.memory)
    : candidates.slice(0, 3);

  const memoryIds = new Set(memories.map((memory) => memory.id));
  const relations = db.relations.filter((relation) => memoryIds.has(relation.memoryId)).slice(0, 12);

  return { memories, relations };
}
