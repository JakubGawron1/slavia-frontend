import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-cookie";

/**
 * Next.js 16: proxy zamiast middleware.
 * Sprawdza obecność HttpOnly cookie sesji (JWT).
 * Weryfikację podpisu/ról nadal robi backend + client RBAC.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const hasSession = Boolean(token && token.length > 0);

  const isProtected =
    pathname === "/klub" ||
    pathname.startsWith("/klub/") ||
    pathname === "/panel" ||
    pathname.startsWith("/panel/");

  if (isProtected && !hasSession) {
    const login = new URL("/logowanie", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  // Nie przekierowuj /logowanie → /klub|/panel tylko dlatego, że cookie istnieje.
  // Stale cookie + next=/klub powodowało pętlę z „Ładowanie panelu…”.
  // Po udanym loginie klient sam robi push na właściwy panel.

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ["/klub", "/klub/:path*", "/panel", "/panel/:path*", "/logowanie"],
};
