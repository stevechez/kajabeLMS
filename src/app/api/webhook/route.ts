import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createAdminClient } from '@/utils/supabase/server';
import { WelcomeEmail } from '@/components/emails/welcome-email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	// Note: If you get a type error on apiVersion,
	// you can use '2023-10-16' which is widely stable for these types
	apiVersion: '2023-10-16' as any,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
	const body = await req.text();
	const signature = (await headers()).get('Stripe-Signature') as string;

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

		// Use Admin Client to bypass RLS since this is a server-to-server call
		const supabaseAdmin = createAdminClient();

		// 1. Record the purchase in the database
		const { error: purchaseError } = await supabaseAdmin
			.from('purchases')
			.insert({
				course_id: courseId,
				user_id: userId,
				price: session.amount_total ? session.amount_total / 100 : 0,
			});

		if (purchaseError) {
			console.error('[WEBHOOK_INSERT_ERROR]', purchaseError);
			return new NextResponse('Database Error', { status: 500 });
		}

		// 2. Fetch course details using Admin client to personalize the email
		const { data: course } = await supabaseAdmin
			.from('courses')
			.select('title')
			.eq('id', courseId)
			.single();

		// 3. Send the Welcome Email via Resend
		try {
			await resend.emails.send({
				from: 'Kajabi Clone <onboarding@resend.dev>',
				to: session.customer_details?.email || '',
				subject: `Welcome to ${course?.title || 'your new course'}!`,
				react: WelcomeEmail({
					courseName: course?.title || 'the course',
					userName: session.customer_details?.name || 'Student',
				}),
			});
		} catch (emailError) {
			console.error('[RESEND_EMAIL_ERROR]', emailError);
		}
	} else {
		return new NextResponse(`Unhandled event type ${event.type}`, {
			status: 200,
		});
	}

	return new NextResponse(null, { status: 200 });
}
