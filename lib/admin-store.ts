import type { Vessel, VesselImage } from "./supabase";
import vesselsJson from "@/data/vessels.json";
import { VESSEL_OVERRIDES } from "@/constants/vessels-data";

function loadInitialVessels(): Vessel[] {
  return (vesselsJson as unknown as Vessel[]).map((v) => {
    const override = VESSEL_OVERRIDES[v.id];
    if (!override) return v;
    return { ...v, ...override, vessel_images: v.vessel_images };
  });
}

let vessels: Vessel[] = loadInitialVessels();

export function getAllVesselsFromStore(): Vessel[] {
  return vessels;
}

export function getVesselFromStore(id: string): Vessel | null {
  return vessels.find((v) => v.id === id) ?? null;
}

export function addVesselToStore(vessel: Vessel): Vessel {
  vessels = [...vessels, vessel];
  return vessel;
}

export function updateVesselInStore(id: string, updates: Partial<Vessel>): Vessel | null {
  const index = vessels.findIndex((v) => v.id === id);
  if (index === -1) return null;
  vessels[index] = { ...vessels[index], ...updates, vessel_images: updates.vessel_images ?? vessels[index].vessel_images };
  vessels = [...vessels];
  return vessels[index];
}

export function deleteVesselFromStore(id: string): boolean {
  const before = vessels.length;
  vessels = vessels.filter((v) => v.id !== id);
  return vessels.length < before;
}

export function addImageToVessel(vesselId: string, image: VesselImage): Vessel | null {
  const vessel = vessels.find((v) => v.id === vesselId);
  if (!vessel) return null;
  vessel.vessel_images = [...(vessel.vessel_images ?? []), image];
  return vessel;
}

export function removeImageFromVessel(vesselId: string, imageId: string): Vessel | null {
  const vessel = vessels.find((v) => v.id === vesselId);
  if (!vessel) return null;
  vessel.vessel_images = (vessel.vessel_images ?? []).filter((img) => img.id !== imageId);
  return vessel;
}
