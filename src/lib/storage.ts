import { CalculatorInput, SavedEstimate } from "./calculations";

const INPUT_KEY = "calculator-input";
const HISTORY_KEY = "calculator-history";

export function loadInput(): CalculatorInput | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(INPUT_KEY);
  return raw ? (JSON.parse(raw) as CalculatorInput) : null;
}

export function persistInput(input: CalculatorInput) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INPUT_KEY, JSON.stringify(input));
}

export function loadHistory(): SavedEstimate[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedEstimate[];
  } catch {
    return [];
  }
}

export function persistHistory(history: SavedEstimate[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
