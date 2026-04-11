import type { Vessel, VesselImage } from "./supabase";
import { VESSEL_OVERRIDES } from "@/constants/vessels-data";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

function getJsonPath(): string {
  return path.resolve(process.cwd(), "data", "vessels.json");
}

function readVessels(): Vessel[] {
  const jsonPath = getJsonPath();
  const raw = readFileSync(jsonPath, "utf-8");
  const vessels = JSON.parse(raw) as Vessel[];
  return vessels.map((v) => {
    const override = VESSEL_OVERRIDES[v.id];
    if (!override) return v;
    return { ...v, ...override, vessel_images: v.vessel_images };
  });
}

function writeVessels(vessels: Vessel[]): void {
  writeFileSync(getJsonPath(), JSON.stringify(vessels, null, 2), "utf-8");
}

export function getAllVesselsFromStore(): Vessel[] {
  return readVessels();
}

export function getVesselFromStore(id: string): Vessel | null {
  return readVessels().find((v) => v.id === id) ?? null;
}

export function addVesselToStore(vessel: Vessel): Vessel {
  const vessels = readVessels();
  vessels.push(vessel);
  writeVessels(vessels);
  return vessel;
}

export function updateVesselInStore(id: string, updates: Partial<Vessel>): Vessel | null {
  const vessels = readVessels();
  const index = vessels.findIndex((v) => v.id === id);
  if (index === -1) return null;
  vessels[index] = { ...vessels[index], ...updates, vessel_images: updates.vessel_images ?? vessels[index].vessel_images };
  writeVessels(vessels);
  return vessels[index];
}

export function deleteVesselFromStore(id: string): boolean {
  const vessels = readVessels();
  const filtered = vessels.filter((v) => v.id !== id);
  if (filtered.length === vessels.length) return false;
  writeVessels(filtered);
  return true;
}

export function addImageToVessel(vesselId: string, image: VesselImage): Vessel | null {
  const vessels = readVessels();
  const vessel = vessels.find((v) => v.id === vesselId);
  if (!vessel) return null;
  vessel.vessel_images = [...(vessel.vessel_images ?? []), image];
  writeVessels(vessels);
  return vessel;
}

export function removeImageFromVessel(vesselId: string, imageId: string): Vessel | null {
  const vessels = readVessels();
  const vessel = vessels.find((v) => v.id === vesselId);
  if (!vessel) return null;
  vessel.vessel_images = (vessel.vessel_images ?? []).filter((img) => img.id !== imageId);
  writeVessels(vessels);
  return vessel;
}
