import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

export async function GET() {
  try {
    const staffRecords = await pb.collection('staff').getFullList({
      sort: 'account',
    });

    const accounts = staffRecords.map((record, index) => ({
      id: index + 1,
      account: record.account,
      pinCode: record.password,
    }));

    return NextResponse.json(accounts, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Failed to fetch staff from PocketBase:', error);
    return NextResponse.json([], { status: 500 });
  }
}
