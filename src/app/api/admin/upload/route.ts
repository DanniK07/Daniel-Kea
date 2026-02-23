import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { isAdmin } from "@/server/auth/assertAdmin";
import { ForbiddenError, handleError } from "@/lib/errors/handler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new ForbiddenError("Acceso restringido a administradores");
    }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const relDir = "uploads";
  const relPath = `/${relDir}/${filename}`;
  const diskDir = path.join(process.cwd(), "public", relDir);
  const diskPath = path.join(diskDir, filename);

    await mkdir(diskDir, { recursive: true });
    await writeFile(diskPath, buffer);

    return NextResponse.json({ url: relPath });
  } catch (error) {
    const handled = handleError(error);
    return NextResponse.json(
      { error: handled.message },
      { status: handled.statusCode },
    );
  }
}

