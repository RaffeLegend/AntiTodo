FROM node:20-alpine

WORKDIR /app

# 先复制依赖文件（兼容 npm/yarn/pnpm 的 lock）
COPY package.json ./
COPY package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# 安装：优先用 lock 对应的工具
RUN corepack enable && \
    if [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    else npm ci || npm i; fi

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]