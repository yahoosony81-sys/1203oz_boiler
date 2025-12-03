# Vercel 배포 가이드

## Git 저장소 설정 및 배포

### 1단계: Git 저장소 초기화

터미널에서 다음 명령어를 실행하세요:

```bash
# Git 저장소 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋 생성
git commit -m "Initial commit: Next.js + Clerk + Supabase boilerplate"
```

### 2단계: GitHub 저장소 생성

1. GitHub에 로그인
2. 우측 상단의 **"+"** 버튼 클릭 → **"New repository"** 선택
3. 저장소 정보 입력:
   - **Repository name**: 원하는 이름 (예: `nextjs-supabase-boilerplate`)
   - **Description**: (선택사항) 프로젝트 설명
   - **Visibility**: Public 또는 Private 선택
   - **Initialize this repository with**: 체크하지 않기 (이미 로컬에 파일이 있으므로)
4. **"Create repository"** 클릭

### 3단계: GitHub에 코드 푸시

GitHub 저장소 생성 후 표시되는 명령어를 실행하세요:

```bash
# GitHub 저장소를 원격 저장소로 추가
git remote add origin https://github.com/your-username/your-repo-name.git

# main 브랜치로 이름 변경 (선택사항)
git branch -M main

# GitHub에 푸시
git push -u origin main
```

**참고**: `your-username`과 `your-repo-name`을 실제 GitHub 사용자명과 저장소 이름으로 변경하세요.

### 4단계: Vercel에서 GitHub 저장소 연결

1. Vercel Dashboard로 이동
2. **"Add New..."** → **"Project"** 클릭
3. **"Import Git Repository"** 섹션에서 방금 생성한 GitHub 저장소 선택
4. **"Import"** 클릭

### 5단계: Vercel 프로젝트 설정

1. **Project Name**: 원하는 프로젝트 이름 입력
2. **Framework Preset**: Next.js (자동 감지됨)
3. **Root Directory**: `./` (기본값)
4. **Build Command**: `pnpm build` (자동 감지됨)
5. **Output Directory**: `.next` (자동 감지됨)
6. **Install Command**: `pnpm install` (자동 감지됨)

### 6단계: 환경 변수 설정 확인

이미 설정한 환경 변수들이 자동으로 적용됩니다:
- ✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- ✅ CLERK_SECRET_KEY
- ✅ NEXT_PUBLIC_CLERK_SIGN_IN_URL
- ✅ NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
- ✅ NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ NEXT_PUBLIC_STORAGE_BUCKET

### 7단계: 배포

**"Deploy"** 버튼을 클릭하면 배포가 시작됩니다!

---

## 문제 해결

### "repository is not empty" 에러

이 에러는 보통 다음 중 하나의 이유로 발생합니다:

1. **Git 저장소가 초기화되지 않음**
   - 해결: 위의 1단계를 따라 Git 저장소를 초기화하세요

2. **GitHub 저장소가 비어있지 않음**
   - 해결: GitHub 저장소를 생성할 때 "Initialize this repository with README" 옵션을 체크하지 마세요
   - 또는 기존 파일을 먼저 pull한 후 push하세요:
     ```bash
     git pull origin main --allow-unrelated-histories
     git push - 충돌이 발생하면 해결 후 다시 push

3. **잘못된 브랜치 이름**
   - 해결: `git branch -M main` 명령어로 브랜치 이름을 `main`으로 변경

4. **원격 저장소가 설정되지 않음**
   - 해결: `git remote -v`로 확인하고, 없으면 `git remote add origin <URL>` 추가

---

## 배포 후 확인 사항

배포가 완료되면:

1. ✅ Vercel에서 제공하는 배포 URL 확인
2. ✅ 사이트가 정상적으로 로드되는지 확인
3. ✅ 로그인/회원가입 기능 테스트
4. ✅ Supabase 연결 확인
5. ✅ 환경 변수가 올바르게 로드되었는지 확인 (Vercel 로그에서)

---

## 자동 배포 설정

GitHub에 코드를 푸시하면 자동으로 배포됩니다:

```bash
# 코드 수정 후
git add .
git commit -m "Update: 변경 사항 설명"
git push origin main
```

Vercel이 자동으로 감지하여 새 배포를 시작합니다!

