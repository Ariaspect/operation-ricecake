import { create } from "zustand"
import { Product } from "@/types/db"

type ProductStore = {
  products: Product[]
  fetchProducts: () => Promise<void>
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  fetchProducts: async () => {
    const res = await fetch("/api/products")
    const data = await res.json()
    set({ products: data })
  },
}))
