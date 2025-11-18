// Simple helper to read the currently logged-in user from localStorage
// Returns null if no user is stored or parsing fails

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("vip_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read vip_user from localStorage", e);
    return null;
  }
}
