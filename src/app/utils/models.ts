export interface Model {
  id: string;
  url: string;
  watchInfo: {
    watchName: string;
    watchSize: string;
  };
  model: {
    wristSize: string;
    desiredWrist: "left" | "right";
  };
}

const STORAGE_KEY = "tryon-models";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getModelsFromStorage(): Model[] {
  if (!isBrowser()) {
    return [];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored) as Model[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

export function saveModelsToStorage(models: Model[]): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
}

export function deleteModelFromStorage(id: string): void {
  if (!isBrowser()) {
    return;
  }

  const models = getModelsFromStorage().filter((model) => model.id !== id);
  saveModelsToStorage(models);
}

export function ensureDefaultModelSeeded(): Model[] {
  const existing = getModelsFromStorage();

  const findLegacy = existing.find((model) => model.id === "default-seed-v1");

  if (findLegacy) {
    deleteModelFromStorage(findLegacy.id);
  }

  const defaultModel: Model = {
    id: "default-seed-v2",
    url: "https://aar0cehbutockake.public.blob.vercel-storage.com/models/1760798715333-lurzhf-IMG_0339.webpwebp",
    watchInfo: {
      watchName: "Tudor Black Bay Pro",
      watchSize: "39mm",
    },
    model: {
      wristSize: "7",
      desiredWrist: "left",
    },
  };

  const seeded = [defaultModel];
  saveModelsToStorage(seeded);
  return seeded;
}
