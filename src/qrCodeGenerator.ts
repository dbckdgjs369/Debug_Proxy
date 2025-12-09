import * as QRCode from "qrcode";

export class QRCodeGenerator {
  public async generateQRCode(url: string): Promise<string> {
    try {
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: "M",
        type: "image/png",
        margin: 2,
        width: 300,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw new Error("QR 코드 생성에 실패했습니다");
    }
  }

  public async generateQRCodeBuffer(url: string): Promise<Buffer> {
    try {
      const buffer = await QRCode.toBuffer(url, {
        errorCorrectionLevel: "M",
        type: "png",
        margin: 2,
        width: 300,
      });

      return buffer;
    } catch (error) {
      console.error("Error generating QR code buffer:", error);
      throw new Error("QR 코드 버퍼 생성에 실패했습니다");
    }
  }
}
