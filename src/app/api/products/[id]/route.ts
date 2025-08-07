import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

type NextAPIParams = { params: Promise<{ id: string }> }

// GET /api/products/:id → 특정 상품 조회
export async function GET(_: NextRequest, { params }: NextAPIParams) {
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
        categories: {
          include: {
            category: true,
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
export async function PATCH(req: NextRequest, { params }: NextAPIParams) {
  const { id } = await params
  const product_id = Number(id)

  const body = await req.json()
  const {
    name,
    price,
    description,
    image_url,
    available,
    options: selectedOptions = {},
    categories: selectedCategories = [],
  } = body

  try {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.productOption.deleteMany({
        where: { product_id },
      })

      await tx.productCategory.deleteMany({
        where: { product_id },
      })

      const product = await tx.product.update({
        where: { product_id },
        data: {
          name,
          price,
          description,
          image_url,
          available,
          available_options: {
            create: Object.entries(selectedOptions).map(
              ([option_id, data]) => ({
                option: { connect: { option_id: Number(option_id) } },
                price: (data as { price: number }).price,
              })
            ),
          },
          categories: {
            create: selectedCategories.map((category_id: number) => ({
              category: { connect: { category_id } },
            })),
          },
        },
        include: {
          available_options: {
            include: {
              option: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
        },
      })

      return product
    })

    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ err: "Update failed" }, { status: 400 })
  }
}

// DELETE /api/products/:id → 상품 삭제
export async function DELETE(_: NextRequest, { params }: NextAPIParams) {
  const { id } = await params
  const product_id = Number(id)

  try {
    await prisma.product.delete({
      where: { product_id },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ err: "Delete failed" }, { status: 400 })
  }
}
