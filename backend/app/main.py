from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DoNotDo API")

# 允许前端访问（开发期先放开）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # set env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/recommend")
def recommend(payload: dict):
    """
    前端传：{ answers: {...} }
    后端回：{ day_type: "...", do: [...], dont: [...] }
    """
    answers = payload.get("answers", {}) or {}

    # 简单规则示例：你后面再换成 50 条规则表即可
    energy = int(answers.get("energy", 3))       # 1-5
    mood = int(answers.get("mood", 3))           # 1-5
    stress = int(answers.get("stress", 3))       # 1-5

    if energy <= 2 or stress >= 4:
        day_type = "养生日"
        do = ["轻任务", "整理/复盘", "早睡", "散步"]
        dont = ["高强度工作冲刺", "重决策", "熬夜", "酒局"]
    elif mood <= 2:
        day_type = "社交日"
        do = ["低门槛沟通", "和朋友/同事对齐", "表达需求"]
        dont = ["硬刚冲突", "做重大承诺", "连续会议轰炸"]
    else:
        day_type = "工作日"
        do = ["深度工作", "做关键决策", "推进核心任务"]
        dont = ["无目的刷信息流", "频繁切换任务", "无效社交"]

    return {"day_type": day_type, "do": do, "dont": dont}