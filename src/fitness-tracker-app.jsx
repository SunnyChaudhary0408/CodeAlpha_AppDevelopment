import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const BG = "#121212";
const SURFACE = "#1B1B1B";
const SURFACE_2 = "#232323";
const BORDER = "#2E2E2E";
const TEXT = "#EDEDED";
const TEXT_MUTE = "#8A8A8A";
const ACCENT = "#5EE0A3";
const ACCENT_2 = "#5EA8E0";
const ACCENT_3 = "#E0B85E";
const DANGER = "#E0615E";

const GOALS = { steps: 10000, calories: 600, workouts: 2 };

function dayLabel(offset) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function keyForOffset(offset) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

// seed history for the previous 6 days so the weekly chart has context
function seedHistory() {
  const entries = [];
  let id = 1;
  for (let offset = 6; offset >= 1; offset--) {
    const date = keyForOffset(offset);
    const steps = 4000 + Math.round(Math.random() * 7000);
    const calories = 250 + Math.round(Math.random() * 350);
    entries.push({ id: id++, date, type: "steps", steps, calories: 0, description: "Daily steps" });
    if (Math.random() > 0.3) {
      entries.push({
        id: id++,
        date,
        type: "workout",
        description: ["Running", "Cycling", "Strength training", "Yoga"][Math.floor(Math.random() * 4)],
        duration: 20 + Math.round(Math.random() * 40),
        calories,
        steps: 0,
      });
    }
  }
  return { entries, nextId: id };
}

function Label({ children, style }) {
  return (
    <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: TEXT_MUTE, ...style }}>
      {children}
    </div>
  );
}

function ProgressBar({ value, goal, color }) {
  const pct = Math.min(100, Math.round((value / goal) * 100));
  return (
    <div style={{ background: SURFACE_2, borderRadius: 999, height: 8, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.3s ease" }} />
    </div>
  );
}

function StatCard({ label, value, unit, goal, color }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 18px", flex: 1, minWidth: 0 }}>
      <Label>{label}</Label>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "8px 0 10px" }}>
        <span style={{ fontSize: 24, fontWeight: 600, color: TEXT }}>{value.toLocaleString()}</span>
        <span style={{ fontSize: 12, color: TEXT_MUTE }}>{unit}</span>
      </div>
      <ProgressBar value={value} goal={goal} color={color} />
      <div style={{ fontSize: 11, color: TEXT_MUTE, marginTop: 6 }}>Goal: {goal.toLocaleString()} {unit}</div>
    </div>
  );
}

