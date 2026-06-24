import { ArrowRightLeft } from "lucide-react";

import { StatusBadge } from "@/components/ui";

const departments = ["大会员", "课堂业务", "短内容", "动画", "影娱", "纪录片"];

export default function MigratePage() {
  return (
    <div className="space-y-6">
      <section className="frosted-card rounded-[28px] p-10">
        <StatusBadge>可迁移能力</StatusBadge>
        <h1 className="mt-5 text-4xl font-bold text-slate-950">迁移能力</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          OGV 风控是首个样板。底层“记忆写入 → AI 结构化 → 图谱沉淀 → Agent 调用”框架可迁移到其他部门。
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {departments.map((department) => (
          <div key={department} className="frosted-card rounded-2xl p-6">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <ArrowRightLeft className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-950">{department}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              复用风险记忆写入、结构化抽取和知识图谱组织能力。
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
