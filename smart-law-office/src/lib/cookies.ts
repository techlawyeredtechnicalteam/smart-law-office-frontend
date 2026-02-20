export const getAuthCookie = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  const name = "auth-token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
};

export const setAuthCookie = async (token: string, role: string) => {
  if (typeof window === "undefined") return;
  // Set server-side via route handler so middleware can see it
  await fetch("/api/auth/set-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, role })
  });
};

export const deleteAuthCookie = async () => {
  if (typeof window === "undefined") return;
  await fetch("/api/auth/clear-session", { method: "POST" });
  // Also clear client-side immediately for instant effect
  const expired =
    "; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax";
  document.cookie = `auth-token=${expired}`;
  document.cookie = `user-role=${expired}`;
};
