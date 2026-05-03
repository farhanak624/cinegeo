import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First handle Supabase auth session
  const supabaseResponse = await updateSession(request);

  // If Supabase middleware redirected, follow that redirect
  if (supabaseResponse.headers.get("location")) {
    return supabaseResponse;
  }

  // Then handle i18n routing
  const intlResponse = intlMiddleware(request);

  // Merge cookies from Supabase response into intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: ["/", "/(en|ka)/:path*"],
};
