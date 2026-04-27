"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import NotesApp from "@/components/NotesApp";
import Auth from "@/components/Auth";
import type { User } from "@supabase/supabase-js";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--muted)" }}>
        Загрузка...
      </div>
    );
  }

  if (!user) {
    return <Auth onAuth={() => supabase.auth.getUser().then(({ data }) => setUser(data.user))} />;
  }

  return (
    <NotesApp
      userId={user.id}
      onLogout={async () => {
        await supabase.auth.signOut();
        setUser(null);
      }}
    />
  );
}
