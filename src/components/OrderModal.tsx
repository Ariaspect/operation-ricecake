"use client"

import { Product, OptionType, ProductOption } from "@/types/db"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import Image from "next/image"

const OPTION_TYPES: OptionType[] = ["slice", "wrap", "addition"]

interface OrderModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<ProductOption[]>([])
  const [totalPrice, setTotalPrice] = useState(product.price)

  useEffect(() => {
    const optionsPrice = selectedOptions.reduce(
      (acc, option) => acc + option.price,
      0
    )
    setTotalPrice(product.price + optionsPrice)
  }, [selectedOptions, product.price])

  const handleOptionToggle = (option: ProductOption) => {
    setSelectedOptions((prev) =>
      prev.some((item) => item.option_id === option.option_id)
        ? prev.filter((item) => item.option_id !== option.option_id)
        : [...prev, option]
    )
  }

  const handleOrder = async () => {
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.product_id,
          options: selectedOptions.map((o) => o.option_id),
          quantity: 1, // Assuming quantity is always 1 for now
        }),
      })
      onClose()
    } catch (error) {
      console.error("Failed to place order", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div>
          <p>{product.description}</p>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover my-4"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 my-4 flex items-center justify-center">
              <p>No Image</p>
            </div>
          )}
          <div className="my-4 space-y-4">
            <h3 className="text-lg font-semibold">Options</h3>
            {OPTION_TYPES.map((type) => (
              <div key={type}>
                <h4 className="text-md font-semibold capitalize mb-2">
                  {type}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {product.available_options
                    ?.filter(({ option }) => option.type === type)
                    .map((productOption) => (
                      <Button
                        key={productOption.option_id}
                        variant={
                          selectedOptions.some(
                            (item) => item.option_id === productOption.option_id
                          )
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleOptionToggle(productOption)}
                      >
                        {productOption.option.name} (+${productOption.price})
                      </Button>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-xl font-bold">Total: ${totalPrice}</div>
          <Button onClick={handleOrder} className="mt-4 w-full">
            Place Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
