import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

type NextAPIParams = { params: { id: string } }

// GET /api/products/:id → 특정 상품 조회
export async function GET(
  _: NextRequest,
  { params }: NextAPIParams
) {
  const { id } = await params
  const product_id = Number(id)

  try {
    const product = await prisma.product.findUnique({
      where: { product_id },
      include: {
        available_options: {
          include: {
            option: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (err) {
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    )
  }
}

// PATCH /api/products/:id → 상품 수정
export async function PATCH(
  req: NextRequest,
  { params }: NextAPIParams
) {
  const { id } = await params
  const product_id = Number(id)

  const body = await req.json()

  try {
    const updated = await prisma.product.update({
      where: { product_id },
      data: body,
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 })
  }
}

// DELETE /api/products/:id → 상품 삭제
export async function DELETE(
  _: NextRequest,
  { params }: NextAPIParams
) {
  const { id } = await params
  const product_id = Number(id)

  try {
    await prisma.product.delete({
      where: { product_id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 })
  }
}
