import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const vesselSlug = formData.get("vesselSlug") as string | null;

  if (!file || !vesselSlug) {
    return NextResponse.json({ error: "파일과 선박 슬러그가 필요합니다." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "images", "vessels", vesselSlug);
  const filePath = path.join(dir, fileName);

  await mkdir(dir, { recursive: true });
  await writeFile(filePath, buffer);

  const url = `/images/vessels/${vesselSlug}/${fileName}`;
  return NextResponse.json({ url, fileName });
}
