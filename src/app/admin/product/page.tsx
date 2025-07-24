"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types/db"
import { ProductCard } from "@/components/ProductCard"
import { ProductModal } from "@/components/ProductModal"
import { Button } from "@/components/ui/button"

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Product | null>(null)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
  }, [])

  const handleModalClose = () => {
    setShowModal(false)
    setEditTarget(null)
  }

  const handleAddUpdate = (updated: Product) => {
    setProducts((prev) =>
      editTarget
        ? prev.map((p) => (p.product_id === updated.product_id ? updated : p))
        : [...prev, updated]
    )
    handleModalClose()
  }

  const handleDelete = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.product_id !== productId))
    handleModalClose()
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <Button onClick={() => setShowModal(true)}>+ 상품 추가</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            onEdit={() => {
              setEditTarget(product)
              setShowModal(true)
            }}
          />
        ))}
      </div>

      <ProductModal
        open={showModal}
        onClose={handleModalClose}
        initial={editTarget}
        onSuccess={handleAddUpdate}
        onDelete={handleDelete}
      />
    </>
  )
}
