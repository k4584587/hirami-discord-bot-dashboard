# 빌드 스테이지
FROM node:20-alpine AS builder

WORKDIR /app

# 패키지 매니저로 yarn을 사용하는 것으로 보입니다
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 소스 파일 복사
COPY . .

# .env 파일이 있으므로 환경 변수 설정
COPY .env .env

# Next.js 빌드
RUN yarn build

# 프로덕션 스테이지
FROM node:20-alpine AS runner

WORKDIR /app

# 볼륨 마운트 포인트 생성
RUN mkdir -p /app/.next && \
    mkdir -p /app/node_modules

# 필요한 파일만 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/next.config.ts ./next.config.ts

# 프로덕션 종속성만 설치
RUN yarn install --production --frozen-lockfile

# 비루트 사용자로 실행
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app
USER nextjs

# 볼륨 설정
VOLUME ["/app/.next", "/app/node_modules"]

# 포트 설정
EXPOSE 3000

# 환경 변수 설정
ENV NODE_ENV production
ENV PORT 3000

# 실행 명령
CMD ["yarn", "start"]