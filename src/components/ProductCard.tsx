import { Card, CardContent } from "@/components/ui/card"
import { Product } from "@/types/db"
import Image from "next/image"

type Props = {
  product: Product
  onClick?: () => void
}

export function ProductCard({ product, onClick }: Props) {
  return (
    <Card
      className={`cursor-pointer ${!product.available ? "bg-gray-100" : ""}`}
      onClick={onClick}
    >
      {product.image_url && (
        <div className="relative w-full h-32">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold">{product.name}</p>
          <p
            className={`text-sm ${
              product.available ? "text-green-500" : "text-red-500"
            }`}
          >
            {product.available ? "판매 중" : "판매 중지"}
          </p>
        </div>
        <p className="font-semibold">{product.price.toLocaleString()}원</p>
      </CardContent>
    </Card>
  )
}
