"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export function AdminTabs() {
  const pathname = usePathname()
  const adminTabs = [
    { label: "상품 관리", href: "/admin/product" },
    { label: "옵션 관리", href: "/admin/option" },
    { label: "카테고리 관리", href: "/admin/category" },
    { label: "통계 관리", href: "/admin/stats" },
  ]

  return (
    <div className="pb-1 border-b border-gray-200">
      <ul className="flex gap-6 text-sm font-medium">
        {adminTabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              className={clsx(
                "pb-1 transition-colors",
                pathname.startsWith(tab.href)
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500 hover:text-black"
              )}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
