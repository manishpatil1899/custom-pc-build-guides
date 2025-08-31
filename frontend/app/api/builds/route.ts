import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    const backendUrl = queryString 
      ? `${process.env.NEXT_PUBLIC_API_URL}/builds?${queryString}`
      : `${process.env.NEXT_PUBLIC_API_URL}/builds`;

    const backendResponse = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error('Builds API route error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch builds' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authToken = request.cookies.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/builds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error('Create build API route error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create build' },
      { status: 500 }
    );
  }
}
