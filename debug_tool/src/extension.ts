import * as vscode from "vscode";
import { TunnelManager } from "./tunnelManager";
import { TunnelViewProvider } from "./tunnelViewProvider";
import { QRCodeGenerator } from "./qrCodeGenerator";

let tunnelManager: TunnelManager;
let tunnelViewProvider: TunnelViewProvider;

export function activate(context: vscode.ExtensionContext) {
  console.log("Local Tunnel Share extension is now active!");

  // Initialize managers
  tunnelManager = new TunnelManager();
  tunnelViewProvider = new TunnelViewProvider(tunnelManager);
  const qrCodeGenerator = new QRCodeGenerator();

  // Register tree view provider
  vscode.window.registerTreeDataProvider("localTunnelView", tunnelViewProvider);

  // Register commands
  const startCommand = vscode.commands.registerCommand(
    "localTunnel.start",
    async () => {
      try {
        // Step 1: Get port number
        const port = await vscode.window.showInputBox({
          prompt: "터널을 생성할 로컬 포트 번호를 입력하세요",
          placeHolder: "예: 3000",
          value: "3000",
          validateInput: (value) => {
            const portNum = parseInt(value);
            if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
              return "올바른 포트 번호를 입력하세요 (1-65535)";
            }
            return null;
          },
        });

        if (!port) {
          return;
        }

        const portNum = parseInt(port);

        // Step 2: Get custom subdomain (optional)
        const subdomain = await vscode.window.showInputBox({
          prompt: "커스텀 URL 이름을 입력하세요 (선택사항, 비워두면 자동 생성)",
          placeHolder:
            "예: my-awesome-project (your-name.loca.lt 형식으로 생성됨)",
          validateInput: (value) => {
            if (value && !/^[a-z0-9-]+$/.test(value)) {
              return "영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다";
            }
            return null;
          },
        });

        // Step 3: Ask if user wants password protection
        const wantsPassword = await vscode.window.showQuickPick(
          ["아니오", "예"],
          {
            placeHolder: "터널에 비밀번호 보호를 설정하시겠습니까?",
          }
        );

        let password: string | undefined;
        if (wantsPassword === "예") {
          password = await vscode.window.showInputBox({
            prompt: "터널 접속을 위한 비밀번호를 설정하세요",
            placeHolder: "비밀번호 입력 (최소 4자)",
            password: true,
            validateInput: (value) => {
              if (value.length < 4) {
                return "비밀번호는 최소 4자 이상이어야 합니다";
              }
              return null;
            },
          });

          if (!password) {
            return;
          }
        }

        // Set password before starting tunnel
        if (password) {
          tunnelManager.setPassword(password);
        }

        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "터널 생성 중...",
            cancellable: false,
          },
          async (progress) => {
            progress.report({ increment: 0 });

            const url = await tunnelManager.startTunnel(
              portNum,
              subdomain || undefined
            );

            progress.report({ increment: 100 });

            let message = `터널이 생성되었습니다! URL: ${url}`;
            if (password) {
              message += `\n🔒 비밀번호 보호 활성화\n사용자명: tunnel\n비밀번호: ${password}`;
            }

            vscode.window
              .showInformationMessage(
                message,
                "URL 복사",
                "QR 코드 보기",
                password ? "인증 정보 복사" : ""
              )
              .then((selection) => {
                if (selection === "URL 복사") {
                  vscode.env.clipboard.writeText(url);
                  vscode.window.showInformationMessage(
                    "URL이 클립보드에 복사되었습니다!"
                  );
                } else if (selection === "QR 코드 보기") {
                  vscode.commands.executeCommand("localTunnel.showQR");
                } else if (selection === "인증 정보 복사" && password) {
                  vscode.env.clipboard.writeText(
                    `URL: ${url}\n사용자명: tunnel\n비밀번호: ${password}`
                  );
                  vscode.window.showInformationMessage(
                    "인증 정보가 클립보드에 복사되었습니다!"
                  );
                }
              });

            tunnelViewProvider.refresh();
          }
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(`터널 생성 실패: ${error.message}`);
      }
    }
  );

  const stopCommand = vscode.commands.registerCommand(
    "localTunnel.stop",
    async () => {
      try {
        await tunnelManager.stopTunnel();
        vscode.window.showInformationMessage("터널이 중지되었습니다");
        tunnelViewProvider.refresh();
      } catch (error: any) {
        vscode.window.showErrorMessage(`터널 중지 실패: ${error.message}`);
      }
    }
  );

  const copyUrlCommand = vscode.commands.registerCommand(
    "localTunnel.copyUrl",
    async () => {
      const url = tunnelManager.getUrl();
      if (url) {
        await vscode.env.clipboard.writeText(url);
        vscode.window.showInformationMessage(
          "URL이 클립보드에 복사되었습니다!"
        );
      } else {
        vscode.window.showWarningMessage(
          "활성화된 터널이 없습니다. 먼저 터널을 시작하세요."
        );
      }
    }
  );

  const showQRCommand = vscode.commands.registerCommand(
    "localTunnel.showQR",
    async () => {
      const url = tunnelManager.getUrl();
      if (!url) {
        vscode.window.showWarningMessage(
          "활성화된 터널이 없습니다. 먼저 터널을 시작하세요."
        );
        return;
      }

      try {
        const qrCodeDataUrl = await qrCodeGenerator.generateQRCode(url);
        const panel = vscode.window.createWebviewPanel(
          "tunnelQRCode",
          "Tunnel QR Code",
          vscode.ViewColumn.One,
          {
            enableScripts: true,
          }
        );

        panel.webview.html = getQRCodeWebviewContent(qrCodeDataUrl, url);
      } catch (error: any) {
        vscode.window.showErrorMessage(`QR 코드 생성 실패: ${error.message}`);
      }
    }
  );

  const setPasswordCommand = vscode.commands.registerCommand(
    "localTunnel.setPassword",
    async () => {
      if (!tunnelManager.isActive()) {
        vscode.window.showWarningMessage(
          "활성화된 터널이 없습니다. 먼저 터널을 시작하세요."
        );
        return;
      }

      const password = await vscode.window.showInputBox({
        prompt: "터널 접속을 위한 비밀번호를 설정하세요",
        placeHolder: "비밀번호 입력",
        password: true,
        validateInput: (value) => {
          if (value.length < 4) {
            return "비밀번호는 최소 4자 이상이어야 합니다";
          }
          return null;
        },
      });

      if (password) {
        tunnelManager.setPassword(password);
        vscode.window.showInformationMessage("비밀번호가 설정되었습니다");
        tunnelViewProvider.refresh();
      }
    }
  );

  context.subscriptions.push(
    startCommand,
    stopCommand,
    copyUrlCommand,
    showQRCommand,
    setPasswordCommand
  );

  // Auto-start if configured
  const config = vscode.workspace.getConfiguration("localTunnel");
  if (config.get("autoStart")) {
    const defaultPort = config.get("defaultPort") as number;
    tunnelManager.startTunnel(defaultPort).catch((err) => {
      console.error("Auto-start failed:", err);
    });
  }
}

