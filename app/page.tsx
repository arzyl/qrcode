"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };
  async function generateQR() {
    if (!inputText) return alert("Please enter some text.");

    const res = await fetch(`/api/qr?text=${encodeURIComponent(inputText)}`);
    const blob = await res.blob();
    setQrImage(URL.createObjectURL(blob));
  }

  return (
    <div className="flex flex-col items-center p-6 space-y-4 max-w-md mx-auto">

      <h1 className="text-2xl font-bold">QR Code Generator</h1>


      


       <textarea className="w-full p-3 border rounded-lg"
        value={inputText}
        onChange={handleChange}
        rows={5}
        cols={40}
        placeholder="Type here..."
        style={{ display: "block", marginBottom: "10px" }} 
	onChange={(e) => setInputText(e.target.value)}
      />

      <button
        onClick={generateQR}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Generate QR
      </button>

      {qrImage && (
        <img src={qrImage} alt="Generated QR" className="w-64 h-64 mt-4" />
      )}
    </div>
  );
}
