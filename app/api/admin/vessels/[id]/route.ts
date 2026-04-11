import { NextRequest, NextResponse } from "next/server";
import {
  getVesselFromStore,
  updateVesselInStore,
  deleteVesselFromStore,
} from "@/lib/admin-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vessel = getVesselFromStore(id);
  if (!vessel) return NextResponse.json({ error: "선박을 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json(vessel);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  if (body.title !== undefined && !body.title?.trim()) {
    return NextResponse.json({ error: "선박명은 필수입니다." }, { status: 400 });
  }

  const updated = updateVesselInStore(id, {
    ...body,
    updated_at: new Date().toISOString(),
  });
  if (!updated) return NextResponse.json({ error: "선박을 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteVesselFromStore(id);
  if (!deleted) return NextResponse.json({ error: "선박을 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ success: true });
}
