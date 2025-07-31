import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET /api/products → 모든 상품 조회
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const available = searchParams.get("available")

  const products = await prisma.product.findMany({
    where: available === "true" ? { available: true } : {},
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

  const { name, price, description, image_url, available, options: selectedOptions = {} } = body

  if (!name || price == null || available == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      name,
      price,
      description,
      image_url,
      available,
      available_options: {
        create: Object.entries(selectedOptions).map(([option_id, data]) => ({
          option: { connect: { option_id: Number(option_id) } },
          price: (data as { price: number }).price,
        })),
      },
    },
    include: {
      available_options: {
        include: {
          option: true,
        },
      },
    },
  })

  return NextResponse.json(product)
}
