import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Product } from "@/types/db"

type Props = {
  product: Product
  onClick?: () => void
}

export function ProductCard({ product, onClick }: Props) {
  return (
    <Card className="p-4">
      <CardTitle>{product.name}</CardTitle>
      <CardContent className="space-y-1">
        <p>가격: {product.price}원</p>
        <p>{product.available ? "판매 중" : "판매 중지"}</p>
              </CardContent>
    </Card>
  )
}
