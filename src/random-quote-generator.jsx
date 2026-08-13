import React, { useState, useEffect } from "react";

const BG = "#121212";
const SURFACE = "#1B1B1B";
const BORDER = "#2E2E2E";
const TEXT = "#EDEDED";
const TEXT_MUTE = "#8A8A8A";
const ACCENT = "#5EE0A3";

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "Do not wait for the perfect moment. Take the moment and make it perfect.", author: "Unknown" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
];

function getRandomIndex(excludeIndex, length) {
  if (length <= 1) return 0;
  let i;
  do {
    i = Math.floor(Math.random() * length);
  } while (i === excludeIndex);
  return i;
}

export default function RandomQuoteGenerator() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // show a random quote on open (already set via initial state)
  }, []);

  function newQuote() {
    setVisible(false);
    setTimeout(() => {
      setIndex((prev) => getRandomIndex(prev, QUOTES.length));
      setVisible(true);
    }, 150);
  }

  const quote = QUOTES[index];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h1 style={{ fontSize: 18, fontWeight: 500, color: TEXT_MUTE, margin: 0, letterSpacing: "0.02em" }}>
            Quote of the moment
          </h1>
        </div>

        <div
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            padding: "40px 32px",
            minHeight: 200,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
          <div style={{ fontSize: 32, color: ACCENT, lineHeight: 1, marginBottom: 12 }}>“</div>
          <p
            style={{
              fontSize: 21,
              lineHeight: 1.5,
              color: TEXT,
              margin: 0,
              fontWeight: 400,
            }}
          >
            {quote.text}
          </p>
          <p
            style={{
              fontSize: 14,
              color: TEXT_MUTE,
              marginTop: 20,
              marginBottom: 0,
            }}
          >
            — {quote.author}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <button
            onClick={newQuote}
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.01em",
              color: "#0A1F14",
              background: ACCENT,
              border: `1px solid ${ACCENT}`,
              borderRadius: 8,
              padding: "10px 24px",
              cursor: "pointer",
              fontFamily: "system-ui, -apple-system, sans-serif",
              transition: "opacity 0.15s ease",
            }}
            onMouseDown={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            New Quote
          </button>
        </div>
      </div>
    </div>
  );
}
