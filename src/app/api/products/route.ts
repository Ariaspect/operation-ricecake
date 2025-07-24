import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/products → 모든 상품 조회
export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      available_options: {
        include: {
          option: true,
        },
      },
    },
  })

  return NextResponse.json(products)
}

// POST /api/products → 상품 추가
export async function POST(req: Request) {
  const body = await req.json()

  const { name, price, available, optionIds, optionPrices } = body

  if (!name || price == null || available == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      name,
      price,
      available,
      available_options: {
        create: optionIds.map((optionId: number, idx: number) => ({
          option: { connect: { option_id: optionId } },
          price: optionPrices?.[idx] ?? 0,
        })),
      },
    },
  })

  return NextResponse.json(product)
}