export function deactivate() {
  if (tunnelManager) {
    tunnelManager.stopTunnel().catch((err) => {
      console.error("Failed to stop tunnel on deactivation:", err);
    });
  }
}

function getQRCodeWebviewContent(qrCodeDataUrl: string, url: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tunnel QR Code</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        .container {
            text-align: center;
            max-width: 600px;
        }
        h1 {
            color: var(--vscode-editor-foreground);
            margin-bottom: 20px;
        }
        .qr-code {
            background: white;
            padding: 20px;
            border-radius: 10px;
            display: inline-block;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .qr-code img {
            display: block;
            max-width: 300px;
            height: auto;
        }
        .url-container {
            background-color: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            padding: 12px;
            margin: 20px 0;
            word-break: break-all;
            font-family: 'Courier New', monospace;
        }
        .instructions {
            margin-top: 20px;
            padding: 15px;
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textLink-foreground);
            border-radius: 4px;
            text-align: left;
        }
        .instructions h3 {
            margin-top: 0;
            color: var(--vscode-textLink-foreground);
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px 5px;
            font-size: 14px;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚇 Tunnel QR Code</h1>
        <div class="qr-code">
            <img src="${qrCodeDataUrl}" alt="QR Code" />
        </div>
        <div class="url-container">
            ${url}
        </div>
        <button onclick="copyUrl()">📋 URL 복사</button>
        <div class="instructions">
            <h3>📱 사용 방법</h3>
            <ul>
                <li>스마트폰으로 QR 코드를 스캔하세요</li>
                <li>또는 위의 URL을 복사하여 공유하세요</li>
                <li>HTTPS가 자동으로 적용되어 있습니다</li>
                <li>팀원들과 안전하게 로컬 서버를 공유할 수 있습니다</li>
            </ul>
        </div>
    </div>
    <script>
        function copyUrl() {
            navigator.clipboard.writeText('${url}').then(() => {
                alert('URL이 클립보드에 복사되었습니다!');
            });
        }
    </script>
</body>
</html>`;
}
