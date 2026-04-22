import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title") || "Событие";
  const start = req.nextUrl.searchParams.get("start") || "";
  const end = req.nextUrl.searchParams.get("end") || "";

  if (!start) {
    return NextResponse.json({ error: "Missing start" }, { status: 400 });
  }

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Notes App//EN",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end || start}`,
    `SUMMARY:${title}`,
    `UID:${Date.now()}@notes-app`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="event.ics"`,
    },
  });
}
