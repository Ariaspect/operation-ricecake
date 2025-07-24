import { Navbar } from "@/components/Navbar"
import { AdminTabs } from "@/components/Tabs"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar label="관리자용" />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AdminTabs />
        <div className="mt-6">{children}</div>
      </main>
    </>
  )
}
