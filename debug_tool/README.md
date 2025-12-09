# Local Tunnel Share - VSCode Extension

🚇 로컬 개발 서버를 외부에서 쉽게 접근할 수 있도록 해주는 VSCode Extension입니다.

## 🎯 주요 기능

### 1. **터널 시작 (Start Tunnel)**

- 로컬 서버를 외부에 공개하는 터널을 생성합니다
- 포트 번호만 입력하면 자동으로 HTTPS URL이 생성됩니다
- `localtunnel.me`를 통해 자동으로 공개 URL이 발급됩니다

### 2. **터널 중지 (Stop Tunnel)**

- 실행 중인 터널을 안전하게 중지합니다

### 3. **URL 복사 (Copy Share URL)**

- 생성된 공개 URL을 클립보드에 복사합니다
- 팀원들과 쉽게 공유할 수 있습니다

### 4. **QR 코드 생성 (Show QR Code)**

- 공개 URL의 QR 코드를 생성합니다
- 스마트폰으로 QR 코드를 스캔하여 바로 접속할 수 있습니다

### 5. **비밀번호 보호 (Protect with Password)**

- 터널에 비밀번호를 설정하여 보안을 강화합니다
- Basic Authentication을 사용합니다

### 6. **자동 HTTPS**

- 모든 터널은 자동으로 HTTPS 인증서가 적용됩니다
- 안전한 연결을 보장합니다

## 🚀 사용 방법

### 설치

1. 이 Extension을 VSCode에 설치합니다
2. 필요한 의존성이 자동으로 설치됩니다

### 빠른 시작

1. **VSCode 명령 팔레트 열기** (`Cmd+Shift+P` or `Ctrl+Shift+P`)
2. `Local Tunnel: Start Tunnel` 입력
3. 로컬 포트 번호 입력 (예: 3000)
4. 생성된 URL을 복사하거나 QR 코드로 공유

### 사이드바 사용

- 왼쪽 사이드바의 "Local Tunnel" 아이콘을 클릭
- 터널 상태와 정보를 한눈에 확인
- 버튼 클릭으로 각 기능 실행

## 📱 사용 시나리오

### 시나리오 1: 모바일에서 테스트

```
1. 로컬에서 개발 서버 실행 (예: localhost:3000)
2. Extension에서 터널 시작
3. QR 코드 생성
4. 스마트폰으로 QR 코드 스캔
5. 모바일 기기의 LTE/5G에서 테스트!
```

### 시나리오 2: 팀원과 공유

```
1. 로컬에서 프로젝트 실행
2. Extension에서 터널 시작
3. 비밀번호 설정 (선택사항)
4. URL 복사하여 팀원에게 전송
5. 다른 장소에 있는 팀원이 즉시 접속 가능!
```

### 시나리오 3: 클라이언트 데모

```
1. 개발 중인 기능을 로컬에서 실행
2. 터널 생성 및 비밀번호 설정
3. URL을 클라이언트에게 공유
4. 별도의 배포 없이 즉시 데모 가능!
```

## 🔧 설정

### 기본 포트 설정

```json
{
  "localTunnel.defaultPort": 3000
}
```

### 자동 시작

```json
{
  "localTunnel.autoStart": true
}
```

### 커스텀 터널 서버

```json
{
  "localTunnel.serverUrl": "https://your-tunnel-server.com"
}
```

## 📋 명령어

- `Local Tunnel: Start Tunnel` - 터널 시작
- `Local Tunnel: Stop Tunnel` - 터널 중지
- `Local Tunnel: Copy Share URL` - URL 복사
- `Local Tunnel: Show QR Code` - QR 코드 표시
- `Local Tunnel: Protect with Password` - 비밀번호 설정

## 🔒 보안

### 비밀번호 보호 기능

- Basic Authentication 사용
- 사용자명: `tunnel`
- 비밀번호: 사용자가 설정한 비밀번호

### HTTPS 자동 적용

- 모든 연결은 HTTPS를 통해 암호화됩니다
- localtunnel.me에서 자동으로 SSL 인증서를 제공합니다

## 🎨 주요 특징

✅ **간편한 사용** - 클릭 몇 번으로 외부 접속 가능  
✅ **QR 코드 지원** - 모바일 기기에서 쉽게 접속  
✅ **비밀번호 보호** - 보안이 필요한 경우 비밀번호 설정  
✅ **자동 HTTPS** - 별도 설정 없이 안전한 연결  
✅ **실시간 상태** - 사이드바에서 터널 상태 확인  
✅ **팀 협업** - 팀원들과 즉시 공유 가능

## 🛠️ 기술 스택

- **VSCode Extension API** - Extension 개발
- **localtunnel** - 터널 생성 및 관리
- **qrcode** - QR 코드 생성
- **TypeScript** - 타입 안정성
- **Node.js** - 런타임 환경

## 📦 의존성

```json
{
  "localtunnel": "^2.0.2",
  "qrcode": "^1.5.3",
  "axios": "^1.6.0"
}
```

## 🐛 알려진 제한사항

- localtunnel.me의 무료 서비스를 사용하므로 연결이 일시적으로 끊길 수 있습니다
- 대용량 파일 전송 시 속도가 느릴 수 있습니다
- 장시간 사용 시 재연결이 필요할 수 있습니다

## 💡 팁

1. **포트 확인**: 터널을 시작하기 전에 로컬 서버가 해당 포트에서 실행 중인지 확인하세요
2. **비밀번호 사용**: 민감한 정보가 있는 경우 반드시 비밀번호를 설정하세요
3. **URL 저장**: 터널을 중지하면 URL이 사라지므로 필요시 저장해두세요

## 🤝 기여

이슈나 개선 사항이 있다면 언제든지 GitHub에서 제안해주세요!

## 📝 라이선스

MIT License

## 👨‍💻 개발자

Made with ❤️ for developers who need to share their local servers quickly and securely.

---

**Happy Tunneling! 🚇**
