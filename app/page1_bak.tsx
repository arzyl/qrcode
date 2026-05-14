"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRPage() {
  const [text, setText] = useState("");
  const qrRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const charCount = text.length;

  // Draw logo on QR code after it renders
  useEffect(() => {
    if (!text || !qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const size = canvas.width;

    const logo = new Image();
    logo.src = "/logo.png"; // <-- put your logo in /public/logo.png
    logo.onload = () => {
      const logoSize = size * 0.2; // 20% of QR code size
      const x = (size - logoSize) / 2;
      const y = (size - logoSize) / 2;

      // Draw white background behind logo
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x, y, logoSize, logoSize);

      // Draw logo
      ctx.drawImage(logo, x, y, logoSize, logoSize);
    };
  }, [text]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>QR Code Generator</h2>

      <textarea
        value={text}
        onChange={handleChange}
        rows={5}
        cols={40}
        placeholder="Type here..."
        style={{ display: "block", marginBottom: "10px" }}
      />

      <p>
        Character count (including spaces & enter):{" "}
        <strong>{charCount}</strong>
      </p>

      {text && (
        <div style={{ marginTop: "20px" }} ref={qrRef}>
          <QRCodeCanvas value={text} size={200} includeMargin={true} />
        </div>
      )}
    </div>
  );
}