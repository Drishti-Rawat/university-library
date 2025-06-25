

import { getUploadAuthParams } from "@imagekit/next/server";

import { NextResponse } from "next/server";
import config from "@/lib/config";
const {
  env: {
    imagekit: { publicKey, privateKey },
  },
} = config;

export async function GET() {
  try {
    // Generate upload authentication parameters
    const { token, expire, signature } = getUploadAuthParams({
      privateKey : privateKey!,
      publicKey : publicKey!,
      // Optional: expire time in seconds (max 1 hour in future)
      // expire: 30 * 60, 
      // Optional: custom token
      // token: "custom-unique-token",
    });

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error: any) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500 }
    );
  }
}