import * as vscode from "vscode";
import { TunnelManager } from "./tunnelManager";

export class TunnelViewProvider implements vscode.TreeDataProvider<TunnelItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    TunnelItem | undefined | null | void
  > = new vscode.EventEmitter<TunnelItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    TunnelItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(private tunnelManager: TunnelManager) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TunnelItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TunnelItem): Thenable<TunnelItem[]> {
    if (!element) {
      // Root level items
      const items: TunnelItem[] = [];

      if (this.tunnelManager.isActive()) {
        const url = this.tunnelManager.getUrl();
        const port = this.tunnelManager.getPort();
        const hasPassword = this.tunnelManager.hasPassword();

        items.push(
          new TunnelItem(
            "상태: 🟢 활성",
            "",
            vscode.TreeItemCollapsibleState.None,
            "status"
          )
        );

        if (url) {
          items.push(
            new TunnelItem(
              `URL: ${url}`,
              url,
              vscode.TreeItemCollapsibleState.None,
              "url",
              {
                command: "localTunnel.copyUrl",
                title: "Copy URL",
              }
            )
          );
        }

        if (port) {
          items.push(
            new TunnelItem(
              `로컬 포트: ${port}`,
              "",
              vscode.TreeItemCollapsibleState.None,
              "port"
            )
          );
        }

        if (hasPassword) {
          items.push(
            new TunnelItem(
              "보안: 🔒 비밀번호 보호 활성",
              "",
              vscode.TreeItemCollapsibleState.None,
              "security"
            )
          );
        } else {
          items.push(
            new TunnelItem(
              "보안: 🔓 비밀번호 보호 비활성",
              "",
              vscode.TreeItemCollapsibleState.None,
              "security"
            )
          );
        }

        items.push(
          new TunnelItem(
            "📋 URL 복사",
            "",
            vscode.TreeItemCollapsibleState.None,
            "action",
            {
              command: "localTunnel.copyUrl",
              title: "Copy URL",
            }
          )
        );

        items.push(
          new TunnelItem(
            "📱 QR 코드 보기",
            "",
            vscode.TreeItemCollapsibleState.None,
            "action",
            {
              command: "localTunnel.showQR",
              title: "Show QR Code",
            }
          )
        );

        items.push(
          new TunnelItem(
            "⏹ 터널 중지",
            "",
            vscode.TreeItemCollapsibleState.None,
            "action",
            {
              command: "localTunnel.stop",
              title: "Stop Tunnel",
            }
          )
        );
      } else {
        items.push(
          new TunnelItem(
            "상태: 🔴 비활성",
            "",
            vscode.TreeItemCollapsibleState.None,
            "status"
          )
        );

        items.push(
          new TunnelItem(
            "▶️ 터널 시작",
            "",
            vscode.TreeItemCollapsibleState.None,
            "action",
            {
              command: "localTunnel.start",
              title: "Start Tunnel",
            }
          )
        );

        items.push(
          new TunnelItem(
            "💡 로컬 서버를 외부에 공유하세요",
            "",
            vscode.TreeItemCollapsibleState.None,
            "info"
          )
        );
      }

      return Promise.resolve(items);
    }

    return Promise.resolve([]);
  }
}

class TunnelItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly type:
      | "status"
      | "url"
      | "port"
      | "security"
      | "action"
      | "info",
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = this.label;
    this.description = this.version;

    // Set context value for conditional rendering
    this.contextValue = type;

    // Set icons based on type
    switch (type) {
      case "status":
        this.iconPath = new vscode.ThemeIcon("circle-filled");
        break;
      case "url":
        this.iconPath = new vscode.ThemeIcon("link");
        break;
      case "port":
        this.iconPath = new vscode.ThemeIcon("plug");
        break;
      case "security":
        this.iconPath = new vscode.ThemeIcon("shield");
        break;
      case "action":
        this.iconPath = new vscode.ThemeIcon("run");
        break;
      case "info":
        this.iconPath = new vscode.ThemeIcon("info");
        break;
    }
  }
}
