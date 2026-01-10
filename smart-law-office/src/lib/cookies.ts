export const setCookie = (name: string, value: string, days: number = 30) => {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // only use in production
  const isProduction = process.env.NODE_ENV === "production";
  const secureFlag = isProduction ? "secure;" : "";

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; ${secureFlag} samesite=lax`;
};

export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCooke = (name: string) => {
  if (typeof window === "undefined") return;

  const isProduction = process.env.NODE_ENV === "production";
  const secureFlag = isProduction ? "secure;" : "";

  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; ${secureFlag} samesite=lax`;
};
