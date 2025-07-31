"use client";

import { Product, Option } from "@/types/db";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [totalPrice, setTotalPrice] = useState(product.price);

  useEffect(() => {
    const optionsPrice = selectedOptions.reduce(
      (acc, option) => acc + option.price,
      0
    );
    setTotalPrice(product.price + optionsPrice);
  }, [selectedOptions, product.price]);

  const handleOptionToggle = (option: Option) => {
    setSelectedOptions((prev) =>
      prev.some((item) => item.option_id === option.option_id)
        ? prev.filter((item) => item.option_id !== option.option_id)
        : [...prev, option]
    );
  };

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
      });
      onClose();
    } catch (error) {
      console.error("Failed to place order", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div>
          <p>{product.description}</p>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover my-4" />
          ) : (
            <div className="w-full h-48 bg-gray-200 my-4 flex items-center justify-center">
              <p>No Image</p>
            </div>
          )}
          <div className="my-4">
            <h3 className="text-lg font-semibold">Options</h3>
            <div className="grid grid-cols-3 gap-2">
              {product.available_options?.map(({ option, price }) => (
                <Button
                  key={option.option_id}
                  variant={
                    selectedOptions.some(
                      (item) => item.option_id === option.option_id
                    )
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleOptionToggle(option)}
                >
                  {option.name} (+${price})
                </Button>
              ))}
            </div>
          </div>
          <div className="text-xl font-bold">Total: ${totalPrice}</div>
          <Button onClick={handleOrder} className="mt-4 w-full">
            Place Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}