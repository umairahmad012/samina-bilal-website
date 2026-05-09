/**
 * The 10 feature options realtors can pick for an Open House landing page.
 * Realtors choose 4. Stored on the row as a string[] of `key` values; UI
 * renders the matching `label`.
 *
 * Add/remove/reword as needed — the DB stores keys, so changing labels here
 * is purely cosmetic. Removing a key just hides it from the picker; existing
 * open houses still render the historical label if you keep an entry.
 */

export type OpenHouseFeatureKey =
  | "open_floor_plan"
  | "hardwood_floors"
  | "gourmet_kitchen"
  | "updated_bathrooms"
  | "primary_suite"
  | "finished_basement"
  | "two_car_garage"
  | "large_backyard"
  | "smart_home_tech"
  | "outdoor_living";

export type OpenHouseFeature = {
  key: OpenHouseFeatureKey;
  label: string;
  /** Lucide icon name. Render via `import { ${icon} } from "lucide-react"`. */
  icon: string;
};

export const OPEN_HOUSE_FEATURES: OpenHouseFeature[] = [
  { key: "open_floor_plan",   label: "Open Floor Plan",   icon: "LayoutDashboard" },
  { key: "hardwood_floors",   label: "Hardwood Floors",   icon: "TreePine" },
  { key: "gourmet_kitchen",   label: "Gourmet Kitchen",   icon: "ChefHat" },
  { key: "updated_bathrooms", label: "Updated Bathrooms", icon: "Bath" },
  { key: "primary_suite",     label: "Primary Suite",     icon: "BedDouble" },
  { key: "finished_basement", label: "Finished Basement", icon: "Layers" },
  { key: "two_car_garage",    label: "Two-Car Garage",    icon: "Car" },
  { key: "large_backyard",    label: "Large Backyard",    icon: "Trees" },
  { key: "smart_home_tech",   label: "Smart-Home Tech",   icon: "Smartphone" },
  { key: "outdoor_living",    label: "Outdoor Living",    icon: "Tent" },
];

export const OPEN_HOUSE_FEATURE_BY_KEY: Record<string, OpenHouseFeature> =
  Object.fromEntries(OPEN_HOUSE_FEATURES.map((f) => [f.key, f]));

export const MAX_FEATURES = 4;
