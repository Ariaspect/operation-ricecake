import { Settings } from "lucide-react"
import Link from "next/link"

type Props = {
  label?: string
}

export function Navbar({ label = "직원용" }: Props) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/admin"
          className="text-gray-600 hover:text-black transition"
        >
          <Settings className="w-5 h-5" />
        </Link>
        <Link href="/" className="text-lg font-semibold text-gray-800">
          {label}
        </Link>
        {/* 오른쪽 여백용 placeholder */}
        <div className="w-5 h-5" />
      </div>
    </nav>
  )
}
