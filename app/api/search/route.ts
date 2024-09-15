import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the POST handler
export async function POST(req: NextRequest) {
  try {
    // Read the JSON file
    const filePath = path.resolve(process.cwd(), 'data.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const results = JSON.parse(data);

    // Parse JSON body
    const { query } = await req.json();
    console.log(results);

    // Return JSON response
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Error occurred' }, { status: 500 });
  }
}
