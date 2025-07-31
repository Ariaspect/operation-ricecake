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
import { Product, Option } from "@/types/db"

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
const [options, setOptions] = useState<Option[]>([])
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, { price: number }>
  >({})

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
      setSelectedOptions({})
    }
  }, [initial])

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await fetch("/api/options")
      const data = await res.json()
      setOptions(data)
    }

    fetchOptions()
  }, [])

  useEffect(() => {
    if (initial?.available_options) {
      const initialSelectedOptions = initial.available_options.reduce(
        (acc, option) => {
          acc[option.option_id] = { price: option.price }
          return acc
        },
        {} as Record<number, { price: number }>,
      )
      setSelectedOptions(initialSelectedOptions)
    }
  }, [initial?.available_options])

  const handleOptionChange = (
    optionId: number,
    isChecked: boolean,
    price?: number,
  ) => {
    setSelectedOptions((prev) => {
      const newSelected = { ...prev }
      if (isChecked) {
        const option = options.find((o) => o.option_id === optionId)
        newSelected[optionId] = { price: price ?? option?.price ?? 0 }
      } else {
        delete newSelected[optionId]
      }
      return newSelected
    })
  }

  const handleSubmit = async () => {
    const method = isEdit ? "PATCH" : "POST"
    const url = isEdit
      ? `/api/products/${initial!.product_id}`
      : "/api/products"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price,
        available,
        options: selectedOptions,
      }),
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
            required
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

          <div>
            <h3 className="text-lg font-medium">옵션 선택</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {options.map((option) => (
                <div key={option.option_id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`option-${option.option_id}`}
                    checked={!!selectedOptions[option.option_id]}
                    onChange={(e) =>
                      handleOptionChange(option.option_id, e.target.checked)
                    }
                  />
                  <label htmlFor={`option-${option.option_id}`}>
                    {option.name} (+
                    {selectedOptions[option.option_id]?.price ?? option.price}
                    원)
                  </label>
                  {selectedOptions[option.option_id] && (
                    <Input
                      type="number"
                      className="w-24 h-8"
                      placeholder="가격 (덮어쓰기)"
                      value={selectedOptions[option.option_id].price}
                      onChange={(e) =>
                        handleOptionChange(
                          option.option_id,
                          true,
                          +e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>{isEdit ? "저장" : "등록"}</Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleDelete()}
          >
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
