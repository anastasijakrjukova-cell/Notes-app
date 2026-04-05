"use client";

import { useState, useEffect } from "react";
import type { Note } from "./NotesApp";

interface NoteEditorProps {
  note: Note | null;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

export default function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), content);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <input
        type="text"
        placeholder="Заголовок заметки..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-lg lg:text-2xl font-bold px-4 lg:px-6 py-3 lg:py-4 bg-transparent border-b outline-none placeholder:opacity-50 shrink-0"
        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
        autoFocus
      />
      <textarea
        placeholder="Начните писать..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full px-4 lg:px-6 py-3 lg:py-4 bg-transparent outline-none resize-none text-base leading-relaxed placeholder:opacity-50"
        style={{ color: "var(--foreground)" }}
      />
      <div
        className="flex gap-3 px-4 lg:px-6 py-3 lg:py-4 border-t shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 lg:flex-none px-5 py-3 lg:py-2.5 rounded-xl text-white font-medium transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed active:scale-95 text-base"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 lg:flex-none px-5 py-3 lg:py-2.5 rounded-xl font-medium transition-colors cursor-pointer active:scale-95 text-base"
          style={{
            backgroundColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
