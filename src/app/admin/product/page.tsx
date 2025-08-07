"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types/db"
import { ProductCard } from "@/components/ProductCard"
import { ProductModal } from "@/components/ProductModal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
  }, [])

  const handleModalClose = () => {
    setShowModal(false)
    setTimeout(() => {
      setEditTarget(null)
    }, 150)
  }

  const handleAddUpdate = (updated: Product) => {
    setProducts((prev) =>
      editTarget
        ? prev.map((p) => (p.product_id === updated.product_id ? updated : p))
        : [...prev, updated]
    )
    handleModalClose()
  }

  const confirmDelete = () => {
    if (productToDelete !== null) {
      handleDelete(productToDelete)
    }
  }

  const handleDelete = async (productId: number) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    })

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.product_id !== productId))
      handleModalClose()
      setIsAlertOpen(false)
      setProductToDelete(null)
    } else {
      console.error("Failed to delete product")
    }
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Management</CardTitle>
          <Button
            onClick={() => {
              setEditTarget(null)
              setShowModal(true)
            }}
          >
            Add Product
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                onClick={() => {
                  setEditTarget(product)
                  setProductToDelete(product.product_id)
                  setShowModal(true)
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <ProductModal
        open={showModal}
        onClose={handleModalClose}
        initial={editTarget}
        onSuccess={handleAddUpdate}
        onDeleteTrigger={() => {
          setProductToDelete(editTarget!.product_id)
          setIsAlertOpen(true)
        }}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
