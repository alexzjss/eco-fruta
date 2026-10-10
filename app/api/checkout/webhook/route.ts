import { NextResponse } from 'next/server';

export async function POST() {
  // Payment status can be persisted here when an order database is introduced.
  return NextResponse.json({ received: true });
}
