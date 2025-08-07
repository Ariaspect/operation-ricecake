import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  })
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const { name } = await request.json()
  const newCategory = await prisma.category.create({
    data: { name },
  })
  return NextResponse.json(newCategory, { status: 201 })
}
