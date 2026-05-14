import { NextResponse } from "next/server";
import QRCode from "qrcode";
import sharp from "sharp";
import fs from "fs/promises";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "Hello World";

  // 1. Generate QR code
  const qrBase64 = await QRCode.toDataURL(text, {
    width: 600,
    margin: 1,
    errorCorrectionLevel: "H", // VERY IMPORTANT for logo space
  });

  const qrBuffer = Buffer.from(qrBase64.split(",")[1], "base64");

  // 2. Load logo
  const logoPath = `${process.cwd()}/public/logo.png`;
  const logoBuffer = await fs.readFile(logoPath);

  const logoSize = 150;  // Size of white box & logo
  const halfLogo = logoSize / 2;

  // 3. Create a white box reserved for the logo
  const whiteBox = await sharp({
    create: {
      width: logoSize,
      height: logoSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  // 4. Resize logo to fit inside box
  const resizedLogo = await sharp(logoBuffer)
    .resize(logoSize - 10, logoSize - 10) // small padding
    .png()
    .toBuffer();

  // 5. Composite (first the box, then the logo)
  const finalImage = await sharp(qrBuffer)
    .composite([
      {
        input: whiteBox,
        gravity: "center",
      },
      {
        input: resizedLogo,
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();

  return new NextResponse(new Uint8Array(finalImage).buffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
