import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2026-01-28.clover',
});

export async function POST(req: Request) {
	const body = await req.text();
	// Await the headers first
	const headerPayload = await headers();
	const signature = headerPayload.get('Stripe-Signature') as string;
	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!,
		);
	} catch (error: any) {
		return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
	}

	const session = event.data.object as Stripe.Checkout.Session;
	const userId = session?.metadata?.userId;
	const courseId = session?.metadata?.courseId;

	if (event.type === 'checkout.session.completed') {
		if (!userId || !courseId) {
			return new NextResponse('Webhook Error: Missing metadata', {
				status: 400,
			});
		}

		const supabase = await createClient();

		// Grant access to the course in your 'purchases' table
		await supabase.from('purchases').insert({
			course_id: courseId,
			user_id: userId,
		});
	}

	return new NextResponse(null, { status: 200 });
}
