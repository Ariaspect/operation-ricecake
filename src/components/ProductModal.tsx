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
import { Product, Option, OptionType, Category } from "@/types/db"

const OPTION_TYPES: OptionType[] = ["slice", "wrap", "addition"]

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
  const [description, setDescription] = useState<string | null>("")
  const [imageUrl, setImageUrl] = useState<string | null>("")
  const [available, setAvailable] = useState(true)
  const [options, setOptions] = useState<Option[]>([])
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, { price: number }>
  >({})
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  const isEdit = !!initial

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setPrice(initial.price)
      setDescription(initial.description)
      setImageUrl(initial.image_url)
      setAvailable(initial.available)
      setSelectedCategories(
        initial.categories?.map((c) => c.category.category_id) || []
      )
    } else {
      setName("")
      setPrice(0)
      setDescription("")
      setImageUrl("")
      setAvailable(true)
      setSelectedOptions({})
      setSelectedCategories([])
    }
  }, [initial])

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await fetch("/api/options")
      const data = await res.json()
      setOptions(data)
    }

    const fetchCategories = async () => {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data)
    }

    fetchOptions()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (initial?.available_options) {
      const initialSelectedOptions = initial.available_options.reduce(
        (acc, option) => {
          acc[option.option_id] = { price: option.price }
          return acc
        },
        {} as Record<number, { price: number }>
      )
      setSelectedOptions(initialSelectedOptions)
    }
  }, [initial?.available_options])

  const handleOptionToggle = (option: Option) => {
    setSelectedOptions((prev) => {
      const newSelected = { ...prev }
      if (newSelected[option.option_id]) {
        delete newSelected[option.option_id]
      } else {
        newSelected[option.option_id] = { price: option.price }
      }
      return newSelected
    })
  }

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handlePriceChange = (optionId: number, newPrice: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: { price: newPrice },
    }))
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
        description,
        image_url: imageUrl,
        available,
        options: selectedOptions,
        categories: selectedCategories,
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
            required
          />
          <Input
            placeholder="간단한 설명"
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="이미지 URL"
            value={imageUrl ?? ""}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            판매 중
          </label>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">카테고리 선택</h3>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <Button
                  key={category.category_id}
                  variant={
                    selectedCategories.includes(category.category_id)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleCategoryToggle(category.category_id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">옵션 선택</h3>
            {OPTION_TYPES.map((type) => (
              <div key={type}>
                <h4 className="text-md font-semibold capitalize mb-2">
                  {type}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {options
                    .filter((o) => o.type === type)
                    .map((option) => (
                      <div
                        key={option.option_id}
                        className="flex flex-col gap-2"
                      >
                        <Button
                          variant={
                            selectedOptions[option.option_id]
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleOptionToggle(option)}
                        >
                          {option.name} (+
                          {selectedOptions[option.option_id]?.price ??
                            option.price}
                          원)
                        </Button>
                        {selectedOptions[option.option_id] && (
                          <Input
                            type="number"
                            className="h-8"
                            placeholder="가격 (덮어쓰기)"
                            value={selectedOptions[option.option_id].price}
                            onChange={(e) =>
                              handlePriceChange(
                                option.option_id,
                                +e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
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
