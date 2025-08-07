import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type NextAPIParams = { params: Promise<{ id: string }> }

export async function DELETE(request: Request, { params }: NextAPIParams) {
  const { id } = await params
  const category_id = Number(id)

  await prisma.category.delete({
    where: { category_id: category_id },
  })
  return new NextResponse(null, { status: 204 })
}
