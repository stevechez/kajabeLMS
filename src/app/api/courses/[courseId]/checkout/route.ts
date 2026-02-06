import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2026-01-28.clover', // Use the latest stable version
});

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ courseId: string }> },
) {
	try {
		const supabase = await createClient();
		const { courseId } = await params;

		// 1. Identify the user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user || !user.email) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		// 2. Fetch course data
		const { data: course } = await supabase
			.from('courses')
			.select('*')
			.eq('id', courseId)
			.single();

		if (!course) {
			return new NextResponse('Not Found', { status: 404 });
		}

		// 3. Check for existing purchase
		const { data: purchase } = await supabase
			.from('purchases')
			.select('*')
			.eq('course_id', courseId)
			.eq('user_id', user.id)
			.single();

		if (purchase) {
			return new NextResponse('Already purchased', { status: 400 });
		}

		// 4. Create Stripe Line Items
		const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
			{
				quantity: 1,
				price_data: {
					currency: 'usd',
					product_data: {
						name: course.title,
						description: course.description!,
					},
					unit_amount: Math.round(course.price! * 100), // Stripe uses cents
				},
			},
		];

		// 5. Create the Session
		const session = await stripe.checkout.sessions.create({
			customer_email: user.email,
			line_items,
			mode: 'payment',
			success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
			cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/preview?canceled=1`,
			metadata: {
				courseId: course.id,
				userId: user.id,
			},
		});

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error('[STRIPE_CHECKOUT_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
