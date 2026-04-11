import { NextRequest, NextResponse } from "next/server";
import { getAllVesselsFromStore, addVesselToStore } from "@/lib/admin-store";
import type { Vessel } from "@/lib/supabase";

export async function GET() {
  const vessels = getAllVesselsFromStore();
  return NextResponse.json(vessels);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const vessel: Vessel = {
    id: body.id || `vessel-${Date.now()}`,
    title: body.title,
    slug: body.slug,
    type: body.type || "both",
    vessel_type: body.vessel_type || "화물선",
    year_built: body.year_built ?? null,
    length_m: body.length_m ?? null,
    tonnage: body.tonnage ?? null,
    engine_power: body.engine_power ?? null,
    capacity: body.capacity ?? null,
    location: body.location ?? null,
    description: body.description ?? null,
    features: body.features ?? [],
    rent_price_per_day: body.rent_price_per_day ?? null,
    sale_price: body.sale_price ?? null,
    is_available: body.is_available ?? true,
    is_featured: body.is_featured ?? false,
    status: body.status || "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vessel_images: body.vessel_images ?? [],
  };

  const created = addVesselToStore(vessel);
  return NextResponse.json(created, { status: 201 });
}
