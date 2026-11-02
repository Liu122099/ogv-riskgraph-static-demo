"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FileText, GitBranch, Network, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/ui";
import { buildReactFlowGraph } from "@/lib/graph-builder";
import type { GraphRelation, RiskMemory } from "@/types/riskgraph";

type GraphNodeData = {
  label: string;
  category: string;
  relationCount: number;
};

type GraphEdgeData = {
  evidenceText: string;
};

export function GraphExplorer({
  memories,
  relations
}: {
  memories: RiskMemory[];
  relations: GraphRelation[];
}) {
  const graph = useMemo(() => buildReactFlowGraph(relations), [relations]);
  const [selectedNode, setSelectedNode] = useState<Node<GraphNodeData> | null>(graph.nodes[0] || null);
  const [selectedEdge, setSelectedEdge] = useState<Edge<GraphEdgeData> | null>(graph.edges[0] || null);

  const relatedRelations = selectedNode
    ? relations.filter((relation) => relation.source === selectedNode.data.label || relation.target === selectedNode.data.label)
    : relations.slice(0, 4);

  const onNodeClick: NodeMouseHandler<Node<GraphNodeData>> = (_, node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  };

  return (
    <section className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)] 2xl:grid-cols-[240px_minmax(0,1fr)_280px]">
      <aside className="space-y-5">
        <div className="frosted-card rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-950">规则记忆</h2>
            <StatusBadge>{memories.length} 条</StatusBadge>
          </div>
          <div className="space-y-3">
            {memories.slice(0, 6).map((memory) => (
              <div key={memory.id} className="rounded-xl border border-slate-100 bg-white/80 p-3">
                <div className="flex items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-800">{memory.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{memory.riskType}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="frosted-card rounded-2xl p-5">
          <h2 className="font-bold text-slate-950">图谱状态</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span className="text-slate-500">节点</span>
              <span className="font-bold text-slate-900">{graph.nodes.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span className="text-slate-500">关系</span>
              <span className="font-bold text-slate-900">{graph.edges.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span className="text-slate-500">数据源</span>
              <span className="font-bold text-blue-600">本地 JSON</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="frosted-card overflow-hidden rounded-2xl p-0">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <div className="text-sm font-bold text-slate-950">风险知识图谱画布</div>
            <div className="mt-1 text-xs text-slate-500">基于本地 relations 自动生成，当前展示 OGV 评论评审规则图谱</div>
          </div>
          <StatusBadge tone="green">MVP 可交互</StatusBadge>
        </div>
        <div className="h-[640px] w-full bg-gradient-to-br from-white to-slate-50">
          <ReactFlow
            nodes={graph.nodes}
            edges={graph.edges}
            onNodeClick={onNodeClick}
            onEdgeClick={(_, edge) => {
              setSelectedEdge(edge as Edge<GraphEdgeData>);
              setSelectedNode(null);
            }}
            fitView
            minZoom={0.45}
            maxZoom={1.6}
          >
            <Background color="#cbd5e1" gap={24} />
            <MiniMap pannable zoomable nodeStrokeWidth={3} />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      <aside className="space-y-5 xl:col-span-2 xl:grid xl:grid-cols-2 xl:gap-5 xl:space-y-0 2xl:col-span-1 2xl:block 2xl:space-y-5">
        <div className="frosted-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-950">选中节点</h2>
              <div className="text-xs text-slate-500">点击画布节点查看证据</div>
            </div>
          </div>
          {selectedNode ? (
            <div>
              <div className="text-lg font-bold text-slate-950">{selectedNode.data.label}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge tone="purple">{selectedNode.data.category}</StatusBadge>
                <StatusBadge>{selectedNode.data.relationCount} 条关系</StatusBadge>
              </div>
            </div>
          ) : selectedEdge ? (
            <div>
              <div className="text-sm font-bold text-slate-950">{selectedEdge.label}</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{selectedEdge.data?.evidenceText}</p>
            </div>
          ) : null}
        </div>

        <div className="frosted-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <GitBranch className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-950">相关关系</h2>
          </div>
          <div className="space-y-3">
            {relatedRelations.slice(0, 6).map((relation) => (
              <div key={relation.id} className="rounded-xl border border-slate-100 bg-white/80 p-3 text-sm">
                <div className="font-bold text-slate-800">{relation.source}</div>
                <div className="my-2 inline-flex rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                  {relation.relation}
                </div>
                <div className="font-semibold text-slate-600">{relation.target}</div>
                <p className="mt-2 text-xs leading-5 text-slate-500">{relation.evidenceText}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="frosted-card rounded-2xl p-6">
          <div className="mb-3 flex items-center gap-3 text-sm font-bold text-slate-950">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            路演说明
          </div>
          <p className="text-sm leading-6 text-slate-500">
            当前图谱基于演示语料生成，展示规则记忆、风险标签、判定动作与证据之间的关系。
          </p>
        </div>
      </aside>
    </section>
  );
}
