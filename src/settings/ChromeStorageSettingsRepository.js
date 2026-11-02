import { SettingsRepository } from "./SettingsRepository.js";
import { DEFAULT_SETTINGS, STORAGE_KEY } from "../shared/constants.js";

export class ChromeStorageSettingsRepository extends SettingsRepository {
  async load() {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    return { ...DEFAULT_SETTINGS, ...(stored[STORAGE_KEY] ?? {}) };
  }

  async save(patch) {
    const next = { ...(await this.load()), ...patch };
    await chrome.storage.local.set({ [STORAGE_KEY]: next });
    return next;
  }

  subscribe(listener) {
    const handler = (changes, area) => {
      if (area !== "local" || !changes[STORAGE_KEY]) return;
      listener({ ...DEFAULT_SETTINGS, ...(changes[STORAGE_KEY].newValue ?? {}) });
    };
    chrome.storage.onChanged.addListener(handler);
    return () => chrome.storage.onChanged.removeListener(handler);
  }
}
