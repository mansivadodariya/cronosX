import { NextResponse } from "next/server";

// Routes that require a logged-in user
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/trade-snap",
  "/trade-analysis",
  "/ai-trade-analysis",
  "/ai-assistant",
  "/calendar",
  "/calculator",
  "/news",
  "/tools",
  "/ai-strategy",
  "/credit-history",
  "/broker",
  "/brokers",
  "/profile",
  "/settings",
  "/onboarding",
  "/steper",
];

// Auth routes — already-logged-in users should be bounced to /dashboard or their intended redirect
const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  const isLoggedIn = Boolean(token);

  if (pathname === "/tools") {
    return NextResponse.redirect(new URL("/calendar", request.url));
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    let redirectTarget = request.nextUrl.searchParams.get("redirect") || "/dashboard";
    if (
      redirectTarget === "/onboarding" ||
      redirectTarget === "/steper" ||
      redirectTarget.startsWith("/onboarding") ||
      redirectTarget.startsWith("/steper")
    ) {
      redirectTarget = "/dashboard";
    }
    return NextResponse.redirect(new URL(redirectTarget, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/trade-snap/:path*",
    "/trade-analysis",
    "/trade-analysis/:path*",
    "/ai-trade-analysis",
    "/ai-trade-analysis/:path*",
    "/ai-assistant/:path*",
    "/calendar",
    "/calendar/:path*",
    "/calculator",
    "/calculator/:path*",
    "/news",
    "/news/:path*",
    "/tools",
    "/tools/:path*",
    "/ai-strategy",
    "/ai-strategy/:path*",
    "/credit-history/:path*",
    "/broker/:path*",
    "/brokers/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/onboarding",
    "/onboarding/:path*",
    "/steper",
    "/steper/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ],
};
