import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Always exclude NextAuth routes and static assets from middleware processing
  if (
    pathname.startsWith("/api/auth") ||
    pathname.includes("/_next") ||
    pathname.includes("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      cookieName: "next-auth.session-token", // Make sure cookie name matches
    });

    const isAuthenticated = !!token;

    // Check for admin role flexibly
    const isAdmin =
      token?.role === "ADMIN" ||
      String(token?.role || "").toUpperCase() === "ADMIN";

    const { nextUrl } = request;

    // Public paths that don't require authentication
    const publicPaths = [
      "/login",
      "/register",
      "/",
      "/dentists",
      "/dentists/:slug",
      "/about",
      "/treatments",
      "/forgot-password",
      "/check-mail",
    ];

    // Admin paths that require admin role
    const adminPaths = ["/admin"];

    // ManageDentsits paths that require authentication
    const ManageDentsitsPaths = ["/manage-dentists"];

    // Check if the path is public or has an extension (static asset)
    const isPublic =
      publicPaths.some((path) => nextUrl.pathname.startsWith(path)) ||
      nextUrl.pathname.includes(".");

    // Check if the path is an admin path
    const isAdminPath = adminPaths.some((path) =>
      nextUrl.pathname.startsWith(path)
    );

    // Check if the path is a ManageDentsits path
    const isManageDentsitsPath = ManageDentsitsPaths.some((path) =>
      nextUrl.pathname.startsWith(path)
    );

    // Protect admin routes - require both authentication and admin role
    if (isAdminPath) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", nextUrl));
      }

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", nextUrl));
      }
    }

    // Protect ManageDentsits routes - require authentication
    if (isManageDentsitsPath && !isAuthenticated) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }

    // Protect ManageDentsits and user-specific routes
    if (!isAuthenticated && !isPublic) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }

    // Redirect authenticated users away from auth pages
    if (
      isAuthenticated &&
      (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
    ) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, allow the request to proceed but log the issue
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Exclude NextAuth routes, static files, and API routes from middleware
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
