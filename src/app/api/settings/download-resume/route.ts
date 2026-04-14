import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getSettings();

  if (!settings.resumeUrl) {
    return NextResponse.json({ error: "Currículo não encontrado" }, { status: 404 });
  }

  const response = await fetch(settings.resumeUrl);

  if (!response.ok) {
    return NextResponse.json({ error: "Erro ao baixar currículo" }, { status: 502 });
  }

  const blob = await response.arrayBuffer();
  const filename = settings.name
    ? `curriculo-${settings.name.toLowerCase().replace(/\s+/g, "-")}.pdf`
    : "curriculo.pdf";

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
