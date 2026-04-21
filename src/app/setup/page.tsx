"use client";

export default function SetupPage() {
  const appUrl = "https://notes-app-omega-green.vercel.app";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
      fontFamily: "-apple-system, sans-serif",
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>Добавить в &quot;Поделиться&quot;</h1>
      <p style={{ fontSize: 16, opacity: 0.6, textAlign: "center", marginBottom: 32, maxWidth: 320, lineHeight: 1.5 }}>
        Нажмите кнопку ниже — откроется приложение Команды с готовой командой
      </p>

      <a
        href={`shortcuts://import-shortcut?url=${encodeURIComponent(appUrl + "/api/shortcut")}&name=${encodeURIComponent("В заметки")}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "16px 32px",
          borderRadius: 16,
          backgroundColor: "var(--accent)",
          color: "#fff",
          fontSize: 18,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Установить команду
      </a>

      <div style={{ marginTop: 48, maxWidth: 340, fontSize: 14, opacity: 0.5, lineHeight: 1.6 }}>
        <p style={{ textAlign: "center", marginBottom: 16 }}>После установки:</p>
        <p>1. Откройте любой сайт в Safari</p>
        <p>2. Нажмите &quot;Поделиться&quot;</p>
        <p>3. Выберите &quot;В заметки&quot;</p>
        <p>4. Ссылка сохранится автоматически!</p>
      </div>
    </div>
  );
}
