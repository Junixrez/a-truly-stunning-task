import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Submission } from '@/lib/models/Submission';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const visitorId = searchParams.get('visitorId');

    if (!visitorId) {
      return NextResponse.json(
        { error: 'Visitor ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Fetch last 5 submissions for this visitor, sorted by most recent
    const submissions = await Submission.find({ visitorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error in /api/history:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
