import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const upload = await video.uploads.create({
      new_asset_settings: { playback_policy: ["signed"] },
      cors_origin: "*", // In production, set this to your domain
    });

    return NextResponse.json({ url: upload.url, id: upload.id });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
