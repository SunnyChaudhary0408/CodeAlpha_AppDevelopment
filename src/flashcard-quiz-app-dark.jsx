import React, { useState } from "react";

const BG = "#121212";
const SURFACE = "#1B1B1B";
const SURFACE_2 = "#232323";
const BORDER = "#2E2E2E";
const TEXT = "#EDEDED";
const TEXT_MUTE = "#8A8A8A";
const ACCENT = "#5EE0A3";
const DANGER = "#E0615E";

const STARTER_CARDS = [
  { id: 1, question: "What is the capital of France?", answer: "Paris" },
  { id: 2, question: "What is the powerhouse of the cell?", answer: "The mitochondria" },
  { id: 3, question: "What year did World War II end?", answer: "1945" },
];

function Button({ onClick, children, variant = "default", disabled, style }) {
  const base = {
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.01em",
    borderRadius: 8,
    padding: "9px 16px",
    cursor: disabled ? "default" : "pointer",
    transition: "background 0.15s ease, opacity 0.15s ease",
    fontFamily: "system-ui, -apple-system, sans-serif",
    border: "1px solid transparent",
  };
  const variants = {
    default: {
      background: "transparent",
      color: disabled ? "#4A4A4A" : TEXT,
      borderColor: disabled ? "#232323" : BORDER,
    },
    primary: {
      background: ACCENT,
      color: "#0A1F14",
      borderColor: ACCENT,
    },
    danger: {
      background: "transparent",
      color: DANGER,
      borderColor: "#3A2323",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

function Label({ children }) {
  return (
    <div
      style={{
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: TEXT_MUTE,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {children}
    </div>
  );
}

export default function FlashcardQuizApp() {
  const [cards, setCards] = useState(STARTER_CARDS);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState("study");
  const [form, setForm] = useState({ question: "", answer: "" });
  const [editingId, setEditingId] = useState(null);
  const [nextId, setNextId] = useState(STARTER_CARDS.length + 1);

  const hasCards = cards.length > 0;
  const current = hasCards ? cards[index] : null;

  function goNext() {
    if (!hasCards) return;
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  }
  function goPrev() {
    if (!hasCards) return;
    setFlipped(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  }
  function openAdd() {
    setForm({ question: "", answer: "" });
    setMode("add");
  }
  function openEdit(card) {
    setForm({ question: card.question, answer: card.answer });
    setEditingId(card.id);
    setMode("edit");
  }
  function saveAdd() {
    if (!form.question.trim() || !form.answer.trim()) return;
    setCards((c) => [...c, { id: nextId, question: form.question.trim(), answer: form.answer.trim() }]);
    setNextId((n) => n + 1);
    setIndex(cards.length);
    setFlipped(false);
    setMode("study");
  }
  function saveEdit() {
    if (!form.question.trim() || !form.answer.trim()) return;
    setCards((c) =>
      c.map((card) =>
        card.id === editingId ? { ...card, question: form.question.trim(), answer: form.answer.trim() } : card
      )
    );
    setMode("study");
    setEditingId(null);
  }
  function deleteCard(id) {
    const pos = cards.findIndex((c) => c.id === id);
    const nextCards = cards.filter((c) => c.id !== id);
    setCards(nextCards);
    if (nextCards.length === 0) setIndex(0);
    else if (pos <= index) setIndex((i) => Math.max(0, Math.min(i, nextCards.length - 1)));
    setFlipped(false);
  }

  const cardNumber = hasCards ? index + 1 : 0;

  const textareaStyle = {
    width: "100%",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: 15,
    color: TEXT,
    background: SURFACE_2,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "10px 12px",
    resize: "vertical",
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        display: "flex",
        justifyContent: "center",
        padding: "56px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: TEXT, margin: 0 }}>Flashcards</h1>
          <p style={{ fontSize: 13, color: TEXT_MUTE, margin: "4px 0 0" }}>
            Study set · {cards.length} {cards.length === 1 ? "card" : "cards"}
          </p>
        </div>

        {mode === "study" && (
          <>
            <div
              onClick={() => hasCards && setFlipped((f) => !f)}
              style={{
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                minHeight: 220,
                padding: "24px 24px 28px",
                cursor: hasCards ? "pointer" : "default",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Label>{hasCards ? `Card ${cardNumber} of ${cards.length}` : "No cards"}</Label>
                {hasCards && <Label style={{ color: ACCENT }}>{flipped ? "Answer" : "Question"}</Label>}
              </div>

              {!hasCards ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ color: TEXT_MUTE, fontSize: 14, margin: 0 }}>
                    No flashcards yet. Add one to start studying.
                  </p>
                </div>
              ) : (
                <p
                  style={{
                    fontSize: 18,
                    lineHeight: 1.5,
                    color: TEXT,
                    margin: "18px 0",
                  }}
                >
                  {flipped ? current.answer : current.question}
                </p>
              )}

              {hasCards && (
                <div style={{ fontSize: 12, color: TEXT_MUTE }}>
                  Tap to {flipped ? "show question" : "show answer"}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              <Button onClick={goPrev} disabled={!hasCards} style={{ flex: 1 }}>
                ‹ Previous
              </Button>
              <Button onClick={() => setFlipped((f) => !f)} disabled={!hasCards} variant="primary" style={{ flex: 1 }}>
                {flipped ? "Show question" : "Show answer"}
              </Button>
              <Button onClick={goNext} disabled={!hasCards} style={{ flex: 1 }}>
                Next ›
              </Button>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center", borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
              <Button onClick={openAdd}>+ Add card</Button>
              {hasCards && <Button onClick={() => openEdit(current)}>Edit card</Button>}
              <Button onClick={() => setMode("manage")}>Manage all</Button>
            </div>
          </>
        )}

        {(mode === "add" || mode === "edit") && (
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 22px" }}>
            <Label>{mode === "add" ? "New card" : `Editing card ${cardNumber}`}</Label>
            <div style={{ marginTop: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: TEXT_MUTE, marginBottom: 6 }}>Question (front)</div>
              <textarea
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                rows={3}
                style={textareaStyle}
                placeholder="Type the question that appears on the front..."
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: TEXT_MUTE, marginBottom: 6 }}>Answer (back)</div>
              <textarea
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                rows={3}
                style={textareaStyle}
                placeholder="Type the answer that appears on the back..."
              />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button onClick={() => { setMode("study"); setEditingId(null); }}>Cancel</Button>
              <Button onClick={mode === "add" ? saveAdd : saveEdit} variant="primary">
                {mode === "add" ? "Save card" : "Save changes"}
              </Button>
            </div>
          </div>
        )}

        {mode === "manage" && (
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Label>All cards ({cards.length})</Label>
              <Button onClick={openAdd}>+ Add card</Button>
            </div>
            {cards.length === 0 ? (
              <p style={{ color: TEXT_MUTE, fontSize: 14 }}>No flashcards yet.</p>
            ) : (
              cards.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "14px 0",
                    borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: TEXT_MUTE, marginBottom: 3 }}>{String(i + 1).padStart(2, "0")}</div>
                    <div style={{ fontSize: 14, color: TEXT, marginBottom: 2 }}>{c.question}</div>
                    <div style={{ fontSize: 13, color: ACCENT }}>{c.answer}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "flex-start" }}>
                    <Button onClick={() => { setIndex(i); openEdit(c); }}>Edit</Button>
                    <Button onClick={() => deleteCard(c.id)} variant="danger">Delete</Button>
                  </div>
                </div>
              ))
            )}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <Button onClick={() => setMode("study")}>‹ Back to study</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
