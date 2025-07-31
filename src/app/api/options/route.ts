
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/options → 모든 옵션 조회
export async function GET() {
  const options = await prisma.option.findMany()
  return NextResponse.json(options)
}

// POST /api/options → 옵션 추가
export async function POST(req: Request) {
  const body = await req.json()
  const { name, type, price } = body

  if (!name || !type || price == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const option = await prisma.option.create({
    data: {
      name,
      type,
      price,
    },
  })

  return NextResponse.json(option)
}