function Button({ onClick, children, variant = "default", style, disabled }) {
  const variants = {
    default: { background: "transparent", color: disabled ? "#4A4A4A" : TEXT, border: `1px solid ${disabled ? "#232323" : BORDER}` },
    primary: { background: ACCENT, color: "#0A1F14", border: `1px solid ${ACCENT}` },
    danger: { background: "transparent", color: DANGER, border: "1px solid #3A2323" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontSize: 13,
        fontWeight: 500,
        borderRadius: 8,
        padding: "9px 16px",
        cursor: disabled ? "default" : "pointer",
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export default function FitnessTrackerApp() {
  const [seed] = useState(seedHistory);
  const [entries, setEntries] = useState(seed.entries);
  const [nextId, setNextId] = useState(seed.nextId);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ kind: "workout", description: "", duration: "", calories: "", steps: "" });

  const today = todayKey();
  const todayEntries = entries.filter((e) => e.date === today);

  const todayTotals = useMemo(() => {
    return todayEntries.reduce(
      (acc, e) => ({
        steps: acc.steps + (e.steps || 0),
        calories: acc.calories + (e.calories || 0),
        workouts: acc.workouts + (e.type === "workout" ? 1 : 0),
      }),
      { steps: 0, calories: 0, workouts: 0 }
    );
  }, [todayEntries]);

  const weekData = useMemo(() => {
    const days = [];
    for (let offset = 6; offset >= 0; offset--) {
      const date = keyForOffset(offset);
      const dayEntries = entries.filter((e) => e.date === date);
      const calories = dayEntries.reduce((s, e) => s + (e.calories || 0), 0);
      const steps = dayEntries.reduce((s, e) => s + (e.steps || 0), 0);
      days.push({ day: dayLabel(offset), calories, steps });
    }
    return days;
  }, [entries]);

  function resetForm() {
    setForm({ kind: "workout", description: "", duration: "", calories: "", steps: "" });
  }

  function submitEntry() {
    if (form.kind === "workout") {
      if (!form.description.trim()) return;
      setEntries((e) => [
        ...e,
        {
          id: nextId,
          date: today,
          type: "workout",
          description: form.description.trim(),
          duration: Number(form.duration) || 0,
          calories: Number(form.calories) || 0,
          steps: 0,
        },
      ]);
    } else {
      if (!form.steps) return;
      setEntries((e) => [
        ...e,
        {
          id: nextId,
          date: today,
          type: "steps",
          description: "Steps entry",
          steps: Number(form.steps) || 0,
          calories: Number(form.calories) || 0,
        },
      ]);
    }
    setNextId((n) => n + 1);
    resetForm();
    setShowForm(false);
  }

  function deleteEntry(id) {
    setEntries((e) => e.filter((entry) => entry.id !== id));
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, padding: "40px 20px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 500, color: TEXT, margin: 0 }}>Fitness Tracker</h1>
            <p style={{ fontSize: 13, color: TEXT_MUTE, margin: "4px 0 0" }}>Today's summary</p>
          </div>
          <Button variant="primary" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Close" : "+ Log activity"}
          </Button>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          <StatCard label="Steps" value={todayTotals.steps} unit="steps" goal={GOALS.steps} color={ACCENT} />
          <StatCard label="Calories" value={todayTotals.calories} unit="kcal" goal={GOALS.calories} color={ACCENT_3} />
          <StatCard label="Workouts" value={todayTotals.workouts} unit="done" goal={GOALS.workouts} color={ACCENT_2} />
        </div>

        {/* Add form */}
        {showForm && (
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 20px", marginBottom: 28 }}>
            <Label style={{ marginBottom: 12 }}>Log new activity</Label>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <Button
                variant={form.kind === "workout" ? "primary" : "default"}
                onClick={() => setForm((f) => ({ ...f, kind: "workout" }))}
                style={{ flex: 1 }}
              >
                Workout
              </Button>
              <Button
                variant={form.kind === "steps" ? "primary" : "default"}
                onClick={() => setForm((f) => ({ ...f, kind: "steps" }))}
                style={{ flex: 1 }}
              >
                Steps
              </Button>
            </div>

            {form.kind === "workout" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  placeholder="Exercise type (e.g. Running)"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  style={inputStyle}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    placeholder="Duration (min)"
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <input
                    placeholder="Calories burned"
                    type="number"
                    value={form.calories}
                    onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  placeholder="Steps count"
                  type="number"
                  value={form.steps}
                  onChange={(e) => setForm((f) => ({ ...f, steps: e.target.value }))}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  placeholder="Calories (optional)"
                  type="number"
                  value={form.calories}
                  onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))}
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
              <Button onClick={() => { resetForm(); setShowForm(false); }}>Cancel</Button>
              <Button variant="primary" onClick={submitEntry}>Save</Button>
            </div>
          </div>
        )}

        {/* Weekly chart */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 20px 8px", marginBottom: 28 }}>
          <Label style={{ marginBottom: 12 }}>Calories burned — last 7 days</Label>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <BarChart data={weekData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: TEXT_MUTE, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} />
                <YAxis tick={{ fill: TEXT_MUTE, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: SURFACE_2, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: TEXT }}
                  itemStyle={{ color: ACCENT_3 }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar dataKey="calories" fill={ACCENT_3} radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's log */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 20px" }}>
          <Label style={{ marginBottom: 12 }}>Today's log ({todayEntries.length})</Label>
          {todayEntries.length === 0 ? (
            <p style={{ color: TEXT_MUTE, fontSize: 14, margin: 0 }}>No activity logged yet today.</p>
          ) : (
            todayEntries
              .slice()
              .reverse()
              .map((e, i) => (
                <div
                  key={e.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, color: TEXT }}>
                      {e.type === "workout" ? e.description : "Steps logged"}
                    </div>
                    <div style={{ fontSize: 12, color: TEXT_MUTE, marginTop: 2 }}>
                      {e.type === "workout"
                        ? `${e.duration} min · ${e.calories} kcal`
                        : `${e.steps.toLocaleString()} steps${e.calories ? ` · ${e.calories} kcal` : ""}`}
                    </div>
                  </div>
                  <Button variant="danger" onClick={() => deleteEntry(e.id)}>
                    Delete
                  </Button>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: 14,
  color: TEXT,
  background: SURFACE_2,
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: "10px 12px",
  outline: "none",
  boxSizing: "border-box",
};
