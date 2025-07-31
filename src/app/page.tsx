"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { ProductCard } from "@/components/ProductCard"
import { OrderModal } from "@/components/OrderModal"
import { Product } from "@/types/db"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetch("/api/products?available=true")
      .then((res) => res.json())
      .then(setProducts)
  }, [])

  const handleModalClose = () => {
    setShowOrderModal(false)
    setTimeout(() => {
      setSelectedProduct(null)
    }, 150)
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Product Order</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onClick={() => {
                setSelectedProduct(product)
                setShowOrderModal(true)
              }}
            />
          ))}
        </div>
      </main>
      {selectedProduct && (
        <OrderModal
          isOpen={showOrderModal}
          onClose={handleModalClose}
          product={selectedProduct}
        />
      )}
    </>
  )
}
