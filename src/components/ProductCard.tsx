import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Product } from "@/types/db"
import { Button } from "@/components/ui/button"

type Props = {
  product: Product
  onEdit?: () => void
}

export function ProductCard({ product, onEdit }: Props) {
  return (
    <Card className="p-4">
      <CardTitle>{product.name}</CardTitle>
      <CardContent className="space-y-1">
        <p>가격: {product.price}원</p>
        <p>{product.available ? "판매 중" : "판매 중지"}</p>
        {onEdit && (
          <Button className="mt-2" size="sm" onClick={onEdit}>
            수정
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
