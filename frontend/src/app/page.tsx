"use client";

import { useState } from "react";

type Result = {
  day_type: string;
  do: string[];
  dont: string[];
};

export default function Home() {
  const [energy, setEnergy] = useState(3);
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState(3);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setResult(null);

    const res = await fetch("http://localhost:8000/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: { energy, mood, stress }
      })
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>今天不该做什么</h1>
      <p>回答三个问题，我给你今天的模式，以及“该做/不该做”。</p>

      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <label>
          精力（1-5）：{energy}
          <input type="range" min={1} max={5} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} />
        </label>

        <label>
          情绪（1-5）：{mood}
          <input type="range" min={1} max={5} value={mood} onChange={(e) => setMood(Number(e.target.value))} />
        </label>

        <label>
          压力（1-5）：{stress}
          <input type="range" min={1} max={5} value={stress} onChange={(e) => setStress(Number(e.target.value))} />
        </label>

        <button onClick={submit} disabled={loading} style={{ padding: "10px 14px", cursor: "pointer" }}>
          {loading ? "计算中..." : "生成建议"}
        </button>
      </div>

      {result && (
        <section style={{ marginTop: 28, padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
          <h2>今日模式：{result.day_type}</h2>

          <h3>建议做</h3>
          <ul>
            {result.do.map((x, i) => <li key={i}>{x}</li>)}
          </ul>

          <h3>建议不做</h3>
          <ul>
            {result.dont.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </section>
      )}
    </main>
  );
}