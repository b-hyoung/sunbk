/**
 * 데이터 접근 레이어
 * DATA_SOURCE=local  → data/*.json (로컬 목 데이터)
 * DATA_SOURCE=supabase (또는 미설정) → Supabase
 */

import type { Vessel, Booking } from "./supabase";
import { createClient } from "@supabase/supabase-js";
import { PHOTO_DATA_MODE, getCategoryLabel, getPhotoGroup } from "@/constants/photo-config";
import type { VesselImage } from "./supabase";
import workPhotosJson from "@/data/work-photos.json";
import { getAllVesselsFromStore } from "./admin-store";

// 항상 로컬 JSON 사용 (Supabase 연동 시 false로 변경)
const USE_LOCAL = true;

// ── Supabase 클라이언트 (서버 전용, service role) ──────────────────────────
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── 로컬 JSON 로더 (정적 import — edge runtime 호환) ──────────────────────
import bookingsJson from "@/data/bookings.json";

/** 인메모리 admin-store에서 선박 목록 반환 */
function localVessels(): Vessel[] {
  return getAllVesselsFromStore();
}

function localBookings() {
  return bookingsJson;
}

async function getVesselsFromSupabase(): Promise<Vessel[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("vessels")
    .select("*, vessel_images(*)")
    .eq("status", "active");
  return data ?? [];
}

// ── 퍼블릭 함수 ──────────────────────────────────────────────────────────

export async function getFeaturedVessels(): Promise<Vessel[]> {
  if (USE_LOCAL) {
    const vessels = localVessels();
    return vessels
      .filter((v) => v.is_featured && v.status === "active")
      .slice(0, 6);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("vessels")
    .select("*, vessel_images(*)")
    .eq("is_featured", true)
    .eq("status", "active")
    .limit(6);
  return data ?? [];
}

export async function getVessels(searchParams: {
  type?: string;
  vessel_type?: string;
}): Promise<Vessel[]> {
  if (USE_LOCAL) {
    const vessels = localVessels();
    let result = vessels.filter((v) => v.status === "active");

    if (searchParams.type === "rent") {
      result = result.filter((v) => v.type === "rent" || v.type === "both");
    } else if (searchParams.type === "sale") {
      result = result.filter((v) => v.type === "sale" || v.type === "both");
    }

    if (searchParams.vessel_type) {
      result = result.filter((v) => v.vessel_type === searchParams.vessel_type);
    }

    return result.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  let query = supabase
    .from("vessels")
    .select("*, vessel_images(*)")
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (searchParams.type === "rent") {
    query = query.in("type", ["rent", "both"]);
  } else if (searchParams.type === "sale") {
    query = query.in("type", ["sale", "both"]);
  }
  if (searchParams.vessel_type) {
    query = query.eq("vessel_type", searchParams.vessel_type);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getVesselBySlug(slug: string): Promise<Vessel | null> {
  if (USE_LOCAL) {
    const vessels = localVessels();
    return vessels.find((v) => v.slug === slug && v.status === "active") ?? null;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("vessels")
    .select("*, vessel_images(*)")
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  return data;
}

export async function getVesselById(id: string): Promise<Vessel | null> {
  if (USE_LOCAL) {
    const vessels = localVessels();
    return vessels.find((v) => v.id === id && v.status === "active") ?? null;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("vessels")
    .select("*, vessel_images(*)")
    .eq("id", id)
    .eq("status", "active")
    .single();
  return data;
}

// ── 어드민 전용 ───────────────────────────────────────────────────────────

export async function getAdminStats() {
  if (USE_LOCAL) {
    const [vessels, bookings] = await Promise.all([localVessels(), localBookings()]);
    return {
      vessels: vessels.filter((v) => v.status === "active").length,
      bookings: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
    };
  }

  const supabase = getSupabaseAdmin();
  const [vessels, bookings, pendingBookings] = await Promise.all([
    supabase.from("vessels").select("id", { count: "exact" }).eq("status", "active"),
    supabase.from("bookings").select("id", { count: "exact" }),
    supabase.from("bookings").select("id", { count: "exact" }).eq("status", "pending"),
  ]);
  return {
    vessels: vessels.count ?? 0,
    bookings: bookings.count ?? 0,
    pendingBookings: pendingBookings.count ?? 0,
  };
}

export async function getRecentBookings() {
  if (USE_LOCAL) {
    const bookings = localBookings();
    return bookings
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  }

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("bookings")
    .select("*, vessels(title)")
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

// ── 예약 생성 ─────────────────────────────────────────────────────────────

export interface CreateBookingInput {
  vessel_id: string;
  booking_type: "rent" | "inquiry";
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  total_price?: number | null;
  message?: string | null;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  if (USE_LOCAL) {
    // 로컬 모드: 저장 없이 성공 응답 반환 (실제 파일 write는 서버리스 환경에서 불가)
    return {
      id: `local-${Date.now()}`,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_days: null,
      admin_memo: null,
      ...input,
    } as unknown as Booking;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      ...input,
      customer_email: input.customer_email ?? null,
      start_date: input.start_date ?? null,
      end_date: input.end_date ?? null,
      total_price: input.total_price ?? null,
      message: input.message ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ── 사진 조회 ────────────────────────────────────────────────────────────

export interface WorkPhotoItem {
  id: string;
  src: string;
  title: string;
  ship: string;
  vessel_id: string;
  category: string;
  group: "vessel" | "work";
  taken_date?: string;
}

function toWorkPhotoItems(vessels: Vessel[], groupFilter?: "vessel" | "work"): WorkPhotoItem[] {
  const items = vessels.flatMap((v) =>
    (v.vessel_images ?? []).map((img) => ({
      id: img.id,
      src: img.url,
      title: getCategoryLabel(img.category ?? "exterior"),
      ship: v.title,
      vessel_id: v.id,
      category: img.category ?? "exterior",
      group: getPhotoGroup(img.category ?? "exterior"),
      taken_date: img.taken_date,
    }))
  );
  if (groupFilter) return items.filter((p) => p.group === groupFilter);
  return items;
}

/** 작업현장 사진 (work 그룹만: 상가, 항해, 환경정화 등) */
export async function getAllWorkPhotos(): Promise<WorkPhotoItem[]> {
  if (PHOTO_DATA_MODE === "split") {
    return workPhotosJson as WorkPhotoItem[];
  }
  const vessels = USE_LOCAL ? localVessels() : await getVesselsFromSupabase();
  return toWorkPhotoItems(vessels, "work");
}

/** 선박 사진 (vessel 그룹만: 외관, 조타실, 기관실 등) */
export async function getAllVesselPhotos(): Promise<WorkPhotoItem[]> {
  const vessels = USE_LOCAL ? localVessels() : await getVesselsFromSupabase();
  return toWorkPhotoItems(vessels, "vessel");
}

/** 전체 사진 (그룹 구분 없이) */
export async function getAllPhotos(): Promise<WorkPhotoItem[]> {
  const vessels = USE_LOCAL ? localVessels() : await getVesselsFromSupabase();
  return toWorkPhotoItems(vessels);
}

/** 특정 선박의 사진 (그룹 필터 옵션) */
export async function getVesselPhotos(
  vesselId: string,
  groupFilter?: "vessel" | "work"
): Promise<VesselImage[]> {
  const vessel = await getVesselById(vesselId);
  if (!vessel) return [];
  let images = vessel.vessel_images ?? [];
  if (groupFilter) {
    images = images.filter((img) => getPhotoGroup(img.category ?? "exterior") === groupFilter);
  }
  return images;
}
