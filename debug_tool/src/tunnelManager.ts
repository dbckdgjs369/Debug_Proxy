import localtunnel from "localtunnel";
import * as http from "http";

interface Tunnel {
  url: string;
  close(): void;
  on(event: string, listener: (...args: any[]) => void): this;
}

export class TunnelManager {
  private tunnel: Tunnel | null = null;
  private localPort: number | null = null;
  private publicUrl: string | null = null;
  private password: string | null = null;
  private proxyServer: http.Server | null = null;

  public isActive(): boolean {
    return this.tunnel !== null;
  }

  public getUrl(): string | null {
    return this.publicUrl;
  }

  public getPort(): number | null {
    return this.localPort;
  }

  public hasPassword(): boolean {
    return this.password !== null;
  }

  public setPassword(password: string): void {
    this.password = password;
    console.log("Password protection enabled");
  }

  public clearPassword(): void {
    this.password = null;
    console.log("Password protection disabled");
  }

  public async startTunnel(port: number, subdomain?: string): Promise<string> {
    if (this.tunnel) {
      throw new Error("터널이 이미 실행 중입니다. 먼저 중지해주세요.");
    }

    try {
      this.localPort = port;

      // If password is set, create a proxy server
      if (this.password) {
        const actualPort = await this.startPasswordProtectedProxy(port);
        this.tunnel = await localtunnel({
          port: actualPort,
          subdomain: subdomain,
        });
      } else {
        this.tunnel = await localtunnel({ port, subdomain: subdomain });
      }

      this.publicUrl = this.tunnel.url;

      // Handle tunnel close event
      this.tunnel.on("close", () => {
        console.log("Tunnel closed");
        this.cleanup();
      });

      // Handle tunnel error event
      this.tunnel.on("error", (err: Error) => {
        console.error("Tunnel error:", err);
      });

      console.log(`Tunnel created: ${this.publicUrl}`);
      return this.publicUrl as string;
    } catch (error) {
      this.cleanup();
      throw error;
    }
  }

  private async startPasswordProtectedProxy(
    targetPort: number
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      // Create a simple HTTP proxy server with password protection
      const proxyPort = targetPort + 10000; // Use a different port for the proxy

      this.proxyServer = http.createServer((req, res) => {
        // Check for basic auth
        const auth = req.headers.authorization;

        if (!auth || !this.checkPassword(auth)) {
          res.writeHead(401, {
            "WWW-Authenticate": 'Basic realm="Tunnel Access"',
            "Content-Type": "text/html",
          });
          res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <title>인증 필요</title>
                            <style>
                                body {
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    height: 100vh;
                                    margin: 0;
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                }
                                .container {
                                    background: white;
                                    padding: 40px;
                                    border-radius: 10px;
                                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                                    text-align: center;
                                }
                                h1 { color: #333; margin-bottom: 10px; }
                                p { color: #666; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>🔒 인증 필요</h1>
                                <p>이 터널은 비밀번호로 보호되고 있습니다.</p>
                                <p>액세스하려면 인증 정보를 입력하세요.</p>
                            </div>
                        </body>
                        </html>
                    `);
          return;
        }

        // Forward the request to the actual local server
        const options = {
          hostname: "localhost",
          port: targetPort,
          path: req.url,
          method: req.method,
          headers: req.headers,
        };

        const proxyReq = http.request(options, (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
          proxyRes.pipe(res);
        });

        proxyReq.on("error", (err) => {
          console.error("Proxy error:", err);
          res.writeHead(502);
          res.end("Bad Gateway - 로컬 서버에 연결할 수 없습니다.");
        });

        req.pipe(proxyReq);
      });

      this.proxyServer.listen(proxyPort, () => {
        console.log(
          `Password-protected proxy server running on port ${proxyPort}`
        );
        resolve(proxyPort);
      });

      this.proxyServer.on("error", (err) => {
        reject(err);
      });
    });
  }

  private checkPassword(authHeader: string): boolean {
    if (!this.password) {
      return true;
    }

    try {
      // Parse Basic Auth header
      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "utf-8"
      );
      const [username, password] = credentials.split(":");

      // We use 'tunnel' as username and check the password
      return username === "tunnel" && password === this.password;
    } catch (error) {
      return false;
    }
  }

  public async stopTunnel(): Promise<void> {
    if (!this.tunnel) {
      throw new Error("실행 중인 터널이 없습니다.");
    }

    try {
      this.tunnel.close();
      this.cleanup();
      console.log("Tunnel stopped successfully");
    } catch (error) {
      console.error("Error stopping tunnel:", error);
      throw error;
    }
  }

  private cleanup(): void {
    if (this.proxyServer) {
      this.proxyServer.close();
      this.proxyServer = null;
    }

    this.tunnel = null;
    this.localPort = null;
    this.publicUrl = null;
  }
}
