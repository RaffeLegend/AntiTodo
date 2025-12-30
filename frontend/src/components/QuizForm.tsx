"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchQuiz, evaluateToday } from "@/lib/api";
import type { Question, SubmitAnswer, EvaluateResponse } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function QuizForm() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchQuiz();
        setQuestions(data.questions);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allAnswered = useMemo(() => {
    if (questions.length === 0) return false;
    return questions.every((q) => Boolean(answers[q.id]));
  }, [questions, answers]);

  async function onSubmit() {
    if (!allAnswered) return;
    setSubmitting(true);
    try {
      const payload: SubmitAnswer[] = questions.map((q) => ({
        question_id: q.id,
        option_id: answers[q.id],
      }));
      const result: EvaluateResponse = await evaluateToday(payload);
      // 存到 sessionStorage，result 页面读取
      sessionStorage.setItem("day_compass_result", JSON.stringify(result));
      router.push("/result");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="card">加载中…</div>;

  return (
    <div className="card">
      <h1 className="h1">今日状态问答</h1>
      <p className="muted">请选择最符合你“此刻”的选项。</p>

      <div className="hr" />

      {questions.map((q) => (
        <div key={q.id} style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>{q.title}</div>
          {q.options.map((opt) => (
            <label key={opt.id} className="option">
              <input
                type="radio"
                name={q.id}
                value={opt.id}
                checked={answers[q.id] === opt.id}
                onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
              />
              {opt.text}
            </label>
          ))}
        </div>
      ))}

      <div className="hr" />

      <button className="btn" disabled={!allAnswered || submitting} onClick={onSubmit}>
        {submitting ? "计算中…" : "生成今日建议"}
      </button>

      {!allAnswered && (
        <p className="muted" style={{ marginTop: 10 }}>
          还差 {questions.filter((q) => !answers[q.id]).length} 题未选。
        </p>
      )}
    </div>
  );
}