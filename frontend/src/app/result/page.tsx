"use client";

import { useEffect, useState } from "react";
import type { EvaluateResponse } from "@/lib/types";
import ResultCard from "@/components/ResultCard";
import Link from "next/link";

export default function ResultPage() {
  const [result, setResult] = useState<EvaluateResponse | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("day_compass_result");
    if (raw) setResult(JSON.parse(raw));
  }, []);

  if (!result) {
    return (
      <div className="card">
        <h1 className="h1">暂无结果</h1>
        <p className="muted">请先完成问卷。</p>
        <div className="hr" />
        <Link className="btn" href="/quiz">去做问卷</Link>
      </div>
    );
  }

  return <ResultCard result={result} />;
}