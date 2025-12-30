from __future__ import annotations
from dataclasses import dataclass
from typing import Dict, List, Tuple
from pathlib import Path
import json
import yaml

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"

@dataclass
class LoadedData:
    questions: dict
    rules: dict

def load_all() -> LoadedData:
    questions_path = DATA_DIR / "questions_zh.json"
    rules_path = DATA_DIR / "rules_zh.yaml"

    with open(questions_path, "r", encoding="utf-8") as f:
        questions = json.load(f)

    with open(rules_path, "r", encoding="utf-8") as f:
        rules = yaml.safe_load(f)

    return LoadedData(questions=questions, rules=rules)

def _build_option_score_index(questions: dict) -> Dict[Tuple[str, str], Dict[str, int]]:
    # (question_id, option_id) -> score dict
    idx: Dict[Tuple[str, str], Dict[str, int]] = {}
    for q in questions["questions"]:
        qid = q["id"]
        for opt in q["options"]:
            idx[(qid, opt["id"])] = opt.get("score", {})
    return idx

def evaluate(answers: List[dict]) -> dict:
    data = load_all()
    q = data.questions
    rules = data.rules

    score_index = _build_option_score_index(q)

    dims = rules["dimensions"]
    scores = {d: 0 for d in dims}

    # 1) accumulate scores
    for a in answers:
        key = (a["question_id"], a["option_id"])
        s = score_index.get(key)
        if s is None:
            continue
        for dim, v in s.items():
            if dim in scores:
                scores[dim] += int(v)

    # 2) decide day_type
    # simple heuristic: compare work/social/recovery composite
    work_score = scores.get("focus", 0) + scores.get("energy", 0) - scores.get("stress", 0)
    social_score = scores.get("social", 0) + scores.get("mood", 0) - scores.get("stress", 0)
    recovery_score = scores.get("fatigue", 0) + scores.get("stress", 0) - scores.get("energy", 0)

    # normalize tie-breaking: prefer recovery when stress/fatigue high
    if recovery_score >= max(work_score, social_score):
        day_type = "recovery"
    elif social_score >= work_score:
        day_type = "social"
    else:
        day_type = "work"

    # 3) generate recommendations
    preset = rules["presets"][day_type]
    do = list(preset["do"])
    dont = list(preset["dont"])
    notes = []

    # 4) dynamic tweaks based on thresholds
    t = rules.get("thresholds", {})
    if scores.get("stress", 0) >= t.get("high_stress", 6):
        notes.append("压力偏高：优先减少高强度/高风险决策，先把节奏稳住。")
        dont.append("高风险决策（重要谈判/大额消费/冲动承诺）")
    if scores.get("fatigue", 0) >= t.get("high_fatigue", 6):
        notes.append("疲劳偏高：适合低认知负担任务，避免连续深度工作。")
        dont.append("长时间连续深度工作（>90分钟不休息）")
        do.append("轻量任务清单（整理/归档/简单回复）")
    if scores.get("mood", 0) <= t.get("low_mood", -2):
        notes.append("情绪偏低：把目标改成“完成一个小闭环”，不要追求完美。")
        do.append("一个小闭环（20–30分钟即可完成）")
    if scores.get("focus", 0) >= t.get("high_focus", 4) and day_type == "work":
        do.append("单一最重要任务（MIT）+ 60–90分钟深度专注")

    # de-dup (keep order)
    def dedup(xs: List[str]) -> List[str]:
        seen = set()
        out = []
        for x in xs:
            if x not in seen:
                seen.add(x)
                out.append(x)
        return out

    return {
        "day_type": day_type,
        "scores": scores,
        "do": dedup(do),
        "dont": dedup(dont),
        "notes": notes,
        "debug": {
            "work_score": work_score,
            "social_score": social_score,
            "recovery_score": recovery_score
        }
    }