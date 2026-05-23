import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const appState = writable({
  help: true,
});

export type AppMode = "market" | "otc";

const appModeKey = "stipflip:mode";

const getInitialAppMode = (): AppMode => {
  if (!browser) return "market";
  return localStorage.getItem(appModeKey) === "otc" ? "otc" : "market";
};

export const appMode = writable<AppMode>(getInitialAppMode());

if (browser) {
  appMode.subscribe((mode) => {
    localStorage.setItem(appModeKey, mode);
  });
}
