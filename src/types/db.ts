export type OptionType = "slice" | "wrap" | "addition"

export interface Product {
  product_id: number
  name: string
  price: number
  description: string | null
  image_url: string | null
  available: boolean
  available_options?: (ProductOption & { option: Option })[]
  categories?: (ProductCategory & { category: Category })[]
}

export interface Category {
  category_id: number
  name: string
  _count?: {
    products: number
  }
}

export interface ProductCategory {
  product_category_id: number
  product_id: number
  category_id: number
}

export interface Option {
  option_id: number
  name: string
  type: OptionType
  price: number
  active_products?: ProductOption[]
}

export interface ProductOption {
  product_option_id: number
  product_id: number
  option_id: number
  price: number
  product?: Product
  option?: Option
}

export interface Order {
  order_id: number
  date: string
  address: string
  payment: string
  memo?: string
  details?: OrderDetail[]
}

export interface OrderDetail {
  order_detail_id: number
  order_id: number
  product_id: number
  quantity: number
  product?: Product
  options?: OrderDetailOption[]
}

export interface OrderDetailOption {
  order_detail_option_id: number
  order_detail_id: number
  option_id: number
  option?: Option
}
