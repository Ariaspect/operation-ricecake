import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { productId, options, quantity } = await req.json()

  try {
    const order = await prisma.order.create({
      data: {
        date: new Date(),
        address: "kiosk",
        payment: "cash",
      },
    })

    const orderDetail = await prisma.orderDetail.create({
      data: {
        order_id: order.order_id,
        product_id: productId,
        quantity: quantity,
        options: {
          create: options.map((optionId: number) => ({
            option_id: optionId,
          })),
        },
      },
    })

    return NextResponse.json(orderDetail)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
