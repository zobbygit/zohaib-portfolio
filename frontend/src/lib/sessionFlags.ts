const INTRO_KEY = "zohaib:intro-seen";

export function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* storage unavailable: intro simply replays */
  }
}
