import { Navbar } from "@/components/Navbar"
import { AdminTabs } from "@/components/Tabs"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      <>
        <Navbar label="관리자용" />
        <main className="max-w-6xl w-full mx-auto px-4 py-8 flex flex-col flex-grow">
          <AdminTabs />
          <div className="mt-6 flex-grow">{children}</div>
        </main>
      </>
    </div>
  )
}
