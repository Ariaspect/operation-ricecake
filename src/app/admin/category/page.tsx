"use client"

import { useEffect, useState } from "react"
import { Category } from "@/types/db"
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
import { Input } from "@/components/ui/input"

type CategoryWithCount = Category & {
  _count: {
    products: number
  }
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data)
  }

  const handleAddCategory = async () => {
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName }),
    })
    setNewCategoryName("")
    fetchCategories()
  }

  const confirmDelete = () => {
    if (categoryToDelete !== null) {
      handleDeleteCategory(categoryToDelete)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    })
    fetchCategories()
    setIsAlertOpen(false)
    setCategoryToDelete(null)
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
            <Input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
            />
            <Button onClick={handleAddCategory}>Add Category</Button>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <Card
                key={category.category_id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <span className="font-bold">{category.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({category._count.products} products)
                  </span>
                </div>
                <Button
                  onClick={() => {
                    setCategoryToDelete(category.category_id)
                    setIsAlertOpen(true)
                  }}
                  variant="destructive"
                >
                  Delete
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category and all associated products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>
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
