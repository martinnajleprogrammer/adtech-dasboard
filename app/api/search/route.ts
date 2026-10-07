import { searchMockItems, SearchResponse } from "@/lib/mock-search-items";
import { NextResponse } from "next/server";

const DEFAULT_LIMIT = 10;
const MIN_LIMIT = 1;
const MAX_LIMIT = 50;
const MIN_QUERY_CHARS = 2;

export async function GET(req: Request): Promise<Response> {

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const limit = searchParams.get('limit'); // string | null

  const limitN = limit === null ? DEFAULT_LIMIT : Number(limit);
  if (query.trim().length < MIN_QUERY_CHARS ||
    (!Number.isInteger(limitN) || limitN < MIN_LIMIT || limitN > MAX_LIMIT))
  {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const res: SearchResponse = searchMockItems(query, limitN);
  return NextResponse.json(
    res,
    { status: 200 }
  );
}