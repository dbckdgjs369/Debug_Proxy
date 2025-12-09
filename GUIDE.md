# 🚇 Local Tunnel Share - 완벽 가이드

## 📋 목차

1. [기본 사용법](#기본-사용법)
2. [커스텀 URL 설정](#커스텀-url-설정)
3. [비밀번호 보호](#비밀번호-보호)
4. [Vite 서버 설정](#vite-서버-설정)
5. [자주 묻는 질문](#자주-묻는-질문)

---

## 🚀 기본 사용법

### 1. 터널 시작하기

1. VSCode 명령 팔레트 열기: `Cmd+Shift+P` (Mac) 또는 `Ctrl+Shift+P` (Windows/Linux)
2. `Local Tunnel: Start Tunnel` 명령 실행
3. 단계별 설정:
   - **포트 번호**: 로컬 서버 포트 입력 (예: 3000)
   - **커스텀 URL**: 원하는 URL 이름 입력 (선택사항)
   - **비밀번호 보호**: 설정 여부 선택 (선택사항)

### 2. URL 공유하기

- 터널 생성 후 나타나는 URL을 복사하여 공유
- QR 코드를 생성하여 모바일 기기로 스캔
- 사이드바의 "Local Tunnel" 뷰에서 상태 확인

---

## 🎨 커스텀 URL 설정

### 원하는 이름으로 URL 만들기

터널 시작 시 커스텀 URL 이름을 입력하세요:

```
입력: my-awesome-project
결과: https://my-awesome-project.loca.lt
```

### URL 이름 규칙

- ✅ 영문 소문자 (a-z)
- ✅ 숫자 (0-9)
- ✅ 하이픈 (-)
- ❌ 대문자, 특수문자 사용 불가

### 예시

```
✅ good-url
✅ my-project-123
✅ test-server
❌ MyProject (대문자 불가)
❌ my_project (언더스코어 불가)
❌ project! (특수문자 불가)
```

### 팁

- 비워두면 랜덤 URL이 자동 생성됩니다 (예: `salty-hotels-turn.loca.lt`)
- 커스텀 이름은 다른 사람이 사용 중일 수 있습니다
- 이미 사용 중인 이름은 터널 생성에 실패할 수 있습니다

---

## 🔐 비밀번호 보호

### 비밀번호 설정하기

1. 터널 시작 시 "비밀번호 보호를 설정하시겠습니까?" → "예" 선택
2. 비밀번호 입력 (최소 4자)
3. 터널 생성 후 인증 정보 확인:
   ```
   URL: https://my-project.loca.lt
   🔒 비밀번호 보호 활성화
   사용자명: tunnel
   비밀번호: your-password
   ```

### 접속 방법

다른 사람이 터널에 접속할 때:

1. URL 접속
2. 로그인 프롬프트에서 인증 정보 입력:
   - **사용자명**: `tunnel` (고정)
   - **비밀번호**: 설정한 비밀번호

### 브라우저 자동 인증

URL에 인증 정보를 포함하여 공유할 수 있습니다:

```
https://tunnel:your-password@my-project.loca.lt
```

### 주의사항

⚠️ **보안 주의사항**

- 비밀번호는 민감한 정보를 포함하지 마세요
- 공개 채널에서 비밀번호를 공유하지 마세요
- 터널 사용 후 즉시 중지하세요
- 비밀번호는 Basic Auth를 사용하여 전송됩니다

---

## ⚙️ Vite 서버 설정

### 문제 상황

```
Blocked request. This host ("xxx.loca.lt") is not allowed.
To allow this host, add "xxx.loca.lt" to `server.allowedHosts` in vite.config.js.
```

### 해결 방법

#### 방법 1: 모든 loca.lt 서브도메인 허용 (권장)

**vite.config.js:**

```javascript
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    allowedHosts: [
      ".loca.lt", // 모든 loca.lt 서브도메인 허용
    ],
  },
});
```

**vite.config.ts (TypeScript):**

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    allowedHosts: [".loca.lt"],
  },
});
```

#### 방법 2: 모든 호스트 허용 (개발 환경 전용)

```javascript
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    allowedHosts: ["all"], // 모든 호스트 허용 (주의!)
  },
});
```

⚠️ **보안 경고**: 프로덕션 환경에서는 사용하지 마세요!

#### 방법 3: 특정 호스트만 허용

```javascript
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    allowedHosts: [
      "my-awesome-project.loca.lt", // 특정 커스텀 URL만
      "salty-hotels-turn.loca.lt", // 또 다른 특정 URL
    ],
  },
});
```

### React + Vite 예시

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // 네트워크 접근 허용
    allowedHosts: [".loca.lt"],
  },
});
```

