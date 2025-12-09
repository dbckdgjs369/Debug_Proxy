# 🚀 Local Tunnel Share 사용 가이드

## 빠른 시작

### 1. Extension 개발 모드로 실행

```bash
# 의존성 설치
npm install

# TypeScript 컴파일
npm run compile

# VSCode에서 F5를 누르거나 "Run > Start Debugging" 실행
# 새로운 VSCode 창(Extension Development Host)이 열립니다
```

### 2. Extension 사용하기

#### 방법 1: 명령 팔레트 사용

1. `Cmd+Shift+P` (Mac) 또는 `Ctrl+Shift+P` (Windows/Linux)
2. "Local Tunnel: Start Tunnel" 입력
3. 포트 번호 입력 (예: 3000)
4. 생성된 URL 확인!

#### 방법 2: 사이드바 사용

1. 왼쪽 Activity Bar에서 "Local Tunnel" 아이콘 클릭
2. "▶️ 터널 시작" 클릭
3. 포트 번호 입력
4. 상태 확인 및 버튼으로 기능 사용

## 📱 실제 사용 예시

### 예시 1: React 앱을 모바일에서 테스트

```bash
# 1. React 앱 실행
npm start
# → http://localhost:3000에서 실행 중

# 2. VSCode에서 Local Tunnel 시작
# Command Palette → "Local Tunnel: Start Tunnel"
# 포트 입력: 3000

# 3. 생성된 URL 예시
# https://random-name-123.loca.lt

# 4. QR 코드 생성
# "Local Tunnel: Show QR Code" 실행
# → 스마트폰으로 스캔!

# 5. 이제 휴대폰 LTE/5G로 접속 가능! 📱
```

### 예시 2: 팀원과 개발 서버 공유

```bash
# 1. 로컬 개발 서버 실행
npm run dev
# → http://localhost:8080

# 2. 터널 생성 및 비밀번호 설정
# - "Local Tunnel: Start Tunnel" → 8080 입력
# - "Local Tunnel: Protect with Password" → 비밀번호 설정

# 3. URL 복사
# "Local Tunnel: Copy Share URL"

# 4. 팀원에게 전송
# URL: https://your-tunnel.loca.lt
# Username: tunnel
# Password: [설정한 비밀번호]

# 5. 팀원이 어디서든 접속 가능! 🌍
```

### 예시 3: Webhook 테스트

```bash
# 1. 웹훅을 받을 로컬 서버 실행
node webhook-server.js
# → http://localhost:4000

# 2. 터널 생성
# "Local Tunnel: Start Tunnel" → 4000 입력

# 3. 생성된 URL을 외부 서비스에 등록
# 예: GitHub Webhook → https://abc123.loca.lt/webhook

# 4. 실시간으로 webhook 이벤트 수신 가능! 🎣
```

## 🔧 고급 설정

### settings.json에서 설정

```json
{
  // 기본 포트 설정
  "localTunnel.defaultPort": 3000,

  // 워크스페이스 열 때 자동 시작
  "localTunnel.autoStart": false,

  // 커스텀 터널 서버 (선택사항)
  "localTunnel.serverUrl": ""
}
```

### 비밀번호 보호 사용

터널이 실행 중일 때:

1. "Local Tunnel: Protect with Password" 실행
2. 비밀번호 입력 (최소 4자)
3. 접속 시 Basic Authentication 필요
   - Username: `tunnel`
   - Password: 입력한 비밀번호

## 🎯 주요 명령어

| 명령어                | 설명          | 단축키 |
| --------------------- | ------------- | ------ |
| Start Tunnel          | 터널 시작     | -      |
| Stop Tunnel           | 터널 중지     | -      |
| Copy Share URL        | URL 복사      | -      |
| Show QR Code          | QR 코드 표시  | -      |
| Protect with Password | 비밀번호 설정 | -      |

## 💡 사용 팁

### 1. 로컬 서버가 실행 중인지 확인

```bash
# 포트가 사용 중인지 확인 (Mac/Linux)
lsof -i :3000

# 포트가 사용 중인지 확인 (Windows)
netstat -ano | findstr :3000
```

### 2. 터널 URL 고정하기

무료 버전은 랜덤 URL이 생성됩니다. 고정 URL이 필요한 경우:

- ngrok, Cloudflare Tunnel 등의 유료 서비스 사용 고려
- 또는 자체 터널 서버 운영 (고급)

### 3. 보안 주의사항

⚠️ **중요**: 민감한 정보가 있는 경우

- 반드시 비밀번호 보호 기능 사용
- 개발/테스트 용도로만 사용
- 프로덕션 환경에는 사용 금지

### 4. 연결이 끊긴 경우

터널이 자동으로 끊길 수 있습니다:

- 터널 중지 후 다시 시작
- 로컬 서버가 실행 중인지 확인
- 네트워크 연결 확인

### 5. 여러 포트 동시 사용

현재는 한 번에 하나의 터널만 지원합니다.
다른 포트를 사용하려면:

1. 현재 터널 중지
2. 새 포트로 터널 시작

## 🐛 문제 해결

### 문제: "터널 생성 실패"

**해결방법:**

1. 로컬 서버가 해당 포트에서 실행 중인지 확인
2. 방화벽 설정 확인
3. 다른 포트 번호로 시도

### 문제: "URL에 접속되지 않음"

**해결방법:**

1. 터널이 활성 상태인지 확인 (사이드바)
2. URL을 정확히 복사했는지 확인
3. localtunnel.me 서비스 상태 확인

### 문제: "비밀번호가 작동하지 않음"

**해결방법:**

1. Username: `tunnel` 사용 확인
2. 비밀번호 정확히 입력했는지 확인
3. 터널을 재시작해보세요

### 문제: "연결이 자주 끊김"

**해결방법:**

- localtunnel.me는 무료 서비스로 제한이 있습니다
- 안정적인 연결이 필요한 경우 유료 서비스 고려
- 네트워크 안정성 확인

## 📦 Extension 패키징

실제 Extension으로 패키징하려면:

```bash
# VSCE 설치 (처음 한 번만)
npm install -g @vscode/vsce

# Extension 패키징
npm run package

# 생성된 .vsix 파일 설치
# VSCode: Extensions → ... → Install from VSIX
```

## 🔄 개발 워크플로우

```bash
# 1. 코드 수정
vim src/extension.ts

# 2. 컴파일
npm run compile

# 3. 테스트 (F5로 Extension Development Host 실행)
# 4. 수정 후 다시 F5로 reload

# 5. Watch 모드로 자동 컴파일
npm run watch
```

## 🌟 다음 단계

이제 Extension을 사용할 준비가 되었습니다!

1. **F5**를 눌러 Extension Development Host 시작
2. 로컬 서버를 실행하고
3. **Local Tunnel: Start Tunnel** 명령 실행
4. 생성된 URL로 어디서든 접속!

---

**Happy Coding! 🚀**
