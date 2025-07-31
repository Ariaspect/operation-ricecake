import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

type NextAPIParams = { params: { id: string } }

// GET /api/options/:id → 단일 옵션 조회
export async function GET(_: NextRequest, { params }: NextAPIParams) {
  const { id } = await params

  try {
    const option = await prisma.option.findUnique({
      where: { option_id: Number(id) },
    })

    if (!option) {
      return NextResponse.json({ error: "Option not found" }, { status: 404 })
    }

    return NextResponse.json(option)
  } catch (err) {
    return NextResponse.json(
      { error: "Error fetching option" },
      { status: 500 }
    )
  }
}

// PUT /api/options/:id → 옵션 수정
export async function PUT(req: NextRequest, { params }: NextAPIParams) {
  const { id } = await params
  const body = await req.json()
  const { name, type, price } = body

  if (!name || !type || price == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  try {
    const option = await prisma.option.update({
      where: { option_id: Number(id) },
      data: {
        name,
        type,
        price,
      },
    })

    return NextResponse.json(option)
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 })
  }
}

// DELETE /api/options/:id → 옵션 삭제
export async function DELETE(_: NextRequest, { params }: NextAPIParams) {
  const { id } = await params

  try {
    await prisma.option.delete({
      where: { option_id: Number(id) },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 })
  }
}
