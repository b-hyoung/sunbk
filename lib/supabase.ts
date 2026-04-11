import { createClient } from '@supabase/supabase-js'

// 타입 정의
export type VesselType = 'rent' | 'sale' | 'both'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type VesselStatus = 'active' | 'inactive' | 'sold'

export interface Vessel {
  id: string
  title: string
  slug: string
  type: VesselType
  vessel_type: string
  year_built: number | null
  length_m: number | null
  tonnage: number | null
  engine_power: string | null
  capacity: number | null
  location: string | null
  description: string | null
  features: string[] | null
  rent_price_per_day: number | null
  sale_price: number | null
  is_available: boolean
  is_featured: boolean
  status: VesselStatus
  created_at: string
  updated_at: string
  vessel_images?: VesselImage[]
}

export interface VesselImage {
  id: string
  vessel_id: string
  url: string
  is_primary: boolean
  sort_order: number
  category?: string
  taken_date?: string
}

export interface Booking {
  id: string
  vessel_id: string
  booking_type: 'rent' | 'inquiry'
  customer_name: string
  customer_phone: string
  customer_email: string | null
  start_date: string | null
  end_date: string | null
  total_days: number | null
  total_price: number | null
  status: BookingStatus
  message: string | null
  admin_memo: string | null
  created_at: string
  vessels?: Vessel
}

export interface Inquiry {
  id: string
  vessel_id: string | null
  name: string
  phone: string
  email: string | null
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

// Supabase 클라이언트는 lazy로 생성 (실제 사용 시에만)
let _supabase: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _supabase
}

/** @deprecated getSupabase() 사용 권장 */
export const supabase = {
  get from() { return getSupabase().from.bind(getSupabase()) },
  get auth() { return getSupabase().auth },
  get storage() { return getSupabase().storage },
} as unknown as ReturnType<typeof createClient>
