import { getSettings as mockGetSettings, updateSettings as mockUpdateSettings } from '../mock/settingsMock';

export async function getSettings() {
  return mockGetSettings();
}

export async function updateSettings(payload) {
  return mockUpdateSettings(payload);
}