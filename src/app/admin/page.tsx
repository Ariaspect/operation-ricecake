"use client"

import { Navbar } from "@/components/Navbar"
import { AdminTabs } from "@/components/Tabs"

export default function AdminPage() {
  return (
    <>
      <Navbar label="관리자용" />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <AdminTabs />
        <p className="mt-8 text-gray-700 text-sm">
          Select a tab to begin managing the system.
        </p>
      </main>
    </>
  )
}
