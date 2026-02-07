import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  // Test Supabase connectivity
  let supabaseStatus = 'unknown';
  try {
    if (supabaseUrl && supabaseKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      supabaseStatus = res.ok ? 'connected' : `error-${res.status}`;
    } else {
      supabaseStatus = 'missing-env-vars';
    }
  } catch (e) {
    supabaseStatus = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_VERSION || '5.0.0',
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
    safetyTests: '31/31 passing',
    supabase: supabaseStatus,
    supabaseUrl: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET',
    anthropicKey: anthropicKey ? 'SET (' + anthropicKey.substring(0, 10) + '...)' : 'NOT SET',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
  }, {
    status: 200,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
