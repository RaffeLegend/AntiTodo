"use client";

import type { EvaluateResponse } from "@/lib/types";
import Link from "next/link";

const DAY_TYPE_ZH: Record<string, string> = {
  work: "工作日（效率/决策）",
  social: "社交日（沟通/情绪）",
  recovery: "养生日（身体/恢复）",
};

export default function ResultCard({ result }: { result: EvaluateResponse }) {
  return (
    <div className="card">
      <h1 className="h1">今日结论</h1>
      <div className="row" style={{ alignItems: "center" }}>
        <span className="badge">{DAY_TYPE_ZH[result.day_type] ?? result.day_type}</span>
        <span className="muted">（你也可以把规则改得更严格/更个性化）</span>
      </div>

      {result.notes?.length > 0 && (
        <>
          <div className="hr" />
          <div style={{ fontWeight: 700, marginBottom: 6 }}>备注</div>
          <ul>
            {result.notes.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </>
      )}

      <div className="hr" />

      <div className="row" style={{ alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>适合做</div>
          <ul>
            {result.do.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>不宜做</div>
          <ul>
            {result.dont.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      </div>

      <div className="hr" />

      <div className="row">
        <Link className="btn2" href="/quiz">再测一次</Link>
        <Link className="btn" href="/">返回首页</Link>
      </div>
    </div>
  );
}