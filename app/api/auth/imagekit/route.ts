
import { getUploadAuthParams } from "@imagekit/next/server"
import { NextResponse } from 'next/server'
import config from '@/lib/config';

export async function GET() {
  // Extract configuration from your config file
  const { publicKey, privateKey } = config.env.imagekit;

  try {
  
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: privateKey as string,
      publicKey: publicKey as string,
 
    });

    console.log (`${token} token`)
    console.log (`${expire} expire`)
    console.log (`${signature} signature`)

    return NextResponse.json({ 
      token, 
      expire, 
      signature, 
      publicKey 
    });

  } catch (error) {
    console.error('Error generating upload auth params:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload parameters' },
      { status: 500 }
    );
  }
}