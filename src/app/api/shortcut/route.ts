import { NextResponse } from "next/server";
import plist from "./plist";

export async function GET() {
  const data = plist("https://notes-app-omega-green.vercel.app");
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="save-to-notes.shortcut"',
    },
  });
}
