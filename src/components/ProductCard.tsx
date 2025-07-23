import { Product } from "@/types/db";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <Card className="p-4 shadow-sm border">
      <CardTitle className="text-lg font-semibold">
        {product.name}
      </CardTitle>
      <CardContent className="space-y-2 mt-2">
        <p className="text-sm text-muted-foreground">
          가격: {product.price}원
        </p>
        <Button variant="default" size="sm">
          주문하기
        </Button>
      </CardContent>
    </Card>
  );
}
