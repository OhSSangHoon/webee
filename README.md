# 🐝 webee - 농업인을 위한 수정벌 거래 및 관리 서비스

> **농업인들의 든든한 파트너, webee**  
> AI 기반 수정벌 추천 및 관리 플랫폼

## 📋 프로젝트 개요

webee는 농업인이 수정벌을 보다 쉽고 신뢰성 있게 활용하기 위한 종합 플랫폼입니다.  
농작물에 적합한 수정벌을 추천해주고, 이와 관련된 검증된 상품을 제안하며, 거래까지 이어줍니다.  
구매 후에는 이미지 기반의 수정벌 상태 진단과 안전한 농약 정보를 제공합니다.

**현재 웹 플랫폼에서 모바일 앱으로 전환 중**이며, IoT 스마트 벌통 하드웨어 개발을 병행하고 있습니다.

### 주요 기능
- 🤖 **AI 기반 수정벌 추천**: 농림축산식품부 공공데이터를 활용한 작물별 최적 수정벌 추천
- 📸 **YOLOv11 질병 진단**: 이미지 기반 수정벌 질병 조기 발견 시스템
- 🛒 **수정벌 거래 플랫폼**: 판매자-구매자 매칭 및 상품 비교 기능
- 🌡️ **실시간 날씨 연동**: 기상 데이터 기반 관리 가이드 제공
- 💬 **AI 상담**: RAG 기반 맞춤형 수정벌 관리 컨설팅
- 🏠 **IoT 스마트 벌통** (개발 중): 온도·습도·CO2 센서 기반 자동 환경 제어

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15.3.1 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.1.5
- **State Management**: 
  - Zustand 5.0.4 (전역 상태)
  - TanStack React Query 5.80.7 (서버 상태)

### Form & Validation
- React Hook Form 7.56.3
- Yup 1.6.1
- @hookform/resolvers 5.0.1

### UI Components & Utils
- lucide-react 0.513.0 (아이콘)
- clsx 2.1.1 (클래스 유틸리티)
- react-intersection-observer 9.16.0 (뷰포트 감지)
- react-daum-postcode 3.2.0 (주소 검색)

### Development Tools
- ESLint 9
- Autoprefixer 10.4.21
- Turbopack (빌드 최적화)

### External APIs
- Kakao Maps API (지도 서비스)
- Daum Postcode API (우편번호 주소)
- OpenWeatherMap API (날씨 데이터)
- 농림축산식품부 공공데이터 (작물 정보)
- 국세청 사업자등록 진위확인 API

## 📂 프로젝트 구조

```
webee/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── features/            # Feature-Sliced Design
│   │   ├── api/            # API 레이어
│   │   ├── model/          # 비즈니스 로직
│   │   └── ui/             # UI 컴포넌트
│   ├── shared/             # 공유 유틸리티
│   └── widgets/            # 복합 컴포넌트
├── public/                 # 정적 파일
└── package.json
```

## 🚀 시작하기

### 설치

```bash
npm install
# or
yarn install
```

### 개발 서버 실행

```bash
npm run dev
# or
yarn dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 빌드

```bash
npm run build
npm run start
```

## 🎯 프로젝트 로드맵

### 완료된 단계 (MVP)
- ✅ 웹 기반 플랫폼 구축
- ✅ AI 수정벌 추천 시스템
- ✅ 질병 진단 기능 (YOLOv11)
- ✅ 거래 플랫폼 기본 기능

### 현재 진행 중 (2025 Q4)
- 🚀 **백엔드 서버 이전 작업 진행 중**
- 🚀 **웹 플랫폼 → 모바일 앱 마이그레이션 진행 중**
  - 모바일 중심 UI/UX 전환
- 🚀 **IoT 스마트 벌통 프로토타입 개발 진행 예정**
  - 시제품 제작 지원금 800만원 확보
  - 온도, 습도, CO2 센서 통합
  - 자동 환경 제어 시스템 설계

### 단기 목표 (2025 Q1-Q2)
- 📱 모바일 앱 공식 출시
- 🏗️ 백엔드 서버 이전 완료
- 🔧 IoT 스마트 벌통 상용화
- 💻 GPU 서버 인프라 구축
- 📊 사용자 데이터 축적 및 추천 시스템 고도화

## 💰 수익 모델

1. **광고 수익**: 플랫폼 내 배너 광고
2. **판매 수수료**: 상품 상단 노출 프리미엄 서비스
3. **프리미엄 구독**: 실시간 알림, 투입 스케줄링 등 독점 기능
4. **스마트 벌통 판매**: IoT 하드웨어 판매 수익

## 🏆 참여 대회 및 지원 프로그램

- 제10회 농림축산식품 공공데이터활용 창업경진대회
- 2025 YU AI 창업 경진대회
- **YUnicorn 시제품 제작 및 사업화 지원 프로그램** ✅ **선정 (지원금 800만원 확보)**
- CBC KOREA 창업 경진대회
- 멋쟁이사자처럼 창업 트랙
- 부울경 로컬 대항색 창업 부트캠프

## 📊 성과 및 진행 상황

### 농림축산식품부 공공데이터활용 창업경진대회
- **제품개발부문 한국농어촌공사사장상 수상**
  - 상금 300만원
  - 지원금 100만원

### 지원금 확보
- **YUnicorn 시제품 제작 지원금**: 800만원
  - IoT 스마트 벌통 프로토타입 개발 진행 중
  - 센서 통합 및 자동 제어 시스템 구축

### 플랫폼 전환
- **웹 → 모바일 앱 마이그레이션 진행 중**
  - 모바일 중심 레이아웃 적용
  - 모바일 최적화 UI/UX 구현

### 백엔드 서버 이전
- 서버 인프라 개선 작업 진행 중
- GPU 서버 구축 준비 (AI 모델 서빙용)

#### 주요 개선 사항
- 이미지 포맷 최적화 (WebP 변환)
- Kakao Maps 등 무거운 컴포넌트 동적 임포트
- 폰트 로딩 최적화
- Layout Shift 제거 (고정 컨테이너 적용)

## 🔐 Git 브랜치 전략

프로젝트는 **Git Flow** 전략을 사용합니다:

- `master`: 프로덕션 배포 브랜치
- `develop`: 개발 통합 브랜치

## 📝 PR 작성 규칙

```
📌[타입] 작업 내용 요약

- 변경사항 1
- 변경사항 2
- 변경사항 3
```

## 📞 문의

- **Email**
  - 팀장: cy6kimm@gmail.com
  - 팀원: fiveon555@gmail.com
  - 팀원: da.young.yun13@gmail.com
- **Website**: [webee.com](https://webee-ten.vercel.app/)
