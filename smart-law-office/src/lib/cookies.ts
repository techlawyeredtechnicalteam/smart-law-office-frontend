// export const setAuthCookie = (token: string) => {
//   if (typeof window === "undefined") return;
//   const isProduction = process.env.NODE_ENV === "production";

//   // ✅ FIXED: All attributes on ONE line, separated by semicolons
//   document.cookie = `auth-token=${token}; path=/; max-age=${
//     30 * 24 * 60 * 60
//   }; ${isProduction ? "secure; " : ""}samesite=strict`;
// };

export const getAuthCookie = (): string | undefined => {
  if (typeof window === "undefined") return undefined;

  const name = "auth-token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
};

export const setAuthCookie = (token: string, role: string) => {
  if (typeof window === "undefined") return;

  const isProduction = process.env.NODE_ENV === "production";
  const secureFlag =
    isProduction || window.location.protocol === "https:" ? "; secure" : "";

  // Set both cookies with the same expiry
  const maxAge = 30 * 24 * 60 * 60; // 30 days (or adjust as needed)

  document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; samesite=lax${secureFlag}`;
  document.cookie = `user-role=${role}; path=/; max-age=${maxAge}; samesite=lax${secureFlag}`;
};

export const deleteAuthCookie = () => {
  const expired =
    "; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax";
  document.cookie = `auth-token=${expired}`;
  document.cookie = `user-role=${expired}`;
};
