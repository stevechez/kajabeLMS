import Mux from "@mux/mux-node";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

// Initialize Supabase Admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("mux-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event;

  try {
    // Verify the webhook is actually from Mux
    event = video.webhooks.unwrap(body, signature, process.env.MUX_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const { type, data } = event;

  // Case 1: The video is fully processed and ready to watch
  if (type === "video.asset.ready") {
    const { playback_ids, id: assetId, upload_id } = data;
    const playbackId = playback_ids?.[0]?.id;

    if (playbackId) {
      // Update our lesson record with the new Playback ID
      const { error } = await supabaseAdmin
        .from("lessons")
        .update({
          video_playback_id: playbackId,
          // You might also want to store the raw assetId for deletion later
        })
        .eq("mux_upload_id", upload_id); // Ensure you saved upload_id during the POST request earlier

      if (error) console.error("Database update failed:", error);
    }
  }

  // Case 2: Clean up when an asset is deleted in Mux
  if (type === "video.asset.deleted") {
    await supabaseAdmin
      .from("lessons")
      .update({ video_playback_id: null })
      .eq("video_playback_id", data.playback_ids?.[0]?.id);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
