import { writable } from "svelte/store";

export const appState = writable({
  help: true,
});
