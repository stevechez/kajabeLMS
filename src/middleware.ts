import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// 1. Keep your updateSession logic
export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					// Update the request cookies
					cookiesToSet.forEach(
						({ name, value, options }) =>
							request.cookies.set({ name, value, ...options }), // <--- Change this line
					);

					// Sync with the response cookies
					supabaseResponse = NextResponse.next({
						request,
					});

					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Simple route protection
	if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return supabaseResponse;
}

// 2. THE FIX: Export the actual middleware function
export async function middleware(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};