### Vue + Vite 예시

```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    allowedHosts: [".loca.lt"],
  },
});
```

### 설정 적용하기

1. `vite.config.js` 또는 `vite.config.ts` 파일 수정
2. Vite 개발 서버 재시작:
   ```bash
   # 서버 중지 (Ctrl+C)
   # 서버 재시작
   npm run dev
   # 또는
   yarn dev
   ```

---

## 🤔 자주 묻는 질문

### Q: 커스텀 URL을 사용했는데 접속이 안 돼요

**A:** 다음을 확인하세요:

1. Vite 설정에 `.loca.lt` 추가했는지 확인
2. Vite 서버를 재시작했는지 확인
3. 해당 URL 이름이 다른 사람이 사용 중일 수 있음
4. 다른 이름으로 시도해보세요

### Q: 비밀번호를 설정했는데 "Bad Gateway" 에러가 나요

**A:** 로컬 서버가 제대로 실행 중인지 확인하세요:

```bash
# 로컬 서버가 정상 작동하는지 확인
curl http://localhost:3000
```

### Q: URL이 매번 바뀌는 게 싫어요

**A:** 터널 시작 시 커스텀 URL을 입력하세요. 같은 이름을 사용하면 항상 같은 URL을 얻을 수 있습니다.

### Q: 터널이 자주 끊겨요

**A:** 이것은 localtunnel의 특성입니다. 다음을 시도하세요:

1. 안정적인 네트워크 사용
2. 터널 재시작
3. 다른 서브도메인 사용

### Q: HTTPS가 적용되나요?

**A:** 네! 모든 localtunnel URL은 자동으로 HTTPS를 지원합니다.

### Q: 여러 포트를 동시에 터널링할 수 있나요?

**A:** 현재는 하나의 터널만 동시에 실행할 수 있습니다. 다른 포트를 사용하려면 현재 터널을 먼저 중지하세요.

### Q: 비밀번호 없이 터널을 시작했는데 나중에 추가할 수 있나요?

**A:**

- 방법 1: 터널을 중지하고 비밀번호와 함께 다시 시작
- 방법 2: `Local Tunnel: Protect with Password` 명령 사용 (터널 실행 중에)

### Q: 인증 정보를 어떻게 공유하나요?

**A:** 터널 생성 후 "인증 정보 복사" 버튼을 클릭하면 다음 형식으로 복사됩니다:

```
URL: https://my-project.loca.lt
사용자명: tunnel
비밀번호: your-password
```

---

## 🛠️ 고급 설정

### VSCode 설정으로 기본값 지정

`settings.json`에 추가:

```json
{
  "localTunnel.defaultPort": 3000,
  "localTunnel.autoStart": false,
  "localTunnel.serverUrl": ""
}
```

### 프로그래밍 방식으로 사용 (개발자용)

TunnelManager API:

```typescript
import { TunnelManager } from "./tunnelManager";

const manager = new TunnelManager();

// 기본 터널 시작
await manager.startTunnel(3000);

// 커스텀 URL로 시작
await manager.startTunnel(3000, "my-custom-name");

// 비밀번호 설정
manager.setPassword("my-secret-password");
await manager.startTunnel(3000, "my-custom-name");

// 터널 정보
const url = manager.getUrl();
const isActive = manager.isActive();
const hasPassword = manager.hasPassword();

// 터널 중지
await manager.stopTunnel();
```

---

## 📞 지원

문제가 발생하면:

1. 이 가이드의 FAQ 섹션 확인
2. VSCode Output 패널에서 에러 로그 확인
3. GitHub Issues에 문제 보고

---

## 🎉 팁과 트릭

### 1. 빠른 테스트를 위한 단축키

1. `Cmd+Shift+P` → `Local Tunnel: Start Tunnel`
2. Enter (기본 포트 사용)
3. Enter (랜덤 URL 사용)
4. "아니오" (비밀번호 없이)

### 2. 팀과 공유하기

커스텀 URL을 사용하면 팀원들이 기억하기 쉽습니다:

```
✅ https://our-team-demo.loca.lt
❌ https://salty-hotels-turn.loca.lt
```

### 3. QR 코드로 모바일 테스트

모바일 기기에서 빠르게 테스트하려면:

1. `Local Tunnel: Show QR Code` 실행
2. 스마트폰으로 QR 코드 스캔
3. 즉시 앱 확인!

### 4. 안전한 비밀번호 보호

민감한 데모를 공유할 때:

1. 항상 비밀번호 보호 사용
2. 강력한 비밀번호 생성
3. 사용 후 즉시 터널 중지
4. 비밀번호는 보안 채널로만 공유

---

**즐거운 개발 되세요! 🚀**
