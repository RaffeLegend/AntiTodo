# AntiTodo
Stop before you act. 今日不做。

my-day-compass/
  README.md
  .gitignore
  docker-compose.yml            # 可选：一键起前后端
  .env.example                  # 环境变量示例（不放密钥）
  docs/
    product.md                  # 规则与产品说明（可选）

  frontend/
    package.json
    next.config.js
    tsconfig.json
    .env.local.example
    public/
      favicon.ico
    src/
      app/                       # Next.js App Router
        layout.tsx
        page.tsx                 # 首页：介绍 + 开始按钮
        quiz/
          page.tsx               # 问题页面
        result/
          page.tsx               # 结果页
        api/                     # 可选：前端中转 API（不一定要）
      components/
        QuizForm.tsx             # 问卷组件
        ResultCard.tsx           # 结果展示卡片
        ProgressBar.tsx          # 进度条
      lib/
        api.ts                   # 调后端 API 的封装
        types.ts                 # TS 类型（Question/Answer/Result）
      styles/
        globals.css

  backend/
    pyproject.toml               # 或 requirements.txt
    .env.example
    app/
      __init__.py
      main.py                    # FastAPI 入口
      api/
        __init__.py
        routes_health.py         # /health
        routes_quiz.py           # /quiz（取问题）/evaluate（打分）
      core/
        __init__.py
        config.py                # 读取环境变量
      schemas/
        __init__.py
        quiz.py                  # Pydantic：Question/Submit/Result
      services/
        __init__.py
        rules_engine.py          # 规则打分与分类逻辑（核心）
      data/
        questions_zh.json        # 问题配置
        rules_zh.yaml            # 规则配置（推荐 YAML）
      tests/
        test_rules_engine.py

  scripts/
    init_dev.sh                  # 可选：一键初始化

execute backend/:
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000

execute frontend/:
npm i
# 或 pnpm i / yarn
npm run dev

前端：http://localhost:3000
后端健康：http://127.0.0.1:8000/health

docker compose up --build