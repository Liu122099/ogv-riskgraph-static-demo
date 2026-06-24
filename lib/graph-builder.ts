import type { Edge, Node } from "@xyflow/react";

import type { GraphRelation } from "@/types/riskgraph";

type GraphNodeData = {
  label: string;
  category: string;
  relationCount: number;
};

type GraphEdgeData = {
  evidenceText: string;
};

const nodePalette: Record<string, { border: string; bg: string; fg: string }> = {
  risk_event: { border: "#2563eb", bg: "#eff6ff", fg: "#1d4ed8" },
  risk_type: { border: "#ec4899", bg: "#fdf2f8", fg: "#db2777" },
  rule: { border: "#0d9488", bg: "#f0fdfa", fg: "#0f766e" },
  root_cause: { border: "#7c3aed", bg: "#f5f3ff", fg: "#6d28d9" },
  system_module: { border: "#0284c7", bg: "#f0f9ff", fg: "#0369a1" },
  action: { border: "#10b981", bg: "#ecfdf5", fg: "#047857" },
  evidence: { border: "#64748b", bg: "#f8fafc", fg: "#475569" }
};

function nodeId(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u4e00-\u9fa5\w-]/g, "");
}

function classifyNode(label: string): string {
  if (/风险|案例|总览|SOP|规则库/.test(label)) return "risk_event";
  if (/标签|引战|低俗|平台保护|内容负面|盗版|广告|大会员/.test(label)) return "risk_type";
  if (/规则|Checklist|矩阵|边界|SOP/.test(label)) return "rule";
  if (/根因|谐音|隐晦|上下文|误判/.test(label)) return "root_cause";
  if (/系统|平台|模型|标注/.test(label)) return "system_module";
  if (/检查|输出|复核|识别|判定/.test(label)) return "action";
  return "evidence";
}

function positionFor(index: number, total: number): { x: number; y: number } {
  if (index === 0) return { x: 360, y: 260 };

  const radiusX = 320;
  const radiusY = 225;
  const angle = ((index - 1) / Math.max(1, total - 1)) * Math.PI * 2 - Math.PI / 2;

  return {
    x: 360 + Math.cos(angle) * radiusX,
    y: 260 + Math.sin(angle) * radiusY
  };
}

export function buildReactFlowGraph(relations: GraphRelation[]): {
  nodes: Array<Node<GraphNodeData>>;
  edges: Array<Edge<GraphEdgeData>>;
} {
  const labels: string[] = [];
  const relationCount = new Map<string, number>();

  for (const relation of relations) {
    for (const label of [relation.source, relation.target]) {
      if (!labels.includes(label)) labels.push(label);
      relationCount.set(label, (relationCount.get(label) || 0) + 1);
    }
  }

  const nodes: Array<Node<GraphNodeData>> = labels.map((label, index) => {
    const category = classifyNode(label);
    const palette = nodePalette[category] || nodePalette.evidence;

    return {
      id: nodeId(label),
      position: positionFor(index, labels.length),
      data: {
        label,
        category,
        relationCount: relationCount.get(label) || 1
      },
      style: {
        border: `1px solid ${palette.border}`,
        background: palette.bg,
        color: palette.fg,
        borderRadius: 999,
        boxShadow: `0 14px 32px ${palette.border}22`,
        fontSize: 12,
        fontWeight: 700,
        padding: "10px 14px",
        minWidth: Math.min(230, Math.max(120, label.length * 14))
      }
    };
  });

  const edges: Array<Edge<GraphEdgeData>> = relations.map((relation, index) => ({
    id: relation.id || `edge-${index}`,
    source: nodeId(relation.source),
    target: nodeId(relation.target),
    label: relation.relation,
    animated: index % 2 === 0,
    data: { evidenceText: relation.evidenceText },
    style: { stroke: "#94a3b8", strokeWidth: 1.8 },
    labelStyle: { fill: "#475569", fontSize: 11, fontWeight: 700 },
    labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 }
  }));

  return { nodes, edges };
}
