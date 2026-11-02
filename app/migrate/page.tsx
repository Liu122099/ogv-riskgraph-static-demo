import { ArrowRightLeft } from "lucide-react";

import { StatusBadge } from "@/components/ui";

const departments = ["大会员", "课堂业务", "短内容", "动画", "影娱", "纪录片"];

export default function MigratePage() {
  return (
    <div className="space-y-6">
      <section className="frosted-card rounded-[28px] p-10">
        <StatusBadge>拓展方向 · 方案设想</StatusBadge>
        <h1 className="mt-5 text-4xl font-bold text-slate-950">拓展方向</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          以下是产品流程的潜在应用方向，尚未验证或接入这些业务。当前仅演示记忆写入、结构化确认、图谱组织与证据问答。
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
              可探索复用记忆写入、结构化抽取和知识图谱组织流程；不代表已部署。
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
