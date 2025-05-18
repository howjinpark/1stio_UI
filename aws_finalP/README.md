# Istio Traffic Manager

Istio 트래픽 관리를 위한 웹 기반 UI 도구입니다. VirtualService의 트래픽 비율을 실시간으로 조절할 수 있습니다.

## 주요 기능

- 서비스 및 버전 정보 실시간 조회
- 슬라이더 기반 트래픽 비율 조절
- 실시간 변경 사항 적용
- 롤백 기능
- 트래픽 모니터링

## 기술 스택

### 프론트엔드
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query

### 백엔드
- Node.js
- Express
- TypeScript
- Kubernetes Client

### 인프라
- Kubernetes
- Istio
- Docker

## 시작하기

### 사전 요구사항
- Node.js 18+
- Docker
- Kubernetes 클러스터
- Istio가 설치된 환경

### 설치 방법

1. 저장소 클론
```bash
git clone [repository-url]
cd istio-traffic-manager
```

2. 프론트엔드 설치 및 실행
```bash
cd frontend
npm install
npm run dev
```

3. 백엔드 설치 및 실행
```bash
cd backend
npm install
npm run dev
```

4. Docker 이미지 빌드
```bash
docker-compose build
```

5. Kubernetes에 배포
```bash
kubectl apply -f k8s/
```

## 환경 설정

### 백엔드 환경변수
- `KUBERNETES_CONFIG`: Kubernetes 설정 파일 경로
- `PORT`: 백엔드 서버 포트 (기본값: 3001)

### 프론트엔드 환경변수
- `NEXT_PUBLIC_API_URL`: 백엔드 API URL

## 라이센스
MIT 