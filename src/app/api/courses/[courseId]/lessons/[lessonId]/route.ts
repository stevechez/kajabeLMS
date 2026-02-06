import Mux from '@mux/mux-node';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const { video } = new Mux({
	tokenId: process.env.MUX_TOKEN_ID,
	tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ courseId: string; lessonId: string }> },
) {
	try {
		const supabase = await createClient();
		const { courseId, lessonId } = await params;

		// 1. Check Auth
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return new NextResponse('Unauthorized', { status: 401 });

		// 2. Request Direct Upload from Mux
		const upload = await video.uploads.create({
			new_asset_settings: {
				playback_policy: ['public'], // Use ["signed"] later for extra security
			},
			cors_origin: '*', // In production, use your specific domain
		});

		// 3. Save the upload_id to the lesson so the Webhook can find it
		await supabase
			.from('lessons')
			.update({ mux_upload_id: upload.id })
			.eq('id', lessonId);

		return NextResponse.json({ url: upload.url });
	} catch (error) {
		console.error('[VIDEO_POST]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
