import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Product } from "@/types/db"

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: (product: Product) => void
  onDelete: (productId: number) => void
  initial?: Product | null
}

export function ProductModal({
  open,
  onClose,
  onSuccess,
  onDelete,
  initial,
}: Props) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [available, setAvailable] = useState(true)

  const isEdit = !!initial

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setPrice(initial.price)
      setAvailable(initial.available)
    } else {
      setName("")
      setPrice(0)
      setAvailable(true)
    }
  }, [initial])

  const handleSubmit = async () => {
    const method = isEdit ? "PATCH" : "POST"
    const url = isEdit
      ? `/api/products/${initial!.product_id}`
      : "/api/products"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, available }),
    })

    const data = await res.json()
    onSuccess(data)
  }

  const handleDelete = async () => {
    const productId = initial!.product_id

    const confirmed = confirm("정말로 이 상품을 삭제하시겠습니까?")
    if (!confirmed) return

    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    })

    if (res.ok) {
      onDelete(productId)
    } else {
      console.error("Failed to delete product")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "상품 수정" : "새 상품 추가"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="상품명"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="가격"
            value={price}
            onChange={(e) => setPrice(+e.target.value)}
          />
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            판매 중
          </label>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>{isEdit ? "저장" : "등록"}</Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete()}
          >
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
