import "@/styles/globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order Management Web",
  description: "Manage your product orders efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  )
}
