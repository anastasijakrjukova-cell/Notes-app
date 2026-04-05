"use client";

import { useState, useEffect, useMemo } from "react";
import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "notes-app-data";

function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

type MobileView = "list" | "view" | "edit";

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>("list");

  useEffect(() => {
    setNotes(loadNotes());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveNotes(notes);
  }, [notes, loaded]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = q
      ? notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q)
        )
      : notes;
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, search]);

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  const handleNew = () => {
    setSelectedId(null);
    setEditing(true);
    setMobileView("edit");
  };

  const handleSelect = (note: Note) => {
    setSelectedId(note.id);
    setEditing(false);
    setMobileView("view");
  };

  const handleSave = (title: string, content: string) => {
    if (selectedId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === selectedId
            ? { ...n, title, content, updatedAt: Date.now() }
            : n
        )
      );
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes((prev) => [newNote, ...prev]);
      setSelectedId(newNote.id);
    }
    setEditing(false);
    setMobileView("list");
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setEditing(false);
      setMobileView("list");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setMobileView("list");
  };

  const handleBack = () => {
    setSelectedId(null);
    setEditing(false);
    setMobileView("list");
  };

  const handleEdit = () => {
    setEditing(true);
    setMobileView("edit");
  };

  // Mobile: show one screen at a time
  // Desktop (lg+): show sidebar + main side by side
  return (
    <div className="flex h-full overflow-hidden" style={{ backgroundColor: "var(--background)" }}>

      {/* Sidebar - always visible on lg+, conditionally on mobile */}
      <aside
        className={`
          w-full lg:w-80 shrink-0 flex-col border-r h-full
          ${mobileView === "list" ? "flex" : "hidden lg:flex"}
        `}
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="px-4 py-4 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <h1 className="text-lg font-bold">Записная книжка</h1>
          <button
            onClick={handleNew}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-white text-xl font-bold transition-colors cursor-pointer active:scale-95"
            style={{ backgroundColor: "var(--accent)" }}
            title="Новая заметка"
          >
            +
          </button>
        </div>

        <div className="px-4 py-3 shrink-0">
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-base outline-none border"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <NotesList
          notes={filtered}
          selectedId={selectedId}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />

        <div
          className="px-4 py-3 text-xs border-t shrink-0"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          Всего заметок: {notes.length} · v2.0
        </div>
      </aside>

      {/* Main area */}
      <main
        className={`
          flex-1 flex flex-col h-full overflow-hidden
          ${mobileView !== "list" ? "flex" : "hidden lg:flex"}
        `}
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        {editing ? (
          <div className="flex flex-col h-full">
            <div
              className="lg:hidden px-4 py-3 border-b flex items-center shrink-0"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={handleCancel}
                className="text-base cursor-pointer active:opacity-70"
                style={{ color: "var(--accent)" }}
              >
                ← Назад
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <NoteEditor
                note={selectedNote}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          </div>
        ) : selectedNote ? (
          <div className="flex flex-col h-full">
            <div
              className="px-4 lg:px-8 py-4 border-b flex items-center justify-between gap-3 shrink-0"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={handleBack}
                className="lg:hidden text-base cursor-pointer active:opacity-70 shrink-0"
                style={{ color: "var(--accent)" }}
              >
                ←
              </button>
              <h2 className="text-lg lg:text-2xl font-bold truncate flex-1">{selectedNote.title}</h2>
              <button
                onClick={handleEdit}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer transition-colors shrink-0 active:scale-95"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Редактировать
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-4 lg:py-6 whitespace-pre-wrap leading-relaxed text-base">
              {selectedNote.content || (
                <span className="opacity-40">Пустая заметка</span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center opacity-40">
              <p className="text-5xl mb-4">📝</p>
              <p className="text-lg">Выберите заметку или создайте новую</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
