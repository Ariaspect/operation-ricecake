"use client"

import { Option } from "@/types/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OptionCardProps {
  option: Option
  onClick: () => void
}

export function OptionCard({ option, onClick }: OptionCardProps) {
  return (
    <Card onClick={onClick} className="cursor-pointer">
      <CardHeader>
        <CardTitle>{option.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>타입: {option.type}</p>
        <p>가격: {option.price.toLocaleString()}원</p>
      </CardContent>
    </Card>
  )
}
