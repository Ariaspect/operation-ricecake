"use client"

import { Option } from "@/types/db"
import { Card, CardContent } from "@/components/ui/card"

interface OptionCardProps {
  option: Option
  onClick: () => void
  onDelete: () => void
}

export function OptionCard({ option, onClick }: OptionCardProps) {
  return (
    <Card onClick={onClick} className="cursor-pointer">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold">{option.name}</p>
          <p className="text-sm text-gray-500">{option.type}</p>
        </div>
        <p className="font-semibold">{option.price.toLocaleString()}원</p>
      </CardContent>
    </Card>
  )
}
