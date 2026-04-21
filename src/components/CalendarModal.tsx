"use client";

import { useState } from "react";

function formatDateForICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function generateICS(title: string, startDate: Date, endDate: Date, description: string): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Notes App//EN",
    "BEGIN:VEVENT",
    `DTSTART:${formatDateForICS(startDate)}`,
    `DTEND:${formatDateForICS(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `UID:${crypto.randomUUID()}@notes-app`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

interface CalendarModalProps {
  onClose: () => void;
}

export default function CalendarModal({ onClose }: CalendarModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!title.trim() || !date || !time) return;

    const start = new Date(`${date}T${time}`);
    const end = new Date(start.getTime() + parseInt(duration) * 60000);

    const ics = generateICS(title.trim(), start, end, description);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "event.ics";
    a.click();
    URL.revokeObjectURL(url);

    onClose();
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 360,
          backgroundColor: "var(--card-bg)",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
          Новое событие
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="text"
            placeholder="Название события"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            autoFocus
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={inputStyle}
          />

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={inputStyle}
          >
            <option value="15">15 минут</option>
            <option value="30">30 минут</option>
            <option value="60">1 час</option>
            <option value="90">1.5 часа</option>
            <option value="120">2 часа</option>
            <option value="180">3 часа</option>
            <option value="1440">Весь день</option>
          </select>

          <textarea
            placeholder="Описание (необязательно)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button
            onClick={handleCreate}
            disabled={!title.trim() || !date || !time}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: 12,
              backgroundColor: title.trim() && date && time ? "var(--accent)" : "var(--border)",
              color: title.trim() && date && time ? "#fff" : "var(--muted)",
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              cursor: title.trim() && date && time ? "pointer" : "not-allowed",
            }}
          >
            В календарь
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: 12,
              backgroundColor: "var(--border)",
              color: "var(--foreground)",
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
