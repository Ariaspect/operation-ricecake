import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  await prisma.category.delete({
    where: { category_id: id },
  })
  return new NextResponse(null, { status: 204 })
}
